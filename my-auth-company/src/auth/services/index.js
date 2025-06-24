export const login = ({email, password}) => {
  return fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, password}),
  })
}

export default {login}
