import { TBreadCrumb } from '@/components/custom/BreadCrumb';
import { Header, BreadCrumb, Loading, DataTable, Badge, DatePicker, Button } from '@/components/custom'; //BreadCrumb
import { ColumnDef } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { request } from '@/lib/core/request';
// import { formatDateToCustomISO } from '@/lib/utils';
import { FinalRespnse } from '@/lib/sharedTypes';
import { subDays, endOfDay, startOfDay } from 'date-fns';
import { CategorySelect } from '../questions/Action';
import { useForm } from 'react-hook-form';
import { cn, formatDateToCustomISO } from '@/lib/utils';
import { useEffect } from 'react';

// {
//   "category_id": "string",
//   "sub_category_id": "string",
//   "status": "active",
//   "org_id": "string",
//   "include_category": true,
//   "range": {
//     "start_range": "2024-06-10T03:20:51.769Z",
//     "end_range": "2024-06-18T03:20:51.769Z"
//   }
// }

type TReport = {
   avg_score: number;
   exam_count: string;
   given_exam_count: string;
   invited_user_count: string;
   invited_user_unique_count: string;
   max_score: number;
   min_score: number;
   name: string;
   //  status: 'inactive';
   status: string;
};

const ExamStatusType = {
   active: 'Идэвхтэй',
   inactive: 'Идэвхгүй',
};

type TExamMainStatus = keyof typeof ExamStatusType;

type RangeFilter = {
   start_range: string;
   end_range: string;
   status: TExamMainStatus | undefined;
   category_id: string;
   sub_category_id: string;
};

const ReportList = ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => {
   const { control, watch, reset, setValue } = useForm<RangeFilter>({ defaultValues: { start_range: '', end_range: '', category_id: '', sub_category_id: '', status: undefined } });

   const { data, isPending } = useQuery({
      enabled: watch('end_range') !== '' && watch('start_range') !== '',
      queryKey: ['dashboard', watch()],
      queryFn: () =>
         request<FinalRespnse<TReport[]>>({
            //<FinalRespnse<TDashboard>>
            url: 'stats',
            method: 'post',
            offAlert: true,
            filterBody: {
               status: watch('status'),
               category_id: watch('category_id'),
               sub_category_id: watch('sub_category_id'),
               range: {
                  start_range: watch('start_range'),
                  end_range: watch('end_range'),
               },
            },
         }),
   });

   useEffect(() => {
      const currentDate = new Date();
      const pastDate = startOfDay(subDays(currentDate, 7));
      const Today = endOfDay(currentDate);

      reset({ start_range: formatDateToCustomISO(pastDate, true), end_range: formatDateToCustomISO(Today, true) });
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <div>
         <Loading load={isPending} />
         <BreadCrumb pathList={breadcrumbs} />
         <Header title={breadcrumbs.find((item) => item.isActive)?.label} />
         <div className={cn('wrapper p-6 pt-3 mb-4 grid grid-cols-[36%_1fr] items-end flex-wrap gap-7 relative')}>
            <div className="flex gap-5">
               <DatePicker triggerClassName="h-[32px] rounded-full" hideClose className="w-full" name="start_range" label="Эхлэх огноо" control={control} />
               <DatePicker triggerClassName="h-[32px] rounded-full" hideClose className="w-full" name="end_range" label="Дуусах огноо" control={control} />
            </div>

            <div className="grid grid-cols-4 justify-start items-end gap-3">
               <CategorySelect
                  control={control}
                  name="category_id"
                  current="main_category"
                  label="Үндсэн ангилал"
                  triggerClassName="rounded-full h-8 w-full"
                  onChange={() => {
                     setValue('sub_category_id', '');
                  }}
               />

               <CategorySelect
                  triggerClassName="rounded-full h-8 w-full"
                  control={control}
                  disabled={!watch('category_id')}
                  idKey={watch('category_id')}
                  name="sub_category_id"
                  current="sub_category"
                  label="Дэд ангилал"
               />

               {Object.keys(ExamStatusType)?.map((item, index) => {
                  return (
                     <Button
                        key={index}
                        onClick={() => setValue('status', item as TExamMainStatus)}
                        size="sm"
                        className={cn('rounded-full', watch('status') === item ? `opacity-100` : `opacity-70`)}
                        variant={watch('status') === item ? `default` : `outline`}
                     >
                        {ExamStatusType[item as TExamMainStatus]}
                     </Button>
                  );
               })}
            </div>
            <div className="h-[1.1rem] w-0.5 bg-primary/40 absolute top-full left-10" />
         </div>
         <DataTable isLoading={isPending} data={data?.data ?? []} columns={columnDef} hideAction />
      </div>
   );
};

export default ReportList;

const columnDef: ColumnDef<TReport>[] = [
   {
      header: 'Шалгалтын нэр',
      accessorKey: 'name',
   },
   {
      header: 'Төлөв',
      accessorKey: 'status',
      cell: ({ row }) => (
         <Badge
            variant="secondary"
            className={cn(row.original?.status === 'active' ? `bg-green-100/70 text-green-600 border-green-300` : 'text-danger-color bg-danger-color/5 border-danger-color/20')}
         >
            {ExamStatusType[row.original?.status as TExamMainStatus]}
         </Badge>
      ),
   },
   {
      header: 'Шалгалт өгсөн тоо',
      accessorKey: 'given_exam_count',
   },
   {
      header: 'Уригдсан хэрэглэгчид',
      accessorKey: 'invited_user_count',
   },
   {
      header: 'Дундаж оноо',
      accessorKey: 'avg_score',
   },
];
