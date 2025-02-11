import React from 'react'
import {render, screen, fireEvent, waitFor} from '@testing-library/react'
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
  it('the search button should be disabled util the search is done', async () => {
    expect(screen.getByRole('button', {name: /search/i})).not.toBeDisabled()

    // click button
    fireEvent.click(screen.getByRole('button', {name: /search/i}))

    // expect disabled
    expect(screen.getByRole('button', {name: /search/i})).toBeDisabled()

    // expect not disabled (finished)
    await waitFor(() =>
      expect(screen.getByRole('button', {name: /search/i})).not.toBeDisabled(),
    )
  })

  it('the data should be displayed as a sticky table', async () => {
    fireEvent.click(screen.getByRole('button', {name: /search/i}))

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
})
