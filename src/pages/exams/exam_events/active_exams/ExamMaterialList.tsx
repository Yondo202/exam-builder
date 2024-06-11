import { useQuery } from '@tanstack/react-query';
import { request } from '@/lib/core/request';
import { type FinalRespnse } from '@/lib/sharedTypes';
import { DataTable, BreadCrumb, Header, Badge } from '@/components/custom';
import { ColumnDef } from '@tanstack/react-table';
import Config from '@/pages/exams/actions/Config';
import { finalRenderDate } from '@/lib/utils';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { TExam } from '@/pages/exams';
import { LuPencil } from 'react-icons/lu';
import { StatusLabels } from '@/pages/candidate/ExamsList';

type TUserInfo = {
   attempt: number;
   employee: null | string;
   id: '47c7e229-830c-497b-aee2-87c844d3df98';
   status: keyof typeof StatusLabels;
   user: { firstname: string; lastname: string };
};

type TMaterialList = {
   id: string;
   start_date: string;
   end_date: string;
   user_exam: TUserInfo;
};

const ExamMaterialList = () => {
   const navigate = useNavigate();
   const { examid } = useParams();
   // const [action, setAction] = useState<TAction<TExam>>({ isOpen: false, type: 'add', data: {} as TExam });

   const { data: examDAta } = useQuery({
      queryKey: ['exam', examid],
      queryFn: () =>
         request<FinalRespnse<TExam>>({
            url: `exam/id/${examid}`,
         }),
   });

   const { data, isLoading } = useQuery({
      queryKey: ['exam/inspector', examid],
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

   console.log(data, "------------>data")

   return (
      <div>
         <BreadCrumb
            pathList={[
               { label: 'Засах шалгалтууд', to: '/handle' },
               { label: examDAta?.data?.name, isActive: true, to: `/handle/${examDAta?.data?.id}` },
            ]}
         />
         {/*ene iig daraa nohtsol shalgaj to- giin oorchil*/}

         <Header title={examDAta?.data?.name} />

         <Config data={examDAta} isCompAdmin />

         <DataTable
            data={data?.data ?? []}
            defaultSortField="active_start_at"
            rowAction={(data) => navigate(data?.data?.id ?? '')}
            // hideActionButton="delete"
            hideAction
            columns={columnDef}
            isLoading={isLoading}
         />
      </div>
   );
};

export default ExamMaterialList;

const columnDef: ColumnDef<TMaterialList>[] = [
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
      header: 'Төлөв',
      accessorKey: 'user_exam',
      cell: ({ row }) => {
         return (
            <Badge variant="secondary" className="font-medium py-1">
               {StatusLabels?.[row.original?.user_exam?.status]}
            </Badge>
         );
      },
   },

   {
      header: 'Дахин өгсөн тоо',
      accessorKey: 'user_exam.status',
      cell: ({ row }) => {
         return (
            <Badge variant="secondary" className="font-medium py-1">
               {row.original.user_exam?.attempt}
            </Badge>
         );
      },
   },
   {
      header: 'Шалгалт эхлүүлсэн',
      accessorKey: 'start_date',
      cell: ({ row }) => {
         return finalRenderDate(row.original?.start_date);
      },
   },
   {
      header: 'Шалгалт дуусгасан',
      accessorKey: 'end_date',
      cell: ({ row }) => {
         return finalRenderDate(row.original?.end_date);
      },
   },
   {
      header: '',
      accessorKey: 'as_action',
      size: 130,
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
         <Link to={row.original?.id ?? '/'} className="w-full leading-11 h-11 text-xs2 text-primary/90 flex items-center gap-1.5 hover:decoration-primary hover:underline">
            <LuPencil className="text-sm" /> Материал засах
         </Link>
      ),
   },
];
