import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ ...this.state, error });
  }

  render() {
    const { error } = this.state;
    if (this.state.hasError) {
      return (
        <>
          <h1 style={{textAlign: 'center'}}>
            Something went wrong.
          </h1>
          {error && (
            <p style={{textAlign: 'center'}}>
              {error.toString()}
            </p>
          )}
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
