import {screen, render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {LoginPage} from './login-page'

test('it should render the login title', () => {
  render(<LoginPage />)

  expect(screen.getByRole('heading', {name: /login/i})).toBeInTheDocument()
})

test('it should render the form elements', () => {
  render(<LoginPage />)

  expect(screen.getByLabelText(/email/i)).toBeInTheDocument() // también se podría usar byRole('textbox)
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  expect(screen.getByRole('button', {name: /submit/i})).toBeInTheDocument()
})

test('it should validate the inputs as required', async () => {
  render(<LoginPage />)

  // submit form
  userEvent.click(screen.getByRole('button', {name: /submit/i}))

  // expect validation errors
  expect(await screen.findByText(/the email is required/i)).toBeInTheDocument()
  expect(
    await screen.findByText(/the password is required/i),
  ).toBeInTheDocument()
})
