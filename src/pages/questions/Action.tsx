// import { useQuery } from '@tanstack/react-query';
// import { request } from '@/lib/core/request';
import { BreadCrumb } from '@/components/custom';
import { useSearchParams } from 'react-router-dom';
import { TBreadCrumb } from '@/components/custom/BreadCrumb';
// import { useForm } from 'react-hook-form';
import { WithSelect, OpenQuestion, WithMedia, WithAdditional } from './QuestionTypes';
// import { BsSave } from 'react-icons/bs';

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
   // const { control } = useForm({ defaultValues: { group: '', sub_group: '', question: '', score: '' } });
   const [search] = useSearchParams({});
   const searchAsObject = Object.fromEntries(new URLSearchParams(search));
   const Component = qTypes[searchAsObject.type as TQTypes]?.component;

   return (
      <>
         <BreadCrumb pathList={[...breadcrumbs.map((item) => ({ ...item, isActive: false })), { to: '#', label: 'Тестийн сан үүсгэх', isActive: true }]} />
         <Component title={qTypes[searchAsObject.type as TQTypes]?.label} />
      </>
   );
};

export default GroupAction;
