import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { TextInput, Button } from '@/components/custom';
// import BackgroundBeams from '@/utils/lib/BgBeams'
import { TavanbogdLogo } from '@/assets/svg';
import { AiOutlineUser } from 'react-icons/ai';
import { IoKeyOutline } from 'react-icons/io5';

type Tinitial = {
   username: string;
   password: string;
};

export default function SignIn() {
   const [loading, setLoading] = useState(false);
   // const { handleSignIn } = useAuthCore();
   const { control, handleSubmit } = useForm<Tinitial>({ mode: 'onChange', defaultValues: { username: '', password: '' } });

   const onSubmit = async (data: Tinitial) => {
      console.log(data, '------>');
      setLoading(true);
      setTimeout(() => setLoading(false), 3000);
   };

   // const blocker = useBlocker(({ currentLocation, nextLocation }) => currentLocation.pathname !== nextLocation.pathname); // value !== '' &&
   // console.log(blocker, '--------------->blocker');
   // if (blocker.state === 'blocked') {
   //    return (
   //       <div>
   //          <p>Are you sure you want to leave?</p>
   //          <button onClick={() => blocker.proceed()}>Proceed</button>
   //          <button onClick={() => blocker.reset()}>Cancel</button>
   //       </div>
   //    );
   // }

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="w-full h-[100dvh] flex justify-center items-start pt-24">
         {/* <TavanbogdLogo />  */}
         {/* <ModeToggle /> */}
         <div className="w-[502px] rounded-lg bg-card-bg p-[48px_56px] shadow-md border">
            <div className="flex justify-center pb-10">
               <TavanbogdLogo className="w-28 h-auto" />{' '}
            </div>
            <div className="mb-10 flex border-b text-xl font-medium">
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
            <Button size="lg" isLoading={loading} type="submit" className="mt-2 w-full">
               Нэвтрэх &rarr;
            </Button>
         </div>
         {/* <div className="bg-box-parent">
            <div className="bg-box" />
         </div> */}
      </form>
   );
}
