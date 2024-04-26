// import { useQuery } from '@tanstack/react-query';
// import { request } from '@/lib/core/request';
import { BreadCrumb, Header, TextInput } from '@/components/custom';
import { useSearchParams } from 'react-router-dom';
import { TBreadCrumb } from '@/components/custom/BreadCrumb';
import { useForm } from 'react-hook-form';
import { WithSelect, OpenQuestion, WithMedia, WithAdditional } from './QuestionTypes';
// eslint-disable-next-line react-refresh/only-export-components
export const qTypes = {
   withSelect: {
      label: 'Сонголттой асуулт',
      component: WithSelect,
   },
   openQuestion: {
      label: 'Нээлттэй асуулт',
      component: OpenQuestion,
   },
   withMedia: {
      label: 'Дүрс зурагтай асуулт',
      component: WithMedia,
   },
   Essay: {
      label: 'Эссэ',
      component: OpenQuestion,
   },
   withAdditional: {
      label: 'Нэмэлт даалгавартай асуулт',
      component: WithAdditional,
   },
};

export type TQTypes = keyof typeof qTypes;

const GroupAction = ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => {
   const { control } = useForm({ defaultValues: { group: '', sub_group: '', question: '', score: '' } });
   const [search] = useSearchParams({});
   const searchAsObject = Object.fromEntries(new URLSearchParams(search));
   const Component = qTypes[searchAsObject.type as TQTypes]?.component;

   return (
      <div>
         <BreadCrumb pathList={[...breadcrumbs.map((item) => ({ ...item, isActive: false })), { to: '#', label: 'Тестийн сан үүсгэх', isActive: true }]} />
         <Header title={qTypes[searchAsObject.type as TQTypes]?.label} />
         <div className="wrapper py-6">
            <div className="border-b px-5 pb-6 mb-5">
               <div className="mb-5 text-muted-text font-medium">Асуултанд хамаарах үндсэн бүлэгүүд</div>
               <div className="flex gap-5">
                  <TextInput className="w-72" name="group" control={control} label="Бүлэг" />
                  <TextInput className="w-72" name="group" control={control} label="Дэд бүлэг" />
               </div>
            </div>
            <div className="px-5">
               <Component />
            </div>
            {/* <div className="px-5">
               <div className="mb-5 text-secondary/70 flex items-center justify-between">
                  Шалгалтын асуумж <Badge variant="secondary">{qTypes[searchAsObject.type as TQTypes]?.label}</Badge>
               </div>
            </div> */}
         </div>
      </div>
   );
};

export default GroupAction;
