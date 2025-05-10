import React, {useState} from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

export const LoginPage = () => {
  const [emailValidationMessage, setEmailValidationMessage] = useState('')
  const [passwordlValidationMessage, setPasswordValidationMessage] = useState(
    '',
  )

  const handleSubmit = e => {
    e.preventDefault()
    const {email, password} = e.target.elements
    if (!email.value) {
      setEmailValidationMessage('The email is required')
    }

    if (!password.value) {
      setPasswordValidationMessage('The password is required')
    }
  }

  return (
    <>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          label="email"
          id="email"
          helperText={emailValidationMessage}
        />
        <TextField
          label="password"
          id="password"
          type="password"
          helperText={passwordlValidationMessage}
        />
        <Button type="submit">Send</Button>
      </form>
    </>
  )
}

export default {LoginPage}
