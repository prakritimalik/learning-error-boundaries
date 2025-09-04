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
      <ErrorBoundary>
        {/* <BuggyComponent shouldThrow={true}></BuggyComponent> */}
        {/* <AsyncBuggyComponent></AsyncBuggyComponent> */}
        <AsyncComponentFix></AsyncComponentFix>

      </ErrorBoundary>

    </>
  )
}

export default App
