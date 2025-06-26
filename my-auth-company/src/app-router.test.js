import React from 'react'
import {fireEvent, screen} from '@testing-library/react'
import {setupServer} from 'msw/node'
import {AppRouter} from './app-router'
import {renderWithRouter} from './utils/tests'
import {handlers} from './mocks/handlers'

const getSendButton = () => screen.getByRole('button', {name: /send/i})

const fillInputs = ({
  email = 'john.do@test.com',
  password = 'Aa123456789!@#',
} = {}) => {
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: {value: email},
  })
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: {value: password},
  })
}

const server = setupServer(...handlers)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe('when the user is not authenticated and enters on admin page', () => {
  it('must be redirected to login page', () => {
    renderWithRouter(<AppRouter />, {route: '/admin'})
    expect(screen.getByText(/login page/i)).toBeInTheDocument()
  })
})

describe('when the user is not authenticated and enters on employee page', () => {
  it('must be redirected to login page', () => {
    renderWithRouter(<AppRouter />, {route: '/employee'})
    expect(screen.getByText(/login page/i)).toBeInTheDocument()
  })
})

describe('when the user is authenticated an enters on admin page', () => {
  it('must show admin page', () => {
    renderWithRouter(<AppRouter isAuth />, {route: '/admin'})
    expect(screen.getByText(/admin page/i)).toBeInTheDocument()
  })
})

describe('when the admin is authenticated in login page', () => {
  it('must be redirected to admin page', async () => {
    // go to login page
    renderWithRouter(<AppRouter />)

    // fill form as admin
    fillInputs({email: 'admin@mail.com'})
    fireEvent.click(getSendButton())

    // expect admin page
    expect(await screen.findByText(/admin page/i)).toBeInTheDocument()
  })
})
