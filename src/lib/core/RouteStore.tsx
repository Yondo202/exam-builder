import React, { ReactNode } from 'react';
import { Users, Plan, Group, Factcheck, Document } from '@/assets/svg'; //Document //Leaderboard
import Category from '@/pages/category';
import Questions from '@/pages/questions';
import QuestionAction from '@/pages/questions/Action';
import UsersList from '@/pages/users';
import Exams from '@/pages/exams';
import ExamAction from '@/pages/exams/Action';
import ActiveExams from '@/pages/exams/exam_events/active_exams';
import ExamMaterialList from '@/pages/exams/exam_events/active_exams/ExamMaterialList';
import ExamMaterialAction from '@/pages/exams/exam_events/active_exams/ExamMaterialAction';
// import ExamResults from '@/pages/exams/exam_events/ExamResults';
import Company from '@/pages/company';
import RolesList from '@/pages/roles';
// import Profile from '@/pages/auth/Profile';
import ExamsList from '@/pages/candidate/ExamsList';
// import HistoryOfExam from '@/pages/candidate/HistoryOfExam';
// import ExamsList from '@/pages/candidate/ExamsList';
import ExamStartAction from '@/pages/candidate/ExamStartAction';
import { type TBreadCrumb } from '@/components/custom/BreadCrumb';
import { type TUserRoles, type TRolesAssetType } from '@/lib/sharedTypes';
// import Dashboard from '@/pages/dashboard';

// const Category = React.lazy(() => import('@/pages/category'));
// const Questions = React.lazy(() => import('@/pages/questions'));
// const Exams = React.lazy(() => import('@/pages/exams'));
// const ExamAction = React.lazy(() => import('@/pages/exams/Action'));
// const QuestionAction = React.lazy(() => import('@/pages/questions/Action'));
// loading tai ni hiihgui bol aldaa garna

export type TRouteStore = {
   to: string;
   icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
   label?: string;
   isHide?: boolean;
   component?: ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => ReactNode;

   // user - iin role oos hamaarch baigaa heseg
   visibleType?: TUserRoles[];
   changedTo?: string;
};

export type TRouteOmit = TRouteStore & { subMenu?: Omit<TRouteStore, 'icon'>[] };

// JSX.Element
const RouteStore: TRouteOmit[] = [
   // {
   //    label: 'Хянах самбар',
   //    to: '/dashboard',
   //    icon: Leaderboard,
   //    component: Dashboard,
   // },
   {
      to: '/category', //groups
      icon: Group,
      label: 'Ангилал',
      component: Category,
   },
   { to: '/questions', icon: Factcheck, label: 'Асуултын сан', component: Questions },
   { to: '/questions/:typeid', label: 'Асуултын сан', component: QuestionAction, isHide: true },

   { to: 'exams', icon: Document, label: 'Шалгалтууд', component: Exams, visibleType: ['company_admin'] },
   { to: '/exams/:typeid', label: 'Шалгалтууд', component: ExamAction, isHide: true, visibleType: ['company_admin'] },

   {
      to: '/handle',
      icon: Plan,
      label: 'Шалгалт удирдлага',
      visibleType: ['inspector'],
      subMenu: [
         { to: '', label: 'Засах шалгалтууд', component: ActiveExams, visibleType: ['inspector'] },
         { to: '/handle/:examid', component: ExamMaterialList, visibleType: ['inspector'], isHide: true },
         { to: '/handle/:examid/:materialid', component: ExamMaterialAction, visibleType: ['inspector'], isHide: true },

         // tur haruulahiin tuld hiileee
         { to: 'examresults', label: 'Шалгалтын үр дүн', component: ActiveExams, visibleType: ['inspector'] },
         { to: 'examresults/:examid', component: ExamMaterialList, visibleType: ['inspector'], isHide: true },
         { to: 'examresults/:examid/:materialid', component: ExamMaterialAction, visibleType: ['inspector'], isHide: true },
         // { to: 'tocheck', label: 'Засах шалгалтууд', component: Category },
         // { to: 'result', label: 'Засах шалгалтууд', component: Groups },
      ],
   },
   {
      to: '/users',
      icon: Users,
      label: 'Хэрэглэгч',
      visibleType: ['company_admin'],
      subMenu: [
         { to: '', label: 'Хэрэглэгчид', component: UsersList, visibleType: ['company_admin'] },
         { to: 'company', label: 'Компани', component: Company },
         { to: 'roles', label: 'Хэрэглэгчийн эрх', component: RolesList },
      ],
   },

   // {
   //    to: 'profile', //groups
   //    label: 'Өөрийн мэдээлэл',
   //    isHide: true,
   //    visibleType: ['company_admin', 'inspector'],
   //    component: Profile,
   // },

   // { to: '/report', icon: Document, label: 'Тайлан' },

   // {
   //    to: '/', //groups
   //    icon: Group,
   //    label: 'Candidate',
   //    component: Category,
   // },

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

const filterMenu = (item: TRouteStore, roles?: TRolesAssetType[]) => {
   return !!item?.visibleType?.find((element) => roles?.some((el) => el.role === element));
};

export const FilteredRoute = (roles?: TRolesAssetType[]): TRouteOmit[] => {
   if (roles?.some((item) => item.role === 'candidate')) {
      return [
         {
            to: '/',
            component: ExamsList,
         },
         {
            to: '/:inviteid',
            component: ExamStartAction,
         },
         // {
         //    to: '/history',
         //    component: HistoryOfExam,
         // },
      ];
   }

   if (roles?.some((item) => item.role === 'super_admin')) {
      return RouteStore;
   }

   // end zowhon comp admin bolon inspector iig shalgaj baigaa
   return RouteStore.filter((item) => filterMenu(item, roles))?.map((item) => ({ ...item, subMenu: item?.subMenu?.filter((sub) => filterMenu(sub, roles)) }));
};

export default RouteStore;
