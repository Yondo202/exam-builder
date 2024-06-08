import { useQuery, useMutation, useQueries } from '@tanstack/react-query';
import { request } from '@/lib/core/request';
import { type FinalRespnse, type TAction } from '@/lib/sharedTypes';
import { BreadCrumb, Header, Button, DataTable, Badge, Dialog, DeleteContent } from '@/components/custom'; // DataTable
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { TBreadCrumb } from '@/components/custom/BreadCrumb';
import { MdOutlineAdd } from 'react-icons/md';
import { FiChevronDown } from 'react-icons/fi';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { questionAsset, CategorySelect } from './Action';
import { useEffect, useState } from 'react';
import { type RowSelectionState } from '@tanstack/react-table';
import { HtmlToText, cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
export type TQuestion = 'text' | 'checkbox' | 'fill';
export type TInputType = 'multi_select' | 'select' | 'text' | 'richtext' | 'essay' | 'fill' | 'fill_with_choice';
export type TTempType = 'question' | 'answer' | 'wrong_answer';

export type TInputTypeTab = {
   label: string;
   key: TInputType;
};

// only use on fill type
type TFillAnswer = {
   fill_index?: number;
   temp_type?: TTempType;
};

export type TAnswers = {
   id?: string;
   answer: string;
   is_correct: boolean;
   // sub_question_id?: string;
   sort_number: number;
   mark: number; // zowhon multi select tei ued
} & TFillAnswer;

export type AllTypesQuestionTypes = {
   id: string;
   question: string;
   score: number;
   type: TQuestion;
   category_id: string;
   answers: TAnswers[];
   sub_category_id: string;
   input_type: TInputType;
   sort_number: number;
   total_score: number;
   created_at: string;
   sub_questions: TQuestionTypes[];
};

export type TQuestionTypes = Omit<AllTypesQuestionTypes, 'created_at' | 'total_score'>;

type Tfilter = TQuestion | 'all';

const Questions = ({ breadcrumbs, fromAction, prevData }: { breadcrumbs: TBreadCrumb[]; fromAction?: (row: RowSelectionState) => React.ReactNode; prevData?: AllTypesQuestionTypes[] }) => {
   const [filterTypes, setFilterTypes] = useState<Tfilter>('all');
   const { control, setValue, watch } = useForm({ defaultValues: { category_id: '', sub_category_id: '' } });

   const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10,
      total: 0,
   });

   const [search, setSearch] = useState('');

   const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
   const [deleteAction, setDeleteAction] = useState({ isOpen: false, id: '' });
   // const [isOpen, setIsOpen] = useState(false);
   const navigate = useNavigate();

   const { data, isLoading, refetch, isFetchedAfterMount } = useQuery({
      queryKey: [`questions`, [pagination.pageIndex, pagination.pageSize, search, watch('category_id'), watch('sub_category_id')], filterTypes],
      queryFn: () =>
         request<FinalRespnse<AllTypesQuestionTypes[]>>({
            method: 'post',
            url: `exam/list/question`,
            offAlert: true,
            filterBody: {
               query: search,
               category_id: watch('category_id'),
               sub_category_id: watch('sub_category_id'),
               type: filterTypes !== 'all' ? filterTypes : undefined,
               pagination: {
                  page: pagination.pageIndex + 1,
                  page_size: pagination.pageSize,
               },
            },
         }),
   });
   // eslint-disable-next-line react-hooks/exhaustive-deps

   useEffect(() => {
      const temp = prevData?.reduce((a: RowSelectionState, c: AllTypesQuestionTypes) => {
         a[c.id] = true;
         return a;
      }, {});
      setRowSelection(temp ?? {});
   }, []);

   useEffect(() => {
      if (data?.meta) {
         setPagination({ pageIndex: data?.meta?.page - 1, pageSize: data?.meta?.page_size, total: +data?.meta?.total }); // eniig update deer boluilchih
      }
   }, [isFetchedAfterMount]);

   // console.log(rowSelection);

   const { isPending, mutate } = useMutation({
      mutationFn: () =>
         request<TQuestionTypes>({
            method: 'delete',
            url: `exam/question/${deleteAction.id}`,
         }),
      onSuccess: () => {
         refetch();
         setDeleteAction({ isOpen: false, id: '' });
      },
   });

   const rowAction = (item: TQuestion) => {
      navigate(`${breadcrumbs.find((item) => item.isActive)?.to}/create?type=${item}`);
   };

   // const submitAction = () =>{
   //    // rowSelection.forEach()
   //    // rowMutate()
   //    Object.keys(rowSelection)?.forEach(item=>{
   //       rowMutate(item)
   //    })
   // }

   // console.log(rowSelection, '------------>prevData');

   // const {
   //    data: dataOne,
   //    isFetchedAfterMount,
   //    isFetched,
   // } = useQuery({
   //    enabled: !!fromAction,
   //    queryKey: [`questions`, typeid],
   //    queryFn: () =>
   //       request<{ data: AllTypesQuestionTypes }>({
   //          url: `exam/question/id/${typeid}`,
   //       }),
   // });

   const userQueries = useQueries({
      queries: Object.keys(rowSelection).map((user) => {
         return {
            queryKey: ['question/one', user],
            queryFn: () =>
               request<{ data: AllTypesQuestionTypes }>({
                  url: `exam/question/id/${user}`,
               }),
         };
      }),
   });

   return (
      <>
         {!fromAction && <BreadCrumb pathList={breadcrumbs} />}
         {!fromAction && (
            <Header
               title={breadcrumbs.find((item) => item.isActive)?.label}
               action={
                  <SelectQuestionType rowAction={rowAction}>
                     <Button className="rounded-full">
                        <MdOutlineAdd className="text-base" /> Асуумж нэмэх <FiChevronDown />
                     </Button>
                  </SelectQuestionType>
               }
            />
         )}

         {fromAction?.(rowSelection)}

         <div className={cn('grid transition-all grid-cols-1 gap-0', fromAction ? ` grid-cols-[60%_1fr] gap-8` : ``)}>
            <div>
               <div className={cn('wrapper p-6 pt-3 mb-4 grid grid-cols-[40%_1fr] items-end flex-wrap gap-10 relative', fromAction ? `grid-cols-[1fr] gap-5` : ``)}>
                  <div className="flex gap-5">
                     <CategorySelect
                        control={control}
                        name="category_id"
                        current="main_category"
                        label="Үндсэн ангилал"
                        onChange={() => {
                           setValue('sub_category_id', '');
                        }}
                     />
                     <CategorySelect control={control} disabled={!watch('category_id')} idKey={watch('category_id')} name="sub_category_id" current="sub_category" label="Дэд ангилал" />
                  </div>

                  <div className="flex flex-wrap gap-2 pb-1">
                     <Button
                        onClick={() => setFilterTypes('all')}
                        size="sm"
                        className={cn('rounded-full', filterTypes === 'all' ? `opacity-100` : `opacity-70`)}
                        variant={filterTypes === 'all' ? `default` : `outline`}
                     >
                        Бүгд
                     </Button>
                     {Object.keys(questionAsset)?.map((item, index) => {
                        return (
                           <Button
                              key={index}
                              onClick={() => setFilterTypes(item as TQuestion)}
                              size="sm"
                              className={cn('rounded-full', filterTypes === item ? `opacity-100` : `opacity-70`)}
                              variant={filterTypes === item ? `default` : `outline`}
                           >
                              {questionAsset[item as TQuestion]?.icon({ size: '17' })} {questionAsset[item as TQuestion]?.label}
                           </Button>
                        );
                     })}
                  </div>
                  <div className="h-[1.1rem] w-0.5 bg-primary/40 absolute top-full left-10" />
               </div>
               <DataTable
                  manualPagination
                  pagination={pagination}
                  setPagination={setPagination}
                  search={search}
                  setSearch={setSearch}
                  data={fromAction ? data?.data?.filter((item) => !Object.keys(rowSelection)?.includes(item.id)) ?? [] : data?.data ?? []}
                  columns={fromAction ? [columnDef[0], columnDef[1]] : columnDef}
                  rowSelection={fromAction ? rowSelection : undefined}
                  {...{ setRowSelection, isLoading }}
                  hideAction={!!fromAction} // eniig sain oilgosongui yah gej hiisnee
                  size={fromAction ? 'sm' : 'md'}
                  rowAction={
                     fromAction
                        ? () => null
                        : (data: TAction<AllTypesQuestionTypes>) => {
                             if (data.type === 'edit') {
                                navigate(`${breadcrumbs.find((item) => item.isActive)?.to}/${data.data?.id}`);
                                return;
                             }
                             setDeleteAction({ isOpen: true, id: data.data?.id ?? '' });
                          }
                  }
               />
            </div>

            {fromAction && (
               <div>
                  <div className="mb-3 flex justify-between text-sm">
                     <div className="text-green-600">Сонгогдсон асуултууд / {userQueries.length}</div>
                     <div className="flex gap-2 text-muted-text">
                        Нийт оноо: <span className="font-medium text-primary">{userQueries.map((item) => ({ ...item?.data?.data }))?.reduce((a, b) => a + b.score!, 0)}</span>{' '}
                     </div>
                  </div>
                  <DataTable
                     data={(userQueries.map((item) => ({ ...item?.data?.data })) as AllTypesQuestionTypes[]) ?? []}
                     columns={[columnDef[0]]}
                     rowSelection={rowSelection}
                     {...{ setRowSelection, isLoading }}
                     hideAction={!!fromAction} // eniig sain oilgosongui yah gej hiisnee
                     size="sm"
                     defaultPageSize={1000}
                     hideColumnVisibleAction
                     hidePagination
                  />
               </div>
            )}
         </div>

         <Dialog isOpen={deleteAction.isOpen} onOpenChange={(e) => setDeleteAction((prev) => ({ ...prev, isOpen: e }))}>
            <DeleteContent setClose={() => setDeleteAction({ isOpen: false, id: '' })} submitAction={mutate} isLoading={isPending} className="pb-6" />
         </Dialog>
      </>
   );
};

export default Questions;

type TSelectQuestionProps = {
   children: React.ReactNode;
   rowAction: (item: TQuestion, type?: TAction<TQuestionTypes>['type'], data?: TAction<TQuestionTypes>) => void;
};

export const SelectQuestionType = ({ children, rowAction }: TSelectQuestionProps) => {
   return (
      <Popover>
         <PopoverTrigger asChild>{children}</PopoverTrigger>

         <PopoverContent className="p-6 w-78 flex flex-col gap-4" align="end" sideOffset={8}>
            {Object.keys(questionAsset)?.map((item, index) => {
               const Icon = questionAsset[item as TQuestion]?.icon;
               return (
                  <div
                     // to={`${breadcrumbs.find((item) => item.isActive)?.to}/create?type=${item}`}
                     onClick={() => rowAction(item as TQuestion)}
                     className="group p-4 hover:bg-primary/5 rounded-md cursor-pointer grid grid-cols-[auto_1fr] gap-4 border border-primary/20"
                     key={index}
                  >
                     <Icon className="text-xl text-secondary mt-1" />

                     <div className="flex flex-col gap-1">
                        <span className="font-medium">{questionAsset[item as TQuestion]?.label}</span>
                        <span className="text-muted-text text-xs">{questionAsset[item as TQuestion]?.description}</span>
                     </div>
                  </div>
               );
            })}
         </PopoverContent>
      </Popover>
   );
};

const columnDef: ColumnDef<AllTypesQuestionTypes>[] = [
   {
      header: 'Асуулт',
      accessorKey: 'question',
      cell: ({ row }) => {
         if (row.original.input_type === 'richtext' || row.original.input_type === 'essay') {
            return HtmlToText({ html: row.original.question ?? '' });
         }
         return row.original.question;
      },
      size: 250,
   },
   {
      header: 'Нийт оноо',
      accessorKey: 'score',
      size: 120,
      // cell: ({ row }) => <Badge variant="outline">{row.original?.score}</Badge>,
      cell: ({ row }) => (
         <Badge variant="outline" className="w-fit text-[11px] py-0.5 px-2 font-medium text-primary bg-secondary/5">
            {row.original?.score}
         </Badge>
      ),
   },
   {
      header: 'Үүсгэсэн огноо',
      accessorKey: 'created_at',
      cell: ({ row }) => row.original?.created_at?.slice(0, 10).replace('T', ' '),
   },
   {
      header: 'Өөрчилсөн огноо',
      accessorKey: 'updated_at',
      cell: ({ row }) => row.original?.created_at?.slice(0, 10).replace('T', ' '),
   },
   {
      header: 'Төрөл',
      accessorKey: 'type',
      cell: ({ row }) => {
         const Icon = questionAsset[row.original?.type as TQuestion]?.icon;
         // return row.original?.type === 'checkbox' ? <Badge variant="secondary">Сонголттой</Badge> : <Badge variant="secondary">Бичгээр</Badge>
         return (
            <div className="flex items-center gap-3">
               {Icon && <Icon className="text-md text-primary/60" />}
               <Badge variant="secondary" className="w-fit text-[11px] font-medium text-primary/90">
                  {questionAsset[row.original?.type as TQuestion]?.label}{' '}
               </Badge>
            </div>
         );
      },
   },

   // {
   //    header: 'Хариултын тоо',
   //    accessorKey: 'answers.length',
   // }, category, bolon sub category nem
];
