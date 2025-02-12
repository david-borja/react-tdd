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
})
