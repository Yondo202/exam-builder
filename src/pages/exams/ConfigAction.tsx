import { TextInput, Textarea, Button, Checkbox, Label, DatePicker, DeleteContent, Badge } from '@/components/custom'; //Checkbox, Label
import { Controller, useForm, type Control, type UseFormWatch, type UseFormSetValue } from 'react-hook-form';
// import { IoCloseOutline } from 'react-icons/io5';
import { PiFolderMinusLight } from 'react-icons/pi';
import { type TExam } from '.';
import { RxClock } from 'react-icons/rx';
import { CategorySelect } from '../questions/Action';
import { Input } from '@/components/ui/Input';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { type TActionProps, ATypes } from '@/lib/sharedTypes';

type TDateInput = {
   control: Control<TExam>;
   // control: TControllerProps['control'];
   watch: UseFormWatch<TExam>;
   setValue: UseFormSetValue<TExam>;
};

const DateInputCustom = ({ fieldName, label = '', control, setValue, watch }: { fieldName: 'active_start_at' | 'active_end_at'; label: string } & TDateInput) => {
   return (
      <div className="flex gap-6 items-end">
         <DatePicker className="w-full" rules={{ required: `${label} оруулна уу` }} name={fieldName} control={control} label={label} />

         <div className="relative">
            <div className="absolute z-50 inset-y-0 end-0.5 top-0 flex items-center pe-4 pointer-events-none">
               <svg className="w-4 h-4 text-primary/80 bg-card-bg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path
                     fillRule="evenodd"
                     d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                     clipRule="evenodd"
                  />
               </svg>
            </div>
            <Input
               type="time"
               min="00:00"
               max="23:59"
               className="w-full self-end"
               disabled={!isTimeOrNot(watch(fieldName))}
               value={isTimeOrNot(watch(fieldName))}
               onChange={(event) => {
                  const value = event.target.value;
                  const sliced = watch(fieldName)?.slice(0, 11);
                  setValue(fieldName, sliced + (value !== '' ? value : '00:00') + ':00+08:00');
               }}
            />
         </div>
      </div>
   );
};

type TConfigAction = {
   afterSuccess: (id: string) => void;
} & TActionProps<TExam>;

type TConfigResponse = {
   data?: {
      id?: string;
   };
};

// "reviewable": false,
// "score_visible": false,
// "scrumble_questions": false,
// "take_per_user": 1,

const ConfigAction = ({ afterSuccess, action }: TConfigAction) => {
   const { control, handleSubmit, watch, setValue, reset } = useForm<TExam>({
      defaultValues: {
         name: '',
         description: '',
         sub_category_id: '',
         category_id: '',
         active_start_at: '',
         active_end_at: '',
         duration_min: 0,
         pass_score: 0,
         take_per_user: 1,
         reviewable: true,
         score_visible: false,
         scrumble_questions: false,
      },
   })

   useEffect(() => {
      if (action.type !== 'add') {
         reset(action.data);
      }
   }, []);

   const { mutate, isPending } = useMutation({
      mutationFn: (body?: TExam & TConfigResponse) => request({ url: `exam${action.type !== 'add' ? `/${action.data?.id}` : ``}`, method: ATypes[action.type]?.apiMethod, body: body }),
      onSuccess: (resdata) => {
         afterSuccess(resdata?.data?.id ?? '');
      },
   });
   const onSubmit = (data: TExam) => {
      mutate(data);
   };

   if (action.type === 'delete') {
      return <DeleteContent setClose={() => afterSuccess('delete')} submitAction={() => mutate(undefined)} isLoading={isPending} className="pb-6" />;
   }
   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <div className="grid grid-cols-[320px_1fr] gap-10 mb-5">
            <div>
               <TextInput
                  floatLabel={false}
                  name="name"
                  className="mb-2"
                  control={control}
                  rules={{ required: 'Шалгалтын нэр оруулна уу' }}
                  label="Шалгалтын нэр"
                  placeholder="Нэр оруулах"
               />

               <TextInput
                  floatLabel={false}
                  name="take_per_user"
                  className="mb-6"
                  control={control}
                  rules={{ required: 'Шалгалтын оролдлогын тоо' }}
                  label="Шалгалтын оролдлогын тоо"
                  placeholder="Тоо оруулах"
                  type="number"
               />
            </div>
            <Textarea
               className="w-full min-h-[100px]"
               name="description"
               control={control}
               rules={{ required: 'Шалгалтын тайлбар оруулна уу' }}
               label="Шалгалтын тайлбар"
               placeholder="Шалгалтын тайлбар дэлгэрэнгүй оруулах"
            />
         </div>

         <div className="grid grid-cols-[1fr_1fr] gap-10 mb-6">
            <TextInput
               beforeAddon={<IoIosCheckmarkCircleOutline />}
               className="w-full mb-0"
               name="pass_score"
               control={control}
               label="Шалгалтанд тэнцэх доод оноо"
               rules={{ required: 'Шалгалтанд тэнцэх доод оноо оруулах', min: { message: 'Оноо - 0 байх боломжгүй', value: 0.001 } }}
               placeholder="Оноо оруулах"
               type="number"
            />
            <div className="flex items-center gap-2">
               <TextInput
                  beforeAddon={<RxClock />}
                  className="w-full mb-0"
                  name="duration_min"
                  control={control}
                  label="Шалгалтын үргэлжилэх хугацаа / мин"
                  rules={{ required: 'Шалгалтын үргэлжилэх хугацаа оруулах', min: { message: 'Оноо - 0 байх боломжгүй', value: 0.001 } }}
                  placeholder="Оноо оруулах"
                  type="number"
               />
               <Badge className="h-full font-medium opacity-70" variant="secondary">
                  Минут
               </Badge>
            </div>
         </div>

         <div className="grid grid-cols-[1fr_1fr] gap-10 mb-6">
            <CategorySelect control={control} name="category_id" current="main_category" label="Үндсэн ангилал" onChange={() => setValue('sub_category_id', '')} />
            <CategorySelect control={control} disabled={!watch('category_id')} idKey={watch('category_id')} name="sub_category_id" current="sub_category" label="Дэд ангилал" />
         </div>

         <div className="grid grid-cols-[1fr_1fr] gap-10 mb-6">
            <DateInputCustom {...{ control, watch, setValue }} fieldName="active_start_at" label="Шалгалт эхлэх огноо" />
            <DateInputCustom {...{ control, watch, setValue }} fieldName="active_end_at" label="Шалгалт дуусах огноо" />
         </div>

         <div className="grid grid-cols-[1fr_1fr_1fr] gap-5 mb-2">
            <Controller
               control={control}
               name="reviewable"
               render={({ field }) => {
                  return (
                     <div className="flex items-center gap-3">
                        <Checkbox id={field.name} checked={field.value} onCheckedChange={(e) => field.onChange(e)} />{' '}
                        <Label htmlFor={field.name} className="m-0">
                           Өгсөн шалгалтаа харах боломжтой
                        </Label>
                     </div>
                  );
               }}
            />

            <Controller
               control={control}
               name="score_visible"
               render={({ field }) => {
                  return (
                     <div className="flex items-center gap-3">
                        <Checkbox id={field.name} checked={field.value} onCheckedChange={(e) => field.onChange(e)} />{' '}
                        <Label htmlFor={field.name} className="m-0">
                           Асуултын оноог харах боломжтой
                        </Label>
                     </div>
                  );
               }}
            />

            {/* <Controller
               control={control}
               name="scrumble_questions"
               render={({ field }) => {
                  return (
                     <div className="flex items-center gap-3">
                        <Checkbox id={field.name} checked={field.value} onCheckedChange={(e) => field.onChange(e)} />{' '}
                        <Label htmlFor={field.name} className="m-0">
                           Асуултыг санамсаргүй байдлаар холих боломжтой
                        </Label>
                     </div>
                  );
               }}
            /> */}
         </div>

         <div className="pt-7 flex justify-end">
            <Button isLoading={isPending} type="submit" className="rounded-full">
               <PiFolderMinusLight className="text-lg mr-1" /> {action.type === 'add' ? `Шалгалт үүсгэх` : `Хадгалах`}
            </Button>
         </div>
      </form>
   );
};

export default ConfigAction;

import { formatISO9075, isDate } from 'date-fns';
import { useMutation } from '@tanstack/react-query';
import { request } from '@/lib/core/request';
import { useEffect } from 'react';
function isTimeOrNot(dateValue: string) {
   if (dateValue) {
      if (isDate(new Date(dateValue))) {
         return formatISO9075(new Date(dateValue), { representation: 'time' })?.slice(0, 5);
      }
      return '';
   }

   return '';
}
