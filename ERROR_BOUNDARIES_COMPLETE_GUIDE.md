# React Error Boundaries: Complete Guide & Interview Preparation

## Table of Contents
1. [What are Error Boundaries?](#what-are-error-boundaries)
2. [Core Implementation](#core-implementation)
3. [Error Catching Scope](#error-catching-scope)
4. [Production-Ready Patterns](#production-ready-patterns)
5. [Multiple Boundary Levels](#multiple-boundary-levels)
6. [Error Handling Strategies](#error-handling-strategies)
7. [Interview Questions & Answers](#interview-questions--answers)
8. [Best Practices](#best-practices)
9. [Common Pitfalls](#common-pitfalls)

## What are Error Boundaries?

### Problem They Solve

**Before Error Boundaries:**
```javascript
// If any component crashes during rendering...
const BrokenComponent = () => {
  throw new Error('Something went wrong!')
  return <div>This never renders</div>
}

// The entire React app would crash with white screen of death
```

**With Error Boundaries:**
```javascript
<ErrorBoundary>
  <BrokenComponent /> {/* Crashes but is contained */}
</ErrorBoundary>
// Only the broken part shows error UI, rest of app keeps working
```

### Key Concepts

**Error Boundaries are:**
- React components that catch JavaScript errors anywhere in their child component tree
- Used to log errors and display fallback UI instead of crashing the entire app
- A way to implement graceful degradation in React applications
- **Must be class components** (cannot be function components)

**They provide:**
- Error isolation (broken components don't crash the whole app)
- User-friendly error messages
- Error logging for debugging and monitoring
- Graceful recovery mechanisms

## Core Implementation

### Basic Error Boundary Structure

```javascript
import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    // State to track error status
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    }
  }

  static getDerivedStateFromError(error) {
    // Updates state to trigger fallback UI
    // This method is called during the render phase
    return { hasError: true, error: error }
  }

  componentDidCatch(error, errorInfo) {
    // Side effects like logging errors
    // This method is called during the commit phase
    console.error('ErrorBoundary caught an error:', error)
    console.error('Error info:', errorInfo)
    
    // Store additional error information
    this.setState({ errorInfo })
    
    // Log to external service (production)
    this.logErrorToService(error, errorInfo)
  }

  logErrorToService = (error, errorInfo) => {
    // In production, send to monitoring service
    // sendToSentry(error, errorInfo)
    // sendToBugsnag(error, errorInfo)
    // sendToLogRocket(error, errorInfo)
    
    console.log('📊 Error logged to monitoring service:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    })
  }

  retry = () => {
    // Reset error state to retry rendering
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    })
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI
      return (
        <ErrorFallback 
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          retry={this.retry}
        />
      )
    }

    // No error, render children normally
    return this.props.children
  }
}

export default ErrorBoundary
```

### Professional Error Fallback Component

```javascript
import React from 'react'

const ErrorFallback = ({ error, errorInfo, retry }) => {
  const isDevelopment = import.meta.env.DEV

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h2 style={styles.title}>Oops! Something went wrong</h2>
        
        <p style={styles.message}>
          We're sorry, but something unexpected happened. 
          Please try again or contact support if the problem persists.
        </p>

        <button 
          onClick={retry} 
          style={styles.retryButton}
        >
          Try again
        </button>

        <button 
          onClick={() => window.location.reload()} 
          style={styles.reloadButton}
        >
          Reload page
        </button>

        {/* Show technical details only in development */}
        {isDevelopment && error && (
          <details style={styles.details}>
            <summary style={styles.summary}>
              Error details (development only)
            </summary>
            <div style={styles.errorDetails}>
              <h4>Error Message:</h4>
              <pre style={styles.errorText}>{error.message}</pre>
              
              <h4>Stack Trace:</h4>
              <pre style={styles.errorText}>{error.stack}</pre>
              
              {errorInfo && (
                <>
                  <h4>Component Stack:</h4>
                  <pre style={styles.errorText}>{errorInfo.componentStack}</pre>
                </>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
    padding: '20px'
  },
  content: {
    textAlign: 'center',
    maxWidth: '500px',
    padding: '30px',
    border: '2px solid #ff6b6b',
    borderRadius: '8px',
    backgroundColor: '#fff5f5'
  },
  title: {
    color: '#d63031',
    marginBottom: '16px'
  },
  message: {
    color: '#636e72',
    marginBottom: '24px',
    lineHeight: '1.5'
  },
  retryButton: {
    backgroundColor: '#0984e3',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    marginRight: '12px',
    cursor: 'pointer'
  },
  reloadButton: {
    backgroundColor: '#6c5ce7',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  details: {
    marginTop: '24px',
    textAlign: 'left'
  },
  summary: {
    cursor: 'pointer',
    fontWeight: 'bold',
    marginBottom: '12px'
  },
  errorDetails: {
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px'
  },
  errorText: {
    fontSize: '12px',
    color: '#495057',
    overflow: 'auto',
    maxHeight: '200px'
  }
}

export default ErrorFallback
```

## Error Catching Scope

### What Error Boundaries DO Catch ✅

```javascript
// 1. Rendering errors
const RenderingError = () => {
  const data = null
  return <div>{data.nonexistent.property}</div> // ✅ Caught
}

// 2. Lifecycle method errors
class LifecycleError extends React.Component {
  componentDidMount() {
    throw new Error('Mount failed') // ✅ Caught
  }
  render() {
    return <div>Component</div>
  }
}

// 3. Constructor errors in child components
class ConstructorError extends React.Component {
  constructor(props) {
    super(props)
    throw new Error('Constructor failed') // ✅ Caught
  }
  render() {
    return <div>Component</div>
  }
}

// 4. Errors in child component tree
<ErrorBoundary>
  <Parent>
    <Child>
      <BrokenGrandChild /> {/* ✅ Caught even if deeply nested */}
    </Child>
  </Parent>
</ErrorBoundary>
```

### What Error Boundaries DON'T Catch ❌

```javascript
// 1. Event handler errors
const EventHandlerError = () => {
  const handleClick = () => {
    throw new Error('Button click failed') // ❌ NOT caught
  }
  return <button onClick={handleClick}>Click me</button>
}

// 2. Asynchronous code errors
const AsyncError = () => {
  React.useEffect(() => {
    setTimeout(() => {
      throw new Error('Async error') // ❌ NOT caught
    }, 1000)
  }, [])
  return <div>Component</div>
}

// 3. Promise rejections
const PromiseError = () => {
  React.useEffect(() => {
    fetch('/api/data')
      .then(response => {
        throw new Error('Fetch failed') // ❌ NOT caught
      })
  }, [])
  return <div>Component</div>
}

// 4. Errors in Error Boundary itself
class SelfError extends React.Component {
  componentDidCatch(error, errorInfo) {
    throw new Error('Boundary error') // ❌ NOT caught by itself
  }
  render() {
    if (this.state.hasError) {
      throw new Error('Render error') // ❌ NOT caught by itself
    }
    return this.props.children
  }
}
```

### Handling Errors Outside Error Boundaries

```javascript
// Event handlers - use try/catch
const SafeEventHandler = () => {
  const [error, setError] = useState(null)

  const handleClick = () => {
    try {
      riskyOperation()
    } catch (error) {
      console.error('Event handler error:', error)
      setError('Operation failed. Please try again.')
      // Optionally report to monitoring service
      reportError(error)
    }
  }

  return (
    <div>
      <button onClick={handleClick}>Risky Action</button>
      {error && <div style={{color: 'red'}}>{error}</div>}
    </div>
  )
}

// Async operations - use try/catch with async/await
const SafeAsyncOperation = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/data')
      if (!response.ok) throw new Error('Fetch failed')
      const data = await response.json()
      // Handle success
    } catch (error) {
      console.error('Async error:', error)
      setError('Failed to load data. Please try again.')
      reportError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
      {error && <div style={{color: 'red'}}>{error}</div>}
    </div>
  )
}

// Global error handlers for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
  reportError(event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
  reportError(event.reason)
})
```

## Production-Ready Patterns

### Enhanced Error Boundary with Configurable Options

```javascript
class EnhancedErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    const { onError, logErrors = true, maxRetries = 3 } = this.props
    
    this.setState({ errorInfo })

    // Custom error handler
    if (onError) {
      onError(error, errorInfo)
    }

    // Log errors based on prop
    if (logErrors) {
      this.logError(error, errorInfo)
    }

    // Auto-retry for transient errors
    if (this.state.retryCount < maxRetries && this.isTransientError(error)) {
      setTimeout(() => {
        this.retry()
      }, 1000)
    }
  }

  isTransientError = (error) => {
    // Define which errors might be temporary
    const transientMessages = ['ChunkLoadError', 'Network Error', 'Failed to fetch']
    return transientMessages.some(msg => error.message.includes(msg))
  }

  logError = (error, errorInfo) => {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      retryCount: this.state.retryCount,
      props: this.props.logProps ? this.props : undefined
    }

    // Development logging
    if (import.meta.env.DEV) {
      console.group('🚨 Error Boundary Triggered')
      console.error('Error:', error)
      console.error('Error Info:', errorInfo)
      console.error('Full Report:', errorReport)
      console.groupEnd()
    }

    // Production logging
    if (import.meta.env.PROD) {
      this.sendToMonitoring(errorReport)
    }
  }

  sendToMonitoring = (errorReport) => {
    // Example: Sentry integration
    // Sentry.captureException(errorReport.error, {
    //   tags: { component: 'ErrorBoundary' },
    //   extra: errorReport
    // })

    // Example: Custom API endpoint
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorReport)
    // })

    console.log('📊 Error sent to monitoring service:', errorReport)
  }

  retry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }))
  }

  render() {
    if (this.state.hasError) {
      const { FallbackComponent, fallback } = this.props

      // Custom fallback component
      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            retry={this.retry}
            retryCount={this.state.retryCount}
          />
        )
      }

      // Custom fallback element
      if (fallback) {
        return fallback
      }

      // Default fallback
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <button onClick={this.retry}>Try again</button>
        </div>
      )
    }

    return this.props.children
  }
}

export default EnhancedErrorBoundary
```

### Professional Error Fallback Components

```javascript
// Generic Error Fallback
const GenericErrorFallback = ({ error, retry }) => (
  <div className="error-container">
    <h2>Oops! Something went wrong</h2>
    <p>We apologize for the inconvenience. Please try again.</p>
    <button onClick={retry}>Try again</button>
    <button onClick={() => window.location.reload()}>Reload page</button>
  </div>
)

// Feature-Specific Error Fallbacks
const ChatErrorFallback = ({ retry }) => (
  <div className="chat-error">
    <h3>Chat unavailable</h3>
    <p>Unable to load chat. You can still use other features.</p>
    <button onClick={retry}>Retry chat</button>
  </div>
)

const PaymentErrorFallback = ({ retry }) => (
  <div className="payment-error">
    <h3>Payment system temporarily unavailable</h3>
    <p>Please try again in a few minutes or contact support.</p>
    <button onClick={retry}>Try again</button>
    <a href="/support">Contact Support</a>
  </div>
)

// Network Error Fallback
const NetworkErrorFallback = ({ retry }) => (
  <div className="network-error">
    <h3>Connection Problem</h3>
    <p>Please check your internet connection and try again.</p>
    <button onClick={retry}>Retry</button>
  </div>
)
```

## Error Catching Scope

### Testing Error Boundary Capabilities

```javascript
// Component that demonstrates what IS caught
const RenderingErrorDemo = ({ shouldThrow }) => {
  if (shouldThrow) {
    // Rendering error - WILL be caught
    throw new Error('Component rendering failed!')
  }
  return <div>✅ Rendering successful</div>
}

// Component that demonstrates what is NOT caught
const EventHandlerErrorDemo = () => {
  const [localError, setLocalError] = useState(null)

  const handleClickUncaught = () => {
    // Event handler error - NOT caught by Error Boundary
    throw new Error('Uncaught event handler error!')
  }

  const handleClickCaught = () => {
    try {
      throw new Error('Event handler error!')
    } catch (error) {
      console.error('Handled event error:', error)
      setLocalError('Action failed. Please try again.')
      
      // Optional: Report to monitoring
      reportError(error, { context: 'button_click' })
    }
  }

  const handleAsyncError = async () => {
    try {
      // Simulate async operation
      await new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Async operation failed')), 1000)
      })
    } catch (error) {
      console.error('Async error handled:', error)
      setLocalError('Async operation failed.')
    }
  }

  return (
    <div>
      <h3>Event Handler Error Tests</h3>
      
      <button onClick={handleClickUncaught}>
        Uncaught Error (check console)
      </button>
      
      <button onClick={handleClickCaught}>
        Caught Error (handled gracefully)
      </button>
      
      <button onClick={handleAsyncError}>
        Async Error (handled)
      </button>

      {localError && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {localError}
          <button onClick={() => setLocalError(null)}>Dismiss</button>
        </div>
      )}
    </div>
  )
}
```

## Multiple Boundary Levels

### Strategic Error Boundary Placement

```javascript
function App() {
  return (
    // Global Error Boundary - catches catastrophic failures
    <ErrorBoundary
      FallbackComponent={AppCrashFallback}
      onError={(error, errorInfo) => {
        // Report critical app-level errors
        reportCriticalError(error, errorInfo)
      }}
    >
      <Header />
      
      <main>
        {/* Feature-level Error Boundary - isolates feature failures */}
        <ErrorBoundary
          FallbackComponent={DashboardErrorFallback}
          onError={(error) => reportFeatureError('dashboard', error)}
        >
          <Dashboard />
        </ErrorBoundary>

        {/* Another feature boundary */}
        <ErrorBoundary
          FallbackComponent={ChatErrorFallback}
          onError={(error) => reportFeatureError('chat', error)}
        >
          <ChatWidget />
        </ErrorBoundary>

        {/* Critical feature with enhanced error handling */}
        <ErrorBoundary
          FallbackComponent={PaymentErrorFallback}
          onError={(error) => {
            reportCriticalError(error, { feature: 'payment' })
            // Maybe also notify support team immediately
            notifySupportTeam(error)
          }}
          maxRetries={1} // Limit retries for payment
        >
          <PaymentForm />
        </ErrorBoundary>
      </main>

      <Footer />
    </ErrorBoundary>
  )
}
```

### Error Boundary Hierarchy Strategy

```
App Level (Global)
├── Navigation (Always visible)
├── Main Content
│   ├── Dashboard (Feature Boundary)
│   ├── Chat Widget (Feature Boundary)  
│   ├── User Profile (Feature Boundary)
│   └── Settings (Feature Boundary)
└── Footer (Always visible)
```

**Benefits:**
- **Granular failure isolation** - only broken features show errors
- **Maintained core functionality** - navigation, footer, other features work
- **Targeted error reporting** - know exactly which feature failed
- **Better user experience** - partial functionality vs complete crash

## Error Handling Strategies

### Development vs Production Error Handling

```javascript
class ProductionErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    const isDevelopment = import.meta.env.DEV
    const isProduction = import.meta.env.PROD

    if (isDevelopment) {
      // Development: Show detailed errors
      console.group('🛠️ Development Error Details')
      console.error('Error:', error)
      console.error('Component Stack:', errorInfo.componentStack)
      console.error('Props:', this.props)
      console.groupEnd()
      
      // Maybe show error overlay
      this.showDevErrorOverlay(error, errorInfo)
    }

    if (isProduction) {
      // Production: Log safely and report to monitoring
      const sanitizedError = {
        message: error.message,
        // Don't include sensitive stack traces in production logs
        stack: this.sanitizeStack(error.stack),
        timestamp: new Date().toISOString(),
        userId: this.props.userId,
        sessionId: this.props.sessionId
      }

      // Send to monitoring service
      this.reportToMonitoring(sanitizedError)
      
      // Show user-friendly message only
      this.setState({ 
        userMessage: 'We encountered an unexpected issue. Our team has been notified.' 
      })
    }
  }

  sanitizeStack = (stack) => {
    // Remove sensitive file paths, keep only relevant error info
    return stack
      .split('\n')
      .filter(line => !line.includes('node_modules'))
      .slice(0, 5) // Limit stack depth
      .join('\n')
  }

  reportToMonitoring = (errorData) => {
    // Example integrations
    
    // Sentry
    // Sentry.captureException(errorData)
    
    // LogRocket
    // LogRocket.captureException(errorData)
    
    // Custom endpoint
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorData)
    // })

    console.log('📊 Error reported to monitoring service')
  }
}
```

### Error Recovery Patterns

```javascript
// Pattern 1: Automatic retry for transient errors
class AutoRetryErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, retryCount: 0 }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    const { maxAutoRetries = 2 } = this.props
    
    if (this.state.retryCount < maxAutoRetries && this.isRetryable(error)) {
      // Auto-retry after short delay
      setTimeout(() => {
        this.setState(prevState => ({
          hasError: false,
          retryCount: prevState.retryCount + 1
        }))
      }, 1000)
    }
  }

  isRetryable = (error) => {
    const retryableErrors = [
      'ChunkLoadError', // Code splitting failures
      'Loading chunk', // Dynamic import failures
      'Loading CSS chunk' // CSS loading failures
    ]
    return retryableErrors.some(msg => error.message.includes(msg))
  }
}

// Pattern 2: Graceful degradation
class GracefulErrorBoundary extends React.Component {
  render() {
    if (this.state.hasError) {
      // Show simplified version of the component instead of generic error
      return this.props.gracefulFallback || <div>Feature temporarily unavailable</div>
    }
    return this.props.children
  }
}

// Usage
<GracefulErrorBoundary 
  gracefulFallback={<SimpleChartVersion />}
>
  <ComplexInteractiveChart />
</GracefulErrorBoundary>
```

## React 18 Concurrent Rendering Considerations

### Understanding Concurrent Rendering Errors

```javascript
// React 18 error boundary behavior
class ConcurrentAwareErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // React 18 might show additional messages like:
    // "There was an error during concurrent rendering but React was able to recover"
    
    // This is normal - React falls back to synchronous rendering
    console.log('React rendering mode fallback occurred')
    
    // Your error handling logic remains the same
    this.logError(error, errorInfo)
  }

  logError = (error, errorInfo) => {
    // Include React version and rendering context
    const errorReport = {
      ...errorInfo,
      reactVersion: React.version,
      isConcurrentMode: true, // React 18+
      renderingContext: 'concurrent_fallback_to_sync'
    }

    console.log('Error report:', errorReport)
  }
}
```

## Interview Questions & Answers

### Fundamental Concepts

**Q: What are React Error Boundaries and why are they important?**

**A:** Error Boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of crashing the entire application. They're crucial for building resilient production applications because they provide graceful error handling and prevent the "white screen of death" when components fail unexpectedly.

**Q: Why must Error Boundaries be class components? Can you implement them with hooks?**

**A:** Error Boundaries must be class components because they rely on specific lifecycle methods (`static getDerivedStateFromError` and `componentDidCatch`) that don't have equivalent hooks in function components. React intentionally doesn't provide error boundary hooks to maintain clear separation between error handling and regular component logic.

**Q: What's the difference between getDerivedStateFromError and componentDidCatch?**

**A:** 
- `getDerivedStateFromError` is called during the render phase to update state and trigger fallback UI. It should be pure and not have side effects.
- `componentDidCatch` is called during the commit phase and is used for side effects like logging errors to external services.

### Error Catching Scope

**Q: What types of errors do Error Boundaries catch vs not catch?**

**A:** 
**Caught (✅):**
- Errors during rendering
- Errors in lifecycle methods of child components
- Errors in constructors of child components

**NOT Caught (❌):**
- Event handler errors
- Asynchronous code errors (setTimeout, Promises)
- Server-side rendering errors
- Errors in the Error Boundary component itself

**Q: How do you handle errors that Error Boundaries can't catch?**

**A:** Use traditional error handling:
- **Event handlers:** try/catch blocks with state to show user feedback
- **Async operations:** try/catch with async/await, handle rejections with .catch()
- **Global errors:** window.onerror and unhandledrejection event listeners
- **API calls:** Response error handling and retry logic

### Architecture & Best Practices

**Q: Where should you place Error Boundaries in your application?**

**A:** Use multiple levels:
- **Global boundary:** Around the entire app for catastrophic failures
- **Feature boundaries:** Around major features (dashboard, chat, payments)
- **Component boundaries:** Around complex or unreliable components
- **Route boundaries:** Around different pages/routes

**Q: How do you design error handling for a large React application?**

**A:** 
1. **Hierarchy:** Global → Feature → Component level boundaries
2. **Isolation:** Each boundary catches errors for its specific scope
3. **Fallbacks:** Different fallback UIs for different types of failures
4. **Monitoring:** Comprehensive error reporting and logging
5. **Recovery:** Retry mechanisms and graceful degradation
6. **User experience:** Clear, actionable error messages

### Production Concerns

**Q: How do you handle error logging in production vs development?**

**A:**
- **Development:** Show detailed error information, full stack traces, component props
- **Production:** Log sanitized errors to monitoring services, show user-friendly messages only
- **Security:** Never expose sensitive data in error messages or logs
- **Monitoring:** Integrate with services like Sentry, LogRocket, or custom endpoints

**Q: What information should you collect when an error occurs?**

**A:**
- Error message and stack trace
- Component stack (which components were rendering)
- User session information (user ID, session ID)
- Browser/environment info (user agent, URL)
- Application state context
- Timestamp and error frequency
- User actions leading to the error

### Advanced Scenarios

**Q: How do you handle errors in lazy-loaded components?**

**A:**
```javascript
const LazyComponent = React.lazy(() => import('./LazyComponent'))

<ErrorBoundary
  FallbackComponent={ChunkLoadErrorFallback}
  onError={(error) => {
    if (error.message.includes('ChunkLoadError')) {
      // Handle code splitting failures
      window.location.reload()
    }
  }}
>
  <React.Suspense fallback={<Loading />}>
    <LazyComponent />
  </React.Suspense>
</ErrorBoundary>
```

**Q: How do you test Error Boundaries?**

**A:**
```javascript
// Test component that throws on command
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

// Jest test
import { render, screen } from '@testing-library/react'

test('ErrorBoundary shows fallback UI when child throws', () => {
  render(
    <ErrorBoundary>
      <ThrowError shouldThrow={true} />
    </ErrorBoundary>
  )
  
  expect(screen.getByText('Something went wrong')).toBeInTheDocument()
})
```

**Q: How do you handle async errors that need to trigger Error Boundary?**

**A:**
```javascript
const AsyncErrorComponent = () => {
  const [, setError] = useState()

  useEffect(() => {
    fetchData()
      .catch(error => {
        // Trigger Error Boundary by throwing during render
        setError(() => { throw error })
      })
  }, [])

  return <div>Async component</div>
}
```

## Best Practices

### 1. Error Boundary Placement Strategy

```javascript
// ✅ Good: Strategic placement
<ErrorBoundary> {/* Global */}
  <Header />
  <ErrorBoundary> {/* Feature level */}
    <Dashboard />
  </ErrorBoundary>
  <ErrorBoundary> {/* Feature level */}
    <Sidebar />
  </ErrorBoundary>
</ErrorBoundary>

// ❌ Avoid: Too many boundaries
<ErrorBoundary>
  <ErrorBoundary>
    <ErrorBoundary>
      <SimpleComponent /> {/* Overkill for simple components */}
    </ErrorBoundary>
  </ErrorBoundary>
</ErrorBoundary>
```

### 2. Fallback UI Design

```javascript
// ✅ Good: Context-aware fallback
const ContextualErrorFallback = ({ error, feature, retry }) => {
  const errorMessages = {
    payment: 'Payment processing is temporarily unavailable.',
    chat: 'Chat is currently offline. Other features remain available.',
    dashboard: 'Unable to load dashboard data. Please refresh.',
    default: 'Something went wrong. Please try again.'
  }

  return (
    <div className="error-fallback">
      <h3>{errorMessages[feature] || errorMessages.default}</h3>
      <button onClick={retry}>Try Again</button>
    </div>
  )
}

// ❌ Avoid: Generic unhelpful messages
const BadFallback = () => <div>Error</div>
```

### 3. Error Reporting Strategy

```javascript
class SmartErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    const errorContext = {
      feature: this.props.feature,
      userId: this.props.userId,
      severity: this.determineSeverity(error),
      timestamp: Date.now()
    }

    // Different handling based on severity
    switch (errorContext.severity) {
      case 'critical':
        this.reportCriticalError(error, errorInfo, errorContext)
        this.notifySupport(error, errorContext)
        break
      case 'warning':
        this.reportWarning(error, errorInfo, errorContext)
        break
      default:
        this.reportInfo(error, errorInfo, errorContext)
    }
  }

  determineSeverity = (error) => {
    if (error.message.includes('ChunkLoadError')) return 'warning'
    if (error.message.includes('Network')) return 'warning'
    if (this.props.feature === 'payment') return 'critical'
    return 'info'
  }
}
```

## Common Pitfalls & Solutions

### 1. Error Boundary Doesn't Catch Error

**Problem:**
```javascript
// Error thrown in event handler - not caught
const Component = () => {
  const handleClick = () => {
    throw new Error('Not caught!') // ❌
  }
  return <button onClick={handleClick}>Click</button>
}
```

**Solution:**
```javascript
// Use try/catch for event handlers
const Component = () => {
  const [error, setError] = useState(null)
  
  const handleClick = () => {
    try {
      riskyOperation()
    } catch (error) {
      setError('Operation failed')
      reportError(error)
    }
  }
  
  if (error) return <div>Error: {error}</div>
  return <button onClick={handleClick}>Click</button>
}
```

### 2. Error Boundary Catching Too Much

**Problem:**
```javascript
// Too broad - catches everything
<ErrorBoundary>
  <EntireApp /> {/* If anything breaks, whole app shows error */}
</ErrorBoundary>
```

**Solution:**
```javascript
// Strategic boundaries - isolate failures
<ErrorBoundary> {/* Global fallback */}
  <Navigation />
  <ErrorBoundary><Dashboard /></ErrorBoundary> {/* Feature isolation */}
  <ErrorBoundary><Chat /></ErrorBoundary>      {/* Feature isolation */}
  <Footer />
</ErrorBoundary>
```

### 3. Poor Error Messages

**Problem:**
```javascript
// Unhelpful for users
render() {
  if (this.state.hasError) {
    return <div>{this.state.error.stack}</div> // ❌ Technical details
  }
}
```

**Solution:**
```javascript
// User-friendly with progressive disclosure
render() {
  if (this.state.hasError) {
    return (
      <div>
        <h2>We're experiencing technical difficulties</h2>
        <p>Please try refreshing the page or contact support.</p>
        <button onClick={this.retry}>Try Again</button>
        
        {/* Technical details only in development */}
        {import.meta.env.DEV && (
          <details>
            <summary>Technical Details</summary>
            <pre>{this.state.error.message}</pre>
          </details>
        )}
      </div>
    )
  }
}
```

### 4. Memory Leaks in Error Boundaries

**Problem:**
```javascript
// Event listeners not cleaned up
componentDidCatch(error, errorInfo) {
  window.addEventListener('online', this.retry) // ❌ Never removed
}
```

**Solution:**
```javascript
componentDidCatch(error, errorInfo) {
  // Clean up in componentWillUnmount
  this.setupNetworkListeners()
}

componentWillUnmount() {
  window.removeEventListener('online', this.retry)
}

setupNetworkListeners = () => {
  window.addEventListener('online', this.retry)
}
```

## Real-World Integration Examples

### Integration with Monitoring Services

```javascript
// Sentry integration
import * as Sentry from '@sentry/react'

const SentryErrorBoundary = Sentry.withErrorBoundary(Component, {
  fallback: ({ error, resetError }) => (
    <div>
      <h2>Application Error</h2>
      <p>Error ID: {Sentry.lastEventId()}</p>
      <button onClick={resetError}>Try again</button>
    </div>
  )
})

// Custom monitoring integration
class MonitoredErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Multiple monitoring services
    Promise.allSettled([
      this.sendToSentry(error, errorInfo),
      this.sendToLogRocket(error, errorInfo),
      this.sendToCustomAPI(error, errorInfo)
    ]).then(results => {
      console.log('Error reporting results:', results)
    })
  }
}
```

### Integration with State Management

```javascript
// Redux integration
class ReduxErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Dispatch error to Redux store
    this.props.dispatch({
      type: 'ERROR_OCCURRED',
      payload: { error: error.message, timestamp: Date.now() }
    })
  }
}

// Zustand integration
import { useErrorStore } from './stores/errorStore'

const ZustandErrorBoundary = (props) => {
  const addError = useErrorStore(state => state.addError)
  
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        addError({
          message: error.message,
          component: errorInfo.componentStack,
          timestamp: Date.now()
        })
      }}
    >
      {props.children}
    </ErrorBoundary>
  )
}
```

## Summary

**Error Boundaries are essential for:**
- **Production React applications** - prevent complete app crashes
- **User experience** - show helpful messages instead of broken UI
- **Debugging** - capture and report errors with context
- **Graceful degradation** - maintain partial functionality during failures

**Key interview takeaways:**
1. **Understand scope** - what they catch vs don't catch
2. **Strategic placement** - multiple levels for isolation
3. **Production patterns** - logging, monitoring, user-friendly fallbacks
4. **Complementary strategies** - try/catch for event handlers, global listeners
5. **React 18 awareness** - concurrent rendering considerations

**You're now equipped to:**
- Implement robust error handling in any React application
- Design error boundary strategies for complex applications
- Integrate with monitoring and logging services
- Answer any interview question about Error Boundaries confidently

**This knowledge makes you a more senior React developer** who thinks about edge cases and user experience beyond just happy path scenarios.