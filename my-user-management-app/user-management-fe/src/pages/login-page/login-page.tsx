import React from 'react'
import axios from 'axios'
import {TextField, Typography} from '@mui/material'
import {useForm, SubmitHandler} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import {StyledLoader} from 'components/loader'
import {loginSchema} from './login-schema'
import {useLoginMutation} from './use-login-mutation'
import {Inputs} from './login-page.interfaces'

// Unlike queries, mutations are typically userd to create/update/delete data or perform server side-effect

const ERROR_MESSAGE_MATCHER = {
  401: 'The email or password are not correct',
  500: 'Unexpected error, please try again',
}

const DEFAULT_ERROR = 'Default Error'

export const LoginPage = () => {
  const [errorMessage, setErrorMessage] = React.useState<string>('')
  const mutation = useLoginMutation()

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<Inputs>({
    resolver: yupResolver(loginSchema),
  })

  const onSubmit: SubmitHandler<Inputs> = async ({email, password}) => {
    mutation.mutate(
      {email, password},
      {
        onError: error => {
          if (!axios.isAxiosError(error)) return
          const status: number = error?.response?.status ?? 0
          const message =
            ERROR_MESSAGE_MATCHER[
              status as keyof typeof ERROR_MESSAGE_MATCHER
            ] || DEFAULT_ERROR
          setErrorMessage(message)
        },
      },
    )
  }

  return (
    <>
      <h1>Login</h1>

      {mutation.isLoading && (
        <StyledLoader role="progressbar" aria-label="loading" />
      )}

      {mutation.isError && <Typography>{errorMessage}</Typography>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">Email</label>
        <TextField
          type="email"
          id="email"
          helperText={errors.email?.message}
          {...register('email', {required: true})} // register already returns props like "name"
        />

        <label htmlFor="password">Password</label>
        <TextField
          type="password"
          id="password"
          helperText={errors.password?.message}
          {...register('password', {required: true})} // register already returns props like "name"
        />

        <button disabled={mutation.isLoading} type="submit">
          Submit
        </button>
      </form>
    </>
  )
}

export default LoginPage
