// import { useMatches, matchRoutes, matchPath } from "react-router-dom"
import { useMutation } from '@tanstack/react-query';
import { request, UseReFetch } from '@/lib/core/request';
import { useState, useEffect } from 'react';
import { DataTable, Drawer, Button, TextInput, UsePrompt, SelectInput, Label, DeleteContent } from '@/components/custom';
import { type FinalRespnse, type TAction, type TActionProps, ATypes, type TUserEmployee } from '@/lib/sharedTypes';
import { ColumnDef } from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import { RowSelectionState } from '@tanstack/react-table';
import { MdOutlineAdd } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import { EmployeeDetail } from '.';

// type TUserEmployee = {
//    id: string;
//    email?: string;
//    lastname: string;
//    firstname: string;
//    gender: 'male' | 'female';
//    phone: string;
//    birth_date: string;
//    regno: string;
//    created_at: string;
//    age: number;
// };

const Candidates = ({ fromAction }: { fromAction?: (row: RowSelectionState) => React.ReactNode }) => {
   const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
   const [action, setAction] = useState<TAction<TUserEmployee>>({ isOpen: false, type: 'add', data: {} as TUserEmployee });
   const { data, isLoading } = useQuery({
      queryKey: [`users/candidate`],
      queryFn: () =>
         request<FinalRespnse<TUserEmployee[]>>({
            method: 'post',
            url: 'user/list',
            offAlert: true,
            // filterBody: {
            //    pagination: {
            //       page: 1,
            //       page_size: 1000,
            //    },
            // },
         }),
   });

   const setClose = () => {
      setAction((prev) => ({ ...prev, isOpen: false }));
   };

   const rowAction = (data: TAction<TUserEmployee>) => {
      setAction(data);
   };

   return (
      <>
         {fromAction?.(rowSelection)}
         <DataTable
            enableMultiRowSelection={false}
            setRowSelection={setRowSelection}
            rowSelection={fromAction ? rowSelection : undefined}
            defaultSortField="created_at"
            data={data?.data ?? []}
            columns={canditateColumnDef}
            hideAction={!!fromAction}
            isLoading={isLoading}
            rowAction={fromAction ? undefined : rowAction}
            headAction={
               <Drawer
                  open={action.isOpen}
                  onOpenChange={(event) => setAction((prev) => ({ ...prev, isOpen: event }))}
                  title="Ажил горилогч үүсгэх"
                  content={<CandidateAction setClose={setClose} action={action} isFromAdmin />}
                  className={`py-10 max-w-2xl`}
               >
                  <Button size="sm" className="rounded-full" variant="outline" onClick={() => setAction((prev) => ({ ...prev, isOpen: true, type: 'add' }))}>
                     <MdOutlineAdd /> Ажил горилогч үүсгэх
                  </Button>
               </Drawer>
            }
         />
      </>
   );
};

export default Candidates;

// eslint-disable-next-line react-refresh/only-export-components
export const canditateColumnDef: ColumnDef<TUserEmployee>[] = [
   {
      header: 'Овог нэр',
      accessorKey: 'firstName',
      cell: ({ row }) => `${row.original?.lastname ?? ''} ${row.original?.firstname ?? ''}`,
   },
   {
      header: 'Е-мэйл',
      accessorKey: 'email',
   },
   {
      header: 'Утас',
      accessorKey: 'phone',
   },
   {
      header: 'Үүсгэсэн огноо',
      accessorKey: 'created_at',
      cell: ({ row }) => row.original?.created_at?.slice(0, 16).replace('T', ' '),
   },
];

const letter_mn = [
   'А',
   'Б',
   'В',
   'Г',
   'Д',
   'Е',
   'Ё',
   'Ж',
   'З',
   'И',
   'Й',
   'К',
   'Л',
   'М',
   'Н',
   'О',
   'Ө',
   'П',
   'Р',
   'С',
   'Т',
   'У',
   'Ү',
   'Ф',
   'Х',
   'Ц',
   'Ч',
   'Ш',
   'Щ',
   'Ъ',
   'Ь',
   'Ы',
   'Ю',
   'Э',
   'Я',
];

const genders = [
   { label: 'Эрэгтэй', value: 'male' },
   { label: 'Эмэгтэй', value: 'female' },
];

type Letters = {
   second_letter: string;
   first_letter: string;
};

export const CandidateAction = ({ setClose, action, isFromAdmin }: TActionProps<TUserEmployee> & { isFromAdmin?: boolean }) => {
   const {
      control,
      handleSubmit,
      watch,
      setError,
      reset,
      formState: { isDirty },
   } = useForm<Omit<TUserEmployee, 'first_letter' | 'second_letter'> & Letters>({
      defaultValues: {
         email: '',
         lastname: '',
         firstname: '',
         //  phone: '',
         phone: '',
         birth_date: '2024-04-30T08:01:30.342Z',
         gender: 'male',
         regno: '',
         age: 0,
         first_letter: '',
         second_letter: '',

         position_applied: '',
         company_applied: '',
      },
   });

   const { isPending, mutate } = useMutation({
      mutationFn: (body?: TUserEmployee) =>
         request<Omit<TUserEmployee, 'user_id'> & { user_id: string }>({
            method: ATypes[action.type]?.apiMethod,
            url: action.type === 'add' ? `auth/signup` : action.type === 'delete' ? `auth/remove?id=${watch('id')}` : `user/profile${isFromAdmin ? `/admin` : ``} `,
            body: body ? { ...body, user_id: isFromAdmin ? action.data?.id ?? '' : `` } : undefined,
         }),
      onSuccess: () => {
         //resdata - deer password irj baigaa
         reset(watch());
         setClose?.({});
         UseReFetch({ queryKey: `users/candidate` });
      },
   });

   useEffect(() => {
      if (action?.type !== 'add') {
         // reset(action?.data ?? {});
         reset({
            ...action?.data,
            regno: action?.data?.regno?.slice(2, 10) ?? '',
            first_letter: action?.data?.regno?.slice(0, 1) ?? '',
            second_letter: action?.data?.regno?.slice(1, 2) ?? '',
            phone: action.data?.phone ?? action.data?.private_number ?? '',
         });
         return;
      }
      //   reset(action.data);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [action?.data?.id]);

   const onSubmit = (data: TUserEmployee) => {
      if (typeof Number(data.regno) !== 'number') {
         setError('regno', { message: 'Зөвхөн тоо оруулна уу!' });
         return;
      }
      let FinalAge = 0;
      const d = new Date();
      const year = d.getFullYear();
      const ageYear = data.regno.toString()?.slice(0, 2);
      if (+ageYear > 30) {
         FinalAge = year - 2000 + (100 - +ageYear);
      } else {
         FinalAge = year - 2000 - +ageYear;
      }

      mutate({ ...data, regno: `${watch('first_letter')}${watch('second_letter')}${data.regno}`, age: FinalAge });
   };

   UsePrompt?.({ isBlocked: isDirty });

   if (action.type === 'delete') {
      return <DeleteContent setClose={setClose} submitAction={() => mutate(undefined)} isLoading={isPending} className="pb-6" />;
   }

   return (
      <>
         <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-10 mb-4">
               <TextInput
                  disabled={!!action.data?.empid}
                  floatLabel={false}
                  autoFocus
                  placeholder="Овог"
                  label="Овог"
                  name="lastname"
                  control={control}
                  rules={{ required: `Овог оруулна уу` }}
               />
               <TextInput disabled={!!action.data?.empid} floatLabel={false} placeholder="Нэр" label="Нэр" name="firstname" control={control} rules={{ required: `Нэр оруулна уу` }} />
            </div>
            <div className="grid grid-cols-2 gap-10 mb-4">
               <TextInput
                  disabled={!!action.data?.empid}
                  floatLabel={false}
                  placeholder={`Е-мэйл`}
                  label={`Е-мэйл оруулах`}
                  name="email"
                  control={control}
                  rules={{ required: `Е-мэйл оруулна уу` }}
               />
               <TextInput
                  disabled={!!action.data?.empid}
                  floatLabel={false}
                  placeholder="Утасны дугаар"
                  label={`Утасны дугаар ${action.data?.private_number ? `- Хувийн дугаар ` : ``}`}
                  name="phone"
                  control={control}
                  rules={{ required: `Утасны дугаар оруулна уу` }}
               />
            </div>

            <div className="grid grid-cols-2 gap-10 mb-5">
               {/* <DatePicker label="Төрсөн он сар өдөр" name="birth_date" control={control} rules={{ required: `Төрсөн он сар өдөр оруулна уу` }} /> */}
               {/* <DatePicker label="Төрсөн он сар өдөр" name="birth_date" control={control} rules={{ required: `Төрсөн он сар өдөр оруулна уу` }} /> */}
               <div className="flex items-center gap-2">
                  <div>
                     <Label>Эхний 2 үсэг</Label>
                     <div className="flex items-center gap-2">
                        <SelectInput
                           disabled={!!action.data?.empid}
                           hideIcon
                           placeholder=".."
                           className="w-10"
                           triggerClassName="h-9 p-0 flex justify-center"
                           control={control}
                           name="first_letter"
                           rules={{ required: true }}
                           options={letter_mn.map((item) => ({ label: item, value: item }))}
                        />
                        <SelectInput
                           disabled={!!action.data?.empid}
                           hideIcon
                           placeholder=".."
                           className="w-10"
                           triggerClassName="h-9 p-0 flex justify-center"
                           control={control}
                           name="second_letter"
                           rules={{ required: true }}
                           options={letter_mn.map((item) => ({ label: item, value: item }))}
                        />
                     </div>
                  </div>

                  <TextInput
                     floatLabel={false}
                     placeholder={`Регистрийн дугаар`}
                     label={`Регистрийн дугаар`}
                     name="regno"
                     disabled={!!action.data?.empid}
                     // type="number"
                     control={control}
                     rules={{
                        required: `Зөвхөн 8 оронтой тоог оруулна уу`,
                        // pattern: {
                        //    value: /^[0-9]{8,}$/,
                        //    message: 'Зөвхөн 8 оронтой тоог оруулна уу',
                        // },
                     }}
                  />
               </div>

               {!action.data?.empid && <SelectInput options={genders} label="Хүйс" name="gender" control={control} rules={{ required: `Хүйс` }} />}
            </div>

            <div className="grid grid-cols-2 gap-10 mb-4">
               <TextInput
                  disabled={!!action.data?.empid || !isFromAdmin}
                  floatLabel={false}
                  placeholder={`Горилж буй албан тушаал`}
                  label={`Горилж буй албан тушаал`}
                  name="position_applied"
                  control={control}
                  // rules={{ required: `Горилж буй албан тушаал оруулна уу` }}
               />
               <TextInput
                  disabled={!!action.data?.empid || !isFromAdmin}
                  floatLabel={false}
                  placeholder="Горилж буй байгууллага"
                  label={`Горилж буй байгууллага ${action.data?.private_number ? `- Хувийн дугаар ` : ``}`}
                  name="company_applied"
                  control={control}
                  // rules={{ required: `Горилж буй байгууллага оруулна уу` }}
               />
            </div>

            {/* <TextInput floatLabel={false} autoFocus placeholder={`Е-мэйл`} label={`Е-мэйл оруулах`} name="email" control={control} rules={{ required: `Е-мэйл оруулна уу` }} /> */}

            <div className="flex justify-end w-full pt-10">
               <Button isLoading={isPending} type="submit" disabled={!isDirty || !!action.data?.empid}>
                  Хадгалах
               </Button>
            </div>
         </form>

         {action.type === 'edit' && isFromAdmin && <EmployeeDetail isRoleAction detailData={action.data as TUserEmployee} />}
      </>
   );
};
