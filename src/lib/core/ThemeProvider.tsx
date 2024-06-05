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
         <Toaster richColors />
         {children}
      </>
   );
};

export default ThemeProvuder;
