import React from 'react'
import {fireEvent, screen} from '@testing-library/react'
import {setupServer} from 'msw/node'
import {AppRouter} from './app-router'
import {
  renderWithAuthProvider,
  goTo,
  fillInputs,
  getSendButton,
} from './utils/tests'
import {handlers} from './mocks/handlers'

const server = setupServer(...handlers)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe('when the user is not authenticated and enters on admin page', () => {
  it('must be redirected to login page', () => {
    goTo('/admin')
    renderWithAuthProvider(<AppRouter />)
    expect(screen.getByText(/login page/i)).toBeInTheDocument()
  })
})

describe('when the user is not authenticated and enters on employee page', () => {
  it('must be redirected to login page', () => {
    goTo('/employee')
    renderWithAuthProvider(<AppRouter />)
    expect(screen.getByText(/login page/i)).toBeInTheDocument()
  })
})

describe('when the user is authenticated an enters on admin page', () => {
  it('must be redirected to login page', () => {
    goTo('/admin')
    renderWithAuthProvider(<AppRouter />, {isAuth: true})
    expect(screen.getByText(/login page/i)).toBeInTheDocument()
  })
})

describe.skip('when the admin is authenticated in login page', () => {
  it('must be redirected to admin page', async () => {
    renderWithAuthProvider(<AppRouter />, {isAuth: true})

    // fill form as admin
    fillInputs({email: 'admin@mail.com'})
    fireEvent.click(getSendButton())

    // expect admin page
    expect(await screen.findByText(/admin page/i)).toBeInTheDocument()
    expect(await screen.findByText(/john doe/i)).toBeInTheDocument()
  })
})
