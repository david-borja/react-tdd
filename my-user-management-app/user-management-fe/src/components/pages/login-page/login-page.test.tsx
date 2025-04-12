import {screen, render, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {LoginPage} from './login-page'

const getSubmitBtn = () => screen.getByRole('button', {name: /submit/i})

test('it should render the login title', () => {
  render(<LoginPage />)

  expect(screen.getByRole('heading', {name: /login/i})).toBeInTheDocument()
})

test('it should render the form elements', () => {
  render(<LoginPage />)

  expect(screen.getByLabelText(/email/i)).toBeInTheDocument() // también se podría usar byRole('textbox)
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  expect(getSubmitBtn()).toBeInTheDocument()
})

test('it should validate the inputs as required', async () => {
  render(<LoginPage />)

  // submit form
  userEvent.click(getSubmitBtn())

  // expect validation errors
  expect(await screen.findByText(/the email is required/i)).toBeInTheDocument()
  expect(
    await screen.findByText(/the password is required/i),
  ).toBeInTheDocument()
})

test('it should validate the email format', async () => {
  render(<LoginPage />)

  userEvent.type(screen.getByLabelText(/email/i), 'invalid email')

  // submit form
  userEvent.click(getSubmitBtn())

  // expect validation errors
  expect(await screen.findByText(/the email is not valid/i)).toBeInTheDocument()
})

test('it should disabled the submit button while is fetching', async () => {
  render(<LoginPage />)

  expect(getSubmitBtn()).not.toBeDisabled()

  userEvent.type(screen.getByLabelText(/email/i), 'john.doe@mail.com')
  userEvent.type(screen.getByLabelText(/password/i), '123456')

  userEvent.click(getSubmitBtn())

  await waitFor(() => expect(getSubmitBtn()).toBeDisabled())
})
