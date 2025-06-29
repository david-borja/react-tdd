import React, {useContext} from 'react'
import {Link} from 'react-router-dom'
import {Button} from '@material-ui/core'
import {AuthContext} from '../../../utils/contexts/auth-context'
import {ADMIN_ROLE} from '../../../consts'

export const EmployeePage = () => {
  const {user} = useContext(AuthContext)
  return (
    <>
      <p>{user.username}</p>
      <Button component={Link} color="inherit" to="/employee">
        Employee
      </Button>
      <h1>Employee page</h1>
      {user.role === ADMIN_ROLE && <button type="button">Delete</button>}
    </>
  )
}

export default {EmployeePage}
