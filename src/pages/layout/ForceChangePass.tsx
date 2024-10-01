import { useForm } from 'react-hook-form';
import { Button, TextInput, UsePrompt } from '@/components/custom';
import { IoKeyOutline } from 'react-icons/io5';
import { GoUnlock } from 'react-icons/go';
import { useMutation } from '@tanstack/react-query';
import { request } from '@/lib/core/request';

type TChangePassword = {
   old_password?: string;
   new_password: string;
   repeat_password?: string;

   id?: string;
};

const ForceChangePass = ({ afterSuccess, userId, isFromAdmin }: { afterSuccess: () => void; userId?: string; isFromAdmin?:boolean }) => {
   const isChangeFromAdmin = !!isFromAdmin && !!userId
   const {
      control,
      handleSubmit,
      formState: { isDirty },
      setError,
   } = useForm<TChangePassword>({ defaultValues: { old_password: '', new_password: '', repeat_password: '' } });
   const onSubmit = (data: TChangePassword) => {
      if (data.new_password !== data.repeat_password) {
         setError('repeat_password', { message: 'Шинэ нууц үг адил биш байна' });
         return;
      }

      if (isChangeFromAdmin) {
         mutate({ new_password: data.new_password, id: userId });
      } else {
         mutate(data);
      }
   };

   const { mutate, isPending } = useMutation({
      mutationFn: (body: TChangePassword) => request({ method: 'post', url: `auth/changepass${isChangeFromAdmin ? `/admin` : ``}`, body: body }),
      onSuccess: () => {
         afterSuccess();
      },
   });

   UsePrompt({ isBlocked: isDirty });

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="px-20 py-14 pt-7 flex flex-col gap-7 max-sm:p-0 max-sm:pb-6">
         {!isChangeFromAdmin && (
            <TextInput
               beforeAddon={<IoKeyOutline />}
               sizes="lg"
               control={control}
               rules={{ required: 'Хуучин нууц үг оруулна уу' }}
               name="old_password"
               label="Хуучин нууц үг"
               placeholder="Хуучин нууц үг оруулах"
               type="password"
            />
         )}
         <TextInput
            beforeAddon={<GoUnlock />}
            sizes="lg"
            control={control}
            rules={{ required: 'Шинэ нууц үг оруулна уу', minLength: { value: 6, message: '6 - ба түүнээс дээш тэмдэгт ашиглана уу' } }}
            name="new_password"
            label="Шинэ нууц үг"
            placeholder="Шинэ нууц үг оруулах"
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

         <Button isLoading={isPending} disabled={!isDirty} className="ml-auto" type='submit'>
            Хадгалах
         </Button>
      </form>
   );
};
export default ForceChangePass;
