import { useQuery } from '@tanstack/react-query';
import { request } from '@/lib/core/request';
import { type FinalRespnse } from '@/lib/sharedTypes';
import { BreadCrumb, Header, Button, DataTable, Badge } from '@/components/custom'; // DataTable
import { ColumnDef } from '@tanstack/react-table';
import { TBreadCrumb } from '@/components/custom/BreadCrumb';
import { MdOutlineAdd } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { questionAsset, type TQTypes } from './Action';

export type TQuestion = 'text' | 'checkbox'; // filler

export type TInputType = 'multi_select' | 'select' | 'text' | 'text_long' | 'text_format' | 'filler' | 'filler_select';
// | 'drag_drop' | 'multi_drag_drop';

export type TInputTypeTab = {
   label: string;
   key: TInputType;
};

export type TAnswers = {
   answer: string;
   is_correct: boolean;
   sub_question_id?: string;
   sort_number: number;

   mark: number; // zowhon multi select tei ued
};

export type TQuestionTypes = {
   question: string;
   score: number;
   type: TQuestion;
   category_id: string;
   answers: TAnswers[];
   sort_number: number;
   total_score: number;
   sub_category_id: string;
   // input_type: 'multi_select' | 'select' | 'text' | 'drag_drop' | 'multi_drag_drop';
   input_type: TInputType;
   created_at: string;
};

const Groups = ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => {
   const { data, isLoading } = useQuery({
      queryKey: [`questions`],
      queryFn: () =>
         request<FinalRespnse<TQuestionTypes>>({
            method: 'post',
            url: `exam/list/question`,
            offAlert: true,
            filterBody: {
               pagination: {
                  page: 1,
                  page_size: 20,
               },
            },
         }),
   });

   return (
      <div>
         <BreadCrumb pathList={breadcrumbs} />
         <Header
            title={breadcrumbs.find((item) => item.isActive)?.label}
            action={
               <Popover>
                  <PopoverTrigger asChild>
                     <Button>
                        <MdOutlineAdd className="text-base" /> Асуумж нэмэх <FiChevronDown />
                     </Button>
                  </PopoverTrigger>

                  <PopoverContent className='p-6 w-78 flex flex-col gap-4' align="end" sideOffset={8}>
                     {Object.keys(questionAsset)?.map((item, index) => {
                        const Icon = questionAsset[item as TQTypes]?.icon
                        return (
                           <Link
                              to={`${breadcrumbs.find((item) => item.isActive)?.to}/create?type=${item}`}
                              className="group p-4 hover:bg-primary/5 rounded-md cursor-pointer grid grid-cols-[auto_1fr] gap-4 border border-primary/20"
                              key={index}
                           >

                              <Icon className="text-xl text-secondary mt-1" />

                              <div className="flex flex-col gap-1">
                                 <span className='font-medium'>{questionAsset[item as TQTypes]?.label}</span>
                                 <span className='text-muted-text text-xs'>{questionAsset[item as TQTypes]?.description}</span>
                              </div>
                           </Link>
                        )
                     })}
                  </PopoverContent>
               </Popover>
            }
         />
         <DataTable data={data?.data ?? []} columns={columnDef} isLoading={isLoading} />
      </div>
   );
};

export default Groups;

const columnDef: ColumnDef<TQuestionTypes>[] = [
   {
      header: 'Асуулт',
      accessorKey: 'question',
      // size:500,
   },
   {
      header: 'Үүсгэсэн огноо',
      accessorKey: 'created_at',
      cell: ({ row }) => row.original?.created_at?.slice(0, 16).replace('T', ' '),
   },
   {
      header: 'Төрөл',
      accessorKey: 'type',
      cell: ({ row }) => (row.original?.type === 'checkbox' ? <Badge variant="secondary">Сонголттой</Badge> : <Badge variant="secondary">Бичгээр</Badge>),
   },

   // {
   //    header: 'Хариултын тоо',
   //    accessorKey: 'answers.length',
   // }, category, bolon sub category nem
];
