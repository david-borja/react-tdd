import {rest} from 'msw'
import {
  ADMIN_EMAIL,
  ADMIN_ROLE,
  EMPLOYEE_EMAIL,
  EMPLOYEE_ROLE,
  HTTP_INVALID_CREDENTIALS_STATUS,
  HTTP_OK_STATUS,
} from '../consts'

export const handlers = [
  rest.post('/login', (req, res, ctx) => {
    sessionStorage.setItem('is-authenticated', true)
    let role = ''
    const {email} = req.body
    if (email === ADMIN_EMAIL) {
      role = ADMIN_ROLE
    }
    if (email === EMPLOYEE_EMAIL) {
      role = EMPLOYEE_ROLE
    }
    return res(ctx.status(200), ctx.json({user: {role, username: 'John Doe'}}))
  }),
  // Handles a GET /user request
  rest.get('/user', null),
]

export const handleInvalidCredentials = ({wrongEmail, wrongPassword}) =>
  rest.post('/login', (req, res, ctx) => {
    const {email, password} = req.body

    if (email === wrongEmail && password === wrongPassword) {
      return res(
        ctx.status(HTTP_INVALID_CREDENTIALS_STATUS),
        ctx.json({message: 'The email or password are not correct'}),
      )
    }

    return res(
      ctx.status(HTTP_OK_STATUS),
      ctx.json({message: 'Unexpected error, please try again'}),
    )
  })

export default {handlers, handleInvalidCredentials}
