import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetUserMe } from '@/pages/auth/Profile';

const RedirectRoot = () => {
   const { data } = GetUserMe();
   const navigate = useNavigate();
   useEffect(() => {
      if (data?.data.roles?.some((item) => item.role === 'super_admin')) {
         // navigate('/dashboard');
         navigate('/category');
         return;
      }
      // comp admin turulj unshih uchiraas hamt bsan ued ch exam - iig l duudna
      if (data?.data.roles?.some((item) => item.role === 'company_admin')) {
         navigate('/exams');
         return;
      }

      if (data?.data.roles?.some((item) => item.role === 'inspector')) {
         navigate('/handle');
         return;
      }
   }, []);
   return <div />;
};

export default RedirectRoot;
