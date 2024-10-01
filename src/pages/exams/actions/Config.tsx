import ConfigAction from '@/pages/exams/ConfigAction';
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { finalRenderDate } from '@/lib/utils';
import { type TAction, type FinalRespnse } from '@/lib/sharedTypes';
import { BsPencil } from 'react-icons/bs';
import { type TExam } from '..';
import { Button, Drawer, Skeleton } from '@/components/custom';
import { useGetCategories } from '@/pages/category';
import { UseReFetch } from '@/lib/core/request';

const Config = ({ data, isCompAdmin }: { data: FinalRespnse<TExam> | undefined; isCompAdmin?: boolean }) => {
   const [action, setAction] = useState<TAction<TExam>>({ isOpen: false, type: 'add', data: {} as TExam });

   const FoundCategoryInfo = ({ current, foundKey }: { current: 'main_category' | 'sub_category'; idKey?: string; foundKey?: string }) => {
      const { data, isLoading } = useGetCategories({ current });
      if (isLoading) return <Skeleton className="h-3 w-20" />;
      return data?.data?.find((item) => item.id === foundKey)?.name ?? '';
   };

   const afterSuccess = () => {
      setAction((prev) => ({ ...prev, isOpen: false }));
      UseReFetch({ queryKey: 'exam', queryId: data?.data?.id ?? undefined });
   };

   return (
      <>
         <Accordion type="multiple">
            <AccordionItem value="value-1" className="border rounded-lg bg-card-bg mb-3 px-6">
               <AccordionTrigger>Ерөнхий мэдээлэл</AccordionTrigger>
               <AccordionContent className="pt-5 pb-7 flex flex-col">
                  <div className="pb-6 grid grid-cols-4 items-center gap-7">
                     <div className="info_items col-span-2">
                        Шалгалтын нэр: <span className="text-text font-normal">{data?.data?.name}</span>
                     </div>
                     <div className="info_items">
                        Эхлэх: <span className="text-text">{finalRenderDate(data?.data?.active_start_at ?? '')}</span>
                     </div>
                     <div className="info_items">
                        Дуусах : <span className="text-text">{finalRenderDate(data?.data?.active_end_at ?? '')}</span>
                     </div>
                  </div>

                  <div className="pb-6 grid grid-cols-4 items-center gap-7">
                     <div className="info_items">
                        Тэнцэх боломжтой оноо:
                        <span className="text-primary">{data?.data?.pass_score ?? ''}</span>
                     </div>

                     <div className="info_items">
                        Үргэлжилэх хугацаа:
                        <span className="text-primary">{data?.data?.duration_min ?? ''} / мин</span>
                     </div>

                     <div className="info_items">
                        Ангилал:
                        <span className="text-primary">
                           <FoundCategoryInfo current="main_category" foundKey={data?.data?.category_id} />
                        </span>
                     </div>
                     <div className="info_items">
                        Дэд ангилал:{' '}
                        <span className="text-primary">
                           <FoundCategoryInfo current="sub_category" foundKey={data?.data?.sub_category_id} />
                        </span>
                     </div>
                  </div>
                  {!isCompAdmin && (
                     <Button onClick={() => setAction({ isOpen: true, type: 'edit', data: data?.data })} size="sm" variant="outline" className="rounded-full ml-auto">
                        <BsPencil className="text-sm" /> Ерөнхий мэдээлэл засах
                     </Button>
                  )}
               </AccordionContent>
            </AccordionItem>
         </Accordion>

         <Drawer
            open={action.isOpen}
            onOpenChange={(e) => setAction((prev) => ({ ...prev, isOpen: e }))}
            title="Шалгалтын тохиргоо"
            content={<ConfigAction action={action} afterSuccess={afterSuccess} />}
            className="py-2 max-w-4xl"
            titleClassName="pt-2 pb-3"
         />
      </>
   );
};

export default Config;
