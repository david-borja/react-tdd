import React from 'react'
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react'
import {GithubSearchPage} from './github-search-page'

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
  const fireClickSearch = () =>
    fireEvent.click(screen.getByRole('button', {name: /search/i}))

  it('the search button should be disabled util the search is done', async () => {
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

    expect(within(repository).getByRole('img', {name: /test/i}))
    expect(tableCells).toHaveLength(5)
    expect(repository).toHaveTextContent(/test/i)
    expect(stars).toHaveTextContent(/10/i)
    expect(forks).toHaveTextContent(/5/i)
    expect(openIssues).toHaveTextContent(/2/i)
    expect(updatedAt).toHaveTextContent(/2020-01-01/i)

    expect(within(table).getByText(/test/i).closest('a')).toHaveAttribute(
      'href',
      'http://localhost:3000/test',
    )
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
})
