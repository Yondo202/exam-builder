import LeftMenu from './LeftMenu';
import { Outlet } from 'react-router-dom';
import { Dialog, Loading } from '@/components/custom';
import { FilteredRoute } from '@/lib/core/RouteStore';
import { useEffect, useState } from 'react';
import ForceChangePass from './ForceChangePass';
import { GetUserMe } from '../auth/Profile';
import { socket } from '../candidate/ExamStartAction';
import { SignOut } from '@/lib/Auth';
import TopMenu from './TopMenu';

// const temp = [
//    // { role: 'company_admin' },
//    { role: 'inspector' },

//    // { role: 'super_admin' },
//    // { role: 'candidate' }
// ];

const SignedInRoot = () => {
   const [isOpen, setIsOpen] = useState(false);
   const [forcePass, setForcePass] = useState(false);
   const { data, isLoading, isFetchedAfterMount, refetch, isRefetching } = GetUserMe();

   useEffect(() => {
      if (data?.data?.force_password_change) {
         setForcePass(true);
         return;
      }

      setForcePass(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isFetchedAfterMount, isRefetching]);

   useEffect(() => {
      function anotherLogin() {
         if(data?.data?.roles?.some((item) => item.role === 'candidate')){
            setIsOpen(true);
            setTimeout(() => SignOut(), 3000);
         }
      }

      socket?.on('another_login', anotherLogin);

      return () => {
         socket?.off('another_login', anotherLogin);
      };
   }, []);

   if (isLoading) {
      return <Loading load={isLoading} />;
   }

   // if (data?.data?.force_password_change) {
   //    return (
   //       <Dialog isOpen={forcePass} onOpenChange={() => setForcePass(true)}>
   //          <div>pass aa soli</div>
   //       </Dialog>
   //    );
   // }

   // userdata?.roles?.some((item) => item.role === 'candidate')
   // pass aa solison ch alga bolohgui baigaa

   return (
      <>
         {' '}
         <Dialog title="Давхар хандалт!" isOpen={isOpen} onOpenChange={() => setIsOpen(true)}>
            <div className="text-center mb-10 text-lg text-orange-500"> Та олон төхөөрөмжөөс зэрэг хандах боломжгүй !</div>
         </Dialog>
         <Dialog isOpen={forcePass} onOpenChange={() => setForcePass(true)} title="Та нууц үгээ солино уу!">
            <ForceChangePass afterSuccess={() => (setForcePass(false), refetch())} />
         </Dialog>
         {data?.data?.roles?.some((item) => item.role === 'candidate') ? (
            <div className="h-dvh w-full">
               <TopMenu userdata={data?.data} />
               <div className="flex justify-center px-3">
                  <div className="custom-container">
                     <Outlet />
                  </div>
               </div>
            </div>
         ) : (
            <div vaul-drawer-wrapper="" className="grid grid-cols-[auto_1fr]">
               <LeftMenu userdata={data?.data} RouteStore={FilteredRoute(data?.data?.roles)} />
               <div className="flex flex-col pt-0 pl-12 pr-12 pb-12 h-dvh max-h-full overflow-y-auto bg-body-bg">
                  <div className="w-full max-w-screen-2xl self-center">
                     <Outlet />
                  </div>
               </div>
            </div>
         )}
      </>
   );
};

export default SignedInRoot;
