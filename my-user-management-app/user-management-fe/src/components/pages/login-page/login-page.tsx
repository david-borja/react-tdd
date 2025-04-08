import {TextField} from '@mui/material'
import React from 'react'
import {useForm, SubmitHandler} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import {loginSchema} from './login-schema'

interface Inputs {
  email: string
  password: string
}

export const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<Inputs>({
    resolver: yupResolver(loginSchema),
  })

  const onSubmit: SubmitHandler<Inputs> = data => console.log(data)
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

        <button type="submit">Submit</button>
      </form>
    </>
  )
}
