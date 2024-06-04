import LeftMenu from './LeftMenu';
import { Outlet } from 'react-router-dom';
import { FinalRespnse, type TUserEmployee } from '@/lib/sharedTypes';
import { request } from '@/lib/core/request';
import { useQuery } from '@tanstack/react-query';
import { Dialog, Loading } from '@/components/custom';
import { FilteredRoute } from '@/lib/core/RouteStore';
import { useEffect, useState } from 'react';
import ForceChangePass from './ForceChangePass';

// const temp = [
//    // { role: 'company_admin' },
//    { role: 'inspector' },

//    // { role: 'super_admin' },
//    // { role: 'candidate' }
// ];

const SignedInRoot = () => {
   const [forcePass, setForcePass] = useState(false);
   const { data, isLoading, isFetchedAfterMount, refetch, isRefetching } = useQuery({
      queryKey: ['user/me'],
      queryFn: () =>
         request<FinalRespnse<TUserEmployee>>({
            url: 'user/profile',
         }),
   });

   useEffect(() => {
      if (data?.data?.force_password_change) {
         setForcePass(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isFetchedAfterMount, isRefetching]);

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

   return (
      <>
         <Dialog isOpen={forcePass} onOpenChange={() => setForcePass(true)} title="Та нууц үгээ солино уу!">
            <ForceChangePass afterSuccess={() => (setForcePass(false), refetch())} />
         </Dialog>
         <div vaul-drawer-wrapper="" className="grid grid-cols-[auto_1fr]">
            <LeftMenu userdata={data?.data} RouteStore={FilteredRoute(data?.data?.roles)} />

            <div className="flex flex-col pt-0 pl-12 pr-12 pb-12 h-dvh max-h-full overflow-y-auto bg-body-bg">
               <div className="w-full max-w-screen-2xl self-center">
                  <Outlet />
               </div>
            </div>
         </div>
      </>
   );
};

export default SignedInRoot;
