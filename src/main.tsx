import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ThemeProvider from '@/lib/core/ThemeProvider.tsx';
import App from './App.tsx';
import './globals.css';

export const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         retry: false,
         staleTime: 0,
         refetchOnWindowFocus: true,
         refetchOnReconnect: true,
      },
   },
});

// ************* chatgpt 

// const container = document.getElementById('root');

// if (!container._root) {
//    // If not, create one and store it in the container
//    container._root = ReactDOMClient.createRoot(container);
// }

// container._root.render(
//    <React.StrictMode>
//       <QueryClientProvider client={queryClient}>
//          {/* <ReactQueryDevtools initialIsOpen={false} position="bottom" /> */}
//          <ThemeProvider>
//             <App />
//          </ThemeProvider>
//       </QueryClientProvider>
//    </React.StrictMode>
// );

ReactDOM.createRoot(document.getElementById('root')!).render(
   <React.StrictMode>
      <QueryClientProvider client={queryClient}>
         {/* <ReactQueryDevtools initialIsOpen={false} position="bottom" /> */}
         <ThemeProvider>
            <App />
         </ThemeProvider>
      </QueryClientProvider>
   </React.StrictMode>
);
