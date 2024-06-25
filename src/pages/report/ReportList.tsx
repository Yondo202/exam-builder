import { TBreadCrumb } from '@/components/custom/BreadCrumb';
import { Header, BreadCrumb, Loading, DataTable, DatePicker, Button } from '@/components/custom'; //BreadCrumb
import { useMutation, useQuery } from '@tanstack/react-query';
import { request } from '@/lib/core/request';
// import { formatDateToCustomISO } from '@/lib/utils';
import { FinalRespnse } from '@/lib/sharedTypes';
import { endOfDay, startOfDay, subMonths } from 'date-fns';
import { CategorySelect } from '../questions/Action';
import { useForm } from 'react-hook-form';
import { cn, formatDateToCustomISO } from '@/lib/utils';
import { useEffect } from 'react';
import { RiFileExcel2Line } from 'react-icons/ri';

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
            url: 'stats/list',
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

   const { mutate, isPending: downloadPending } = useMutation({
      mutationFn: () =>
         request<FinalRespnse<TReport[]>>({
            //<FinalRespnse<TDashboard>>
            url: 'stats/list/download',
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
      onSuccess: (resdata: any) => {
         const url = URL.createObjectURL(new Blob([resdata], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
         const link = document.createElement('a');
         link.href = url;
         link.setAttribute('download', 'Шалгалтын тайлан.xlsx');
         link.click();
      },
   });

   useEffect(() => {
      const currentDate = new Date();
      const pastDate = startOfDay(subMonths(currentDate, 1));
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
                        onClick={() => setValue('status', watch('status') === item ? undefined : (item as TExamMainStatus))}
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
         <DataTable
            isLoading={isPending}
            data={data?.data ?? []}
            hideSearch
            hideAction
            isOneLineHead
            initialHideColumn={Object.keys(data?.data?.at(0) ?? {})?.filter((item, index) => index > 5 && item)}
            columns={Object.keys(data?.data?.at(0) ?? {})?.map((item) => {
               return {
                  header: item,
                  accessorKey: item,
                  isSortable: false, // This is my custom property
                  enableHiding: true,
                  // size: 200,
               };
            })}
            headAction={
               <div>
                  <Button variant="outline" size="sm" className="rounded-full w-28" isLoading={downloadPending} onClick={() => mutate()}>
                     <RiFileExcel2Line className="text-base" /> Татах
                  </Button>
               </div>
            }
         />
      </div>
   );
};

export default ReportList;
