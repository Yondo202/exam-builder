import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ThemeProvider from '@/lib/core/ThemeProvider.tsx';
import App from './App.tsx';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './globals.css';
// import Dashboard from './pages/dashboard/index.tsx';

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
            {/* <div vaul-drawer-wrapper="" className="grid grid-cols-[auto_1fr]">
               <div className='w-[260px]' />
               <div className="flex flex-col pt-0 pl-12 pr-12 pb-12 h-dvh max-h-full overflow-y-auto bg-body-bg">
                  <div className="w-full max-w-screen-2xl self-center">
                     <Dashboard breadcrumbs={[]} />
                  </div>
               </div>
            </div> */}
            {/* <div>
               <Dashboard breadcrumbs={[]} />
            </div> */}
         </ThemeProvider>
         <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
   </React.StrictMode>
);
