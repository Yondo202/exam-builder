import { useEffect, useState } from 'react';
import { Drawer, TextInput, Button, Textarea, DeleteContent, Dialog } from '@/components/custom'; //
import { type TAction, type TActionProps, type FinalRespnse, ATypes } from '@/lib/sharedTypes'; // , type FinalRespnse
import { useForm } from 'react-hook-form';
import { MdOutlineAdd } from 'react-icons/md';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UseReFetch, request } from '@/lib/core/request';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { type TExamSection } from '..'; // type TVariant,
import { Empty } from '@/assets/svg';
import { type RowSelectionState } from '@tanstack/react-table';
import ActionButtons from '@/components/ActionButtons';
import { toast } from 'sonner';

import Questions from '@/pages/questions';

type TVairantTabs = {
   exam_id?: string;
   variant_id: string;
   //   sections?: TExamSection[];
   //    variantId: string;
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

const Section = ({ variant_id }: TVairantTabs) => {
   // const [current, setCurrent] = useState('');
   const [action, setAction] = useState<TAction<TExamSection>>({ isOpen: false, type: 'add', data: {} as TExamSection });

   const [actionQuestion, setActionQuestion] = useState<TAction<TActionQuestion>>({ isOpen: false, type: 'add', data: {} as TActionQuestion });

   const { data } = useQuery({
      enabled: !!variant_id,
      queryKey: ['exam/section', variant_id],
      queryFn: () =>
         request<FinalRespnse<TExamSection[]>>({
            url: `exam/list/section/${variant_id}`,
         }),
   });

   // const { data: dataOne } = useQuery({
   //    enabled: !!variant_id,
   //    queryKey: ['exam/section/id', `48cf75ea-780e-47d7-8559-23bf457a9e68`],
   //    queryFn: () =>
   //       request<FinalRespnse<TExamSection>>({
   //          url: `exam/section/48cf75ea-780e-47d7-8559-23bf457a9e68`,
   //       }),
   // });

   return (
      <div className="wrapper py-5">
         <div className="px-6 pb-5 mb-4 text-muted-text font-medium text-sm flex gap-3 justify-between ">
            Асуумжын жагсаалт
            <Button onClick={() => setAction({ type: 'add', isOpen: true })} size="sm" className="rounded-full" type="button">
               <MdOutlineAdd className="text-base" />
               Дэд гарчиг нэмэх
            </Button>
         </div>
         {(data?.data?.length ?? 0) > 0 ? (
            <Accordion type="multiple" className="px-6">
               {data?.data
                  ?.sort((a, b) => a.sort_number - b.sort_number)
                  .map((item, index) => {
                     return (
                        <AccordionItem key={index} value={item.id} className="border rounded-md bg-primary/10 mb-4 pr-1.5">
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
                                    Нийт асуултын тоо: <span className="text-text font-medium">{item.questions.length}</span>
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

                           <AccordionContent className="p-3">
                              <div className="pb-2 mb-2 text-primary/70 text-xs border-border border-b font-medium">Асуултууд</div>
                              {item.questions.length > 0 ? (
                                 item.questions.map((element, ind) => {
                                    return (
                                       <div className="bg-card-bg mb-3 p-3 py-2 rounded-md shadow-sm" key={ind}>
                                          {element.question}
                                       </div>
                                    );
                                 })
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
               <h3 className="text-muted-text/40">Мэдээлэл байхгүй байна</h3>
            </div>
         )}

         <Dialog
            isOpen={actionQuestion.isOpen}
            onOpenChange={(event) => setActionQuestion((prev) => ({ ...prev, isOpen: event }))}
            title="Асуултын жагсаалт"
            className={`p-6 pt-0 w-[80dvw]`}
         >
            <SelectRowAction variant_id={variant_id} action={actionQuestion} setClose={() => setActionQuestion((prev) => ({ ...prev, isOpen: false }))} />
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

const SelectRowAction = ({ action, setClose, variant_id }: { variant_id: string } & TActionProps<TActionQuestion>) => {
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

   const { isPending: deletePending, mutate: deleteMutate } = useMutation({
      mutationFn: (questionId: TActionQuestion['question_id']) =>
         request<Pick<TActionQuestion, 'question_id' | 'section_id'>>({
            method: 'delete',
            url: `exam/remove/question`,
            offAlert: true,
            body: {
               //sort number nem
               question_id: questionId,
               section_id: action?.data?.section_id ?? undefined,
            },
         }),
   });

   const finalSubmit = (row: RowSelectionState) => {

      const finalFunc = () => {
         toast.success('Хүсэлт амжилттай');
         UseReFetch({ queryKey: 'exam/section', queryId: variant_id });
         setClose?.({});
      };

      const temparr: { id: string; type: 'add' | 'delete', sort_number?:number }[] = [];

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

      temparr.forEach((item, index) => {
         if (item.type === 'add') {
            mutate(item.id, { onSuccess: () => (temparr.length === index + 1 ? finalFunc() : null) });
         } else {
            deleteMutate(item.id, { onSuccess: () => (temparr.length === index + 1 ? finalFunc() : null) });
         }
      });
   };

   return (
      <Questions
         breadcrumbs={[]}
         fromAction={(row) => {
            return (
               <div className="sticky z-20 top-0 left-0 bg-card-bg flex justify-between items-center mb-2 py-2">
                  <div className="text-muted-text">
                     Нийт сонгогдсон асуултын тоо: <span className="text-primary font-semibold">{Object.keys(row)?.length}</span>
                  </div>
                  <Button isLoading={isPending || deletePending} onClick={() => finalSubmit(row)} className="rounded-full">
                     Сонгогдсон асуулт хадгалах
                  </Button>
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
   } = useForm<TExamSection>({ defaultValues: { name: '', description: '' } });

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
            control={control}
            rules={{ required: false }}
         />

         <div className="flex justify-end w-full pt-10">
            <Button isLoading={isPending} type="submit" disabled={!isDirty}>
               Хадгалах
            </Button>
         </div>
      </form>
   );
};
