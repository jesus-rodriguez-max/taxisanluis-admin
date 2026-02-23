import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full border border-red-200">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Algo salió mal</h1>
                        <p className="text-gray-700 mb-4">
                            La aplicación ha encontrado un error inesperado. Por favor recarga la página.
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors mb-6"
                        >
                            Recargar Página
                        </button>

                        <details className="bg-gray-100 p-4 rounded text-xs font-mono overflow-auto max-h-96">
                            <summary className="cursor-pointer font-bold text-gray-700 mb-2">Detalles del Error (Para Soporte)</summary>
                            <p className="font-bold text-red-800 mb-2">{this.state.error && this.state.error.toString()}</p>
                            <pre className="text-gray-600 whitespace-pre-wrap">
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </details>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
