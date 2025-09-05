# React Error Boundaries Learning Plan

## Core Fundamentals (30 minutes)

### 1. Class Component Lifecycle for Error Boundaries
- [x] Understand why Error Boundaries must be class components
- [x] Learn `static getDerivedStateFromError(error)` - updates state
- [x] Learn `componentDidCatch(error, errorInfo)` - logs errors
- [x] Build basic ErrorBoundary class component

### 2. Error Catching Scope
- [x] Understand what errors ARE caught (rendering, lifecycle, constructors of children)
- [x] Understand what errors are NOT caught (event handlers, async code, server-side)
- [x] Build components that demonstrate both scenarios
- [x] Learn difference between caught vs uncaught error handling strategies

### 3. Fallback UI Patterns
- [x] Implement basic "Something went wrong" fallback
- [x] Create user-friendly error messages with professional styling
- [x] Add retry/reload functionality to fallback UI
- [x] Build ErrorFallback component with dev/prod modes
- [ ] Build different fallback components for different error types

### 4. Error Logging & Monitoring
- [x] Log errors to console in development
- [x] Understand difference between console.error vs console.log for handled errors
- [x] Simulate sending errors to external services (Sentry pattern)
- [x] Extract useful error information (component stack, error details)
- [x] Handle error reporting in production vs development
- [x] Understand React 18 concurrent rendering error behavior

## Practical Implementation (Hands-on Building)

### 5. Multiple Error Boundary Levels
- [x] Global error boundary (wrap entire app)
- [x] Local error boundaries (wrap specific features)
- [x] Demonstrate partial UI failure vs complete app failure
- [x] Build nested error boundary example
- [x] Test isolated feature failures (chat widget vs user profile)

### 6. Testing Error Scenarios
- [x] Create BuggyComponent that throws errors on purpose
- [x] Build AsyncErrorComponent to show what's NOT caught
- [x] Create EventHandlerError with try/catch to demonstrate proper handling
- [x] Test error propagation through component tree
- [x] Build random error component for testing retry functionality

### 7. Production Patterns
- [ ] Environment-specific error handling (dev vs prod)
- [ ] User-friendly error messages (no technical details for users)
- [ ] Error boundary integration with state management
- [ ] Graceful degradation patterns

## Advanced Concepts (Future Learning)

### 8. Error Handling Beyond Boundaries
- [ ] Global error handlers (window.onerror, unhandledrejection)
- [ ] Async error handling patterns (try/catch in useEffect)
- [ ] Event handler error handling
- [ ] Network request error handling

### 9. Error Monitoring Integration
- [ ] Sentry integration patterns
- [ ] Custom error reporting service
- [ ] Error metrics and monitoring
- [ ] User feedback collection on errors

### 10. React 18+ Considerations
- [ ] Error boundaries with concurrent rendering
- [ ] Suspense boundary vs error boundary differences
- [ ] Modern error handling patterns

## Interview Preparation

### Technical Questions to Master
- [ ] "What are React Error Boundaries and when do you use them?"
- [ ] "What types of errors do Error Boundaries catch vs not catch?"
- [ ] "How do you implement error logging in production?"
- [ ] "Where should you place Error Boundaries in your app?"

### Coding Challenges
- [ ] "Build an Error Boundary component from scratch"
- [ ] "Implement error boundaries at multiple levels"
- [ ] "Show how to handle async errors that boundaries can't catch"
- [ ] "Create a user-friendly error fallback with retry functionality"

### Architecture Questions
- [ ] "How do you design error handling strategy for a large React app?"
- [ ] "When should you NOT use Error Boundaries?"
- [ ] "How do you handle errors in modern React (hooks) vs class components?"

---

## Real-World Examples We'll Build

1. **Global App Error Boundary** - Catches catastrophic failures
2. **Feature Error Boundary** - Isolates specific feature failures  
3. **BuggyComponent** - Demonstrates error throwing and catching
4. **AsyncErrorDemo** - Shows limitations of error boundaries
5. **ErrorFallback** - User-friendly error UI with retry functionality

**Goals:** Build production-ready error handling that you'd actually use in a real app and can confidently discuss in interviews.
