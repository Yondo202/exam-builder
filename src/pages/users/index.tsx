// import { useMatches, matchRoutes, matchPath } from "react-router-dom"
import { useMutation, useQuery } from '@tanstack/react-query';
import { UseReFetch, request } from '@/lib/core/request';
import { useState, useEffect } from 'react';
import { DataTable, BreadCrumb, AnimatedTabs, Dialog, Checkbox, Label, Loading } from '@/components/custom';
import { type FinalRespnse, type TAction, UserRolesAsset, type TUserRoles, type TUserEmployee } from '@/lib/sharedTypes';
import { ColumnDef } from '@tanstack/react-table';
import { TBreadCrumb } from '@/components/custom/BreadCrumb';
import { CheckedState } from '@radix-ui/react-checkbox';
import Candidates from './Candidates';
import { RowSelectionState } from '@tanstack/react-table';

// type CandidateUser = {
//    email: '';
//    lastname: '';
//    firstname: '';
//    gender: 'male' | 'female';
//    birth_date: '';
// };

// eslint-disable-next-line react-refresh/only-export-components

const catAsset = {
   candidate: {
      label: 'Ажил горилогч',
      url: 'user/list',
      enabled: false,
   },
   employees: {
      label: 'Ажилтан',
      url: 'user/list/employees',
      enabled: true,
   },

   // **daraa ene filter uud hereg bolvol ashigla - ugui bol zugeer useQuery code oo tseverle
   // hr: {
   //    label: 'Ажилтан - GREEN.HR',
   //    url: 'user/list/hr',
   //    enabled: true,
   // },
   // green: {
   //    label: 'Ажилтан - ODOO',
   //    url: 'user/list/odoo',
   //    enabled: true,
   // },
} as const;

export type TKeys = keyof typeof catAsset;

const Users = ({ breadcrumbs, fromAction, is_inspector }: { breadcrumbs: TBreadCrumb[]; is_inspector?: boolean; fromAction?: (row: RowSelectionState) => React.ReactNode }) => {
   const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
   const [search, setSearch] = useState('');
   const [current, setCurrent] = useState<TKeys>('candidate');

   const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10,
      total: 0,
   });

   const { data, isLoading, isFetchedAfterMount } = useQuery({
      enabled: catAsset[current]?.enabled,
      queryKey: [`users`, [pagination.pageIndex, pagination.pageSize, search]],
      queryFn: () =>
         request<FinalRespnse<TUserEmployee[]>>({
            method: 'post',
            url: catAsset[current]?.url,
            offAlert: true,
            filterBody: {
               query: search,
               is_inspector: !!is_inspector,
               pagination: {
                  page: pagination.pageIndex + 1,
                  page_size: pagination.pageSize,
               },
            },
         }),
   });

   useEffect(() => {
      if (data?.meta) {
         setPagination({ pageIndex: data?.meta?.page - 1, pageSize: data?.meta?.page_size, total: +data?.meta?.total }); // eniig update deer boluilchih
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isFetchedAfterMount]);

   const [detail, setDetail] = useState({ isOpen: false, data: {} as TUserEmployee });

   const rowAction = (data: TAction<TUserEmployee>) => {
      setDetail({ isOpen: true, data: data.data as TUserEmployee });
      // setAction(data);
   };

   return (
      <>
         <Dialog
            className="max-w-[750px] w-[750px]"
            title={`${detail.data?.lastname} ${detail.data?.firstname}`}
            isOpen={detail.isOpen}
            onOpenChange={(e) => setDetail((prev) => ({ ...prev, isOpen: e }))}
         >
            <EmployeeDetail detailData={detail.data} />
         </Dialog>

         {!fromAction && <BreadCrumb pathList={breadcrumbs} />}

         {!fromAction && (
            <AnimatedTabs
               items={Object.keys(catAsset)?.map((item) => ({ label: catAsset[item as TKeys]?.label, key: item }))}
               activeKey={current}
               onChange={(value) => setCurrent(value as TKeys)}
            />
         )}

         {fromAction?.(rowSelection)}

         {current === 'candidate' && !fromAction ? (
            <Candidates />
         ) : (
            <DataTable
               enableMultiRowSelection={false}
               setRowSelection={setRowSelection}
               rowSelection={fromAction ? rowSelection : undefined}
               manualPagination
               pagination={pagination}
               rowAction={fromAction ? undefined : rowAction}
               hideAction={!!fromAction}
               setPagination={setPagination}
               search={search}
               hideActionButton="delete"
               setSearch={setSearch}
               // defaultSortField="hired_date"
               data={data?.data ?? []}
               columns={empColumnDef}
               isLoading={isLoading}
            />
         )}
      </>
   );
};

export default Users;

// export enum UserRolesEnum {
//    CANDIDATE = 'candidate',
//    SUPER_ADMIN = 'super_admin',
//    COMPANY_ADMIN = 'company_admin',
//    INSPECTOR = 'inspector',
// }

export type pickedEmp = Pick<TUserEmployee, 'lastname' | 'firstname' | 'company_name' | 'dep_name' | 'hired_date' | 'phone' | 'regno' | 'email' | 'private_number'>;

const EmployeeAsset: pickedEmp = {
   lastname: 'Овог',
   firstname: 'Нэр',
   company_name: 'Байгууллага',
   dep_name: 'Хэлтэс',
   hired_date: 'Ажиллаж эхэлсэн огноо',
   phone: 'Утасны дугаар',
   regno: 'Регистр',
   email: 'Э-Мэйл',
   private_number: 'Хувийн дугаар',
};

type TUrlKey = 'add' | 'remove';

export const EmployeeDetail = ({ detailData, onChanged, isRoleAction }: { detailData: TUserEmployee; onChanged?: () => void; isRoleAction?: boolean }) => {
   const { data, refetch, isLoading } = useQuery({
      enabled: !!detailData.id,
      queryKey: ['user-detail', detailData.id],
      queryFn: () => request<FinalRespnse<TUserEmployee>>({ url: `user/detail${detailData?.empid ? `/employee` : ``}?id=${detailData.id}` }),
   });

   const { mutate, isPending } = useMutation({
      mutationFn: (body: { urlKey: TUrlKey; data: { user_id: string; role: TUserRoles } }) => request({ method: 'post', url: `user/role/${body.urlKey}`, body: body.data }),
      onSuccess: () => {
         refetch(), onChanged?.();
         UseReFetch({ queryKey: 'user/me' }); // ene barag hereggui daraa ustga
      },
   });

   const onChangeHandle = (event: CheckedState, item: TUserRoles) => {
      if (event) {
         mutate({ urlKey: 'add', data: { user_id: detailData.id, role: item } });
         return;
      }
      mutate({ urlKey: 'remove', data: { user_id: detailData.id, role: item } });
   };

   // isRoleAction - dara ene ued oorchil
   return (
      <div className="p-2 pb-8 grid grid-cols-[55%_1fr] gap-10">
         {!isRoleAction && (
            <div className="p-4 pt-5 bg-secondary/5 rounded-md shadow-md">
               {Object.keys(EmployeeAsset)?.map((item, index) => {
                  const itemData = item === 'hired_date' ? data?.data?.[item as keyof pickedEmp]?.slice(0, 10) : data?.data?.[item as keyof pickedEmp];
                  return (
                     <div key={index} className="pb-2.5 flex items-center gap-1">
                        <span className="text-muted-text/80">{EmployeeAsset?.[item as keyof pickedEmp]}:</span> {itemData ?? ''}
                     </div>
                  );
               })}
            </div>
         )}
         <div>
            <div className="font-normal text-primary text-base mb-5">Хэрэглэгчийн эрх удирдах</div>
            <div className="flex flex-col gap-3 relative">
               <Loading load={isPending || isLoading} inside />
               {Object.keys(UserRolesAsset)?.map((item, index) => {
                  return (
                     <div key={index} className="flex items-center gap-3">
                        <Checkbox id={item} checked={data?.data?.roles?.some((element) => element.role === item)} onCheckedChange={(e) => onChangeHandle(e, item as TUserRoles)} />{' '}
                        <Label className="m-0 text-sm hover:text-primary" htmlFor={item}>
                           {UserRolesAsset[item as TUserRoles]?.label}
                        </Label>
                     </div>
                  );
               })}
            </div>
         </div>
      </div>
   );
};

// eslint-disable-next-line react-refresh/only-export-components
export const empColumnDef: ColumnDef<TUserEmployee>[] = [
   {
      header: 'Овог нэр',
      accessorKey: 'firstname',
      cell: ({ row }) => `${row.original?.lastname ?? ''} ${row.original?.firstname ?? ''}`,
   },
   {
      header: 'Байгууллага',
      accessorKey: 'company_name',
   },
   {
      header: 'Утас',
      accessorKey: 'phone',
   },
   {
      header: 'Ажилд орсон огноо',
      accessorKey: 'hired_date',
      cell: ({ row }) => row.original?.hired_date?.slice(0, 16).replace('T', ' '),
   },
   {
      header: 'Хэлтэс',
      accessorKey: 'dep_name',
   },
];
