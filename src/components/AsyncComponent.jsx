const AsyncBuggyComponent = () => {
    const handleClick = () => {
        // This error WON'T be caught by ErrorBoundary
        throw new Error('Event handler error!')
    }

    return <button onClick={handleClick}>Click to break (not caught!)</button>
}

export default AsyncBuggyComponent