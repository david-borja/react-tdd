import React from 'react'
import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import {GithubSearchPage} from './github-search-page'
import {makeFakeResponse, makeFakeRepo} from '../../__fixtures__/repos'

import {OK_STATUS} from '../../consts'
import {handlePaginatedSearch} from '../../__fixtures__/handlers'

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

describe('when the developer does a search and selects 50 rows per page', () => {
  it('must fetch a new search and display 50 rows results on the table', async () => {
    // config mock server response
    server.use(rest.get('/search/repositories', handlePaginatedSearch))

    // click search
    fireClickSearch()

    // expect 30 rows length
    expect(await screen.findByRole('table')).toBeInTheDocument()
    expect(await screen.findAllByRole('row')).toHaveLength(31) // 30 + header

    // select 50 per page
    fireEvent.mouseDown(screen.getByLabelText(/rows per page/i)) // parece que material UI espera mouseDown
    fireEvent.click(screen.getByRole('option', {name: '50'}))
    // Espera a que el botón realmente se deshabilite antes de verificar lo contrario
    await waitFor(() =>
      expect(screen.getByRole('button', {name: /search/i})).toBeDisabled(),
    )

    // expect 50 rows length
    // Ahora espera a que el botón se habilite
    await waitFor(() =>
      expect(screen.getByRole('button', {name: /search/i})).not.toBeDisabled(),
    )
    // Espera a que las filas de la tabla se actualicen
    expect(await screen.findAllByRole('row')).toHaveLength(51) // 50 + header

    // importante usar get or find de manera apropiada. Si no -> tests inestables
  }, 10000)
})

describe('when the developer clicks on seach and then on next page button and then on previous page button', () => {
  it('must display the next repositories page and the previous repositories page', async () => {
    // config server handler
    server.use(rest.get('/search/repositories', handlePaginatedSearch))

    // click search
    fireClickSearch()

    // wait table
    expect(await screen.findByRole('table')).toBeInTheDocument()

    // expect first repo name is from page 0
    expect(screen.getByRole('cell', {name: /1-0/})).toBeInTheDocument()

    // expect next page is not disabled
    expect(screen.getByRole('button', {name: /next page/i})).not.toBeDisabled()

    // click next page button
    fireEvent.click(screen.getByRole('button', {name: /next page/i}))

    // expect search button to be disabled
    expect(screen.getByRole('button', {name: /search/i})).toBeDisabled()

    // expect first repo name is from page 1
    await waitFor(() =>
      expect(screen.getByRole('button', {name: /search/i})).not.toBeDisabled(),
    )
    expect(screen.getByRole('cell', {name: /2-0/})).toBeInTheDocument()

    // click previous page
    fireEvent.click(screen.getByRole('button', {name: /previous page/i}))

    // wait search finished
    await waitFor(() =>
      expect(screen.getByRole('button', {name: /search/i})).not.toBeDisabled(),
    )
    // expect
    expect(screen.getByRole('cell', {name: /1-0/})).toBeInTheDocument()
  }, 20000)
})

describe('when the developer does a search and clicks on next page button and selects 50 rows per page', () => {
  it('must display the results of the first page', async () => {
    // config server handler
    server.use(rest.get('/search/repositories', handlePaginatedSearch))

    // click search
    fireClickSearch()

    // wait table
    expect(await screen.findByRole('table')).toBeInTheDocument()

    // expect first repo name is from page 0
    expect(screen.getByRole('cell', {name: /1-0/})).toBeInTheDocument()

    // expect next page is not disabled
    expect(screen.getByRole('button', {name: /next page/i})).not.toBeDisabled()

    // click next page button
    fireEvent.click(screen.getByRole('button', {name: /next page/i}))

    // expect search button to be disabled
    expect(screen.getByRole('button', {name: /search/i})).toBeDisabled()

    // expect first repo name is from page 1
    await waitFor(() =>
      expect(screen.getByRole('button', {name: /search/i})).not.toBeDisabled(),
    )
    expect(screen.getByRole('cell', {name: /2-0/})).toBeInTheDocument()

    // select 50 per page
    fireEvent.mouseDown(screen.getByLabelText(/rows per page/i)) // parece que material UI espera mouseDown
    fireEvent.click(screen.getByRole('option', {name: '50'}))
    // Espera a que el botón realmente se deshabilite antes de verificar lo contrario
    await waitFor(() =>
      expect(screen.getByRole('button', {name: /search/i})).toBeDisabled(),
    )

    // expect 50 rows length
    // Ahora espera a que el botón se habilite
    await waitFor(() =>
      expect(screen.getByRole('button', {name: /search/i})).not.toBeDisabled(),
    )

    // expect first page
    expect(screen.getByRole('cell', {name: /1-0/})).toBeInTheDocument()
  }, 20000)
})
