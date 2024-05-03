// import { useQuery } from '@tanstack/react-query';
// import { request } from '@/lib/core/request';
import { BreadCrumb } from '@/components/custom';
import { useSearchParams } from 'react-router-dom';
import { TBreadCrumb } from '@/components/custom/BreadCrumb';
// import { useForm } from 'react-hook-form';
import { WithSelect, OpenQuestion, WithMedia, WithAdditional } from './QuestionTypes';
import { TQuestion } from '.';
// import { BsSave } from 'react-icons/bs';

// eslint-disable-next-line react-refresh/only-export-components

// [ multi_select, select, text, drag_drop, multi_drag_drop ] - essay hassan

export type TQTypes = 'withSelect' | 'openQuestion' | 'withMedia' | 'withAdditional';

type TObjectPettern = {
   label: string;
   component: ({ title, type }: { title: string; type: TQuestion }) => JSX.Element;
   type: TQuestion;
};

type TQuestionTypesInFront = { [Key in TQTypes]: TObjectPettern };

export const questionAsset: TQuestionTypesInFront = {
   withSelect: {
      label: 'Сонголттой асуулт',
      component: WithSelect,
      type: 'checkbox',
   },
   openQuestion: {
      label: 'Нээлттэй асуулт',
      component: OpenQuestion,
      type: 'text',
   },
   withMedia: {
      label: 'Дүрс зурагтай асуулт',
      component: WithMedia,
      type: 'text',
   },
   withAdditional: {
      label: 'Нэмэлт даалгавартай асуулт',
      component: WithAdditional,
      type: 'checkbox',
   },
};

// export type TQTypes = keyof typeof qTypes;

const GroupAction = ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => {
   const [search] = useSearchParams({});
   const searchAsObject = Object.fromEntries(new URLSearchParams(search));
   const Component = questionAsset[searchAsObject.type as TQTypes]?.component;

   return (
      <>
         <BreadCrumb pathList={[...breadcrumbs.map((item) => ({ ...item, isActive: false })), { to: '#', label: 'Тестийн сан үүсгэх', isActive: true }]} />
         <Component title={questionAsset[searchAsObject.type as TQTypes]?.label} type={questionAsset[searchAsObject.type as TQTypes]?.type} />
      </>
   );
};

export default GroupAction;
