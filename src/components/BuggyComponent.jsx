
const BuggyComponent = ( {shouldThrow}) => {
    if(shouldThrow) {
        throw new Error('I crashed on purpose');
    }
    return <div>I am working fine!</div>
}

export default BuggyComponent;