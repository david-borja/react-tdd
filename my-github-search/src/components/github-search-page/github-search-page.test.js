import React from 'react'
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import {GithubSearchPage} from './github-search-page'
import {
  makeFakeResponse,
  makeFakeRepo,
  getReposListBy,
  makeFakeError,
} from '../../__fixtures__/repos'

import {OK_STATUS, UNEXPECTED_STATUS, UNPROCESSABLE_STATUS} from '../../consts'

const fakeResponse = makeFakeResponse({totalCount: 1})

const fakeRepo = makeFakeRepo()

fakeResponse.items = [fakeRepo]

const server = setupServer(
  rest.get('/search/repositories', (req, res, ctx) => {
    return res(ctx.status(OK_STATUS), ctx.json(fakeResponse))
  }),
)

const fireClickSearch = () =>
  fireEvent.click(screen.getByRole('button', {name: /search/i}))

// Enable API mocking before tests.
beforeAll(() => server.listen())

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done.
afterAll(() => server.close())

beforeEach(() => render(<GithubSearchPage />))

describe('when the GithubSearchPage is mounted', () => {
  it('must display the title', () => {
    expect(
      screen.getByRole('heading', {name: /github repositories list/i}),
    ).toBeInTheDocument()
  })

  it('must be an input text with label "filter by" field', () => {
    expect(screen.getByLabelText(/filter by/i)).toBeInTheDocument()
  })

  it('must be a Search button', () => {
    expect(screen.getByRole('button', {name: /search/i})).toBeInTheDocument()
  })

  it('must be a initial message "Please provide a search option and click in the search button"', () => {
    expect(
      screen.getByText(
        /please provide a search option and click in the search button/i,
      ),
    ).toBeInTheDocument()
  })
})

describe('when the developer does a search', () => {
  it('the search button should be disabled util the search is done', async () => {
    expect(screen.getByRole('button', {name: /search/i})).not.toBeDisabled()

    fireEvent.change(screen.getByLabelText(/filter by/i), {
      target: {value: 'test'},
    })

    expect(screen.getByRole('button', {name: /search/i})).not.toBeDisabled()

    // click button
    fireClickSearch()

    // expect disabled
    expect(screen.getByRole('button', {name: /search/i})).toBeDisabled()

    // expect not disabled (finished)
    await waitFor(() =>
      expect(screen.getByRole('button', {name: /search/i})).not.toBeDisabled(),
    )
  })

  it('the data should be displayed as a sticky table', async () => {
    fireClickSearch()

    // not initial state message
    await waitFor(() =>
      expect(
        screen.queryByText(
          // queryByText is an async matcher - getByText makes the test to stop if it fails
          /please provide a search option and click in the search button/i,
        ),
      ).not.toBeInTheDocument(),
    )

    // table
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('the table headers must contain: Repository, stars, forks, open issues and updated at', async () => {
    fireClickSearch()
    // all methods that start by find, are async
    const table = await screen.findByRole('table')
    // we use all, because if not it will return an error when matching more than one
    const tableHeaders = within(table).getAllByRole('columnheader')
    expect(tableHeaders).toHaveLength(5)

    const [repository, stars, forks, openIssues, updatedAt] = tableHeaders

    expect(repository).toHaveTextContent(/repository/i)
    expect(stars).toHaveTextContent(/stars/i)
    expect(forks).toHaveTextContent(/forks/i)
    expect(openIssues).toHaveTextContent(/open issues/i)
    expect(updatedAt).toHaveTextContent(/updated at/i)
  })

  it(`each table result must contain: owner avatar image, name, stars, updated at, forks, open issues, it should have a link that opens in a new tab`, async () => {
    fireClickSearch()

    const table = await screen.findByRole('table')
    const tableCells = within(table).getAllByRole('cell')
    const [repository, stars, forks, openIssues, updatedAt] = tableCells
    const avatarImg = within(repository).getByRole('img', {name: fakeRepo.name})
    expect(avatarImg).toBeInTheDocument()
    expect(tableCells).toHaveLength(5)
    expect(repository).toHaveTextContent(fakeRepo.name)
    expect(stars).toHaveTextContent(fakeRepo.stargazers_count)
    expect(forks).toHaveTextContent(fakeRepo.forks_count)
    expect(openIssues).toHaveTextContent(fakeRepo.open_issues_count)
    expect(updatedAt).toHaveTextContent(fakeRepo.updated_at)

    expect(within(table).getByText(fakeRepo.name).closest('a')).toHaveAttribute(
      'href',
      fakeRepo.html_url,
    )

    expect(avatarImg).toHaveAttribute('src', fakeRepo.owner.avatar_url)
  })

  it('must display the total results number of the search and the current number of results', async () => {
    fireClickSearch()
    await screen.findByRole('table')
    expect(screen.getByText(/1-1 of 1/)).toBeInTheDocument()
  })

  it('results size per page select/combobox with the options: 30, 50, 100. The default is 30', async () => {
    fireClickSearch()

    await screen.findByRole('table')
    expect(screen.getByLabelText(/rows per page/i)).toBeInTheDocument()
    fireEvent.mouseDown(screen.getByLabelText(/rows per page/i))

    const listbox = screen.getByRole('listbox', {name: /rows per page/i})

    const options = within(listbox).getAllByRole('option')
    expect(options).toHaveLength(3)

    const [option30, option50, option100] = options
    expect(option30).toHaveTextContent(/30/)
    expect(option50).toHaveTextContent(/50/)
    expect(option100).toHaveTextContent(/100/)
  })

  it('must exist the next and previous pagination', async () => {
    fireClickSearch()
    await screen.findByRole('table')
    const previousPageBtn = screen.getByRole('button', {name: /previous page/i})
    expect(previousPageBtn).toBeInTheDocument()
    expect(screen.getByRole('button', {name: /next page/i})).toBeInTheDocument()

    expect(previousPageBtn).toBeDisabled()
  })
})

describe('when the developer does a search without results', () => {
  it('must show an empty state message "Your search has no results"', async () => {
    // set the mock server no items
    server.use(
      rest.get('/search/repositories', (req, res, ctx) =>
        res(ctx.status(200), ctx.json(makeFakeResponse({}))),
      ),
    )

    // click search
    fireClickSearch()

    // expect message no results
    await waitFor(() =>
      expect(
        screen.getByText(/your search has no results/i),
      ).toBeInTheDocument(),
    )

    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})

describe('when the developer types on filter by and does a search', () => {
  it('must display the related repos', async () => {
    // setup the mock server
    const REPO_NAME = 'laravel'
    const defaultFakeResponse = makeFakeResponse()
    const [expectedRepo] = getReposListBy({name: REPO_NAME})

    server.use(
      rest.get('/search/repositories', (req, res, ctx) => {
        return res(
          ctx.status(OK_STATUS),
          ctx.json({
            ...defaultFakeResponse,
            items: getReposListBy({name: req.url.searchParams.get('q')}),
          }),
        )
      }),
    )
    // type for a word in filter by input
    fireEvent.change(screen.getByLabelText(/filter by/i), {
      target: {value: REPO_NAME},
    })

    // click on search
    fireClickSearch()

    // expect the table content
    const table = await screen.findByRole('table')
    expect(table).toBeInTheDocument()
    const tableCells = within(table).getAllByRole('cell')
    const [repository] = tableCells
    expect(repository).toHaveTextContent(expectedRepo.name)
  })
})

describe('when there is an Unprocessable Entity from the backend', () => {
  it('must display an alert message error with the message from the service', async () => {
    expect(screen.queryByText(/validation failed/i)).not.toBeInTheDocument() // si aquí usáramos toBeVisible, nos daría un error el matcher

    // config server so it returns error
    server.use(
      rest.get('/search/repositories', (req, res, ctx) =>
        res(ctx.status(UNPROCESSABLE_STATUS), ctx.json(makeFakeError())),
      ),
    )

    // click search
    fireClickSearch()

    // expect message
    expect(await screen.findByText(/validation failed/i)).toBeVisible()
  })
})

describe('when there is an unexpected error from the backend', () => {
  it('must display an alert message error with the message from the service', async () => {
    expect(screen.queryByText(/unexpected error/i)).not.toBeInTheDocument() // si aquí usáramos toBeVisible, nos daría un error el matcher

    // config server so it returns error
    server.use(
      rest.get('/search/repositories', (req, res, ctx) =>
        res(
          ctx.status(UNEXPECTED_STATUS),
          ctx.json(makeFakeError({message: 'Unexpected error'})),
        ),
      ),
    )

    // click search
    fireClickSearch()

    // expect message
    expect(await screen.findByText(/unexpected error/i)).toBeVisible()
  })
})
