import { Outlet, Navigate } from 'react-router-dom';
import SignedInRoot from '@/pages/layout/SignedInRoot';
import { useCookies } from 'react-cookie';
// import Loading from '../@components/Loading';

const PrivateRoute = ({ toSign }: { toSign?: boolean }) => {
   const [cookie] = useCookies(['access_token']);
   //  const auth = { isAuthenticated: true };

   //   if(auth.isLoading) return <Loading load={true} />
   // to sign buruu ajillaj bn

  //  console.log(cookie.access_token, '-=============>cookie');

   if (toSign) {
      return cookie.access_token ? <SignedInRoot /> : <Navigate to="/signin" />;
   }
   return cookie.access_token ? <Navigate to="/" /> : <Outlet />;
};

export default PrivateRoute;
