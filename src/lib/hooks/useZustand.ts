import { create } from 'zustand';

type TState = {
   theme: 'dark' | 'light';
};

interface TAuthState extends TState {
   setTheme: (theme: TState['theme']) => void;
}

export const useTheme = create<TAuthState>((set) => {
   const uitheme = localStorage.getItem('ui-theme') ?? 'dark';

   return {
      theme: uitheme === 'dark' ? 'dark' : 'light',
      setTheme: (theme: TState['theme']) => set((state) => ({ ...state, theme: theme })),
   };
});
