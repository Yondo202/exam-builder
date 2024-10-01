import { create } from 'zustand';

type TState = {
   theme: 'dark' | 'light';
};

interface TAuthState extends TState {
   setTheme: (theme: TState['theme']) => void;
}

export const useTheme = create<TAuthState>((set) => {
   const uitheme = localStorage.getItem('ui-theme') ?? 'light'; // dark

   return {
      theme: uitheme === 'dark' ? 'dark' : 'light',
      setTheme: (theme: TState['theme']) => set((state) => ({ ...state, theme: theme })),
   };
});

// export const useAuth = create<TUserEmployee>((set) => {

//    return {
//       userdata:'',
//       setUser: (user: TState['theme']) => set((state) => ({ ...state, theme: theme })),
//    };
// });

export const useSubQuestion = create((set) => {
   // const uitheme = localStorage.getItem('ui-theme') ?? 'light'; // dark

   return {
      subValue: {},
      getErrors: {},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setInitial: () => set(() => ({ subValue: {}, getErrors: {} })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setErrors: (value: any) => set((state: any) => ({ ...state, getErrors: { ...state.getErrors, ...value } })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSubValue: (value: any) => set((state: any) => ({ ...state, subValue: { ...state.subValue, ...value } })),
   };
});
