import LeftMenu from './LeftMenu';
import { Outlet } from 'react-router-dom';

const SignedInRoot = () => {
   return (
      <div vaul-drawer-wrapper="" className="grid grid-cols-[auto_1fr]">
         <LeftMenu />

         <div className="flex flex-col pt-0 pl-12 pr-12 pb-12 h-dvh max-h-full overflow-y-auto bg-body-bg">
            <div className="w-full max-w-screen-2xl self-center">
               <Outlet />
            </div>
         </div>
      </div>
   );
};

export default SignedInRoot;
