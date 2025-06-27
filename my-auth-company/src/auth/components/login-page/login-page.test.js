import {rest} from 'msw'
import React from 'react'
import {
  screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import {setupServer} from 'msw/node'

import {LoginPage} from './login-page'
import {handleInvalidCredentials, handlers} from '../../../mocks/handlers'
import {HTTP_UNEXPECTED_ERROR_STATUS} from '../../../consts'
import {
  fillInputs,
  getSendButton,
  renderWithAuthProvider,
} from '../../../utils/tests'
import {AuthContext} from '../../../utils/contexts/auth-context'

const passwordValidationMessage =
  'The password must contain at least 8 characters, one upper case letter, one number and one special character'

const getPasswordInput = () => screen.getByLabelText(/password/i)

const server = setupServer(...handlers)

beforeEach(() =>
  renderWithAuthProvider(
    <AuthContext.Provider
      value={{handleSuccessLogin: jest.fn(), user: {role: ''}}}
    >
      <LoginPage />
    </AuthContext.Provider>,
  ),
)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe('when login page is mounted', () => {
  it('must display the login title', () => {
    expect(screen.getByText(/login page/i)).toBeInTheDocument()
  })

  it('must have a form with the following fields: email, password and a submit button', () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', {name: /send/i}))
  })
})

describe('when the user leaves empty fields and clicks the submit button', () => {
  it('display required messages as the format: "The [field name] is required"', async () => {
    expect(screen.queryByText(/the email is required/i)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', {name: /send/i}))

    expect(screen.getByText(/the email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/the password is required/i)).toBeInTheDocument()

    await waitFor(() =>
      expect(screen.getByRole('button', {name: /send/i})).not.toBeDisabled(),
    )
  })
})

describe('when the user fills the fields and clicks the submit button', () => {
  it('must not display the required messages', async () => {
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: {value: 'john.do@test.com'},
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: {value: 'Aa123456789!@#'},
    })

    fireEvent.click(screen.getByRole('button', {name: /send/i}))

    expect(screen.queryByText(/the email is required/i)).not.toBeInTheDocument()
    expect(
      screen.queryByText(/the password is required/i),
    ).not.toBeInTheDocument()

    await waitFor(() =>
      expect(screen.getByRole('button', {name: /send/i})).not.toBeDisabled(),
    )
  })
})

describe('when the user fills and blur the email input with invalid email, and then focus and change with valid value', () => {
  it('must not display a validation message', () => {
    const emailInput = screen.getByLabelText(/email/i)

    // change and blur email input
    fireEvent.change(emailInput, {
      target: {value: 'invalid.email'},
    })
    fireEvent.blur(emailInput)

    expect(
      screen.getByText(/the email is invalid. Example: john.doe@mail.com/i),
    ).toBeInTheDocument()

    fireEvent.change(emailInput, {
      target: {value: 'john.doe@email.com'},
    })
    fireEvent.blur(emailInput)

    expect(
      screen.queryByText(/the email is invalid. Example: john.doe@mail.com/i),
    ).not.toBeInTheDocument()
  })
})

describe('when the user fills and blur the password input with a value with 7 character length', () => {
  it(`must display the validation message "The password must contain at least 8 characters,
  one upper case letter, one number and one special character"`, () => {
    // change and blur email input
    fireEvent.change(getPasswordInput(), {
      target: {value: 'asdfghj'},
    })
    fireEvent.blur(getPasswordInput())

    expect(screen.getByText(passwordValidationMessage)).toBeInTheDocument()
  })
})

describe('when the user fills and blur the password input with a value without one upper case character', () => {
  it(`must display the validation message "The password must contain at least 8 characters,
  one upper case letter, one number and one special character"`, () => {
    // change and blur email input
    fireEvent.change(getPasswordInput(), {
      target: {value: 'asdfghj8'},
    })
    fireEvent.blur(getPasswordInput())

    expect(screen.getByText(passwordValidationMessage)).toBeInTheDocument()
  })
})

describe(`when the user fills and blur the password input without one special character and
then change with valid value and blur again`, () => {
  it(`must not display the validation message`, () => {
    const validPassword = 'aA1asdasda#'
    // change and blur email input
    fireEvent.change(getPasswordInput(), {
      target: {value: 'asdfghjA1a'},
    })
    fireEvent.blur(getPasswordInput())

    expect(screen.getByText(passwordValidationMessage)).toBeInTheDocument()

    // change and blur email input
    fireEvent.change(getPasswordInput(), {
      target: {value: validPassword},
    })
    fireEvent.blur(getPasswordInput())

    expect(
      screen.queryByText(passwordValidationMessage),
    ).not.toBeInTheDocument()
  })
})

describe('when the user submit the login form with valid data', () => {
  it('must disable the submit button while the form page is fetching the data', async () => {
    fillInputs()

    fireEvent.click(screen.getByRole('button', {name: /send/i}))

    expect(screen.getByRole('button', {name: /send/i})).toBeDisabled()

    await waitFor(() =>
      expect(screen.getByRole('button', {name: /send/i})).not.toBeDisabled(),
    )
  })

  it('must be a loading indicator at the top of the form while it is fetching', async () => {
    expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: {value: 'john.do@test.com'},
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: {value: 'Aa123456789!@#'},
    })

    fireEvent.click(getSendButton())

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-indicator'),
    )
  })
})

describe('when the user submit the login form with valid data and there is an unexpected server error', () => {
  it('must display the error message "Unexpected error, please try again" from the api', async () => {
    // setup - config server
    server.use(
      rest.post('/login', (req, res, ctx) =>
        res(
          ctx.status(HTTP_UNEXPECTED_ERROR_STATUS),
          ctx.json({message: 'Unexpected error, please try again'}),
        ),
      ),
    )

    expect(
      screen.queryByText(/unexpected error, please try again/i),
    ).not.toBeInTheDocument()

    // trigger submit form
    fillInputs()
    fireEvent.click(getSendButton())

    // expect display error message
    expect(
      await screen.findByText(/unexpected error, please try again/i),
    ).toBeInTheDocument()
  })
})

describe('when the user submit the login form with valid data and there is an invalid credentials error', () => {
  it('must display the error message "The email or password are not correct" from the api', async () => {
    const wrongEmail = 'wrong@mail.com'
    const wrongPassword = 'Aa12345678$'

    // setup server
    server.use(handleInvalidCredentials({wrongEmail, wrongPassword}))

    expect(
      screen.queryByText(/the email or password are not correct/i),
    ).not.toBeInTheDocument()

    // trigger - submit form
    fillInputs({email: wrongEmail, password: wrongPassword})
    fireEvent.click(getSendButton())

    // expects error message
    expect(
      await screen.findByText(/the email or password are not correct/i),
    ).toBeInTheDocument()
  })
})
