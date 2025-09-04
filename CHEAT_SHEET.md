# React Error Boundaries – Cheat Sheet

## 🔹 What They Are

A React component (class-based) that "catches" errors in child components and prevents the whole app from crashing.

## 🔹 Lifecycle Methods

**`static getDerivedStateFromError(error)`** → Update state, show fallback UI  
**`componentDidCatch(error, errorInfo)`** → Log error (to console or monitoring)

## 🔹 What They Catch ✅

- **Errors in rendering** (component render method fails)
- **Errors in lifecycle methods** (componentDidMount crashes)
- **Errors in constructors** of child components
- **Errors anywhere in child component tree** (deeply nested failures)

## 🔹 What They Don't Catch ❌

- **Event handler errors** (onClick, onSubmit, etc.)
- **Asynchronous errors** (setTimeout, fetch, Promises)
- **Server-side rendering errors**
- **Errors thrown inside the Error Boundary itself**

## 🔹 Basic Example

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong 🚨</h2>
    }
    return this.props.children
  }
}
```

**Usage:**
```javascript
<ErrorBoundary>
  <BuggyComponent />
</ErrorBoundary>
```

## 🔹 With Retry Button

```javascript
if (this.state.hasError) {
  return (
    <div>
      <h2>Something went wrong 🚨</h2>
      <button onClick={() => this.setState({ hasError: false })}>
        Retry
      </button>
    </div>
  )
}
```

## 🔹 Multiple Boundaries

Wrap different parts separately → only the broken part shows fallback:

```javascript
<ErrorBoundary>
  <Sidebar />
</ErrorBoundary>
<ErrorBoundary>
  <MainContent />
</ErrorBoundary>
```

**Result:** If MainContent crashes, Sidebar keeps working!

## 🔹 Production Ready Pattern

```javascript
class ProductionErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log to monitoring service
    console.error('Error caught:', error)
    
    // Send to Sentry/LogRocket in production
    if (import.meta.env.PROD) {
      this.reportError(error, errorInfo)
    }
  }

  reportError = (error, errorInfo) => {
    // Production error reporting
    console.log('📊 Reported to monitoring service')
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Oops! Something went wrong</h2>
          <p>We've been notified and are working on a fix.</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
          
          {/* Show details only in development */}
          {import.meta.env.DEV && (
            <details>
              <summary>Error Details (Dev Only)</summary>
              <pre>{this.state.error?.message}</pre>
            </details>
          )}
        </div>
      )
    }
    return this.props.children
  }
}
```

## 🔹 Best Practices

### ✅ DO
- **Use global boundary** (at root) + **local ones** (for risky features)
- **Provide user-friendly fallbacks** (reload, retry, support links)
- **Log errors** (Sentry, LogRocket, or custom backend)
- **Test error scenarios** in development
- **Handle async errors** with try/catch separately

### ❌ DON'T
- **Don't overuse** – they're for unexpected crashes, not normal flow
- **Don't show technical details** to users in production
- **Don't rely on them** for event handler or async errors
- **Don't forget to clean up** event listeners in error boundaries
- **Don't use for data fetching errors** – use proper data fetching libraries

## 🔹 Common Error Handling Patterns

### Event Handlers
```javascript
const handleClick = () => {
  try {
    riskyOperation()
  } catch (error) {
    setError('Operation failed')
    reportError(error)
  }
}
```

### Async Operations
```javascript
useEffect(() => {
  fetchData()
    .catch(error => {
      setError('Failed to load data')
      reportError(error)
    })
}, [])
```

### Global Errors
```javascript
window.addEventListener('error', (event) => {
  reportError(event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  reportError(event.reason)
})
```

## 🔹 Quick Implementation Checklist

When adding Error Boundaries to your app:

- [ ] **Global boundary** around entire app
- [ ] **Feature boundaries** around major sections
- [ ] **User-friendly fallback UI** with retry/reload options
- [ ] **Error logging** to monitoring service
- [ ] **Development vs production** error handling
- [ ] **Test with intentionally broken components**
- [ ] **Handle async errors** with separate try/catch
- [ ] **Integrate with existing error reporting** infrastructure

## 🔹 Interview Ready Responses

**"Why use Error Boundaries?"**
*"They prevent JavaScript errors from crashing the entire React app, providing graceful degradation and better user experience."*

**"What don't they catch?"**
*"Event handlers, async code, and errors in the Error Boundary itself. For those, use try/catch and global error handlers."*

**"How do you test them?"**
*"Create components that throw errors on command, wrap them with Error Boundaries, and verify fallback UI appears instead of app crash."*

**"Production strategy?"**
*"Global boundary for catastrophic failures, feature boundaries for isolation, comprehensive logging to monitoring services, user-friendly messages only."*

---

**🎯 Goal:** Master Error Boundaries as a production-ready React developer who thinks about edge cases and user experience!