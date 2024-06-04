import { Route, useNavigate, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'; // createBrowserRouter, createRoutesFromElements, RouterProvider,
import PrivateRoute from '@/lib/core/PrivateRoute';
import SignIn from '@/pages/auth/SignIn';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import { Empty } from '@/assets/richsvg';
import { TRouteOmit, FilteredRoute } from '@/lib/core/RouteStore';
// import { CookiesProvider } from 'react-cookie';
import { FinalRespnse, type TUserEmployee, type TRolesAssetType } from '@/lib/sharedTypes';
import { request } from '@/lib/core/request';
import { useQuery } from '@tanstack/react-query';
import Cookie from 'js-cookie';
import { useEffect } from 'react';
// import { Loading } from '@/components/custom';
// import useTheme from '@/hooks/useTheme';

const converSome = (Item: TRouteOmit) => {
   if (!Item.isHide) {
      return Item;
   }

   return { ...Item, to: Item.to.replace('/:typeid', '') };
};

function App() {
   const { data } = useQuery({
      enabled: !!Cookie.get('access_token'),
      queryKey: ['user/me', [Cookie.get('access_token')]],
      queryFn: () =>
         request<FinalRespnse<TUserEmployee>>({
            url: 'user/profile',
            isPublic: true,
         }),
   });

   // console.log(Cookie.get('access_token'));
   // if (isLoading) {
   //    return <Loading load={isLoading} />;
   // }

   // RouteStore
   return (
      // <BrowserRouter>
      //    <Routes>{CustomRoutes({ roles: data?.data?.roles ?? [] })}</Routes>
      // </BrowserRouter>
      // <CookiesProvider>
      <RouterProvider router={createBrowserRouter(createRoutesFromElements(CustomRoutes({ roles: data?.data?.roles ?? [] })))} />
      // </CookiesProvider>
   );
}

export default App;

const CustomRoutes = ({ roles }: { roles: TRolesAssetType[] }) => {
   return (
      <>
         <Route path="/" element={<PrivateRoute toSign />}>
            {roles?.length > 0
               ? FilteredRoute(roles).map((Item, index) => {
                    return Item.subMenu ? (
                       <Route key={index} path={Item.to}>
                          {Item.subMenu?.map((childE, index) => {
                             return (
                                <Route
                                   key={index}
                                   path={childE.to}
                                   element={childE.component ? <childE.component breadcrumbs={[{ ...converSome(childE), isActive: true }]} /> : <div>{childE.label}</div>}
                                />
                             );
                          })}
                       </Route>
                    ) : (
                       <Route key={index} path={Item.to} element={Item.component ? <Item.component breadcrumbs={[{ ...converSome(Item), isActive: true }]} /> : <div>{Item.label}</div>} />
                    );
                 })
               : null}
         </Route>

         <Route path="/" element={<PrivateRoute />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
         </Route>

         <Route path="*" element={<NoutFound />} />
      </>
   );
};

const NoutFound = () => {
   const navigate = useNavigate();
   useEffect(() => {
      setTimeout(() => navigate('/'), 1000);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
   return (
      <div className="h-[70dvh] flex items-center justify-center flex-col">
         <Empty />
         <h3 className="text-lg">Хуудас олдсонгүй</h3>
      </div>
   );
};
// role oor interface ee haruulii
// bas force_change_password - iig hucheer oruuluulii
