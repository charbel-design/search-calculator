import React from 'react'
import Calculator from './Calculator'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error)
    console.error('Error info:', errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#ffffff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              maxWidth: '500px',
              padding: '40px 20px',
            }}
          >
            <h1
              style={{
                color: '#2814ff',
                fontSize: '48px',
                margin: '0 0 20px 0',
                fontWeight: 'bold',
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                color: '#666666',
                fontSize: '16px',
                margin: '0 0 40px 0',
                lineHeight: '1.6',
              }}
            >
              We hit an unexpected error. Your data is safe.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={this.handleReload}
                style={{
                  backgroundColor: '#2814ff',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#1a0d99')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = '#2814ff')}
              >
                Try Again
              </button>
              <a
                href="https://talent-gurus.com"
                style={{
                  color: '#2814ff',
                  textDecoration: 'none',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  borderRadius: '6px',
                  border: '2px solid #2814ff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f0f0f0'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                }}
              >
                Go Back
              </a>
            </div>
          </div>
        </div>
      )
    }

    return <Calculator />
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Calculator />
    </ErrorBoundary>
  )
}

export default App
