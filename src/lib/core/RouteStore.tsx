import React, { ReactNode } from 'react';
import { Users, Plan, Group, Factcheck } from '@/assets/svg'; //Document //Leaderboard
// import Category from '@/pages/category';
// import Questions from '@/pages/questions';
// import Exams from '@/pages/exams';
// import ExamAction from '@/pages/exams/Action';
// import QuestionAction from '@/pages/questions/Action';
import { TBreadCrumb } from '@/components/custom/BreadCrumb';
const Category = React.lazy(() => import('@/pages/category'));
const Questions = React.lazy(() => import('@/pages/questions'));
const Exams = React.lazy(() => import('@/pages/exams'));
const ExamAction = React.lazy(() => import('@/pages/exams/Action'));
const QuestionAction = React.lazy(() => import('@/pages/questions/Action'));

type TRouteStore = {
   to: string;
   icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
   label: string;
   isHide?: boolean;
   component?: ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => ReactNode;
};

export type TRouteOmit = TRouteStore & { subMenu?: Omit<TRouteStore, 'icon'>[] };
// JSX.Element
const RouteStore: TRouteOmit[] = [
   // {
   //    label: 'Хянах самбар',
   //    to: '/',
   //    icon: Leaderboard,
   // },
   {
      to: '/', //groups
      icon: Group,
      label: 'Ангилал',
      component: Category,
   },
   { to: '/questions', icon: Factcheck, label: 'Асуултын сан', component: Questions },
   { to: '/questions/:typeid', label: 'Асуултын сан', component: QuestionAction, isHide: true },
   {
      to: '/exams',
      icon: Plan,
      label: 'Шалгалт',
      subMenu: [
         { to: '', label: 'Шалгалтууд', component: Exams },
         { to: '/exams/:typeid', label: 'Шалгалтууд', component: ExamAction, isHide: true },
         { to: 'tocheck', label: 'Засах шалгалтууд', component: Category },
         // { to: 'result', label: 'Засах шалгалтууд', component: Groups },
      ],
   },
   // { to: '/report', icon: Document, label: 'Тайлан' },
   {
      to: '/users',
      icon: Users,
      label: 'Хэрэглэгч',
      subMenu: [
         { to: '', label: 'Хэрэглэгчид', component: Category },
         { to: 'company', label: 'Компани', component: Category },
      ],
   },

   // {
   //    to: '/groups',
   //    icon: Group,
   //    label: 'Бүлэг',
   // subMenu: [
   //    { to: '', label: 'Шалгалтууд', component: Groups },
   //    { to: 'group123', label: 'Бүлэгийн жагсаалт', component: Groups },
   // ],
   // },
];

export default RouteStore;
