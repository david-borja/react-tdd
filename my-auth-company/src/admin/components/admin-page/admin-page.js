import React, {useContext} from 'react'
import {Link} from 'react-router-dom'
import {Button} from '@material-ui/core'
import {AuthContext} from '../../../utils/contexts/auth-context'

export const AdminPage = () => {
  const {user} = useContext(AuthContext)
  return (
    <>
      <h1>Admin page</h1>
      <p>{user.username}</p>
      <Button component={Link} color="inherit" to="/employee">
        Employee
      </Button>
    </>
  )
}

export default {AdminPage}
