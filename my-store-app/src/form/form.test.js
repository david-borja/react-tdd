import React from 'react'
import {screen, render, fireEvent, waitFor} from '@testing-library/react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import {Form} from './form'
import {CREATED_STATUS, ERROR_SERVER_STATUS} from '../consts/httpStatus'

// If we configure the server like this, it gives a 201 response by simply submitting the form
// const server = setupServer(
//   rest.post('/products', (req, res, ctx) => res(ctx.status(CREATED_STATUS))),
// )

const server = setupServer(
  rest.post('/products', (req, res, ctx) => {
    const {name, size, type} = req.body
    if (name && size && type) {
      return res(ctx.status(CREATED_STATUS))
    }
    return res(ctx.status(ERROR_SERVER_STATUS))
  }),
)

// Initialize server before testing
beforeAll(() => server.listen())

// Disable API mocking after the tests are done.
afterAll(() => server.close())

beforeEach(() => render(<Form />))

// Reset any runtime request handlers we may add during the tests. We added this after configuring what we want the API to return for a particular test case in the 'when the user submits the form and the server returns an invalid request error' block
afterEach(() => server.resetHandlers())

describe('when the form is mounted', () => {
  it('there must be a create product form page', () => {
    expect(
      screen.getByRole('heading', {name: /create product/i}),
    ).toBeInTheDocument()
    // expect(screen.queryByText(/create product/i)).toBeInTheDocument()
  })

  it('should have these fields: name, size, type (electronic, furniture, clothing) and a submit button.', () => {
    // getByLabelText alone is already gonna make the test fail if there's no match, but again, it is more readable if we write with expect().toBeInTheDocument()
    // screen.getByLabelText(/name/i)
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/size/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument()

    expect(screen.queryByText(/electronic/i)).toBeInTheDocument()
    expect(screen.queryByText(/furniture/i)).toBeInTheDocument()
    expect(screen.queryByText(/clothing/i)).toBeInTheDocument()
  })

  it('should exist the submit button', () => {
    expect(screen.getByRole('button', {type: 'submit'})).toBeInTheDocument()
  })
})

describe('when user submits form without values', () => {
  it('should display validation messages', async () => {
    expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/the size is required/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/the type is required/i)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', {type: 'submit'}))

    expect(screen.queryByText(/the name is required/i)).toBeInTheDocument()
    expect(screen.queryByText(/the size is required/i)).toBeInTheDocument()
    expect(screen.queryByText(/the type is required/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByRole('button', {type: 'submit'})).not.toBeDisabled()
    })
  })
})

describe('when user blurs an empty field', () => {
  it('should display a validation error message for name input', () => {
    expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument()

    fireEvent.blur(screen.getByLabelText(/name/i), {
      target: {id: 'name', value: ''},
    })

    expect(screen.queryByText(/the name is required/i)).toBeInTheDocument()
  })

  it('should display a validation error message for size input', () => {
    expect(screen.queryByText(/the size is required/i)).not.toBeInTheDocument()

    fireEvent.blur(screen.getByLabelText(/size/i), {
      target: {id: 'size', value: ''},
    })

    expect(screen.queryByText(/the size is required/i)).toBeInTheDocument()
  })
})

describe('when user submits form properly and the server returns created status', () => {
  it('should disable the submit button until request is completed', async () => {
    const submitBtn = screen.getByRole('button', {type: 'submit'})
    expect(submitBtn).not.toBeDisabled()
    fireEvent.click(submitBtn)
    expect(submitBtn).toBeDisabled()

    // wait until request is completed and expect no disabled. waitFor returns a promise. If the thing is waiting for doesn't happen, it fails the test
    await waitFor(() => {
      expect(submitBtn).not.toBeDisabled()
    })
  })

  it('must display the success message "Product stored" and clean the fields values on the form page', async () => {
    const nameInput = screen.getByLabelText(/name/i)
    const sizeInput = screen.getByLabelText(/size/i)
    const typeInput = screen.getByLabelText(/type/i)

    fireEvent.change(nameInput, {
      target: {id: 'name', value: 'my product'},
    })
    fireEvent.change(sizeInput, {
      target: {id: 'size', value: '10'},
    })
    fireEvent.change(typeInput, {
      target: {id: 'type', value: 'electronic'},
    })

    fireEvent.click(screen.getByRole('button', {type: 'submit'}))

    await waitFor(() =>
      expect(screen.getByText(/product stored/i)).toBeInTheDocument(),
    )

    expect(nameInput).toHaveValue('')
    expect(sizeInput).toHaveValue('')
    expect(typeInput).toHaveValue('')
  })
})

describe('when the user submits the form and the server returns an unexpected error', () => {
  it('must display the error message "Unexpected error, please try again" on the form page', async () => {
    fireEvent.click(screen.getByRole('button', {type: 'submit'}))

    await waitFor(() =>
      expect(
        screen.getByText(/unexpected error, please try again/i),
      ).toBeInTheDocument(),
    )
  })
})

describe('when the user submits the form and the server returns an invalid request error', () => {
  it('must display the error message "The form is invalid, the fields [field1...fieldN] are required" on the form page', async () => {
    // In order to avoid setting up our mock server with much logic, we can use msw to set what we want the API to return in a particular test
    server.use(
      rest.post('/products', (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            message:
              'The form is invalid, the fields name, size, type are required',
          }),
        )
      }),
    )

    // Just trying if this modifies the text we are getting on the UI. But it doesn't. We keep getting the error message, because that's what we configured our API to return for this particular test case.

    // const nameInput = screen.getByLabelText(/name/i)
    // const sizeInput = screen.getByLabelText(/size/i)
    // const typeInput = screen.getByLabelText(/type/i)

    // fireEvent.change(nameInput, {
    //   target: {id: 'name', value: 'my product'},
    // })
    // fireEvent.change(sizeInput, {
    //   target: {id: 'size', value: '10'},
    // })
    // fireEvent.change(typeInput, {
    //   target: {id: 'type', value: 'electronic'},
    // })

    fireEvent.click(screen.getByRole('button', {type: 'submit'}))

    await waitFor(() =>
      expect(
        screen.getByText(
          /the form is invalid, the fields name, size, type are required/i,
        ),
      ).toBeInTheDocument(),
    )
  })
})

// In the not found service path, the form page must display the message
describe('when the user submits the form and the server returns a service path not found error', () => {
  it('must display the error message "Connection error, please try later" on the form page', async () => {
    // In order to avoid setting up our mock server with much logic, we can use msw to set what we want the API to return in a particular test
    server.use(
      rest.post('/products', (req, res) =>
        res.networkError('Failed to connect'),
      ),
    )

    fireEvent.click(screen.getByRole('button', {type: 'submit'}))

    await waitFor(() =>
      expect(
        screen.getByText(/connection error, please try later/i),
      ).toBeInTheDocument(),
    )
  })
})
