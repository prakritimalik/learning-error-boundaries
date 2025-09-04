
const ErrorFallback = ({ error, retry }) => {
    return (
        <div style={{ padding: '20px', textAlign: 'center', border: '1px solid red' }}>
            <h2>Oops! Something went wrong</h2>
            <p>We're sorry, but something
                unexpected happened.</p>
            <button onClick={retry}>Try
                again</button>
            {import.meta.env.DEV && (
                    <details style={{
                        marginTop:
                            '20px'
                    }}>
                        <summary>Error details (dev
                            only)</summary>
                        <pre>{error.message}</pre>
                    </details>
                )}
        </div>
    )
}

export default ErrorFallback;