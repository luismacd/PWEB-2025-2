import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props){
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error){
    return { error }
  }

  componentDidCatch(error, info){
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught', error, info)
  }

  render(){
    if(this.state.error){
      return (
        <div style={{padding:20}}>
          <h2>Ha ocurrido un error en la aplicación</h2>
          <pre style={{whiteSpace:'pre-wrap'}}>{String(this.state.error && this.state.error.message)}</pre>
        </div>
      )
    }
    return this.props.children
  }
}
