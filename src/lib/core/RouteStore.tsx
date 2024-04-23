import { Dashboard, Users, Plan, Group, Report } from '@/assets/svg';
import Groups from '@/pages/groups';
import { TBreadCrumb } from '@/components/custom/BreadCrumb';

type TRouteStore = {
   to: string;
   icon?: JSX.Element;
   label: string;
   component?: ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => JSX.Element;
};

// type TRouteOmit = Omit<TRouteStore, 'subMenu'>[] & { subMenu?: TRouteStore[] };
export type TRouteOmit = TRouteStore & { subMenu?: TRouteStore[] };

const RouteStore: TRouteOmit[] = [
   {
      label: 'Хянах самбар',
      to: '/',
      icon: <Dashboard className="menu-svg" />,
   },
   {
      to: '/groups',
      icon: <Group className="menu-svg" />,
      label: 'Бүлэг',
      subMenu: [
         { to: '', label: 'Бүлэг', component: Groups },
         { to: 'group123', label: 'Бүлэг222222', component: Groups },
      ],
   },
   { to: '/exams', icon: <Plan className="menu-svg" />, label: 'Шалгалт' },
   { to: '/report', icon: <Report className="menu-svg" />, label: 'Тайлан' },
   { to: '/users', icon: <Users className="menu-svg" />, label: 'Хэрэглэгчид' },

   // subMenu: [
   //    { name: 'Веб сайт', path: '', Component: WebMainAction },
   //    { name: 'Хуудас удирдах', path: 'webpages', Component: Pages },
   //    // { name: 'Мэдэгдэл илгээх', path: 'inapp', Component: InApp },
   //    { name: 'Хэрэглэгчид', path: 'storeuser', Component: StoreUser },
   //    // { name: 'Web Builder', push: true, path: '_playground', pushLink: `https://www.builder.siro.mn` },
   // ],
];

export default RouteStore;
