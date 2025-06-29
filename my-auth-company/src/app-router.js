import React from 'react'
import {Switch, Route, BrowserRouter as Router} from 'react-router-dom/'
import {LoginPage} from './auth/components/login-page'
import {PrivateRoute} from './utils/components/private-route'
import {AdminPage} from './admin/components/admin-page/admin-page'
import {EmployeePage} from './employee/components/employee-page/employee-page'
import {ADMIN_ROLE} from './consts'

export const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <LoginPage />
        </Route>
        <PrivateRoute path="/admin" allowRoles={[ADMIN_ROLE]}>
          <AdminPage />
        </PrivateRoute>
        <PrivateRoute path="/employee">
          <EmployeePage />
        </PrivateRoute>
      </Switch>
    </Router>
  )
}

export default {AppRouter}
