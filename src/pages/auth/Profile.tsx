import { useQuery } from '@tanstack/react-query';
import { request } from '@/lib/core/request';
import { type FinalRespnse } from '@/lib/sharedTypes';
import { BreadCrumb, Header } from '@/components/custom';
import { TBreadCrumb } from '@/components/custom/BreadCrumb';
import { type TAction, type TUserEmployee } from '@/lib/sharedTypes';
import { CandidateAction } from '../users/Candidates';
import { useEffect, useState } from 'react';

export const GetUserMe = () => {
   return useQuery({
      queryKey: ['user/me'],
      queryFn: () =>
         request<FinalRespnse<TUserEmployee>>({
            url: 'user/profile',
         }),
   });
};

const Profile = ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => {
   const [action, setAction] = useState<TAction<TUserEmployee>>({ isOpen: false, type: 'add', data: {} as TUserEmployee });
   const { data, isFetchedAfterMount, refetch } = GetUserMe();
   useEffect(() => {
      if (isFetchedAfterMount) {
         setAction({ isOpen: true, type: 'edit', data: data?.data });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isFetchedAfterMount]);

   return (
      <>
         <BreadCrumb pathList={breadcrumbs} />
         <Header title={breadcrumbs.find((item) => item.isActive)?.label} />
         <div className="wrapper p-6">
            <CandidateAction setClose={() => refetch()} action={action} />
         </div>
      </>
   );
};

export default Profile;
