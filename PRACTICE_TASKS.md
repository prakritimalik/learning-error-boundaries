# Error Boundaries Practice Tasks

## Task 1: Global App Boundary

**Objective:** Understand app-wide error protection

**Steps:**
1. Wrap your entire app in a single ErrorBoundary
2. Throw an error in App.js itself (in render method)
3. ✅ Verify the whole app shows the fallback instead of crashing

**Implementation:**
```javascript
// App.jsx
function App() {
  const shouldCrash = false // Change to true to test
  
  if (shouldCrash) {
    throw new Error('App-level crash!')
  }

  return (
    <div>
      <h1>My App</h1>
      {/* Your app content */}
    </div>
  )
}

// main.jsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**Expected Result:** When shouldCrash is true, entire app shows error fallback

---

## Task 2: Local Boundary per Feature

**Objective:** Demonstrate isolated failure handling

**Steps:**
1. Create two sections: `<Profile />` (safe) and `<Notifications />` (crashes randomly)
2. Wrap only Notifications with an ErrorBoundary
3. ✅ Check that Profile still works when Notifications breaks

**Implementation:**
```javascript
// Safe component
const Profile = () => (
  <div style={{ padding: '20px', border: '1px solid green' }}>
    <h3>✅ User Profile (Always Works)</h3>
    <p>Name: John Doe</p>
    <p>Email: john@example.com</p>
  </div>
)

// Randomly crashing component
const Notifications = () => {
  const shouldCrash = Math.random() < 0.7 // 70% crash rate
  
  if (shouldCrash) {
    throw new Error('Notifications service failed!')
  }
  
  return (
    <div style={{ padding: '20px', border: '1px solid blue' }}>
      <h3>📬 Notifications (Sometimes Breaks)</h3>
      <p>You have 3 new messages</p>
    </div>
  )
}

// App setup
function App() {
  return (
    <div>
      <Profile /> {/* No boundary - always visible */}
      
      <ErrorBoundary> {/* Only wraps notifications */}
        <Notifications />
      </ErrorBoundary>
    </div>
  )
}
```

**Expected Result:** Profile always works, Notifications sometimes shows error fallback

---

## Task 3: Enhanced Retry Mechanism

**Objective:** Build sophisticated retry functionality

**Steps:**
1. Add retry button to fallback UI ✅ (already completed)
2. Track retry attempts and limit them
3. Reset component state properly on retry
4. ✅ Verify retry works without full page reload

**Implementation:**
```javascript
class SmartErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null,
      retryCount: 0,
      lastRetryTime: null
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  retry = () => {
    const { maxRetries = 3 } = this.props
    
    if (this.state.retryCount >= maxRetries) {
      alert('Maximum retry attempts reached. Please refresh the page.')
      return
    }

    this.setState(prevState => ({
      hasError: false,
      error: null,
      retryCount: prevState.retryCount + 1,
      lastRetryTime: Date.now()
    }))
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', border: '2px solid red' }}>
          <h2>⚠️ Component Error</h2>
          <p>Retry attempts: {this.state.retryCount}</p>
          <button onClick={this.retry}>
            Try Again ({this.props.maxRetries - this.state.retryCount} left)
          </button>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

**Test with:**
```javascript
<SmartErrorBoundary maxRetries={3}>
  <RandomlyFailingComponent />
</SmartErrorBoundary>
```

---

## Task 4: Async Error Simulation

**Objective:** Understand Error Boundary limitations with async code

**Steps:**
1. Create component that calls `fetch("bad-url")`
2. Wrap it with ErrorBoundary - see that it doesn't catch async errors
3. ✅ Fix it with try...catch inside useEffect
4. 👉 Learn what Error Boundaries don't handle

**Implementation:**

**Step 1 - Async Error NOT Caught:**
```javascript
const AsyncBuggyComponent = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    // This error will NOT be caught by ErrorBoundary
    fetch('https://invalid-url-that-will-fail.com/api/data')
      .then(response => response.json())
      .then(data => setData(data))
    // No .catch() - error goes uncaught
  }, [])

  return <div>Data: {JSON.stringify(data)}</div>
}

// Test: Wrap with ErrorBoundary - error still appears in console
<ErrorBoundary>
  <AsyncBuggyComponent /> {/* ErrorBoundary won't catch fetch errors */}
</ErrorBoundary>
```

**Step 2 - Proper Async Error Handling:**
```javascript
const AsyncSafeComponent = () => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('https://invalid-url-that-will-fail.com/api/data')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Async error caught:', error)
      setError('Failed to load data. Please try again.')
      
      // Optionally report to monitoring
      reportError(error, { context: 'data_fetch' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return (
    <div style={{ color: 'red' }}>
      <p>Error: {error}</p>
      <button onClick={fetchData}>Retry</button>
    </div>
  )

  return <div>Data: {JSON.stringify(data)}</div>
}
```

**Learning:** Async errors need explicit handling, not Error Boundaries

---

## Task 5: Custom Fallback Component

**Objective:** Build reusable, configurable fallback UI

**Steps:**
1. Create flexible `<Fallback />` component ✅ (already completed)
2. Make it accept different props for customization
3. Pass it to ErrorBoundary as FallbackComponent
4. ✅ Verify you can swap fallback UIs easily

**Implementation:**

**Flexible Fallback Component:**
```javascript
const CustomFallback = ({ 
  error, 
  retry, 
  title = "Something went wrong",
  message = "We're sorry for the inconvenience",
  showDetails = false,
  supportEmail,
  retryText = "Try Again"
}) => {
  return (
    <div style={styles.container}>
      <h2>{title}</h2>
      <p>{message}</p>
      
      <div style={styles.actions}>
        <button onClick={retry} style={styles.retryButton}>
          {retryText}
        </button>
        
        <button onClick={() => window.location.reload()} style={styles.reloadButton}>
          Reload Page
        </button>
        
        {supportEmail && (
          <a href={`mailto:${supportEmail}`} style={styles.supportLink}>
            Contact Support
          </a>
        )}
      </div>

      {showDetails && import.meta.env.DEV && error && (
        <details style={styles.details}>
          <summary>Technical Details</summary>
          <pre style={styles.errorText}>{error.message}</pre>
        </details>
      )}
    </div>
  )
}

const styles = {
  container: { padding: '30px', textAlign: 'center', border: '2px solid #ff6b6b' },
  actions: { display: 'flex', gap: '10px', justifyContent: 'center', margin: '20px 0' },
  retryButton: { padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none' },
  reloadButton: { padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none' },
  supportLink: { padding: '10px 20px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none' },
  details: { marginTop: '20px', textAlign: 'left' },
  errorText: { fontSize: '12px', backgroundColor: '#f8f9fa', padding: '10px' }
}
```

**Configurable ErrorBoundary:**
```javascript
class ConfigurableErrorBoundary extends React.Component {
  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.FallbackComponent || CustomFallback
      
      return (
        <FallbackComponent
          error={this.state.error}
          retry={this.retry}
          title={this.props.errorTitle}
          message={this.props.errorMessage}
          showDetails={this.props.showDetails}
          supportEmail={this.props.supportEmail}
        />
      )
    }
    return this.props.children
  }
}
```

**Usage Examples:**
```javascript
// Payment boundary with custom messaging
<ConfigurableErrorBoundary
  errorTitle="Payment System Unavailable"
  errorMessage="Please try again or contact our support team."
  supportEmail="support@company.com"
  showDetails={false}
>
  <PaymentForm />
</ConfigurableErrorBoundary>

// Development boundary with technical details
<ConfigurableErrorBoundary
  showDetails={true}
  FallbackComponent={DeveloperFallback}
>
  <ExperimentalFeature />
</ConfigurableErrorBoundary>
```

---

## Bonus Tasks

### Task 6: Error Monitoring Integration

**Objective:** Simulate production error reporting

```javascript
class MonitoredErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Simulate different monitoring services
    this.simulateSentryReport(error, errorInfo)
    this.simulateSlackAlert(error)
    this.simulateUserNotification(error)
  }

  simulateSentryReport = (error, errorInfo) => {
    const report = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userId: 'user_123',
      sessionId: 'session_456'
    }
    
    console.log('📊 Simulated Sentry Report:', report)
  }

  simulateSlackAlert = (error) => {
    const slackMessage = {
      text: `🚨 Production Error Alert`,
      attachments: [{
        color: 'danger',
        fields: [{
          title: 'Error Message',
          value: error.message,
          short: false
        }, {
          title: 'Environment',
          value: 'Production',
          short: true
        }]
      }]
    }
    
    console.log('📱 Simulated Slack Alert:', slackMessage)
  }

  simulateUserNotification = (error) => {
    // Show user notification (toast, modal, etc.)
    console.log('🔔 User notification: Issue reported to development team')
  }
}
```

### Task 7: Performance Monitoring

**Objective:** Track Error Boundary performance impact

```javascript
class PerformanceAwareErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Track error frequency
    const errorFrequency = this.getErrorFrequency()
    
    // Performance impact assessment
    const performanceData = {
      errorCount: errorFrequency.count,
      errorRate: errorFrequency.rate,
      memoryUsage: performance.memory?.usedJSHeapSize,
      renderTime: performance.now(),
      userAgent: navigator.userAgent
    }

    console.log('📈 Error Performance Impact:', performanceData)
    
    // Alert if error rate is too high
    if (errorFrequency.rate > 0.1) { // More than 10% error rate
      console.warn('⚠️ High error rate detected:', errorFrequency.rate)
    }
  }

  getErrorFrequency = () => {
    // Implementation would track errors over time
    return { count: 1, rate: 0.05 }
  }
}
```

---

## Testing Your Knowledge

After completing these tasks, you should be able to:

✅ **Explain** when and why to use Error Boundaries  
✅ **Implement** Error Boundaries from scratch  
✅ **Design** error handling strategy for complex apps  
✅ **Debug** error boundary issues in production  
✅ **Integrate** with monitoring and logging services  
✅ **Handle** different types of errors appropriately  
✅ **Build** user-friendly error experiences  

**Interview Confidence Check:**
- Can you explain Error Boundary limitations?
- Can you design error boundary placement for a large app?
- Can you implement retry logic and error reporting?
- Do you understand React 18 concurrent rendering implications?

**If you can answer all these confidently, you've mastered Error Boundaries!** 🎉