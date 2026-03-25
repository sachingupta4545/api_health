import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from './redux/Store'
import { Provider } from 'react-redux'
import { ErrorBoundary } from './components/ErrorBoundary';
import { HelmetProvider } from 'react-helmet-async';

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
  </div>
);

function App() {
  return <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <HelmetProvider>
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <RouterProvider router={router} />
          </Suspense>
        </ErrorBoundary>
      </HelmetProvider>
    </Provider>
  </QueryClientProvider>;
}

export default App;