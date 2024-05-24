import { BreadCrumb, Header, TabsContent } from '@/components/custom';
import { TBreadCrumb } from '@/components/custom/BreadCrumb';
// import { Drawer, TextInput, Button, Textarea, TabsList, Tabs, TabsContent } from '@/components/custom'; //
// import { CiSaveUp1 } from 'react-icons/ci';
import { useQuery } from '@tanstack/react-query';
import { type TExam } from '.';
import { type FinalRespnse } from '@/lib/sharedTypes';
import { useParams } from 'react-router-dom';
import { request } from '@/lib/core/request';

import Config from './actions/Config';
import Variants from './actions/Variants';
import Section from './actions/Section';
import { useEffect, useState } from 'react';

const ExamAction = ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => {
   const { typeid } = useParams();
   const [variantId, setVariantId] = useState('');
   const { data, isFetchedAfterMount, isRefetching } = useQuery({
      queryKey: ['exam', typeid],
      queryFn: () =>
         request<FinalRespnse<TExam>>({
            url: `exam/id/${typeid}`,
         }),
   });

   useEffect(() => {
      if (data?.data?.variants?.length ?? 0 > 0) {
         setVariantId(data?.data?.variants?.[0]?.id ?? '');
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isFetchedAfterMount, isRefetching]);

   //  const { control } = useForm({ defaultValues: { group: '', sub_group: '', question: '', score: '' } });
   //  const [search] = useSearchParams({});
   //  const searchAsObject = Object.fromEntries(new URLSearchParams(search));

   // console.log(variants, '--------->variants');

   return (
      <>
         <BreadCrumb pathList={[...breadcrumbs.map((item) => ({ ...item, isActive: false })), { to: '#', label: data?.data?.name ?? '', isActive: true }]} />
         <Header title="Шалгалтын материал" />

         <Config data={data} />

         <Variants variantId={variantId} setVariantId={setVariantId} exam_id={data?.data?.id} variants={data?.data?.variants ?? []}>
            {data?.data?.variants?.map((item, index) => {
               return (
                  <TabsContent key={index} value={item.id}>
                     <Section variant_id={variantId} />
                     {/* <div className="flex justify-end p-6 pt-8 pb-0">
                           <Button className="rounded-full">
                              <CiSaveUp1 className="text-base" />
                              Хадгалах
                           </Button>
                        </div> */}
                  </TabsContent>
               );
            })}
         </Variants>
      </>
   );
};

export default ExamAction;
