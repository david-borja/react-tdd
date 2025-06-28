import React, {useState, useContext} from 'react'
import {Redirect} from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import {login} from '../../services'
import {ADMIN_ROLE, EMPLOYEE_ROLE} from '../../../consts'
import {AuthContext} from '../../../utils/contexts/auth-context'
import {validateEmail, validatePassword} from '../../../utils/helpers'

const passwordValidationsMsg =
  'The password must contain at least 8 characters, one upper case letter, one number and one special character'

export const LoginPage = () => {
  const {handleSuccessLogin, user} = useContext(AuthContext)
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

    const {email, password} = formValues

    try {
      setIsFetching(true)
      const response = await login({email, password})

      if (!response.ok) {
        throw response
      }

      const {
        user: {role, username},
      } = await response.json()
      handleSuccessLogin({role, username})
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

  if (!isFetching && user.role === EMPLOYEE_ROLE) {
    return <Redirect to="/employee" />
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

export default {LoginPage}
