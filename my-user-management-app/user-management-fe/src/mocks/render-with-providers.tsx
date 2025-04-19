import {render} from '@testing-library/react'
import {LoginPage} from 'pages/login-page/login-page'
import {QueryClient, QueryClientProvider} from 'react-query'

const queryClient = new QueryClient()

export const renderWithProviders = (ui: React.ReactNode) =>
  render(
    <QueryClientProvider client={queryClient}>
      <LoginPage />
    </QueryClientProvider>,
    {},
  )
