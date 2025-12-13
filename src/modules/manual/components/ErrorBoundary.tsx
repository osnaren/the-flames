import Button from '@/components/ui/Button';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Manual Mode error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-background flex min-h-screen items-center justify-center p-4">
          <div className="bg-surface border-outline/20 max-w-md rounded-2xl border p-8 text-center shadow-lg">
            <div className="text-error mb-4 text-5xl">💔</div>
            <h2 className="text-on-surface mb-3 text-2xl font-bold">Oops! Something went wrong</h2>
            <p className="text-on-surface-variant mb-6">
              Don't worry, your love story isn't over! Let's try that again.
            </p>
            <Button variant="primary" onClick={this.handleReset}>
              Start Fresh 🔄
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
