import { TextInput, Textarea, Button, Checkbox, Label, CkEditor, Header, AnimatedTabs, Badge, Drawer } from '@/components/custom';
import { useForm, useFieldArray, Controller, type FieldArrayWithId, type UseFieldArrayAppend } from 'react-hook-form';
import { IoCloseOutline } from 'react-icons/io5';
import { MdOutlineAdd } from 'react-icons/md';
import { useMutation } from '@tanstack/react-query';
import { request } from '@/lib/core/request';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { BsSave } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { IoWarningOutline } from 'react-icons/io5';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNavigate } from 'react-router-dom';
import { GoDotFill } from 'react-icons/go';
import { type TQuestionTypes, type TAnswers, type TInputTypeTab, type TInputType, type TQuestion } from '.';
import { cn } from '@/lib/utils';
import { BsChatSquareText } from 'react-icons/bs';
import { CategorySelect, type TObjectPettern } from './Action';
import { BsPencil } from 'react-icons/bs';
import { GoTrash } from 'react-icons/go';

// type TQTypesInBackEnd = 'radio' | 'checkbox' | 'text';

const InitialAnswer: TAnswers[] = [
   {
      answer: '',
      is_correct: false,
      sort_number: 0,
      mark: 0,
   },
   {
      answer: '',
      is_correct: false,
      sort_number: 1,
      mark: 0,
   },
];

const SelectTypes: TInputTypeTab[] = [
   { label: 'Нэг зөв хариулттай', key: 'select' },
   { label: 'Олон зөв хариулттай', key: 'multi_select' },
];

export const WithSelect = ({ title, type }: { title: string; type: TQuestion }) => {
   const navigate = useNavigate();
   const [showError, setShowError] = useState(false);
   const { control, handleSubmit, watch, setValue } = useForm<TQuestionTypes>({
      defaultValues: { question: '', score: 0, category_id: '', sub_category_id: '', input_type: 'select', answers: InitialAnswer },
   });

   const { fields, append, remove } = useFieldArray({ control, name: 'answers', rules: { required: 'Хариултаа оруулна уу' } });

   const { isPending, mutate } = useMutation({
      // mutationFn: (body?: Omit<TQuestionTypes, 'id'> | undefined) =>
      mutationFn: (body: TQuestionTypes) =>
         request<Omit<TQuestionTypes, 'id'>>({
            method: 'post',
            url: `exam/question-with-answers`,
            body: body,
         }),
      onSuccess: () => {
         navigate('/questions');
      },
   });

   const onSubmit = (data: TQuestionTypes) => {
      if (!watch()?.answers?.some((item) => item.is_correct)) {
         setShowError(true);
         return;
      }
      // input_type: 'select',
      // total_score: 20,
      mutate({ ...data, sort_number: 0, type: type, answers: data.answers.map((el, index) => ({ ...el, sort_number: index })) });
   };

   useEffect(() => {
      if (watch()?.input_type === 'multi_select') {
         setValue(
            'score',
            watch()
               .answers?.map((item) => item.mark)
               .reduce((prev, curr) => prev + curr, 0)
         );
      }
   }, [watch()]);

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

         <div className="wrapper p-7 mb-5">
            <div className="flex gap-10 mb-5">
               <CategorySelect control={control} name="category_id" current="main_category" label="Үндсэн ангилал" />
               <CategorySelect control={control} disabled={!watch()?.category_id} idKey={watch()?.category_id} name="sub_category_id" current="sub_category" label="Дэд ангилал" />
            </div>

            <Textarea
               className="w-full min-h-[100px]"
               name="question"
               control={control}
               label="Асуулт оруулах"
               placeholder="Асуултаа дэлгэрэнгүй оруулах"
               rules={{ required: 'Асуулт оруулах' }}
            />
         </div>

         <div className={cn('wrapper p-7 mb-5 relative', showError ? `border-danger-color` : ``)}>
            <div className="pb-12 flex justify-between items-end">
               <Controller
                  control={control}
                  name="input_type"
                  render={({ field }) => {
                     return (
                        <AnimatedTabs
                           className="mb-0 -mt-2 text-xs"
                           items={SelectTypes}
                           activeKey={field.value}
                           onChange={(value) => {
                              if (value === 'select') {
                                 setValue(
                                    'answers',
                                    fields.map((item) => ({ ...item, is_correct: false, mark: 0 }))
                                 );
                              }

                              field.onChange(value as TInputType);
                           }}
                        />
                     );
                  }}
               />
               <TextInput
                  // floatLabel={false}
                  className="w-72 mb-0"
                  name="score"
                  disabled={watch()?.input_type === 'multi_select'}
                  control={control}
                  beforeAddon={<GoDotFill className="text-xs" />}
                  rules={{ required: 'Хариултын оноо оруулах', min: { message: 'Хамгийн багадаа 1 оноо оруулах боломжтой', value: 1 } }}
                  label="Асуултанд авах оноо"
                  placeholder="Оноо оруулах"
                  type="number"
               />
            </div>
            <div className={cn('grid grid-cols-[1fr_1fr] gap-x-10 gap-y-6', watch()?.input_type === 'multi_select' && 'grid-cols-[1fr]')}>
               {fields?.map((item, index) => {
                  return (
                     <div key={item.id} className={cn('grid grid-cols-[1fr_auto] items-center gap-3', watch()?.input_type === 'multi_select' && `grid-cols-[1fr_auto_auto] gap-8`)}>
                        <div className="relative">
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
                              name={`answers.${index}.is_correct` as const}
                              render={({ field }) => {
                                 return (
                                    <div className="flex items-center gap-3 px-3 absolute right-[1px] top-[1px] bottom-[1px] w-36 rounded-md bg-card-bg">
                                       <Checkbox
                                          name={field.name}
                                          id={field.name}
                                          checked={field.value}
                                          onCheckedChange={(event) => {
                                             event ? setShowError(false) : null;
                                             const newValue = watch()?.answers.map((element, ind) =>
                                                ind === index
                                                   ? { ...element, mark: event ? element.mark : 0, is_correct: event ? true : false }
                                                   : watch()?.input_type === 'select'
                                                   ? { ...element, is_correct: false }
                                                   : element
                                             );
                                             setValue('answers', newValue);
                                          }}
                                       />
                                       <Label htmlFor={field.name} className="m-0">
                                          Зөв хариулт
                                       </Label>
                                    </div>
                                 );
                              }}
                           />
                        </div>

                        {watch()?.input_type === 'multi_select' ? (
                           <div className="w-80">
                              {item.is_correct ? (
                                 <TextInput
                                    control={control}
                                    name={`answers.${index}.mark`}
                                    // rules={{ required: 'Хариултанд харгалзах оноо' }}
                                    rules={{ required: 'Хариултын оноо оруулах', min: { message: 'Хамгийн багадаа 1 оноо оруулах боломжтой', value: 1 } }}
                                    sizes="lg"
                                    autoFocus
                                    beforeAddon={<GoDotFill className="text-xs" />}
                                    className="w-full"
                                    label="Зөв хариултанд харгалзах оноо"
                                    type="number"
                                 />
                              ) : (
                                 <span className="text-muted-text opacity-60">
                                    <span className="text-lg font-medium">0 / </span> оноо
                                 </span>
                              )}
                           </div>
                        ) : null}

                        <Button disabled={fields.length === 2} onClick={() => remove(index)} size="icon" variant="ghost" className="rounded-full" type="button">
                           <IoCloseOutline className="text-[22px] text-danger-color " />
                        </Button>
                     </div>
                  );
               })}
            </div>
            <div className="py-10 pb-0 flex justify-end">
               <Button onClick={() => append({ ...InitialAnswer[0], sort_number: fields.length })} variant="outline" type="button" className="rounded-md">
                  <MdOutlineAdd className="text-base" /> Хариулт нэмэх
               </Button>
            </div>

            {showError && (
               <div className="text-danger-color flex items-center gap-2 absolute right-4 -top-3 bg-card-bg px-4 py-1 rounded-md">
                  <div className="relative">
                     <IoWarningOutline className="text-sm" />
                     <IoWarningOutline className="text-sm animate-ping absolute top-0 left-0" />
                  </div>
                  Зөв хариултаа сонгоно уу!
               </div>
            )}
         </div>
         <div className="flex justify-center">
            <Button type="button" variant="outline" size="lg" className={cn('relative rounded-full py-6 shadow-sm')}>
               <MdOutlineAdd className="text-xl" />{' '}
               <Badge variant="secondary" className="text-xs rounded-full">
                  {title}
               </Badge>{' '}
               дотор асуулт нэмэх
            </Button>
         </div>
      </form>
   );
};

const SelectInputTypes: TInputTypeTab[] = [
   { label: 'Богино хариулттай', key: 'text' },
   { label: 'Урт хариулттай', key: 'text_long' },
   { label: 'Дүрс зурагтай - асуулт / хариулт', key: 'text_format' },
];

export const OpenQuestion = ({ title }: { title: string }) => {
   // const { control } = useForm({ defaultValues: { question: '', score: '' } });
   const { control, watch } = useForm<TQuestionTypes>({
      defaultValues: { question: '', score: 0, category_id: '', sub_category_id: '', input_type: 'text' },
   });

   const { isPending } = useMutation({
      mutationFn: (body: TQuestionTypes) =>
         request<Omit<TQuestionTypes, 'id'>>({
            method: 'post',
            url: `exam/question-with-answers`,
            body: body,
         }),
      onSuccess: () => {
         // navigate('/questions');
      },
   });

   return (
      <>
         <Header
            title={title}
            action={
               <Button isLoading={isPending} type="submit">
                  <BsSave className="text-sm mr-1" />
                  Хадгалах
               </Button>
            }
         />

         <div className="wrapper p-7 mb-5">
            <div className="flex gap-10 mb-5">
               <CategorySelect control={control} name="category_id" current="main_category" label="Үндсэн ангилал" />
               <CategorySelect control={control} disabled={!watch()?.category_id} idKey={watch()?.category_id} name="sub_category_id" current="sub_category" label="Дэд ангилал" />
            </div>
         </div>
         <div className="wrapper p-7 mb-5">
            <div className="pb-12 flex justify-between items-end">
               <Controller
                  control={control}
                  name="input_type"
                  render={({ field }) => {
                     return (
                        <AnimatedTabs
                           className="mb-0 text-xs"
                           items={SelectInputTypes}
                           activeKey={field.value}
                           onChange={(value) => {
                              field.onChange(value as TInputType);
                           }}
                        />
                     );
                  }}
               />
               <TextInput
                  // floatLabel={false}
                  className="w-72 mb-0"
                  name="score"
                  disabled={watch()?.input_type === 'multi_select'}
                  control={control}
                  beforeAddon={<GoDotFill className="text-xs" />}
                  rules={{ required: 'Хариултын оноо оруулах', min: { message: 'Хамгийн багадаа 1 оноо оруулах боломжтой', value: 1 } }}
                  label="Асуултанд авах оноо"
                  placeholder="Оноо оруулах"
                  type="number"
               />
            </div>

            {watch()?.input_type === 'text_format' ? (
               <>
                  <Controller
                     control={control}
                     name="question"
                     rules={{ required: 'Асуулт оруулах' }}
                     render={({ field, fieldState }) => {
                        return (
                           <>
                              <Label htmlFor={field.name}>
                                 Асуулт оруулах <span className="text-danger-color">*</span>
                              </Label>
                              <CkEditor />
                              <ErrorMessage error={fieldState?.error} />
                           </>
                        );
                     }}
                  />
               </>
            ) : (
               <Textarea
                  className={cn('w-full transition-all', watch()?.input_type === 'text_long' ? `min-h-[220px]` : `min-h-[80px]`)}
                  name="question"
                  control={control}
                  label="Асуулт оруулах"
                  placeholder="Асуултаа дэлгэрэнгүй оруулах"
                  rules={{ required: 'Асуулт оруулах' }}
               />
            )}
         </div>
      </>
   );
};

const fillerInputTypes = {
   question: {
      label: 'Асуулт',
   },
   answer: {
      label: 'Хариулт',
   },
};

type fillerTypeEnum = keyof typeof fillerInputTypes;

type TQuestionLine = {
   value: string;
   type: fillerTypeEnum;
};

const fillerList: TQuestionLine = {
   value: 'Асууулт 123',
   type: 'question',
};

const fillerTabItem: TInputTypeTab[] = [
   { label: 'Хариулт харагдахгүй', key: 'filler' },
   { label: 'Хариултын сонголт харагдана', key: 'filler_select' },
];

// const temp = [
//    {
//       is_answer: false,
//       text: 'Asuult 123'
//    },
//    null,
//    {
//       is_answer: false,
//       text: 'Asuult'
//    }
//    // {
//    //    is_answer: true,
//    //    text: 'Hariult 1123'
//    // }
// ]

type TQuestionTypesInFront = { [Key in fillerTypeEnum]: Omit<TObjectPettern, 'component' | 'type'> };

const questionAsset: TQuestionTypesInFront = {
   question: {
      label: 'Асуулт хэсэг',
      description: 'Асуултын оролцогчид харагдах хэсэг',
      icon: BsChatSquareText,
   },
   answer: {
      label: 'Харуилт хэсэг',
      description: 'Шалгалтанд оролцогч нөхөж бичих хэсэг',
      icon: HiOutlineDotsHorizontal,
   },
};

export const Filler = ({ title }: { title: string }) => {
   const [qAction, setQAction] = useState<{ isOpen: boolean; type: fillerTypeEnum }>({ isOpen: false, type: 'answer' });

   const { control, watch } = useForm<Omit<TQuestionTypes, 'questionLine'> & { questionLine: TQuestionLine[] }>({
      defaultValues: { question: '', input_type: 'filler', score: 0, questionLine: [fillerList, fillerList, { type: 'answer', value: 'hariult123123123' }, fillerList] },
   });

   const { fields, append, remove } = useFieldArray({ control, name: 'questionLine' });

   // console.log(fields, '------->field');
   return (
      <>
         <Header
            title={title}
            // action={
            //    <Button isLoading={isPending} type="submit">
            //       <BsSave className="text-sm mr-1" />
            //       Хадгалах
            //    </Button>
            // }
         />
         <div className="wrapper p-7 mb-5">
            <div className="flex gap-10 mb-5">
               <CategorySelect control={control} name="category_id" current="main_category" label="Үндсэн ангилал" />
               <CategorySelect control={control} disabled={!watch()?.category_id} idKey={watch()?.category_id} name="sub_category_id" current="sub_category" label="Дэд ангилал" />
            </div>
         </div>

         <div className="wrapper p-7 mb-5">
            <div className="pb-12 flex justify-between items-end">
               <Controller
                  control={control}
                  name="input_type"
                  render={({ field }) => {
                     return (
                        <AnimatedTabs
                           className="mb-0 text-xs"
                           items={fillerTabItem}
                           activeKey={field.value}
                           onChange={(value) => {
                              field.onChange(value as TInputType);
                           }}
                        />
                     );
                  }}
               />
               <TextInput
                  // floatLabel={false}
                  className="w-72 mb-0"
                  name="score"
                  disabled={true}
                  control={control}
                  beforeAddon={<GoDotFill className="text-xs" />}
                  rules={{ required: 'Хариултын оноо оруулах', min: { message: 'Хамгийн багадаа 1 оноо оруулах боломжтой', value: 1 } }}
                  label="Асуултанд авах оноо"
                  placeholder="Оноо оруулах"
                  type="number"
               />
            </div>
            {/* <div className="p-7 py-3 border-b">Асуулт оруулах</div> */}
            {/* <TextInput floatLabel={false} className="w-72 mb-5" name="score" control={control} label="Асуултын оноо" placeholder="Оноо оруулах" type="number" /> */}

            <div className="flex gap-y-2 items-center flex-wrap">
               <div className="group flex gap-x-2 gap-y-2 items-center flex-wrap">
                  {fields.map((item, index) => {
                     return (
                        <div
                           key={item.id}
                           className={cn(
                              'relative group/items bg-card-bg group-hover:opacity-40 border cursor-pointer rounded-md leading-[2.3rem] border-transparent group-hover:hover:opacity-100 group-hover:hover:border-primary/20  max-w-full transition-all duration-500 py-1 px-2 ', //group-hover:hover:px-3
                              item.type === 'answer' ? `text-primary` : ``
                              // item.value?.length > 50 ? `group-hover:hover:scale-120` : `group-hover:hover:scale-200`
                           )}
                        >
                           <div className="text-pretty">{item.value}</div>

                           <div className="flex cursor-default items-center gap-2 absolute w-full -top-10 translate-y-1/2 -left-2 opacity-0 scale-0 transition-all duration-200 group-hover/items:opacity-100 group-hover/items:scale-100">
                              <Button variant="outline" className="rounded-full h-7 w-7 min-w-7" size="icon">
                                 <BsPencil className="text-xs2" />
                              </Button>
                              <Button onClick={() => remove(index)} variant="outline" className="rounded-full h-8 w-8 min-w-7" size="icon">
                                 <GoTrash className="text-sm" />
                              </Button>
                           </div>
                        </div>
                     );
                  })}
               </div>

               <Popover>
                  <PopoverTrigger asChild>
                     <Button className="rounded-full ml-2 bg-primary/10" variant="outline" size="icon">
                        <MdOutlineAdd className="text-lg" />
                     </Button>
                  </PopoverTrigger>

                  <PopoverContent className="p-6 w-78 flex flex-col gap-4" align="center" sideOffset={8}>
                     {Object.keys(questionAsset)?.map((item, index) => {
                        const Icon = questionAsset[item as fillerTypeEnum]?.icon;
                        return (
                           <div
                              onClick={() => setQAction({ isOpen: true, type: item as fillerTypeEnum })}
                              className="group p-4 hover:bg-primary/5 rounded-md cursor-pointer grid grid-cols-[auto_1fr] gap-4 border border-primary/20"
                              key={index}
                           >
                              <Icon className="text-xl text-secondary mt-1" />

                              <div className="flex flex-col gap-1">
                                 <span className="font-medium">{questionAsset[item as fillerTypeEnum]?.label}</span>
                                 <span className="text-muted-text text-xs">{questionAsset[item as fillerTypeEnum]?.description}</span>
                              </div>
                           </div>
                        );
                     })}
                  </PopoverContent>
               </Popover>
            </div>

            <Drawer
               open={qAction.isOpen}
               onOpenChange={(event) => setQAction((prev) => ({ ...prev, isOpen: event }))}
               title={questionAsset[qAction.type]?.label}
               content={
                  <FillerAnserAction
                     onClose={() => setQAction({ isOpen: false, type: 'answer' })}
                     label={`${questionAsset[qAction.type]?.label} оруулах`}
                     type={qAction.type}
                     {...{ append, fields }}
                  />
               }
               className={`py-2 max-w-2xl`}
            />

            {/* <CkEditor /> */}
         </div>
      </>
   );
};

type TFillerAction = {
   label: string;
   fields: FieldArrayWithId<
      Omit<TQuestionTypes, 'questionLine'> & {
         questionLine: TQuestionLine[];
      },
      'questionLine',
      'id'
   >[];
   append: UseFieldArrayAppend<
      Omit<TQuestionTypes, 'questionLine'> & {
         questionLine: TQuestionLine[];
      },
      'questionLine'
   >;
   type: fillerTypeEnum;
   onClose: () => void;
};

const FillerAnserAction = ({ label, append, fields, type, onClose }: TFillerAction) => {
   const { control, handleSubmit } = useForm({
      defaultValues: { value: '', type: type },
   });

   const onSubmit = (data: { value: string }) => {
      append({ value: data.value, type: type });
      onClose?.();
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="py-6">
         <div className="py-6 flex items-center gap-2 flex-wrap">
            {fields.map((item) => {
               return (
                  <div className="opacity-50" key={item.id}>
                     {item.value}
                  </div>
               );
            })}
            <TextInput floatLabel={false} className="w-72" placeholder={label} control={control} name="value" rules={{ required: label }} autoFocus />
         </div>

         <div className="flex mt-7 justify-end">
            <Button className="ml-auto">Хадгалах</Button>
         </div>
      </form>
   );
};
