import axios from 'axios'
import {TextField} from '@mui/material'
import React from 'react'
import {useForm, SubmitHandler} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import {loginSchema} from './login-schema'

interface Inputs {
  email: string
  password: string
}

const loginService = async (email: string, password: string) => {
  await axios.post('/login', {
    email,
    password,
  })
}

export const LoginPage = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<Inputs>({
    resolver: yupResolver(loginSchema),
  })

  const onSubmit: SubmitHandler<Inputs> = async ({email, password}) => {
    setIsLoading(true)
    await loginService(email, password)
  }

  return (
    <>
      <h1>Login</h1>

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
          name="password"
          helperText={errors.password?.message}
          {...register('password', {required: true})} // register already returns props like "name"
        />

        <button disabled={isLoading} type="submit">
          Submit
        </button>
      </form>
    </>
  )
}
