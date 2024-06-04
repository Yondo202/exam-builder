import React, { ReactNode } from 'react';
import { Users, Plan, Group, Factcheck, Document } from '@/assets/svg'; //Document //Leaderboard
import Category from '@/pages/category';
import Questions from '@/pages/questions';
import UsersList from '@/pages/users';
import Exams from '@/pages/exams';
import ExamAction from '@/pages/exams/Action';
import ActiveExams from '@/pages/exams/exam_events/ActiveExams';
import ExamResults from '@/pages/exams/exam_events/ExamResults';
import QuestionAction from '@/pages/questions/Action';
import Company from '@/pages/company';
import RolesList from '@/pages/roles';
import Profile from '@/pages/auth/Profile';
import Candidate from '@/pages/candidate';
import { type TBreadCrumb } from '@/components/custom/BreadCrumb';
import { type TUserRoles, type TRolesAssetType } from '@/lib/sharedTypes';
// const Category = React.lazy(() => import('@/pages/category'));
// const Questions = React.lazy(() => import('@/pages/questions'));
// const Exams = React.lazy(() => import('@/pages/exams'));
// const ExamAction = React.lazy(() => import('@/pages/exams/Action'));
// const QuestionAction = React.lazy(() => import('@/pages/questions/Action'));
// loading tai ni hiihgui bol aldaa garna

export type TRouteStore = {
   to: string;
   icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
   label: string;
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

   { to: 'exams', icon: Document, label: 'Шалгалтууд', component: Exams, visibleType: ['company_admin'] },
   { to: '/exams/:typeid', label: 'Шалгалтууд', component: ExamAction, isHide: true, visibleType: ['company_admin'] },

   {
      to: '/handle',
      icon: Plan,
      label: 'Шалгалт удирдлага',
      visibleType: ['inspector'],
      subMenu: [
         { to: '', label: 'Засах шалгалтууд', component: ActiveExams, visibleType: ['inspector'] },
         { to: 'examresults', label: 'Шалгалтын үр дүн', component: ExamResults, visibleType: ['inspector'] },
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
   {
      to: 'profile', //groups
      label: 'Өөрийн мэдээлэл',
      isHide: true,
      visibleType: ['company_admin', 'inspector'],
      component: Profile,
   },

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
      // return <Candidate />;
      return [
         {
            to: '/',
            icon: Group,
            label: 'Оролцогч',
            component: Candidate,
            subMenu: [],
         },
      ];
   }

   if (roles?.some((item) => item.role === 'super_admin')) {
      return RouteStore;
   }

   if (roles?.some((item) => item.role === 'inspector') && !roles?.some((item) => item.role === 'company_admin')) {
      return [
         {
            to: '/',
            icon: Plan,
            label: 'Засах шалгалтууд',
            component: ActiveExams,
            subMenu: [],
         },
         { icon: Document, to: 'examresults', label: 'Шалгалтын үр дүн', component: ExamResults, subMenu: [] },
      ];
   }

   // company admin deer - exam erh ogj baigaag shalgah
   /// ene function baga zereg static baidaltai baigaa - zowhon - compnay admin ymuu ( inspector && company_admin - 2 uulaa baih ued bolomjtoi )
   return RouteStore.filter((item) => filterMenu(item, roles))
      ?.map((item) => ({ ...item, subMenu: item?.subMenu?.filter((sub) => filterMenu(sub, roles)) }))
      ?.map((item, index) => ({
         ...item,
         to: index === 0 ? `/` : item.to === '/exams/:typeid' ? `/:typeid` : item.to,
         subMenu: item.subMenu?.map((el, ind) => ({ ...el, to: ind === 0 ? `` : el.to })),
      }));
};

export default RouteStore;
