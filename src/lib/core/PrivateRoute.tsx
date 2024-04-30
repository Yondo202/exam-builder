import { Outlet, Navigate } from 'react-router-dom';
import SignedInRoot from '@/pages/layout/SignedInRoot';
// import Loading from '../@components/Loading';

const PrivateRoute = ({ toSign }:{ toSign?:boolean }) => {
  const auth = { isAuthenticated:false }

//   if(auth.isLoading) return <Loading load={true} />
  // to sign buruu ajillaj bn

  if(toSign){
    return auth.isAuthenticated ? <SignedInRoot /> : <Navigate to="/signin" />
  }else{
    return auth.isAuthenticated ? <Navigate to="/" /> : <Outlet /> 
  }
}

export default PrivateRoute
