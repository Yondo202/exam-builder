import { Dashboard, Users, Plan, Group, Report } from '@/assets/svg';
import Groups from '@/pages/groups';
import { TBreadCrumb } from '@/components/custom/BreadCrumb';

type TRouteStore = {
   to: string;
   icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
   label: string;
   component?: ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => JSX.Element;
};

// type TRouteOmit = Omit<TRouteStore, 'subMenu'>[] & { subMenu?: TRouteStore[] };
export type TRouteOmit = TRouteStore & { subMenu?: Omit<TRouteStore, 'icon'>[] };

const RouteStore: TRouteOmit[] = [
   {
      label: 'Хянах самбар',
      to: '/',
      icon: Dashboard,
   },
   {
      to: '/groups',
      icon: Group,
      label: 'Бүлэг',
      subMenu: [
         { to: '', label: 'Шалгалтууд', component: Groups },
         { to: 'group123', label: 'Бүлэгийн жагсаалт', component: Groups },
      ],
   },
   { to: '/exams', icon: Plan, label: 'Шалгалт' },
   { to: '/report', icon: Report, label: 'Тайлан' },
   { to: '/users', icon: Users, label: 'Хэрэглэгчид' },

   // subMenu: [
   //    { name: 'Веб сайт', path: '', Component: WebMainAction },
   //    { name: 'Хуудас удирдах', path: 'webpages', Component: Pages },
   //    // { name: 'Мэдэгдэл илгээх', path: 'inapp', Component: InApp },
   //    { name: 'Хэрэглэгчид', path: 'storeuser', Component: StoreUser },
   //    // { name: 'Web Builder', push: true, path: '_playground', pushLink: `https://www.builder.siro.mn` },
   // ],
];

export default RouteStore;
