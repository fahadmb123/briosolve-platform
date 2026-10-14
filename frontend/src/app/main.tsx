import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from '../shared/components/error-boundary/ErrorBoundary.tsx';


const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
      <StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
      </StrictMode>
  </QueryClientProvider>
  
)
