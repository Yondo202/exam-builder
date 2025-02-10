import { useTheme } from '@/lib/hooks/useZustand';
import { Toaster } from 'sonner';
import { useEffect } from 'react';

const ThemeProvuder = ({ children }: { children: React.ReactNode }) => {
   const { theme } = useTheme();

   useEffect(() => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');

      localStorage.setItem('ui-theme', theme); // theme / daraa theme geed damjuul 'light' - iig
      root.classList.add(theme);
   }, [theme]);

   return (
      <>
         <Toaster
            richColors
            toastOptions={{
               closeButton: true,
               classNames: {
                  closeButton: '!bg-white !text-red-700 !border !border-red-400',
               },
            }}
         />
         {children}
      </>
   );
};

export default ThemeProvuder;
