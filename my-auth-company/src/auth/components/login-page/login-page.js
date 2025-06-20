import React, {useState} from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import {login} from '../../services'

const passwordValidationsMsg =
  'The password must contain at least 8 characters, one upper case letter, one number and one special character'

const validateEmail = email => {
  const regex = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/

  return regex.test(email)
}

const validatePassword = password => {
  const passwordRulesRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/

  return passwordRulesRegex.test(password)
}

export const LoginPage = () => {
  const [emailValidationMessage, setEmailValidationMessage] = useState('')
  const [passwordlValidationMessage, setPasswordValidationMessage] = useState(
    '',
  )
  const [formValues, setFormValues] = useState({email: '', password: ''})
  const [isFetching, setIsFetching] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const validateForm = () => {
    const {email, password} = formValues

    const isEmailEmpty = !email
    const isPasswordEmpty = !password

    if (isEmailEmpty) {
      setEmailValidationMessage('The email is required')
    }

    if (isPasswordEmpty) {
      setPasswordValidationMessage('The password is required')
    }
    return isEmailEmpty || isPasswordEmpty
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (validateForm()) return

    try {
      setIsFetching(true)
      const response = await login()

      if (!response.ok) {
        throw response
      }
      setIsFetching(false)
    } catch (err) {
      const data = await err.json()
      setErrorMessage(data.message)
      setIsOpen(true)
    } finally {
      setIsFetching(false)
    }
    // setIsFetching(true)

    // await login()

    // setIsFetching(false)
  }

  const handleChange = ({target: {value, name}}) => {
    setFormValues({...formValues, [name]: value})
  }

  const handleBlurEmail = () => {
    if (!validateEmail(formValues.email)) {
      setEmailValidationMessage(
        'The email is invalid. Example: john.doe@mail.com',
      )
      return
    }

    setEmailValidationMessage('')
  }

  const handleBlurPassword = () => {
    if (!validatePassword(formValues.password)) {
      setPasswordValidationMessage(passwordValidationsMsg)
      return
    }

    setPasswordValidationMessage('')
  }

  return (
    <>
      <h1>Login Page</h1>
      {isFetching && <p data-testid="loading-indicator">Loading</p>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="email"
          id="email"
          name="email"
          helperText={emailValidationMessage}
          onChange={handleChange}
          onBlur={handleBlurEmail}
          value={formValues.email}
        />
        <TextField
          label="password"
          id="password"
          type="password"
          name="password"
          onChange={handleChange}
          onBlur={handleBlurPassword}
          value={formValues.password}
          helperText={passwordlValidationMessage}
        />
        <Button disabled={isFetching} type="submit">
          Send
        </Button>
      </form>
      <span>{errorMessage}</span>
    </>
  )
}

export default {LoginPage}
