import React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error) {
        // Update state to show fallback UI
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        // Log error details
        console.error('Error caught:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return <h2>Something went wrong!</h2>
        }
        return this.props.children
    }
}


export default ErrorBoundary

//   The basic structure is the same, but you customize:

//   1. State shape:
//   // Basic
//   this.state = { hasError: false }

//   // Advanced
//   this.state = {
//     hasError: false,
//     error: null,
//     errorInfo: null
//   }

//   2. Fallback UI:
//   // Basic
//   return <h2>Something went wrong!</h2>

//   // Custom
//   return <ErrorFallback error={this.state.error} retry={this.retry} />

//   3. Error logging:
//   // Development
//   console.error('Error:', error)

//   // Production
//   sendToSentry(error, errorInfo)

//   4. Props customization:
//   // Different fallback per boundary
//   <ErrorBoundary fallback={<CustomErrorUI />}>

//   // Different error handling
//   <ErrorBoundary onError={(error) => logToService(error)}></ErrorBoundary>