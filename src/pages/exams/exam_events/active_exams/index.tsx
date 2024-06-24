import { useQuery } from '@tanstack/react-query';
import { request } from '@/lib/core/request';
import { type FinalRespnse } from '@/lib/sharedTypes';
import { DataTable, BreadCrumb, Header, Badge } from '@/components/custom';
import { ColumnDef } from '@tanstack/react-table';
import { TBreadCrumb } from '@/components/custom/BreadCrumb';
import { useNavigate, useLocation } from 'react-router-dom';
import { finalRenderDate } from '@/lib/utils';
import { useGetCategories } from '@/pages/category';
import { TExam } from '@/pages/exams';
import { SubmissionTypes } from '@/pages/exams/exam_events/active_exams/ExamMaterialList';

const ActiveExams = ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => {
   const isResult = useLocation()?.pathname?.startsWith('/handle/examresults');
   const navigate = useNavigate();
   // const [action, setAction] = useState<TAction<TExam>>({ isOpen: false, type: 'add', data: {} as TExam });
   const { data: CategoryData } = useGetCategories({ current: 'main_category' });
   const { data, isLoading } = useQuery({
      queryKey: ['exam/inspector', isResult],
      refetchOnWindowFocus:true,
      queryFn: () =>
         request<FinalRespnse<TExam[]>>({
            method: 'post',
            url: 'user/inspector/exam/list',
            offAlert: true,
            filterBody: {
               pagination: {
                  page: 1,
                  page_size: 1000,
               },
            },
         }),
   });

   // const afterSuccess = (id: string) => {
   //    setAction((prev) => ({ ...prev, isOpen: false }));
   //    refetch();
   //    if (id !== 'delete') {
   //       navigate(id);
   //    }
   // };

   return (
      <div>
         <BreadCrumb pathList={isResult ? [{ ...breadcrumbs[0], to: `/handle/examresults` }] : breadcrumbs} />
         <Header title={breadcrumbs.find((item) => item.isActive)?.label} />

         <DataTable
            data={data?.data ?? []}
            defaultSortField="active_start_at"
            rowAction={(data) => navigate(data?.data?.id ?? '')}
            hideActionButton="delete"
            headAction={
               <div className="flex items-center gap-3">
                  {data?.meta.grading_status?.map((item, index) => {
                     return (
                        <Badge key={index} className="py-1.5 rounded-full flex gap-1" variant="secondary">
                           <span className="text-muted-text">{SubmissionTypes?.[item.status]}: </span>
                           <span className="font-medium">{item.count}</span>
                        </Badge>
                     );
                  })}

                  {/* <Badge>hehehe</Badge> */}
               </div>
            }
            columns={[
               {
                  header: 'Шалгалтын нэр',
                  accessorKey: 'name',
                  // size:500,
               },
               {
                  header: 'Бүлэг',
                  accessorKey: 'category_id',
                  cell: ({ row }) => {
                     return <div>{CategoryData?.data?.find((item) => item.id === row.original.category_id)?.name}</div>;
                  },
               },
               ...columnDef,
            ]}
            isLoading={isLoading}
         />

         {/* <Drawer
            open={action.isOpen}
            onOpenChange={(e) => setAction((prev) => ({ ...prev, isOpen: e }))}
            title="Шалгалтын тохиргоо"
            content={<ConfigAction action={action} afterSuccess={afterSuccess} />}
            className="py-2 max-w-4xl"
            titleClassName="pt-2 pb-2"
         /> */}
      </div>
   );
};

export default ActiveExams;

const columnDef: ColumnDef<TExam>[] = [
   {
      header: 'Эхлэх огноо',
      accessorKey: 'active_start_at',
      cell: ({ row }) => {
         return finalRenderDate(row.original?.active_start_at)?.slice(0, 10);
      },
   },
   {
      header: 'Дуусах огноо',
      accessorKey: 'active_end_at',
      cell: ({ row }) => {
         return finalRenderDate(row.original?.active_end_at)?.slice(0, 10);
      },
   },
   {
      header: 'Ү / ху',
      accessorKey: 'duration_min',
      size: 100,
      enableSorting: false,
      cell: ({ row }) => {
         return (
            row.original.code && (
               <>
                  <Badge variant="secondary" className="w-fit text-[10px] font-medium text-primary/90 px-1.5 py-0.5">
                     {row.original.duration_min}
                  </Badge>
                  <span className="text-muted-text text-xs ml-1">мин</span>
               </>
            )
         );
      },
   },

   {
      header: 'Тэнцэх оноо',
      accessorKey: 'pass_score',
      size: 120,
      enableSorting: false,
      cell: ({ row }) => {
         return (
            row.original.code && (
               <>
               {/* className={cn('rounded-full gap-1.5 transition-all text-primary/70', isSelected ? `border-green-300 text-green-600` : ``)} */}
                  <Badge variant="secondary" className="w-fit text-[10px] font-semibold bg-green-100/50 border-green-300 text-green-600 px-1.5 py-0.5">
                     {row.original.pass_score}
                  </Badge>
               </>
            )
         );
      },
   },
   // {
   //    header: 'Код',
   //    accessorKey: 'code',
   //    enableSorting: false,
   //    size: 120,
   //    cell: ({ row }) => {
   //       return (
   //          row.original.code && (
   //             <Badge variant="secondary" className="w-fit text-[10px] font-medium text-primary/90">
   //                {row.original.code}
   //             </Badge>
   //          )
   //       );
   //    },
   // },

   // {
   //    header: '',
   //    accessorKey: 'as_action',
   //    size: 100,
   //    enableSorting: false,
   //    enableHiding: false,
   //    cell: ({ row }) => (
   //       <Link to={row.original?.id ?? '/'} className="w-full leading-11 h-11 text-[11px] font-medium text-primary/90 flex items-center gap-1 hover:decoration-primary hover:underline">
   //          Шалгалт засах
   //       </Link>
   //    ),
   // },
];
