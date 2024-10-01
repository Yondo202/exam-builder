import { Outlet, Navigate } from 'react-router-dom';
import SignedInRoot from '@/pages/layout/SignedInRoot';
// import { useCookies } from 'react-cookie';
// import Cookie from 'js-cookie';
import Cookies from 'js-cookie';
// import Loading from '../@components/Loading';

const PrivateRoute = ({ toSign }: { toSign?: boolean }) => {
   const accessCookie = Cookies.get('access_token');

   // console.log(accessCookie, "'------------------->accessCookie")
   // const CookiesArray = Object.entries(allCookie);
   // const [cookie] = useCookies(['access_token']);
   //  const auth = { isAuthenticated: true };
   //   if(auth.isLoading) return <Loading load={true} />
   // to sign buruu ajillaj bn
   //  console.log(cookie.access_token, '-=============>cookie');
   //   console.log(cookie, "-------------------->cookie")
   // console.log(
   //    CookiesArray.find((item) => item?.[0] === 'access_token'),
   //    '------------->CookiesArray'
   // );
   // const accessCookie = CookiesArray.find((item) => item?.[0] === 'access_token');

   if (toSign) {
      return accessCookie ? <SignedInRoot /> : <Navigate to="/signin" />;
   }
   return accessCookie ? <Navigate to="/" /> : <Outlet />;
   // if (toSign) {
   //    return cookie.access_token ? <SignedInRoot /> : <Navigate to="/signin" />;
   // }
   // return cookie.access_token ? <Navigate to="/" /> : <Outlet />;
};

export default PrivateRoute;
