import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { TextInput, Button } from '@/components/custom';
// import BackgroundBeams from '@/utils/lib/BgBeams'
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
      <div className="flex flex-col gap-6 p-40 pt-32">
         {/* <img className="w-24" src="/siro.svg" /> */}
         <form onSubmit={handleSubmit(onSubmit)}>
            {/* <ModeToggle /> */}
            <div className="w-96 rounded-md bg-card-bg p-6 pb-12 shadow-sm border">
               <div className="mb-10 flex border-b text-base font-normal">
                  <div className="h-full border-b border-primary pb-2.5">Нэвтрэх</div>
               </div>
               <TextInput beforeAddon={<AiOutlineUser />} sizes="lg" className="mb-6" control={control} label="Нэвтрэх нэр" name="username" rules={{ required: 'Нэвтрэх нэр' }} />
               <TextInput
                  beforeAddon={<IoKeyOutline />}
                  sizes="lg"
                  className="mb-6"
                  autoComplete="on"
                  type="password"
                  control={control}
                  name="password"
                  label="Нууц үг."
                  rules={{ required: 'Нууц үг' }}
               />
               <Button isLoading={loading} type="submit" className="mt-4 w-full">
                  Нэвтрэх &rarr;
               </Button>
            </div>
         </form>
         {/* <div className="bg-box-parent">
            <div className="bg-box" />
         </div> */}
      </div>
   );
}
