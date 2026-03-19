import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from './redux/Store'
import { Provider } from 'react-redux'

const queryClient = new QueryClient();

function App() {
  return <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </QueryClientProvider>;
}

export default App;