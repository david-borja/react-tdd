import React from 'react'
import {screen, render, fireEvent, waitFor} from '@testing-library/react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import {Form} from './form'

const server = setupServer(
  rest.post('/products', (req, res, ctx) => res(ctx.status(201))),
)

// Initialize server before testing
beforeAll(() => server.listen())

// Disable API mocking after the tests are done.
afterAll(() => server.close())

beforeEach(() => render(<Form />))
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
    expect(screen.getByRole('button', {name: /submit/i})).toBeInTheDocument()
  })
})

describe('when user submits form without values', () => {
  it('should display validation messages', async () => {
    expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/the size is required/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/the type is required/i)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', {name: /submit/i}))

    expect(screen.queryByText(/the name is required/i)).toBeInTheDocument()
    expect(screen.queryByText(/the size is required/i)).toBeInTheDocument()
    expect(screen.queryByText(/the type is required/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByRole('button', {name: /submit/i})).not.toBeDisabled()
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

describe('when user submits form', () => {
  it('should disable the submit button until request is completed', async () => {
    const submitBtn = screen.getByRole('button', {name: /submit/i})
    expect(submitBtn).not.toBeDisabled()

    fireEvent.click(submitBtn)

    expect(submitBtn).toBeDisabled()

    // wait until request is completed and expect no disabled. waitFor returns a promise. If the thing is waiting for doesn't happen, it fails the test
    await waitFor(() => {
      expect(submitBtn).not.toBeDisabled()
    })
  })
})
