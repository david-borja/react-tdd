import React from 'react'
import PropTypes from 'prop-types'

// https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary

// There is currently no way to write an error boundary as a function component. However, you don’t have to write the error boundary class yourself. For example, you can use react-error-boundary instead.

// https://github.com/bvaughn/react-error-boundary

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {hasError: false}
  }

  static getDerivedStateFromError() {
    return {hasError: true}
  }

  handleReloadClick = () => {
    window.location.reload()
  }

  render() {
    const {children} = this.props
    const {hasError} = this.state

    if (hasError) {
      return (
        <>
          <p>There is an unexpected error</p>
          <button type="button" onClick={this.handleReloadClick}>
            Reload
          </button>
        </>
      )
    }
    return children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ErrorBoundary
