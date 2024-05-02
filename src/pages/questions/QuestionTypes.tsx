import { TextInput, Textarea, Button, Checkbox, Label, CkEditor, Header, SelectInput } from '@/components/custom';
import { useForm, type FieldValues, useFieldArray, Controller } from 'react-hook-form';
import { IoCloseOutline } from 'react-icons/io5';
import { MdOutlineAdd } from 'react-icons/md';
import { useMutation } from '@tanstack/react-query';
import { request } from '@/lib/core/request';
import { BsSave } from 'react-icons/bs';
import { ReactNode, useState } from 'react';
import { IoWarningOutline } from 'react-icons/io5';
import { TControllerProps } from '@/lib/sharedTypes';
import { useGetCategories, type TKeys } from '../category';

const CategorySelect = <TFieldValues extends FieldValues>({ control, name, current, label }: TControllerProps<TFieldValues> & { current: TKeys; label: string }) => {
   const { data } = useGetCategories({ current });
   return (
      <SelectInput options={data?.data ? data.data?.map((item) => ({ value: item.id, label: item.name })) : []} rules={{ required: 'Ангилалаа сонгоно уу' }} {...{ label, name, control }} />
   );
};

const CategoryInputs = ({ children }: { children: ReactNode }) => {
   return (
      <div className="wrapper p-7 mb-5">
         <div className="mb-5 text-muted-text font-normal">Асуултанд хамаарах үндсэн бүлэгүүд</div>
         <div className="flex gap-10">{children}</div>
      </div>
   );
};

type TAnswers = {
   answer: string;
   is_correct: boolean;
   sub_question_id?: string;
   sort_number: number;
   // "mark": 0
};
type TQuestionTypes = {
   question: string;
   score: number;
   category_id: string;
   sub_category_id: string;
   answers: TAnswers[];
};

const InitialAnswer: TAnswers[] = [
   {
      answer: '',
      is_correct: false,
      sort_number: 0,
   },
   {
      answer: '',
      is_correct: false,
      sort_number: 1,
   },
];

export const WithSelect = ({ title }: { title: string }) => {
   const [showError, setShowError] = useState(false);
   const { control, handleSubmit, watch } = useForm<TQuestionTypes>({ defaultValues: { question: '', score: 0, category_id: '', sub_category_id: '', answers: InitialAnswer } });
   const { fields, append, remove } = useFieldArray({ control, name: 'answers', rules: { required: 'Хариултаа оруулна уу' } });

   const { isPending, mutate } = useMutation({
      // mutationFn: (body?: Omit<TQuestionTypes, 'id'> | undefined) =>
      mutationFn: (body: TQuestionTypes) =>
         request<Omit<TQuestionTypes, 'id'>>({
            method: 'post',
            url: `exam/question-with-answers`,
            body: body,
         }),
      onSuccess: (resdata) => {
         // setClose?.({});
         console.log(resdata, '------->resdata');
      },
   });

   const onSubmit = (data: TQuestionTypes) => {
      if (!watch()?.answers?.some((item) => item.is_correct)) {
         setShowError(true);
         return;
      }
      mutate(data);
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <Header
            title={title}
            action={
               <Button isLoading={isPending} type="submit">
                  <BsSave className="text-sm mr-1" />
                  Хадгалах
               </Button>
            }
         />

         <CategoryInputs>
            <CategorySelect control={control} name="category_id" current="main_category" label="Үндсэн ангилал" />
            <CategorySelect control={control} name="sub_category_id" current="sub_category" label="Дэд ангилал" />
         </CategoryInputs>

         <div className="wrapper p-7">
            <TextInput
               floatLabel={false}
               className="w-72 mb-5"
               name="score"
               control={control}
               rules={{ required: 'Асуултын оноо оруулах', min: { message: 'Хамгийн багадаа 1 оноо оруулах боломжтой', value: 1 } }}
               label="Асуултын оноо"
               placeholder="Оноо оруулах"
               type="number"
            />
            {/* end bururu avj baigaa string number garaad baigaa */}
            <Textarea
               className="w-full min-h-[100px]"
               name="question"
               control={control}
               label="Асуулт оруулах"
               placeholder="Асуултаа дэлгэрэнгүй оруулах"
               rules={{ required: 'Асуулт оруулах' }}
            />
            <div className="py-6 text-secondary/80 flex justify-between items-center">
               <span>Хариулт</span>

               <div className="text-danger-color flex items-center gap-2">
                  {showError && (
                     <>
                        <div className="relative">
                           <IoWarningOutline className="text-sm" />
                           <IoWarningOutline className="text-sm animate-ping absolute top-0 left-0" />
                        </div>
                        Зөв хариултаа сонгоно уу!s
                     </>
                  )}
               </div>
            </div>
            <div className="grid grid-cols-[1fr_1fr] gap-x-10 gap-y-6">
               {fields?.map((item, index) => {
                  return (
                     <div key={item.id} className="grid grid-cols-[auto_1fr] items-center gap-2 relative">
                        <Button disabled={fields.length === 2} onClick={() => remove(index)} size="icon" variant="ghost" className="rounded-full" type="button">
                           <IoCloseOutline className="text-[22px] text-danger-color " />
                        </Button>

                        <TextInput
                           control={control}
                           name={`answers.${index}.answer`}
                           rules={{ required: 'Хариултаа оруулна уу' }}
                           sizes="lg"
                           beforeAddon={<span className="font-light ml-1 text-base">{index + 1}.</span>}
                           className="w-full"
                           label="Хариулт оруулах"
                        />

                        <Controller
                           control={control}
                           name={`answers.${index}.is_correct`}
                           render={({ field }) => {
                              return (
                                 <div className="flex items-center gap-3 px-3 absolute right-[1px] top-[1px] bottom-[1px] w-36 rounded-md bg-card-bg">
                                    <Checkbox id={field.name} checked={field.value} onCheckedChange={(event) => (field.onChange(event), event ? setShowError(false) : null)} />
                                    <Label htmlFor={field.name} className="m-0">
                                       Зөв хариулт
                                    </Label>
                                 </div>
                              );
                           }}
                        />
                     </div>
                  );
               })}
            </div>
            <div className="py-8 pb-0 flex justify-end">
               <Button onClick={() => append({ ...InitialAnswer[0], sort_number: fields.length })} variant="outline" type="button" className="rounded-md">
                  <MdOutlineAdd className="text-base" /> Хариулт нэмэх
               </Button>
            </div>
         </div>
      </form>
   );
};

export const OpenQuestion = () => {
   const { control } = useForm({ defaultValues: { question: '', score: '' } });
   return (
      <>
         <div className="wrapper p-7">
            <TextInput floatLabel={false} className="w-72 mb-5" name="score" control={control} label="Асуултын оноо" placeholder="Оноо оруулах" type="number" />
            <Textarea className="w-full min-h-[100px]" name="question" control={control} label="Асуулт оруулах" placeholder="Асуултаа дэлгэрэнгүй оруулах" />
         </div>
      </>
   );
};

export const WithMedia = () => {
   const { control } = useForm({ defaultValues: { question: '', score: '' } });
   return (
      <>
         <div className="wrapper p-7">
            <TextInput floatLabel={false} className="w-72 mb-5" name="score" control={control} label="Асуултын оноо" placeholder="Оноо оруулах" type="number" />
            <Label htmlFor="123">Асуулт оруулах</Label>
            <CkEditor />
         </div>
      </>
   );
};

export const WithAdditional = () => {
   const { control } = useForm({ defaultValues: { question: '', score: '' } });
   return (
      <>
         <div className="wrapper p-7">
            <TextInput floatLabel={false} className="w-72 mb-5" name="score" control={control} label="Асуултын оноо" placeholder="Оноо оруулах" type="number" />
            <Textarea className="w-full min-h-[100px]" name="question" control={control} label="Асуулт оруулах" placeholder="Асуултаа оруулах" />
            <div className="py-5 text-secondary/70">Нэмэлт асуулт</div>

            <div className="grid grid-cols-[1fr_1fr] gap-x-10 gap-y-6">
               <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                  <Button size="icon" variant="ghost" className="rounded-full">
                     <IoCloseOutline className="text-[22px] text-danger-color " />
                  </Button>
                  <TextInput sizes="lg" beforeAddon={<span className="font-light ml-1 text-base">1.</span>} className="w-full" name="question" control={control} label="Асуулт оруулах" />
               </div>
            </div>
            <div className="py-8 pb-0 flex justify-end">
               <Button variant="outline" className="rounded-md">
                  <MdOutlineAdd className="text-base" /> Нэмэлт асуулт нэмэх
               </Button>
            </div>
         </div>
      </>
   );
};
