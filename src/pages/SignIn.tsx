import { useForm } from 'react-hook-form';
import { TextInput, Button } from '@/components/custom';
// import BackgroundBeams from '@/utils/lib/BgBeams'
import { TavanbogdLogo } from '@/assets/svg';
import { AiOutlineUser } from 'react-icons/ai';
import { IoKeyOutline } from 'react-icons/io5';
import { useCookies } from 'react-cookie';
import { useMutation } from '@tanstack/react-query';
import { request } from '@/lib/core/request';

type TUserResponse = {
   data: {
      access_token: string;
   };
};

type TUser = {
   username: string;
   password: string;
} & TUserResponse;

const setDate = () => {
   const d = new Date();
   d.setTime(d.getTime() + 4 * 24 * 60 * 60 * 1000); // 4 day
   return d;
};

export default function SignIn() {
   const [, setCookie] = useCookies();
   const { control, handleSubmit, setError } = useForm<TUser>({ mode: 'onChange', defaultValues: { username: '', password: '' } });

   const { mutate, isPending } = useMutation({
      mutationFn: (body: TUser) => request<TUser>({ method: 'post', url: 'auth/login', body: body }),
      onSuccess: (resdata) => {
         setCookie('access_token', resdata?.data.access_token, {
            path: '/',
            expires: setDate(),
            domain: import.meta.env.VITE_DOMAIN,
            sameSite: 'lax',
         });
      },
      onError: () => {
         setError('password', { message: 'Нэвтрэх нэр эсвэл нууц үг буруу байна' });
      },
   });

   const onSubmit = async (data: TUser) => {
      mutate(data);
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="w-full h-[100dvh] flex justify-center items-start pt-16 sm:px-2">
         <div className="w-[410px] max-w-full">
            <div className="flex justify-center pb-10">
               <TavanbogdLogo className="w-28 h-auto" />{' '}
            </div>

            <div className='rounded-lg bg-card-bg p-10 pt-8 shadow-md border'>
               <div className="mb-10 flex border-b text-base font-medium text-muted-text">
                  <div className="h-full border-b-2 border-primary pb-2.5">Нэвтрэх</div>
               </div>
               <TextInput beforeAddon={<AiOutlineUser />} sizes="lg" className="mb-8" control={control} label="Нэвтрэх нэр" name="username" rules={{ required: 'Нэвтрэх нэр' }} />
               <TextInput
                  beforeAddon={<IoKeyOutline />}
                  sizes="lg"
                  className="mb-8"
                  autoComplete="on"
                  type="password"
                  control={control}
                  name="password"
                  label="Нууц үг."
                  rules={{ required: 'Нууц үг' }}
               />
               <Button size="default" isLoading={isPending} type="submit" className="mt-2 w-full">
                  Нэвтрэх &rarr;
               </Button>
            </div>
         </div>
      </form>
   );
}
