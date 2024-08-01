import { useQuery } from '@tanstack/react-query';
import { request } from '@/lib/core/request';
import { type FinalRespnse } from '@/lib/sharedTypes';
import { DataTable, BreadCrumb, Header, Badge } from '@/components/custom';
import { ColumnDef } from '@tanstack/react-table';
import Config from '@/pages/exams/actions/Config';
import { cn, finalRenderDate } from '@/lib/utils';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { TExam } from '@/pages/exams';
import { StatusLabels } from '@/pages/candidate/ExamsList';

export type TUserInfo = {
   attempt: number;
   employee: null | string;
   // id: '47c7e229-830c-497b-aee2-87c844d3df98';
   status: keyof typeof StatusLabels;
   user: { firstname: string; lastname: string };
   exam: {
      code: string;
      description: string;
      name: string;
      pass_score: number;
   };
};

// [ graded, not_graded_yet, regraded ]
export const SubmissionTypes = {
   graded: 'Шалгасан',
   not_graded_yet: 'Шалгаагүй',
   regraded: 'Дахин шалгасан',
} as const;

export type TMaterialList = {
   id: string;
   start_date: string;
   attempt_no: number;
   passed: boolean;
   attempt_score: number;
   end_date: string;
   user_exam: TUserInfo;
   status: keyof typeof SubmissionTypes;
   variant: { name: string; achievable_score: number };
   temp_exam_code: string;
};

export const GetExamDetial = ({ examid }: { examid?: string }) => {
   return useQuery({
      queryKey: ['exam', examid],
      queryFn: () =>
         request<FinalRespnse<TExam>>({
            url: `exam/id/${examid}`,
         }),
   });
};

const ExamMaterialList = () => {
   const isResult = useLocation()?.pathname?.startsWith('/handle/examresults');
   const navigate = useNavigate();
   const { examid } = useParams();
   // const [action, setAction] = useState<TAction<TExam>>({ isOpen: false, type: 'add', data: {} as TExam });

   const { data: examDAta } = GetExamDetial({ examid: examid });

   const { data, isLoading } = useQuery({
      queryKey: ['exam/inspector', [examid, isResult]],
      refetchOnWindowFocus: true,
      queryFn: () =>
         request<FinalRespnse<TMaterialList[]>>({
            method: 'post',
            url: 'user/inspector/submissions/list',
            offAlert: true,
            filterBody: {
               exam_id: examid,
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
         <BreadCrumb
            pathList={[
               isResult ? { label: 'Шалгалтын үр дүн', to: '/handle/examresults' } : { label: 'Засах шалгалтууд', to: '/handle' },
               { label: examDAta?.data?.name, isActive: true, to: `/handle${isResult ? `/examresults` : ``}/${examDAta?.data?.id}` },
            ]}
         />

         <Header title={examDAta?.data?.name} />

         <Config data={examDAta} isCompAdmin />

         <DataTable
            data={data?.data?.filter((item) => (isResult ? item.status !== 'not_graded_yet' : item.status === 'not_graded_yet')) ?? []}
            defaultSortField="active_start_at"
            rowAction={(data) => navigate(data?.data?.id ?? '')}
            hideActionButton="delete"
            // headAction={
            //    <div>
            //          asdf
            //       {/* {data?.data?.pass_score}
            //       {data?.data?.status}
            //       {data?.data?.take_per_user} */}
            //    </div>
            // }
            // hideAction
            columns={[
               ...columnDef,
               isResult
                  ? {
                       header: 'Төлөв',
                       accessorKey: 'passed',
                       cell: ({ row }) => {
                          return (
                             <Badge variant="secondary" className={cn('text-[10px]', row.original.passed ? `bg-green-400/10 text-green-600 border-green-300` : ``)}>
                                {row.original.passed ? `Тэнцсэн` : ` Тэнцээгүй`}
                             </Badge>
                          );
                       },
                    }
                  : {
                       header: 'Оролдлого',
                       accessorKey: 'attempt_no',
                       cell: ({ row }) => {
                          return (
                             <div className="text-[11px] text-muted-text">
                                № <span className="font-semibold text-primary text-sm">{row.original.attempt_no}</span>
                             </div>
                          );
                       },
                    },
            ]}
            isLoading={isLoading}
         />
      </div>
   );
};

export default ExamMaterialList;

const columnDef: ColumnDef<TMaterialList>[] = [
   // {
   //    header: 'Төлөв',
   //    accessorKey: 'status',
   //    cell: ({ row }) => {
   //       return (
   //          <Badge variant="secondary" className={cn('font-normal text-[11px]', row.original?.status !== 'not_graded_yet' ? `bg-green-200/30 text-green-600` : ``)}>
   //             {SubmissionTypes?.[row.original?.status]}
   //          </Badge>
   //       );
   //    },
   // },
   {
      header: 'Оролцогч',
      accessorKey: 'user_exam.user.firstname',
      cell: ({ row }) => {
         const user = row?.original?.user_exam.user;
         return (
            <div>
               {user?.lastname?.slice(0, 1)}. {user?.firstname}
            </div>
         );
      },
   },
   {
      header: 'Шалгалтын явц',
      accessorKey: 'user_exam',
      cell: ({ row }) => {
         return (
            <Badge variant="secondary" className="text-[11px]">
               {StatusLabels?.[row.original?.user_exam?.status]}
            </Badge>
         );
      },
   },
   {
      header: 'Хувилбар',
      accessorKey: 'variant.name',
      size: 130,
      // cell: ({ getValue }) => getValue(),
   },
   // {
   //    header: 'Дахин өгсөн тоо',
   //    accessorKey: 'user_exam.status',
   //    cell: ({ row }) => {
   //       return (
   //          <Badge variant="secondary" className="font-medium py-1">
   //             {row.original.user_exam?.attempt}
   //          </Badge>
   //       );
   //    },
   // },
   {
      header: 'Эхлүүлсэн',
      accessorKey: 'start_date',
      cell: ({ row }) => {
         return finalRenderDate(row.original?.start_date);
      },
   },
   {
      header: 'Дуусгасан',
      accessorKey: 'end_date',
      cell: ({ row }) => {
         return finalRenderDate(row.original?.end_date);
      },
   },
   {
      header: 'Авсан оноо',
      accessorKey: 'attempt_score',
      cell: ({ row }) => {
         return (
            <Badge variant="secondary" className="text-[11px]">
               {row.original.attempt_score}
            </Badge>
         );
      },
   },
   {
      header: 'Авсан хувь',
      accessorKey: 'attempt_score',
      cell: ({ row }) => {
         const persentage = (row.original.attempt_score / row.original.variant?.achievable_score) * 100
         return (
            // <Badge variant="secondary" className="text-[11px]">
               <>{(isNaN(persentage)?0:persentage)?.toLocaleString()} %</>
            // </Badge>
         );
      },
   },
   // {
   //    header: '',
   //    accessorKey: 'as_action',
   //    size: 130,
   //    enableSorting: false,
   //    enableHiding: false,
   //    cell: ({ row }) => (
   //       <Link to={row.original?.id ?? '/'} className="w-full leading-11 h-11 text-xs2 text-primary/90 flex items-center gap-1.5 hover:decoration-primary hover:underline">
   //          <LuPencil className="text-sm" /> Материал засах
   //       </Link>
   //    ),
   // },
];
