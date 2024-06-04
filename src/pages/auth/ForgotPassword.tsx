// import React from 'react'
import { useForm } from 'react-hook-form';
import { GoUnlock } from 'react-icons/go';
import { TextInput, Button } from '@/components/custom'; //UsePrompt
import { useMutation } from '@tanstack/react-query';
import { CiMail } from 'react-icons/ci';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { request } from '@/lib/core/request';
import { useEffect, useState } from 'react';
import { VscSend } from 'react-icons/vsc';
import { PiPasswordLight } from 'react-icons/pi';
import { cn } from '@/lib/utils';

type TForgotPassword = {
   email: string;
   otp_code: string;
   new_password: string;
   repeat_password: string;
};

const initial = { email: '', otp_code: '', new_password: '', repeat_password: '' };

const ForgotPassword = () => {
   const navigate = useNavigate();
   const [stepFinal, setStepFinal] = useState(false);
   const [search, setSearch] = useSearchParams({});
   const searchAsObject = Object.fromEntries(new URLSearchParams(search));

   const {
      control,
      handleSubmit,
      formState: { isDirty },
      watch,
      reset,
      setError,
   } = useForm<TForgotPassword>({ mode: 'onChange', defaultValues: initial });

   const { mutate, isPending } = useMutation({
      mutationFn: (email: TForgotPassword['email']) => request({ method: 'post', url: 'auth/forgot/start', body: { email: email }, isPublic: true }),
      onSuccess: () => {
         setStepFinal(true);
         setSearch({ email: watch('email') });
      },
   });

   useEffect(() => {
      if (searchAsObject.email) {
         reset({ ...initial, email: searchAsObject.email });
         setStepFinal(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [searchAsObject.email]);

   const { mutate: FinalMutate, isPending: finalPending } = useMutation({
      mutationFn: (body: TForgotPassword) => request({ method: 'post', url: 'auth/forgot/end', body: body, isPublic: true }),
      onSuccess: () => {
         navigate(`/signin?email=${watch('email')}`);
      },
   });

   const onSubmit = (data: TForgotPassword) => {
      if (stepFinal) {
         if (data.new_password !== data.repeat_password) {
            setError('repeat_password', { message: 'Шинэ нууц үг адил биш байна' });
            return;
         }
         FinalMutate(data);
         return;
      }
      mutate(data.email);
   };

   return (
      <div className="flex items-start pt-28 justify-center h-dvh">
         <form onSubmit={handleSubmit(onSubmit)} className="w-[430px] h-auto rounded-lg bg-card-bg p-12 py-8 shadow-md border flex flex-col gap-6">
            <div className="mb-5 flex border-b text-base font-medium text-muted-text">
               <div className="h-full border-b-2 border-primary pb-2.5">Нууц үг сэргээх</div>
            </div>

            <TextInput
               disabled={stepFinal}
               className={cn('mb-3', stepFinal ? `opacity-50` : ``)}
               beforeAddon={<CiMail />}
               sizes="lg"
               control={control}
               label="Э-мэйл хаяг"
               name="email"
               rules={{ required: 'Э-мэйл хаяг аа оруулна уу' }}
            />

            {stepFinal && (
               <>
                  <TextInput
                     beforeAddon={<PiPasswordLight />}
                     sizes="lg"
                     control={control}
                     rules={{ required: `Нэг удаагийн код оо оруулна уу` }}
                     name="otp_code"
                     label="Нэг удаагийн код"
                     //  placeholder="Нэг удаагийн код оруулах"
                     //  type="password"
                  />

                  <TextInput
                     beforeAddon={<GoUnlock />}
                     sizes="lg"
                     control={control}
                     rules={{ required: 'Шинэ нууц үг оруулна уу', minLength: { value: 6, message: '6 - ба түүнээс дээш тэмдэгт ашиглана уу' } }}
                     name="new_password"
                     label="Шинэ нууц үг"
                     //  placeholder="Шинэ нууц үг оруулах"
                     type="password"
                  />
                  <TextInput
                     beforeAddon={<GoUnlock />}
                     sizes="lg"
                     control={control}
                     rules={{ required: 'Шинэ нууц үг давтах оруулна уу', minLength: { value: 6, message: '6 - ба түүнээс дээш тэмдэгт ашиглана уу' } }}
                     name="repeat_password"
                     label="Шинэ нууц үг давтах"
                     placeholder="Шинэ нууц үг давтах оруулах"
                     type="password"
                  />
               </>
            )}

            {stepFinal ? (
               <Button isLoading={finalPending} disabled={!isDirty} className="ml-auto mt-2 rounded-full flex items-center gap-3" type="submit">
                  Хадгалах
               </Button>
            ) : (
               <Button isLoading={isPending} disabled={!isDirty} className="ml-auto mt-2 rounded-full flex items-center gap-3" type="submit">
                  Илгээх <VscSend className="text-sm mt-0.5" />
               </Button>
            )}
         </form>
      </div>
   );
};

export default ForgotPassword;
