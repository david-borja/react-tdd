import {render} from '@testing-library/react'
import {QueryClient, QueryClientProvider} from 'react-query'

export const queryClient = new QueryClient()

export const renderWithProviders = (ui: React.ReactNode) =>
  render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    {},
  )
