
const BuggyComponent = ({ shouldThrow }) => {
    const shouldError = Math.random() < 0.5 // 50% chance

    if (shouldThrow && shouldError) {
        throw new Error('Random crash!')
    }

    return <div>I am working fine!</div>
}

export default BuggyComponent;