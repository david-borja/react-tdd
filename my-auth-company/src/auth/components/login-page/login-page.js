import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Redirect} from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import {login} from '../../services'
import {ADMIN_ROLE} from '../../../consts'

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

export const LoginPage = ({onSuccessLogin}) => {
  const [emailValidationMessage, setEmailValidationMessage] = useState('')
  const [passwordlValidationMessage, setPasswordValidationMessage] = useState(
    '',
  )
  const [formValues, setFormValues] = useState({email: '', password: ''})
  const [isFetching, setIsFetching] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [user, setUser] = useState({role: ''})

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

    const {email, password} = formValues

    try {
      setIsFetching(true)
      const response = await login({email, password})

      if (!response.ok) {
        throw response
      }

      const {
        user: {role},
      } = await response.json()
      setUser({role})
      onSuccessLogin()
    } catch (err) {
      const data = await err.json()
      setErrorMessage(data.message)
      setIsOpen(true)
    } finally {
      setIsFetching(false)
    }
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

  const handleClose = () => setIsOpen(false)

  if (!isFetching && user.role === ADMIN_ROLE) {
    return <Redirect to="/admin" />
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
      {isOpen && (
        <>
          <span>
            <button type="button" onClick={handleClose}>
              x
            </button>
            {errorMessage}
          </span>
        </>
      )}
    </>
  )
}

LoginPage.propTypes = {
  onSuccessLogin: PropTypes.func,
}

LoginPage.defaultProps = {
  onSuccessLogin: () => {},
}

export default {LoginPage}
