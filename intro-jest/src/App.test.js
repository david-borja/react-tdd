import { render, screen } from '@testing-library/react'
import App from './App'

// test es el método global de jest
test('renders learn react link', () => {
  render(<App />)
  const linkElement = screen.getByText(/learn react/i)
  expect(linkElement).toBeInTheDocument()
  // the toBeInTheDocument matcher comes from setupTests.js as an extension.
})
