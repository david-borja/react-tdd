import {screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {rest} from 'msw'

import {renderWithProviders} from 'mocks/render-with-providers'
import {LoginPage} from './login-page'
import {server} from 'mocks/server'

const getSubmitBtn = () => screen.getByRole('button', {name: /submit/i})

const mockServerWithError = () =>
  server.use(
    rest.post('/login', (req, res, ctx) => res(ctx.delay(1), ctx.status(500))),
  )

const fillAndSendLoginForm = async () => {
  userEvent.type(screen.getByLabelText(/email/i), 'john.doe@mail.com')
  userEvent.type(screen.getByLabelText(/password/i), '123456')

  userEvent.click(getSubmitBtn())
}

test('it should render the login title', () => {
  renderWithProviders(<LoginPage />)

  expect(screen.getByRole('heading', {name: /login/i})).toBeInTheDocument()
})

test('it should render the form elements', () => {
  renderWithProviders(<LoginPage />)

  expect(screen.getByLabelText(/email/i)).toBeInTheDocument() // también se podría usar byRole('textbox)
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  expect(getSubmitBtn()).toBeInTheDocument()
})

test('it should validate the inputs as required', async () => {
  renderWithProviders(<LoginPage />)

  // submit form
  userEvent.click(getSubmitBtn())

  // expect validation errors
  expect(await screen.findByText(/the email is required/i)).toBeInTheDocument()
  expect(
    await screen.findByText(/the password is required/i),
  ).toBeInTheDocument()
})

test('it should validate the email format', async () => {
  renderWithProviders(<LoginPage />)

  userEvent.type(screen.getByLabelText(/email/i), 'invalid email')

  // submit form
  userEvent.click(getSubmitBtn())

  // expect validation errors
  expect(await screen.findByText(/the email is not valid/i)).toBeInTheDocument()
})

test('it should disabled the submit button while is fetching', async () => {
  renderWithProviders(<LoginPage />)

  expect(getSubmitBtn()).not.toBeDisabled()

  await fillAndSendLoginForm()

  await waitFor(() => expect(getSubmitBtn()).toBeDisabled())
})

test('it should show a loading indicator while is fetching the login', async () => {
  renderWithProviders(<LoginPage />)

  expect(
    screen.queryByRole('progressbar', {name: /loading/i}),
  ).not.toBeInTheDocument()

  await fillAndSendLoginForm()

  expect(await screen.findByRole('progressbar', {name: /loading/i}))
})

it('should display "Unexpected error, please try again" when there is an error from the api login', async () => {
  mockServerWithError()
  renderWithProviders(<LoginPage />)

  userEvent.type(screen.getByLabelText(/email/i), 'john.doe@mail.com')
  userEvent.type(screen.getByLabelText(/password/i), '123456')

  userEvent.click(getSubmitBtn())

  expect(
    await screen.findByText('Unexpected error, please try again'),
  ).toBeInTheDocument()
})
