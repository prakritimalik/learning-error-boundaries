import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import BuggyComponent from './components/BuggyComponent'
import ErrorBoundary from './components/ErrorBoundary'
import AsyncBuggyComponent from './components/AsyncComponent'
import AsyncComponentFix from './components/AsyncComponentFix'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <ErrorBoundary> */}
      {/* <BuggyComponent shouldThrow={true}></BuggyComponent> */}
      {/* <AsyncBuggyComponent></AsyncBuggyComponent> */}
      {/* <AsyncComponentFix></AsyncComponentFix> */}

      {/* </ErrorBoundary> */}
      {/* // Global boundary (catches catastrophic errors) */}
      <ErrorBoundary>
        <h1>My Dashboard</h1>

        {/* Local boundary (catches feature-specific errors) */}
        <ErrorBoundary>
          <h3>Chat Widget</h3>
          <BuggyComponent shouldThrow={true} />
        </ErrorBoundary>

        {/* This stays working even if chat breaks */}
        <div>
          <h3>User Profile</h3>
          <p>User: John Doe</p>
        </div>
      </ErrorBoundary>

    </>
  )
}

export default App
