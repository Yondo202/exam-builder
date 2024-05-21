import { BreadCrumb, Button, Header, Skeleton, Drawer } from '@/components/custom';
import { useState } from 'react';
import { TBreadCrumb } from '@/components/custom/BreadCrumb';
import { MdOutlineAdd } from 'react-icons/md';
import { CiSaveUp1 } from 'react-icons/ci';
import { BsPencil } from 'react-icons/bs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useQuery } from '@tanstack/react-query';
import { TExam } from '.';
import ConfigAction from '@/pages/exams/ConfigAction';
import { type FinalRespnse, type TAction } from '@/lib/sharedTypes';
import { useParams } from 'react-router-dom';
import { request } from '@/lib/core/request';
import { finalRenderDate } from '@/lib/utils';
import { useGetCategories } from '../category/index';

const FoundCategoryInfo = ({ current, foundKey }: { current: 'main_category' | 'sub_category'; idKey?: string; foundKey?: string }) => {
   const { data, isLoading } = useGetCategories({ current });
   if (isLoading) return <Skeleton className="h-3 w-20" />;
   return data?.data?.find((item) => item.id === foundKey)?.name ?? '';
};

const ExamAction = ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => {
   const [action, setAction] = useState<TAction<TExam>>({ isOpen: false, type: 'add', data: {} as TExam });
   const { typeid } = useParams();
   const { data, refetch } = useQuery({
      queryKey: ['exam', typeid],
      queryFn: () =>
         request<FinalRespnse<TExam>>({
            url: `exam/id/${typeid}`,
         }),
   });

   //  const { control } = useForm({ defaultValues: { group: '', sub_group: '', question: '', score: '' } });
   //  const [search] = useSearchParams({});
   //  const searchAsObject = Object.fromEntries(new URLSearchParams(search));

   const afterSuccess = () => {
      setAction((prev) => ({ ...prev, isOpen: false }));
      refetch();
   };

   return (
      <>
         <BreadCrumb pathList={[...breadcrumbs.map((item) => ({ ...item, isActive: false })), { to: '#', label: data?.data?.name ?? '', isActive: true }]} />
         <Header title="Шалгалтын материал" />
         <Accordion type="multiple">
            <AccordionItem value="value-1" className="border rounded-lg bg-card-bg mb-3 px-6">
               <AccordionTrigger>Ерөнхий мэдээлэл</AccordionTrigger>
               <AccordionContent className="pt-5 pb-7 flex flex-col">
                  <div className="pb-6 flex items-center gap-12">
                     <div className="info_items">
                        Шалгалтын нэр: <span className="text-text font-normal">{data?.data?.name}</span>
                     </div>
                     <div className="info_items">
                        Эхлэх огноо: <span className="text-text">{finalRenderDate(data?.data?.active_start_at ?? '')}</span>
                     </div>
                     <div className="info_items">
                        Дуусах огноо: <span className="text-text">{finalRenderDate(data?.data?.active_end_at ?? '')}</span>
                     </div>
                  </div>
                  <div className="pb-6 flex items-center gap-7">
                     <div className="info_items">
                        Ангилал:{' '}
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
                  <Button onClick={() => setAction({ isOpen: true, type: 'edit', data: data?.data })} size="sm" variant="outline" className="rounded-full ml-auto">
                     <BsPencil className="text-sm" /> Ерөнхий мэдээлэл засах
                  </Button>
               </AccordionContent>
            </AccordionItem>
         </Accordion>

         <div className="wrapper py-5">
            <div className="px-6 pb-5 mb-4 text-muted-text font-medium text-sm flex gap-3 justify-between ">
               Асуумжын жагсаалт
               <Button size="sm" variant="outline" className="rounded-full">
                  <MdOutlineAdd className="text-base" />
                  Асуумж нэмэх
               </Button>
            </div>

            <Accordion type="multiple" className="px-6">
               <AccordionItem value="item-1" className="border rounded-lg bg-primary/10 mb-3">
                  <AccordionTrigger>Is it accessible?</AccordionTrigger>
                  <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
               </AccordionItem>
               <AccordionItem value="item-2" className="border rounded-lg bg-primary/10">
                  <AccordionTrigger>Is it accessible?</AccordionTrigger>
                  <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
               </AccordionItem>
            </Accordion>

            <div className="flex justify-end p-6 pt-8 pb-0">
               <Button className="rounded-full">
                  <CiSaveUp1 className="text-base" />
                  Хадгалах
               </Button>
            </div>
         </div>

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

export default ExamAction;
