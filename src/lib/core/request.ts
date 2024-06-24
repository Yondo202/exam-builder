// import { queryClient } from "@/main";
import axios from 'axios';
// import Notification from '@/utils/hooks/Notification';
import { toast } from 'sonner';
import { queryClient } from '@/main';
import { SignOut } from '../Auth';

export type TRequest<T> = {
   method?: 'get' | 'post' | 'put' | 'delete';
   url?: string;
   mainUrl?: string;
   body?: T;
   filterBody?: unknown;
   queryParams?: unknown;
   offAlert?: boolean;
   isPublic?: boolean;
   passToken?: boolean;
};

// type ResponseType<T> = {
//    data?: T;
// };

export const getJwt = () => {
   return document.cookie
      ?.split('; ')
      ?.find((row) => row.startsWith('access_token='))
      ?.split('=')[1];
};

export const request = async <T>({ mainUrl, url = '', method = 'get', body = undefined, queryParams, offAlert = false, filterBody, isPublic, passToken }: TRequest<T>) => {
   if (!isPublic && method === "get") {
      if (!getJwt() && !passToken) {
         SignOut();
      }
      try {
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         const resdata: any = await axios<T>({ url: `${import.meta.env.VITE_MAIN_URL}auth/verify?token=${getJwt()}`, method: 'get' }); //daraa typescript iin zas
         if (!resdata?.data?.data?.is_valid && !passToken) {
            SignOut();
         }
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
         toast.error(error?.response?.data?.message);
         if(!passToken){
            SignOut();
         }
      }
   }

   const reqAsset = { headers: { Authorization: `Bearer ${getJwt()}` }, params: queryParams };
   const fullUrl = `${mainUrl ?? import.meta.env.VITE_MAIN_URL}${url}`;

   try {
      // const response = await axios<ResponseType<T>>({ url: fullUrl, method: method, data: body ?? filterBody ?? {}, ...reqAsset }); // tur ashiglaj baigaa data naas shaltgalaad tur darsan
      const response = await axios<T>({ url: fullUrl, method: method, data: body ?? filterBody ?? {}, ...reqAsset });
      if (method !== 'get' && !offAlert) {
         toast.success('Хүсэлт амжилттай');
      }

      // if(method === "post"){
      //    return response.data?.data
      // }
      // return response.data.data;
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
   } catch (err: any) {
      if (err?.response?.data?.message) {
         toast.error(err?.response?.data?.message);
      } else {
         toast.error('Хүсэлт амжилтгүй');
      }
      throw err;
   }
};

type TRefetch = {
   queryKey: string;
   queryId?: string;
};

export const UseReFetch = ({ queryKey, queryId }: TRefetch) => {
   queryClient.refetchQueries({ queryKey: [queryKey, queryId ?? undefined] });
   // messageAlert('Хүсэлт амжилттай')
};
