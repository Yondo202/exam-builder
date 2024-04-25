// import { useQuery } from '@tanstack/react-query';
// import { request } from '@/lib/core/request';
import { BreadCrumb, Header, TextInput, Badge, Textarea } from '@/components/custom';
import { useSearchParams } from 'react-router-dom';
import { TBreadCrumb } from '@/components/custom/BreadCrumb';
import { useForm } from 'react-hook-form';

// eslint-disable-next-line react-refresh/only-export-components
export const qTypes = {
   withSelect: {
      label: 'Сонголттой асуулт',
   },
   openQuestion: {
      label: 'Нээлттэй асуулт',
   },
   withMedia: {
      label: 'Дүрс зурагтай асуулт',
   },
   Essay: {
      label: 'Эссэ',
   },
   withAdditional: {
      label: 'Нэмэлт даалгавартай асуулт',
   },
};

export type TQTypes = keyof typeof qTypes;

const GroupAction = ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => {
   const { control } = useForm({ defaultValues: { group: '', sub_group: '', question: '', score: '' } });
   const [search] = useSearchParams({});
   const searchAsObject = Object.fromEntries(new URLSearchParams(search));

   return (
      <div>
         <BreadCrumb pathList={[...breadcrumbs.map((item) => ({ ...item, isActive: false })), { to: '#', label: qTypes[searchAsObject.type as TQTypes]?.label, isActive: true }]} />
         <Header title="Тестийн сан үүсгэх" />
         <div className="wrapper py-6">
            <div className="border-b px-5 pb-6 mb-5">
               <div className="mb-5 text-muted-text font-medium">Шалгалтын ерөнхий мэдээлэл</div>
               <div className="flex gap-5">
                  <TextInput className="w-72" name="group" control={control} label="Бүлэг" />
                  <TextInput className="w-72" name="group" control={control} label="Дэд бүлэг" />
               </div>
            </div>
            <div className="px-5">
               <div className="mb-5 text-secondary/70 flex items-center justify-between">
                  Шалгалтын асуумж <Badge variant="secondary">{qTypes[searchAsObject.type as TQTypes]?.label}</Badge>
               </div>
               <TextInput floatLabel={false} className="w-72 mb-5" name="score" control={control} label="Асуултын оноо" placeholder="Оноо оруулах" />
               <Textarea className="w-full min-h-[100px]" name="question" control={control} label="Асуултын оруулах" placeholder="Асуултаа дэлгэрэнгүй оруулах" />

               <div className="py-5 text-secondary/70">Хариулт</div>
            </div>
         </div>
      </div>
   );
};

export default GroupAction;
