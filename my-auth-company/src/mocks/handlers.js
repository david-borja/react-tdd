import {rest} from 'msw'

export const handlers = [
  rest.post('/login', (req, res, ctx) => {
    sessionStorage.setItem('is-authenticated', true)
    return res(ctx.status(200))
  }),
  // Handles a GET /user request
  rest.get('/user', null),
]

export default {handlers}
