import {TextField} from '@mui/material'
import React from 'react'

export const LoginPage = () => {
  const [emailErrorMsg, setEmailErrorMesg] = React.useState<string>('')
  const [passwordlErrorMsg, setPasswordErrorMesg] = React.useState<string>('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formElement = event.currentTarget

    const formElements = formElement.elements as typeof formElement.elements & {
      email: {value: sttring}
      password: {value: sttring}
    }
    const {email, password} = formElements

    if (!email.value) {
      setEmailErrorMesg('The email is required')
    }
    if (!password.value) {
      setPasswordErrorMesg('The password is required')
    }
  }
  return (
    <>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <TextField
          type="email"
          id="email"
          name="email"
          helperText={emailErrorMsg}
        />

        <label htmlFor="password">Password</label>
        <TextField
          type="password"
          id="password"
          name="password"
          helperText={passwordlErrorMsg}
        />

        <button type="submit">Submit</button>
      </form>
    </>
  )
}
