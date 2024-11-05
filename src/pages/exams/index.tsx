import { useQuery } from '@tanstack/react-query';
import { request } from '@/lib/core/request';
import { type FinalRespnse, type TAction } from '@/lib/sharedTypes';
import { DataTable, BreadCrumb, Header, Button, Drawer, Badge } from '@/components/custom';
import { ColumnDef } from '@tanstack/react-table';
import { TBreadCrumb } from '@/components/custom/BreadCrumb';
import { useNavigate } from 'react-router-dom';
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineAdd } from 'react-icons/md';
import { CategorySelect } from '../questions/Action';
import ConfigAction from '@/pages/exams/ConfigAction';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { finalRenderDate } from '@/lib/utils';
// import { IoArrowForwardSharp } from 'react-icons/io5';
import { AllTypesQuestionTypes } from '../questions';
import { GetUserMe } from '@/pages/auth/Profile';

export type TExamSection = {
   id: string;
   name: string;
   description: string;
   color?: string;
   sort_number: number;
   questions: AllTypesQuestionTypes[];
   // exam_id:string
};
export type TVariant = {
   id: string;
   name: string;
   description: string;
   exam_id: string;
   sections?: TExamSection[];
};

export type TExam = {
   id: string;
   name: string;
   code: string;
   description: string;
   status: string;
   pass_score: number;
   all_score: number;
   max_score: number;
   min_score: number;
   avg_score: number;
   duration_min: number;
   take_per_user: number;
   category_id: string;
   sub_category_id: string;
   reviewable: boolean;
   scrumble_questions: boolean;
   score_visible: boolean;
   active_start_at: string;
   active_end_at: string;
   created_at: Date;
   updated_at: Date;
   variants: TVariant[];
   grade_status_count?: { count: string; status: string }[];
};

// {
//    "deleted_at": null,
//    "deleted_by": null,
//    "created_by": null,
//    "updated_by": null
//  },

// eslint-disable-next-line react-refresh/only-export-components
export const onlyCompanyAdmin = () => {
   const { data: userMe } = GetUserMe();
   return userMe?.data?.roles?.some((item) => item.role === 'company_admin') && userMe?.data?.roles?.every((item) => item.role !== 'super_admin');
};

const Exams = ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => {
   const isCompAdmin = onlyCompanyAdmin();
   const { control, setValue, watch } = useForm({ defaultValues: { category_id: '', sub_category_id: '' } });
   const [search, setSearch] = useState('');
   const navigate = useNavigate();
   const [action, setAction] = useState<TAction<TExam>>({ isOpen: false, type: 'add', data: {} as TExam });

   const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10,
      total: 0,
   });

   const { data, isLoading, refetch, isFetchedAfterMount } = useQuery({
      queryKey: ['exam/list', [pagination.pageIndex, pagination.pageSize, search, watch('category_id'), watch('sub_category_id')]],
      queryFn: () =>
         request<FinalRespnse<TExam[]>>({
            method: 'post',
            url: 'exam/list',
            offAlert: true,
            filterBody: {
               query: search,
               category_id: watch('category_id'),
               sub_category_id: watch('sub_category_id'),
               // type: filterTypes !== 'all' ? filterTypes : undefined,
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
   }, [isFetchedAfterMount]);

   const afterSuccess = (id: string) => {
      setAction((prev) => ({ ...prev, isOpen: false }));
      refetch();
      if (id !== 'delete') {
         navigate(id);
      }
      // row.original?.id ?? '/'
   };

   return (
      <div>
         <BreadCrumb pathList={breadcrumbs} />
         {/* {userData.roles} */}

         <Header
            title={breadcrumbs.find((item) => item.isActive)?.label}
            action={
               isCompAdmin ? null : (
                  <Button onClick={() => setAction({ isOpen: true, type: 'add' })} className="rounded-full">
                     <MdOutlineAdd className="text-base" /> Шалгалт үүсгэх
                  </Button>
               )
            }
         />

         {/* <div className="wrapper p-6 pt-3 mb-4 flex gap-10 relative">
            <div className="flex w-1/2 gap-5">
               <CategorySelect
                  control={control}
                  name="category_id"
                  current="main_category"
                  label="Үндсэн ангилал"
                  triggerClassName="rounded-full h-8"
                  onChange={() => {
                     setValue('sub_category_id', '');
                  }}
               />
               <CategorySelect
                  triggerClassName="rounded-full h-8"
                  control={control}
                  disabled={!watch('category_id')}
                  idKey={watch('category_id')}
                  name="sub_category_id"
                  current="sub_category"
                  label="Дэд ангилал"
               />
            </div>

            <div className="h-[1.1rem] w-0.5 bg-primary/40 absolute top-full left-10" />
         </div> */}

         <DataTable
            hideAction={isCompAdmin}
            defaultSortField="active_start_at"
            // rowAction={(data) => (isCompAdmin ? navigate(data?.data?.id ?? '/') : setAction(data))}
            rowAction={(data) => (isCompAdmin ? navigate(data?.data?.id ?? '/') : navigate(data?.data?.id ?? '/'))}
            data={data?.data ?? []}
            columns={[
               ...columnDef,
               {
                  header: '',
                  accessorKey: 'as_action',
                  size: 60,
                  enableSorting: false,
                  enableHiding: false,
                  cell: ({ row }) => (
                     <div
                        // to={row.original?.id ?? '/'}
                        onClick={() => setAction({ isOpen:true, type:'edit', data:row.original })}
                        className="w-full leading-11 h-11 text-[11px] font-medium text-primary/90 flex items-center gap-1 hover:decoration-primary hover:underline"
                     >
                        Тохиргоо <IoSettingsOutline />
                     </div>
                     // <Link
                     //    to={row.original?.id ?? '/'}
                     //    className="w-full leading-11 h-11 text-[11px] font-medium text-primary/90 flex items-center gap-1 hover:decoration-primary hover:underline"
                     // >
                     //    Дэлгэрэнгүй <IoArrowForwardSharp />
                     // </Link>
                  ),
               },
            ]}
            isLoading={isLoading}
            manualPagination
            pagination={pagination}
            setPagination={setPagination}
            search={search}
            setSearch={setSearch}
            headActionClassName="items-end"
            hideActionButton="delete"
            headAction={
               <div className="flex gap-5">
                  <CategorySelect
                     control={control}
                     name="category_id"
                     current="main_category"
                     label="Үндсэн ангилал"
                     triggerClassName="rounded-full w-48 h-8"
                     onChange={() => {
                        setValue('sub_category_id', '');
                     }}
                  />
                  <CategorySelect
                     triggerClassName="rounded-full w-48 h-8"
                     control={control}
                     disabled={!watch('category_id')}
                     idKey={watch('category_id')}
                     name="sub_category_id"
                     current="sub_category"
                     label="Дэд ангилал"
                  />
               </div>
            }

            // size="sm"
            // rowAction={
            //    fromAction
            //       ? () => null
            //       : (data: TAction<AllTypesQuestionTypes>) => {
            //            if (data.type === 'edit') {
            //               navigate(`${breadcrumbs.find((item) => item.isActive)?.to}/${data.data?.id}`);
            //               return;
            //            }
            //            setDeleteAction({ isOpen: true, id: data.data?.id ?? '' });
            //         }
            // }
         />

         <Drawer
            open={action.isOpen}
            onOpenChange={(e) => setAction((prev) => ({ ...prev, isOpen: e }))}
            title="Шалгалтын тохиргоо"
            content={<ConfigAction action={action} afterSuccess={afterSuccess} />}
            className="py-2 max-w-4xl"
            titleClassName="pt-2 pb-2"
         />
      </div>
   );
};

export default Exams;

const columnDef: ColumnDef<TExam>[] = [
   {
      header: 'Шалгалт',
      accessorKey: 'name',
      // size:500,
   },
   // {
   //    header: 'Тайлбар',
   //    accessorKey: 'description',
   // },
   {
      header: 'Эхлэх огноо',
      accessorKey: 'active_start_at',
      cell: ({ row }) => {
         return finalRenderDate(row.original?.active_start_at);
      },
   },
   {
      header: 'Дуусах огноо',
      accessorKey: 'active_end_at',
      cell: ({ row }) => {
         return finalRenderDate(row.original?.active_end_at);
      },
   },
   {
      header: 'Код',
      accessorKey: 'code',
      size: 100,
      cell: ({ row }) => {
         return (
            row.original.code && (
               <Badge variant="secondary" className="w-fit text-[10px] font-medium text-primary/90">
                  {row.original.code}
               </Badge>
            )
         );
      },
   },
];
