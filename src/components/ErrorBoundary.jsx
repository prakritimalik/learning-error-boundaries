import React from 'react'
import ErrorFallback from './ErrorFallback'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        // Update state to show fallback UI
        return { hasError: true, error: error }
    }

    componentDidCatch(error, errorInfo) {
        // Log error details
        console.error('Error caught:', error, errorInfo)


        // Simulate sending to error monitoring service
        this.logErrorToService(error, errorInfo)
    }

    logErrorToService = (error, errorInfo) => {
        // In real app: sendToSentry(error, errorInfo)
        console.log('📊 Sent to monitoring:', {
            message: error.message,
            component: errorInfo.componentStack,
            timestamp: new Date().toISOString()
        })
    }

    retry = () => {
        this.setState({ hasError: false })
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback error={this.state.error} retry={this.retry} />
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