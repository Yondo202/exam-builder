// import { useMatches, matchRoutes, matchPath } from "react-router-dom"
import { useQuery } from '@tanstack/react-query';
import { request } from '@/lib/core/request';
import { Link } from 'react-router-dom';
import { IoArrowForwardSharp } from 'react-icons/io5';
import { useState } from 'react';
import { DataTable, BreadCrumb, Dialog, AnimatedTabs, Badge } from '@/components/custom';
import { type FinalRespnse, type TAction, type TUserEmployee, type TRolesAssetType, UserRolesAsset, type TUserRoles } from '@/lib/sharedTypes';
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
            columns={[
               ...columnDef,
               current === 'candidate'
                  ? {
                       header: '',
                       accessorKey: 'as_action',
                       size: 100,
                       enableSorting: false,
                       enableHiding: false,
                       cell: ({ row }) => (
                          <Link
                             to={row.original.empid ? `${row.original.id}?type=emp` : row.original?.id}
                             className="w-full leading-11 h-11 text-[11px] font-medium text-primary/90 flex items-center gap-1 hover:decoration-primary hover:underline"
                          >
                             Шалгалтын түүх <IoArrowForwardSharp />
                          </Link>
                       ),
                    }
                  : {
                       header: 'Регистр',
                       accessorKey: 'regno',
                    },
            ]}
            isLoading={isLoading}
         />
      </>
   );
};

export default RolesList;
// private_number
const columnDef: ColumnDef<TUserEmployee>[] = [
   {
      header: 'Овог нэр',
      accessorKey: 'firstname',
      cell: ({ row }) => `${row.original?.lastname ?? ''} ${row.original?.firstname ?? ''}`,
   },
   {
      header: 'Утас',
      accessorKey: 'phone',
      cell: ({ row }) => (row.original.phone ? row.original.phone : row.original.private_number),
   },
   {
      header: 'Э-мэйл',
      accessorKey: 'email',
   },

   {
      header: 'Төрөл',
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
