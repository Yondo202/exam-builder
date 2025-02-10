import { useEffect, useState } from 'react';
import { Drawer, TextInput, Button, Textarea, DeleteContent, Dialog, Sortable, SortableDragHandle, SortableItem, Skeleton, Loading, Tooltip } from '@/components/custom';
import { useSearchParams, useParams } from 'react-router-dom';
import { type TAction, type TActionProps, type FinalRespnse, ATypes } from '@/lib/sharedTypes'; // , type FinalRespnse
import { Controller, useForm } from 'react-hook-form';
import { MdOutlineAdd } from 'react-icons/md';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UseReFetch, request } from '@/lib/core/request';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { type TExamSection, type TExam } from '..'; // type TVariant,
import { Empty } from '@/assets/svg';
import { PiDotsSixVerticalBold } from 'react-icons/pi';
import { CgDanger } from 'react-icons/cg';
import { type RowSelectionState } from '@tanstack/react-table';
import ActionButtons from '@/components/ActionButtons';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Questions from '@/pages/questions';
import { queryClient } from '@/main';
import QuestionDetail from '@/pages/questions/Action';
import { SelectQuestionType } from '@/pages/questions';

type TVairantTabs = {
   variant_id: string;
   parentData: TExam;
   scrumble_questions?: boolean;
   // setValidInvite: React.Dispatch<React.SetStateAction<boolean>>;
   // exam_id?: string;
   // sections?: TExamSection[];
   // variantId: string;
   //    setVariantId: (id: string) => void;
   //    variants?: FinalRespnse<TVariant[]>;
   //    children: React.ReactNode;
};

type TActionQuestion = {
   section_id?: string;
   question_id?: string;
   questions: TExamSection['questions'];
   // "sort_number": 0
};

const UseDeleteMutate = () => {
   return useMutation({
      mutationFn: ({ questionId, section_id }: { section_id?: string; questionId?: TActionQuestion['question_id'] }) =>
         request<Pick<TActionQuestion, 'question_id' | 'section_id'>>({
            method: 'delete',
            url: `exam/remove/question`,
            offAlert: true,
            body: {
               //sort number nem
               question_id: questionId,
               section_id: section_id ?? undefined,
            },
         }),
   });
};

type TActionDelete = {
   isOpen: boolean;
   // type: keyof typeof ATypes;
   data?: { questionId: string; section_id: string };
};

const Section = ({ variant_id, parentData, scrumble_questions }: TVairantTabs) => {
   const { typeid } = useParams();
   // const [activeSection, setActiveSection] = useState([]);
   const [deleteAction, setDeleteAction] = useState<TActionDelete>({ isOpen: false, data: {} as TActionDelete['data'] });
   const [questionDetail, setQuestionDetail] = useState({ isOpen: false, pathId: '' });
   // const [action, setAction] = useState<TAction<TExamSection>>({ isOpen: false, type: 'add', data: {} as TQuestion });
   const [action, setAction] = useState<TAction<TExamSection>>({ isOpen: false, type: 'add', data: {} as TExamSection });
   const [actionQuestion, setActionQuestion] = useState<TAction<TActionQuestion>>({ isOpen: false, type: 'add', data: {} as TActionQuestion });

   const { data, isRefetching, refetch } = useQuery({
      enabled: !!variant_id,
      queryKey: ['exam/section', variant_id],
      queryFn: () =>
         request<FinalRespnse<TExamSection[]>>({
            url: `exam/list/section/${variant_id}`,
         }),
   });

   const { mutate, isPending } = UseDeleteMutate();

   const { mutate: stortMutate, isPending: sortPending } = useMutation({
      mutationFn: (body: { section_id: string; sort_orders: { question_id: string; sort_number: number }[] }) =>
         request({
            method: 'post',
            url: 'exam/arrange/question',
            offAlert: true,
            body: {
               exam_id: typeid,
               variant_id: variant_id,
               ...body,
               // section_id: 'string',
               // sort_orders: body,
               // ...body,
            },
         }),
      onSuccess: () => {
         refetch();
      },
   });

   // useEffect(() => {
   //    if (isFetchedAfterMount && data?.data) {
   //       if (data?.data?.length > 0) {
   //          const quetions = data?.data?.filter((element) => element.questions?.length > 0);
   //          if (quetions?.length > 0) {
   //             setValidInvite(true);
   //             return;
   //          }
   //          setValidInvite(false);
   //          // console.log(data?.data?.map(element=>element.questions))

   //          return;
   //       }

   //       setValidInvite(false);
   //    }
   //    // eslint-disable-next-line react-hooks/exhaustive-deps
   // }, [isFetchedAfterMount, isRefetching]);

   // const { data: dataOne } = useQuery({
   //    enabled: !!variant_id,
   //    queryKey: ['exam/section/id', `48cf75ea-780e-47d7-8559-23bf457a9e68`],
   //    queryFn: () =>
   //       request<FinalRespnse<TExamSection>>({
   //          url: `exam/section/48cf75ea-780e-47d7-8559-23bf457a9e68`,
   //       }),
   // });

   const DeleteSubmit = () => {
      mutate(deleteAction.data ?? {}, {
         onSuccess: () => {
            refetch();
            setDeleteAction({ isOpen: false, data: { section_id: '', questionId: '' } });
            UseReFetch({ queryKey: 'exam', queryId: typeid });
         },
      });
   };

   return (
      <div className="wrapper py-5">
         <div className="px-6 pb-5 mb-4 text-muted-text font-medium text-sm flex gap-3 justify-between ">Асуумжын жагсаалт</div>
         {(data?.data?.length ?? 0) > 0 ? (
            <Accordion type="multiple" className="px-6">
               {data?.data
                  ?.sort((a, b) => a.sort_number - b.sort_number)
                  .map((item, index) => {
                     return (
                        <AccordionItem key={index} value={item.id} className="border rounded-md bg-primary/5 mb-4 pr-1.5">
                           <div className="grid items-center grid-cols-[1fr_auto]">
                              <AccordionTrigger className="flex-row-reverse justify-end gap-3 relative group/items">
                                 <span className="truncate max-w-96">{item.name}</span> <span>{index + 1}.</span>
                                 <ActionButtons // ene component oos bolj aldaa ogj baigaa browser deer
                                    editTrigger={() => setAction({ data: item, type: 'edit', isOpen: true })}
                                    deleteTrigger={() => setAction({ data: item, type: 'delete', isOpen: true })}
                                    className="pl-9 -top-1/4 -translate-y-1/2 translate-x-11 right-full"
                                 />
                              </AccordionTrigger>
                              <div className="flex items-center gap-5">
                                 <div className="text-muted-text">
                                    Асуултын тоо: <span className="text-text font-medium">{item.questions.length}</span>
                                 </div>
                                 <div className="text-muted-text">
                                    Авах оноо: <span className="text-primary font-medium">{item.questions?.reduce((a, b) => a + b.score, 0)}</span>
                                 </div>
                                 <Button
                                    size="sm"
                                    type="button"
                                    variant="outline"
                                    className="rounded-full"
                                    onClick={() => setActionQuestion({ type: 'add', isOpen: true, data: { section_id: item.id, questions: item.questions ?? [] } })}
                                 >
                                    <MdOutlineAdd className="text-base" /> Асуулт нэмэх
                                 </Button>
                              </div>
                           </div>

                           <AccordionContent className="p-3 relative">
                              <div className="pb-2 mb-2 flex gap-3 text-primary/70 text-xs border-border border-b font-medium">
                                 <span>Асуултууд</span>
                                 {scrumble_questions && (
                                    <Tooltip content="Та санамсаргүй байдлаар холих сонгосон үед: Шалгалт өгч буй хүнд үндсэн асуулт энэхүү байрлалаар харагдахгүй">
                                       <span className="text-amber-500 flex items-center gap-1.5 font-normal">
                                          <CgDanger className="text-lg" />
                                       </span>
                                    </Tooltip>
                                 )}
                              </div>

                              {item.questions.length > 0 ? (
                                 <Sortable
                                    // value={fields.map((item) => ({ ...item, id: item._id }))}
                                    value={item.questions}
                                    onMove={({ activeIndex, overIndex }) => {
                                       const fakeSort = item.questions?.map((element, index) => ({
                                          // ...item,
                                          question_id: element.id,
                                          sort_number: index === overIndex ? activeIndex : index === activeIndex ? overIndex : index,
                                       }));

                                       stortMutate({ section_id: item.id, sort_orders: fakeSort });
                                    }}
                                    overlay={
                                       <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                                          <Skeleton className="h-8 w-8 rounded-sm" />
                                          <Skeleton className="h-11 w-full rounded-sm" />
                                          {/* <Skeleton className="size-8 shrink-0 rounded-sm" /> */}
                                          {/* <Skeleton className="size-8 shrink-0 rounded-sm" /> */}
                                       </div>
                                    }
                                 >
                                    <Loading load={sortPending || isRefetching} inside />
                                    {item.questions.map((element, ind) => {
                                       return (
                                          <SortableItem key={element.id} value={element.id} asChild>
                                             <div className="mb-3 max-w-full grid grid-cols-[auto_1fr] gap-3 items-center" key={ind}>
                                                <SortableDragHandle variant="ghost" size="icon" className="size-8 shrink-0">
                                                   <PiDotsSixVerticalBold className="text-lg text-muted-text" aria-hidden="true" />
                                                </SortableDragHandle>

                                                <div
                                                   // onClick={() => setQuestionDetail({ isOpen: true, pathId: element.id })}
                                                   className="group-hover/items:opacity-60 bg-card-bg px-6 py-3 rounded-md hover:shadow-lg cursor-pointer overflow-hidden shadow-sm group/items relative transition-all"
                                                >
                                                   {element.input_type === 'richtext' || element.input_type === 'essay' || element.input_type === 'select' ? (
                                                      <article className="prose-sm dark:prose-invert max-h-[20dvh] overflow-y-auto">
                                                         <span dangerouslySetInnerHTML={{ __html: element.question }} />
                                                      </article>
                                                   ) : (
                                                      element.question
                                                   )}

                                                   <ActionButtons // ene component oos bolj aldaa ogj baigaa browser deer
                                                      editTrigger={() => setQuestionDetail({ isOpen: true, pathId: element.id })}
                                                      deleteTrigger={() => setDeleteAction({ data: { questionId: element.id, section_id: item.id }, isOpen: true })}
                                                      // className="relative"
                                                   />
                                                </div>
                                             </div>
                                          </SortableItem>
                                       );
                                    })}
                                 </Sortable>
                              ) : (
                                 <div className="h-32 flex items-center justify-center flex-col gap-4">
                                    <Empty />
                                    <h3 className="text-muted-text/40">Мэдээлэл байхгүй байна</h3>
                                 </div>
                              )}
                           </AccordionContent>
                        </AccordionItem>
                     );
                  })}
            </Accordion>
         ) : (
            <div className="h-32 flex items-center justify-center flex-col gap-4">
               <Empty />
               <h3 className="text-muted-text/40">Асуумж байхгүй байна</h3>
            </div>
         )}

         <div className="px-6">
            <Button onClick={() => setAction({ type: 'add', isOpen: true })} className={cn('rounded-full', data?.data?.length ?? 0 > 0 ? `` : `w-full`)} variant="outline" type="button">
               <MdOutlineAdd className="text-base" />
               Дэд хэсэг нэмэх
            </Button>
         </div>

         <Dialog
            isOpen={questionDetail.isOpen}
            onOpenChange={(event) => setQuestionDetail((prev) => ({ ...prev, isOpen: event }))}
            title="Асуултын жагсаалт"
            className={`p-6 pt-0 w-[80dvw]`}
         >
            <QuestionDetail
               pathId={questionDetail.pathId}
               setClose={() => {
                  // refetch();
                  queryClient.resetQueries({ queryKey: ['exam/section', variant_id], exact: true });
                  setQuestionDetail((prev) => ({ ...prev, isOpen: false }));
               }}
            />
         </Dialog>

         <Dialog isOpen={deleteAction.isOpen} onOpenChange={(event) => setDeleteAction((prev) => ({ ...prev, isOpen: event }))}>
            <DeleteContent isLoading={isPending} submitAction={DeleteSubmit} />
         </Dialog>

         <Dialog
            isOpen={actionQuestion.isOpen}
            onOpenChange={(event) => setActionQuestion((prev) => ({ ...prev, isOpen: event }))}
            title="Асуултын жагсаалт"
            className={`p-6 pt-0 w-[80dvw]`}
         >
            <SelectRowAction variant_id={variant_id} action={actionQuestion} setClose={() => setActionQuestion((prev) => ({ ...prev, isOpen: false }))} parentData={parentData} />
         </Dialog>

         <Drawer
            open={action.isOpen}
            onOpenChange={(event) => setAction((prev) => ({ ...prev, isOpen: event }))}
            title="Дэд бүлэг"
            content={
               <SectionAction
                  sectionList={data?.data?.sort((a, b) => a.sort_number - b.sort_number) ?? []}
                  variant_id={variant_id}
                  action={action}
                  setClose={() => setAction((prev) => ({ ...prev, isOpen: false }))}
               />
            }
            className={`py-10 pt-7 max-w-lg`}
         />
      </div>
   );
};

export default Section;

import { type TQuestion } from '@/pages/questions';
import { Label } from '@radix-ui/react-label';

// type TActionAdd<T> = {
//    isOpen: boolean;
//    type: TQuestion;
//    data?: T | undefined;
// };

const SelectRowAction = ({ action, setClose, variant_id, parentData }: { variant_id: string; parentData: TExam } & TActionProps<TActionQuestion>) => {
   const { typeid } = useParams();
   // const [actionAdd, setActionAdd] = useState<TActionAdd<AllTypesQuestionTypes>>({ isOpen: false, type: 'checkbox', data: {} as AllTypesQuestionTypes });
   const [isAddOpen, setIsAddOpen] = useState(false);
   const [, setSearch] = useSearchParams({});

   const { isPending, mutate } = useMutation({
      mutationFn: (questionId: TActionQuestion['question_id']) =>
         request<Pick<TActionQuestion, 'question_id' | 'section_id'>>({
            method: 'post',
            url: `exam/add/question`,
            offAlert: true,
            body: {
               question_id: questionId,
               section_id: action?.data?.section_id ?? undefined,
            },
         }),
   });

   const { isPending: deletePending, mutate: deleteMutate } = UseDeleteMutate();

   const finalSubmit = (row: RowSelectionState) => {
      const finalFunc = (fake?: boolean) => {
         if (fake) {
            toast.info(`Өөрчлөлт орсонгүй`);
         } else {
            toast.success('Хүсэлт амжилттай');
         }
         UseReFetch({ queryKey: 'exam/section', queryId: variant_id });
         UseReFetch({ queryKey: 'exam', queryId: typeid });
         setClose?.({});
      };

      const temparr: { id: string; type: 'add' | 'delete'; sort_number?: number }[] = [];

      action?.data?.questions.forEach((item) => {
         const foundRow = Object.keys(row)?.find((element) => element === item.id);
         if (!foundRow) {
            temparr.push({ id: item.id, type: 'delete' });
         }
      });

      // const restTotal = action?.data?.questions?.length??0 - temparr.length

      Object.keys(row)?.forEach((item) => {
         const found = action?.data?.questions?.find((element) => element.id === item);
         if (!found) {
            temparr.push({ id: item, type: 'add' });
         }
      });

      if (temparr.length > 0) {
         temparr.forEach((item, index) => {
            if (item.type === 'add') {
               mutate(item.id, { onSuccess: () => (temparr.length === index + 1 ? finalFunc() : null) });
            } else {
               deleteMutate({ questionId: item.id, section_id: action?.data?.section_id ?? '' }, { onSuccess: () => (temparr.length === index + 1 ? finalFunc() : null) });
            }
         });
         return;
      }

      finalFunc(true);
   };

   const rowAction = (item: TQuestion) => {
      setSearch({ type: item, category_id: parentData?.category_id, sub_category_id: parentData?.sub_category_id });
      setIsAddOpen(true);
   };

   return (
      <Questions
         breadcrumbs={[]}
         parentData={parentData}
         // variant_id={variant_id}
         fromAction={(row, refetch) => {
            return (
               <div className="sticky z-20 top-0 left-0 bg-card-bg flex justify-between items-center mb-3 py-2">
                  <div className="text-muted-text">
                     Нийт сонгогдсон асуултын тоо: <span className="text-primary font-semibold">{Object.keys(row)?.length}</span>
                  </div>

                  <div className="flex gap-3">
                     <SelectQuestionType rowAction={rowAction}>
                        <Button className="rounded-full" variant="outline">
                           <MdOutlineAdd className="text-base" /> Асуулт нэмэх
                        </Button>
                     </SelectQuestionType>

                     <Button isLoading={isPending || deletePending} onClick={() => finalSubmit(row)} className="rounded-full">
                        Сонгогдсон асуулт хадгалах
                     </Button>
                  </div>

                  <Dialog
                     title="Асуулт нэмэх"
                     className={`p-6 pt-0 w-[80dvw]`}
                     isOpen={isAddOpen}
                     onOpenChange={(e) => {
                        if (!e) {
                           setSearch({});
                        }
                        setIsAddOpen(e);
                     }}
                  >
                     <QuestionDetail
                        isFromExam={true}
                        setClose={() => {
                           refetch?.();
                           setIsAddOpen(false);
                           setSearch({});
                        }}
                     />
                  </Dialog>
               </div>
            );
         }}
         prevData={action?.data?.questions}
      />
   );
};

type TSectionAction = {
   variant_id?: string;
   sectionList: TExamSection[];
} & TActionProps<TExamSection>;

export const SectionAction = ({ setClose, action, variant_id, sectionList }: TSectionAction) => {
   const {
      control,
      handleSubmit,
      formState: { isDirty },
      reset,
   } = useForm<TExamSection>({ defaultValues: { name: '', description: '', color: '' } });

   useEffect(() => {
      if (action.type !== 'add') {
         reset(action.data);
         return;
      }
      reset({ name: '', description: '' });
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const { mutate, isPending } = useMutation({
      mutationFn: (body?: TExamSection) =>
         request<TExamSection>({
            method: ATypes[action.type]?.apiMethod,
            url: `exam/section/${action.type === 'add' ? variant_id : action.data?.id}`,
            body: body,
         }),
      onSuccess: () => {
         UseReFetch({ queryKey: 'exam/section', queryId: variant_id });
         setClose?.({});
      },
      // onSettled:()=> setClose?.({})
   });

   // console.log(sectionList, '---.sectionList');

   const onSubmit = (data: TExamSection) => {
      mutate({ ...data, sort_number: action.type === 'add' ? sectionList.length : data.sort_number });
   };

   if (action.type === 'delete') {
      return <DeleteContent setClose={setClose} submitAction={() => mutate(undefined)} isLoading={isPending} className="pb-6" />;
   }

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <TextInput
            className="mb-5"
            floatLabel={false}
            autoFocus={true}
            placeholder={`Дэд бүлэгийн нэр`}
            label={`Дэд бүлэгийн нэр оруулах`}
            name="name"
            control={control}
            rules={{ required: `Дэд бүлэг оруулна уу` }}
         />

         <Textarea
            // floatLabel={current !== 'sub_category'}
            placeholder={`Дэд бүлэгийн тайлбар`}
            label={`Дэд бүлэгийн тайлбар оруулах`}
            name="description"
            className="mb-2"
            control={control}
            rules={{ required: false }}
         />

         <Controller
            control={control}
            name="color"
            rules={{ required: false }}
            render={({ field }) => {
               return (
                  <>
                     <Label>Өнгө сонгох</Label>
                     <div className="flex items-center gap-3">
                        <input className=" h-8 w-8" value={field.value} onChange={(e) => field.onChange(e.target.value)} type="color" />
                        <div>{field.value}</div>
                     </div>
                  </>
               );
            }}
         />

         <div className="flex justify-end w-full pt-10">
            <Button isLoading={isPending} type="submit" disabled={!isDirty}>
               Хадгалах
            </Button>
         </div>
      </form>
   );
};
