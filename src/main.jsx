import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return React.createElement('div', { style: { padding: 40, color: 'red', fontSize: 18, fontFamily: 'monospace', whiteSpace: 'pre-wrap', background: '#fff' } },
        '❌ Error: ' + (this.state.error.message || String(this.state.error)) + '\n\n' + (this.state.error.stack || '')
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
