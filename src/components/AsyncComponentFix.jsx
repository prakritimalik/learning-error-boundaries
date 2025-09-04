
const AsyncComponentFix = () => {
  const handleClick = () => {
    try {
      throw new Error('Event handler error!')
    } catch (error) {
      console.error('Caught in event handler:', error)
      // Handle gracefully
    }
  }

  return <button
    onClick={handleClick}>Click to break
    (handled!)</button>
}

export default AsyncComponentFix