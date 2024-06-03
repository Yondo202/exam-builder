// import { useMatches, matchRoutes, matchPath } from "react-router-dom"
import { useQuery } from '@tanstack/react-query';
import { request } from '@/lib/core/request';
import { useState } from 'react';
import { DataTable, BreadCrumb, Dialog, AnimatedTabs, Badge } from '@/components/custom';
import { type FinalRespnse, type TAction, type TUserEmployee, type TRolesAssetType, UserRolesAsset, type TUserRoles, } from '@/lib/sharedTypes';
import { ColumnDef } from '@tanstack/react-table';
import { TBreadCrumb } from '@/components/custom/BreadCrumb';
import { EmployeeDetail } from '../users'; //UserRolesAsset

type TRoles = TRolesAssetType & { user: TUserEmployee; employee: TUserEmployee };

const RolesList = ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => {
   const [current, setCurrent] = useState<TUserRoles>('candidate');
   const { data, isLoading, refetch } = useQuery({
      queryKey: [`roles/list`, [current]],
      queryFn: () =>
         request<FinalRespnse<TRoles[]>>({
            method: 'post',
            url: 'user/role/list',
            offAlert: true,
            filterBody: {
               role: current,
            },
         }),
   });

   const [detail, setDetail] = useState({ isOpen: false, data: {} as TUserEmployee });

   const rowAction = (data: TAction<TUserEmployee>) => {
      setDetail({ isOpen: true, data: data.data as TUserEmployee });
   };

   return (
      <>
         <BreadCrumb pathList={breadcrumbs} />
         {/* <Header title={breadcrumbs.find((item) => item.isActive)?.label} /> */}

         <AnimatedTabs
            items={Object.keys(UserRolesAsset)?.map((item) => ({ label: UserRolesAsset[item as TUserRoles]?.label, key: item }))}
            activeKey={current}
            onChange={(value) => setCurrent(value as TUserRoles)}
         />

         <Dialog
            className="max-w-[750px] w-[750px]"
            title={`${detail.data?.lastname} ${detail.data?.firstname}`}
            isOpen={detail.isOpen}
            onOpenChange={(e) => setDetail((prev) => ({ ...prev, isOpen: e }))}
         >
            <EmployeeDetail detailData={detail.data} onChanged={() => refetch()} />
         </Dialog>

         <DataTable
            hideActionButton="delete"
            rowAction={rowAction}
            data={data?.data?.filter((el) => el.user || el.employee)?.map((item) => (item.user ? { ...item.user } : { ...item.employee })) ?? []}
            columns={columnDef}
            isLoading={isLoading}
         />
      </>
   );
};

export default RolesList;

const columnDef: ColumnDef<TUserEmployee>[] = [
   {
      header: 'Овог нэр',
      accessorKey: 'firstname',
      cell: ({ row }) => `${row.original?.lastname ?? ''} ${row.original?.firstname ?? ''}`,
   },
   {
      header: 'Утас',
      accessorKey: 'phone',
   },
   {
      header: 'Э-мэйл',
      accessorKey: 'email',
   },
   {
      header: 'Регистр',
      accessorKey: 'regno',
   },
   {
      header: 'Регистр',
      accessorKey: 'lastname',
      cell: ({ row }) => (
         <div>
            {row.original?.empid ? (
               <Badge variant="secondary" className="bg-green-100/70 text-green-600">
                  Ажилтан
               </Badge>
            ) : (
               <Badge variant="secondary">Ажил горилогч</Badge>
            )}
         </div>
      ),
   },
];