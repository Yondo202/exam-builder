import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import PrivateRoute from '@/lib/core/PrivateRoute';
import SignIn from '@/pages/SignIn';
import { Empty } from '@/assets/richsvg';
import RouteStore from '@/lib/core/RouteStore';
// import useTheme from '@/hooks/useTheme';

const router = createBrowserRouter(
   createRoutesFromElements(
      <>
         <Route path="/" element={<PrivateRoute toSign />}>
            {RouteStore.map((Item, index) => {
               return Item.subMenu ? (
                  <Route key={index} path={Item.to}>
                     {Item.subMenu?.map((childE, index) => {
                        return (
                           <Route key={index} path={childE.to} element={childE.component ? <childE.component breadcrumbs={[{ ...childE, isActive: true }]} /> : <div>{childE.label}</div>} />
                        );
                     })}
                  </Route>
               ) : (
                  <Route key={index} path={Item.to} element={Item.component ? <Item.component breadcrumbs={[{ ...Item, isActive: true }]} /> : <div>{Item.label}</div>} />
               );
            })}
         </Route>

         <Route path="/" element={<PrivateRoute />}>
            <Route path="/signin" element={<SignIn />} />
         </Route>

         <Route
            path="*"
            element={
               <div className="h-[70dvh] flex items-center justify-center flex-col">
                  <Empty />
                  <h3 className="text-lg">Хуудас олдсонгүй</h3>
               </div>
            }
         />
      </>
   )
);

function App() {
   return <RouterProvider router={router} />;
}

export default App;
