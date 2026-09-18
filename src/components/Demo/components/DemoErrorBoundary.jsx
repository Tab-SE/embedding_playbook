"use client";

import { Component } from 'react';

export class DemoErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[DemoErrorBoundary] Redirecting to auth after error:', error, info);
    const authPath = this.props.authPath;
    if (authPath && typeof window !== 'undefined') {
      window.location.replace(authPath);
    }
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
