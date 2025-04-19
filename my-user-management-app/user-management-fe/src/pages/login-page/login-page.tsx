import {TextField} from '@mui/material'
import {useForm, SubmitHandler} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import {StyledLoader} from 'components/loader'
import {loginSchema} from './login-schema'
import {useLoginMutation} from './use-login-mutation'
import {Inputs} from './login-page.interfaces'

// Unlike queries, mutations are typically userd to create/update/delete data or perform server side-effect

export const LoginPage = () => {
  const mutation = useLoginMutation()

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<Inputs>({
    resolver: yupResolver(loginSchema),
  })

  const onSubmit: SubmitHandler<Inputs> = async ({email, password}) => {
    mutation.mutate({email, password})
  }

  return (
    <>
      <h1>Login</h1>
      {mutation.isLoading && (
        <StyledLoader role="progressbar" aria-label="loading" />
      )}
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

        <button disabled={mutation.isLoading} type="submit">
          Submit
        </button>
      </form>
    </>
  )
}
