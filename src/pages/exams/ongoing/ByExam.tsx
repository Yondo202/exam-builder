import { useQuery } from '@tanstack/react-query';
import { Header, BreadCrumb, DataTable, Button } from '@/components/custom'; //BreadCrumb
import { FinalRespnse } from '@/lib/sharedTypes';
import { useParams } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { request } from '@/lib/core/request';
import { IoRefreshSharp } from 'react-icons/io5';
// import { finalRenderDate } from '@/lib/utils';
// import { CategorySelect } from '@/pages/questions/Action';

type TOngoungByExam = {
   // status: 'ongoing';
   candidate: { firstname: string; lastname: string };
   employee: { firstname: string; lastname: string };
   duration_min: number;
   end_at: string;
   // status: keyof typeof StatusLabels;
};

// export enum ExamStatusEnum {
//    ACTIVE = 'active',
//    INACTIVE = 'inactive',
//    HIDDEN = 'hidden',
//    ARCHIVED = 'archived',
//  }


// {
//    "id": "ee432aea-fce7-4baf-a3df-3f12e36960bb",
//    "connection_id": null,
//    "user_id": "4753cb51-6dfc-45f1-8596-f5a2829cafdc",
//    "exam_id": "6b3540f1-698a-4679-a5e0-f61d54fdf901",
//    "variant_id": "4e5e3366-796c-4d27-b47f-d4a04569364a",
//    "progress": null,
//    "status": "ongoing",
//    "duration_min": 180,
//    "end_at": "2025-02-10T05:40:58.219Z",
//    "sort_key": 12,
//    "created_at": "2025-02-10T02:40:58.220Z",
//    "updated_at": "2025-02-10T02:40:58.220Z",
//    "deleted_at": null,
//    "deleted_by": null,
//    "created_by": null,
//    "updated_by": null,
//    "employee": null,
//    "candidate": {
//        "firstname": "Лхагвадорж",
//        "lastname": "Баасандорж",
//        "email": "lmeteor25@gmail.com",
//        "phone": "88560939",
//        "position_applied": "Boss"
//    }
// }

const ByExam = () => {
   const { examid } = useParams();
   const { data, isLoading, isRefetching, refetch } = useQuery({
      // enabled: watch('category_id') !== '' && watch('sub_category_id') !== '',
      enabled: !!examid,
      queryKey: ['ongoing/progresses', examid],
      queryFn: () =>
         request<FinalRespnse<TOngoungByExam[]>>({
            url: 'exam/ongoing/list/progresses',
            method: 'post',
            offAlert: true,
            filterBody: {
               exam_id: examid?.split('=')?.at(0),
               pagination: {
                  page: 1,
                  page_size: 20,
               },
            },
         }),
   });

   return (
      <div>
         <BreadCrumb
            pathList={[
               { label:'Явагдаж буй шалгалтууд', to:'/handle/ongoing' },
               { label:examid?.split('=')?.at(1), isActive: true, to:`#` },
            ]}
         />
         <Header title={examid?.split('=')?.at(1)} />
         <DataTable
            headAction={
               <Button isLoading={isRefetching} onClick={() => refetch()} className="rounded-full" size="icon">
                  <IoRefreshSharp />
               </Button>
            }
            hideAction
            isLoading={isLoading || isRefetching}
            data={data?.data ?? []}
            columns={columnDef}
         />
      </div>
   );
};

export default ByExam;

import { ShiftingCountdown } from '@/components/custom';

const columnDef: ColumnDef<TOngoungByExam>[] = [
   {
      header: 'Оролцогч',
      accessorKey: 'exam_id',
      cell: ({ row }) => {
         const user = row?.original?.candidate ?? row?.original?.employee;
         return (
            <div>
               {user?.lastname?.slice(0, 1)}. {user?.firstname}
            </div>
         );
      },
   },
   {
      header: 'Үргэлжилэх хугацаа',
      accessorKey: 'duration_min',
      cell: ({ row }) => {
         return <div>{row.original.duration_min} / мин</div>;
      },
   },
   // {
   //    header: 'Төлөв',
   //    accessorKey: 'status',
   //    cell: ({ row }) => {
   //       return <div>{row.original.status}</div>;
   //    },
   // },
   {
      header: 'Үлдсэн хугацаа',
      accessorKey: 'end_at',
      cell: ({ row }) => {
         return (
            <div className="flex items-center gap-2 text-muted-text/35">
               <ShiftingCountdown endAt={row.original.end_at} extraSM />
               <span className="text-xs">Цаг / Мин / Сек</span>
            </div>
         );
      },
   },
];
