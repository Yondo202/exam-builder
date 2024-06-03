import { useForm } from 'react-hook-form';
import { TextInput, Button, AnimatedTabs } from '@/components/custom';
import { TavanbogdLogo } from '@/assets/svg';
import { AiOutlineUser } from 'react-icons/ai';
import { IoKeyOutline } from 'react-icons/io5';
import { useMutation } from '@tanstack/react-query';
import { request } from '@/lib/core/request';
import Cookie from 'js-cookie';
import { useState } from 'react';
import { HiOutlineMail } from 'react-icons/hi';

type TUserResponse = {
   data: {
      access_token: string;
   };
};

type TUser = {
   username: string;
   password: string;
} & TUserResponse;

const catAsset = {
   email: {
      labelRender: (
         <div className="flex items-center gap-2">
            <HiOutlineMail className="text-base" />
            Э-Мэйл
         </div>
      ),
      label: 'Нэвтрэх нэр',
      disabled: false,
   },
   hr: {
      labelRender: <img className="w-16 h-auto object-contain" src="/green.png" />,
      label: 'Нэвтрэх - Green',
      disabled: false,
   },

   odoo: {
      labelRender: <img className="w-16 h-auto object-contain" src="/odoo.png" />,
      label: 'Нэвтрэх - Odoo',
      disabled: true,
   },
} as const;

export type TKeys = keyof typeof catAsset;

// const setDate = () => {
//    const d = new Date();
//    d.setTime(d.getTime() + 4 * 24 * 60 * 60 * 1000); // 4 day
//    return d;
// };

export default function SignIn() {
   const [current, setCurrent] = useState<TKeys>('email');
   // const [, setCookie] = useCookies(['access_token']);
   const { control, handleSubmit, setError } = useForm<TUser>({ mode: 'onChange', defaultValues: { username: '', password: '' } });

   const { mutate, isPending } = useMutation({
      mutationFn: (body: TUser) => request<TUser>({ method: 'post', url: `auth/login${current !== 'email' ? `/${current}` : ''}`, body: body, isPublic:true }),
      onSuccess: (resdata) => {
         // console.log("its success")
         Cookie.set('access_token', resdata?.data.access_token ?? '');
         window.location.reload();

         // setCookie('access_token', resdata?.data.access_token, {
         //    path: '/',
         //    expires: setDate(),
         //    domain: import.meta.env.VITE_DOMAIN,
         //    sameSite: 'lax',
         // });
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
         <div className="w-[440px] max-w-full">
            <div className="flex justify-center pb-10">
               <TavanbogdLogo className="w-28 h-auto" />{' '}
            </div>

            <div className="rounded-lg bg-card-bg p-12 pt-6 shadow-md border">
               {/* <div className="mb-10 flex border-b text-base font-medium text-muted-text">
                  <div className="h-full border-b-2 border-primary pb-2.5">Нэвтрэх</div>
               </div> */}

               <AnimatedTabs
                  className="mb-12"
                  tabClassName="flex items-center"
                  items={Object.keys(catAsset)?.map((item) => ({ key: item, labelRender: catAsset[item as TKeys]?.labelRender, disabled: catAsset[item as TKeys]?.disabled }))}
                  activeKey={current}
                  onChange={(value) => setCurrent(value as TKeys)}
               />
               <TextInput
                  beforeAddon={<AiOutlineUser />}
                  sizes="lg"
                  className="mb-8"
                  control={control}
                  label={catAsset[current as TKeys].label}
                  name="username"
                  rules={{ required: 'Нэвтрэх нэр' }}
               />
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
               <Button isLoading={isPending} type="submit" className="mt-2 w-full">
                  Нэвтрэх &rarr;
               </Button>
            </div>
         </div>
      </form>
   );
}
