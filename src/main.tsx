/// <reference types="vite/client" />
import { createRoot } from 'react-dom/client'
import './globals.css'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactFlowProvider } from '@xyflow/react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  </QueryClientProvider>,
)
