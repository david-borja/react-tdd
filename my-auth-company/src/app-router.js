import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom/'
import {LoginPage} from './auth/components/login-page'

const AdminPage = () => <h1>Admin page</h1>

const EmployeePage = () => <h1>Employee page</h1>

const isAuth = false

export const AppRouter = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <LoginPage />
      </Route>
      <Route path="/admin" exact>
        {isAuth ? <AdminPage /> : <Redirect to="/" />}
      </Route>
      <Route path="/employee" exact>
        {isAuth ? <EmployeePage /> : <Redirect to="/" />}
      </Route>
    </Switch>
  )
}

export default {AppRouter}
