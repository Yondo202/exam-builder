import { Users, Plan, Leaderboard, Group, Document, Factcheck } from '@/assets/svg';
import Groups from '@/pages/groups';
import Questions from '@/pages/questions';
import Exams from '@/pages/exams';
import ExamAction from '@/pages/exams/Action';
import QuestionAction from '@/pages/questions/Action';
import { TBreadCrumb } from '@/components/custom/BreadCrumb';

type TRouteStore = {
   to: string;
   icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
   label: string;
   isHide?: boolean;
   component?: ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => JSX.Element;
};

export type TRouteOmit = TRouteStore & { subMenu?: Omit<TRouteStore, 'icon'>[] };

const RouteStore: TRouteOmit[] = [
   {
      label: 'Хянах самбар',
      to: '/',
      icon: Leaderboard,
   },
   {
      to: '/groups',
      icon: Group,
      label: 'Бүлэг',
      component: Groups,
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
         { to: 'tocheck', label: 'Засах шалгалтууд', component: Groups },
         // { to: 'result', label: 'Засах шалгалтууд', component: Groups },
      ],
   },
   { to: '/report', icon: Document, label: 'Тайлан' },
   {
      to: '/users',
      icon: Users,
      label: 'Хэрэглэгч',
      subMenu: [
         { to: '', label: 'Хэрэглэгчид', component: Groups },
         { to: 'company', label: 'Компани', component: Groups },
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
