import { BreadCrumb, SelectInput, Header, Button, UsePrompt, Dialog, DeleteContent } from '@/components/custom';
import { useEffect, useState } from 'react';
import { MdOutlineAdd } from 'react-icons/md';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { TBreadCrumb } from '@/components/custom/BreadCrumb';
import { useGetCategories, type TKeys } from '../category';
import { type FieldValues, useForm, type Control, type UseFormWatch, type UseFormSetValue, useFieldArray, type UseFieldArrayAppend } from 'react-hook-form'; //useFieldArray
import { useMutation } from '@tanstack/react-query';
import { TControllerProps, type TAction, type TActionProps } from '@/lib/sharedTypes'; //type TActionProps
// import { TControllerProps } from '@/lib/sharedTypes';
import { WithSelect, OpenQuestion } from './QuestionTypes'; // Filler -- daraa nemchine
import { type TQuestion, type TQuestionTypes, type TAnswers, type TInputType, SelectQuestionType } from '.';
import { IconType } from 'react-icons/lib';
import { GoCheckCircle } from 'react-icons/go';
import { BsSave } from 'react-icons/bs';
import { IoTextOutline } from 'react-icons/io5';
import { request } from '@/lib/core/request';
import { cn } from '@/lib/utils';
import ActionButtons from '@/components/ActionButtons';

// eslint-disable-next-line react-refresh/only-export-components
// [ multi_select, select, text, drag_drop, multi_drag_drop ] - essay hassan
// export type TQTypes = 'withSelect' | 'openQuestion'; // | 'fill';
// | 'withAdditional';

type AdditionalProps = {
   setShowError: React.Dispatch<React.SetStateAction<boolean>>;
   showError: boolean;
};

export type TQTypesProps = {
   control: Control<TQuestionTypes>;
   // control: TControllerProps['control'];
   watch?: UseFormWatch<TQuestionTypes>;
   setValue: UseFormSetValue<TQuestionTypes>;
   idPrefix?: string;
   // sumName?: TControllerProps['name'];
} & AdditionalProps;

export type TObjectPettern = {
   label: string;
   component: ({ control, watch, setValue, setShowError, showError }: TQTypesProps) => JSX.Element;
   type: TQuestion;
   description: string;
   icon: IconType;

   input_type: TInputType;
   // 'multi_select' | 'select' | 'text' | 'richtext' | 'text_format' | 'filler' | 'filler_with_choice';
};

type TQuestionTypesInFront = { [Key in TQuestion]: TObjectPettern };

// eslint-disable-next-line react-refresh/only-export-components
export const questionAsset: TQuestionTypesInFront = {
   checkbox: {
      label: 'Сонголттой асуулт',
      component: WithSelect,
      type: 'checkbox',
      description: 'Нэг болон олон сонголттой тест',
      icon: GoCheckCircle,
      input_type: 'select', // default type
   },
   text: {
      label: 'Нээлттэй асуулт',
      component: OpenQuestion,
      type: 'text',
      description: 'Энгийн болон Эссэ бичих боломжтой',
      icon: IoTextOutline,
      input_type: 'text', // default type
   },
   // filler: {
   //    label: 'Нөхөж бичих',
   //    component: Filler,
   //    type: 'text', // filler gedeg typetai bolno
   //    description: 'Өгүүлбэр дунд хариулт нөхөж оруулах боломжтой',
   //    icon: HiOutlineDotsHorizontal,
   // },
};

type TSelectProps = { current: TKeys; label: string; disabled?: boolean; idKey?: string };

export const CategorySelect = <TFieldValues extends FieldValues>({ control, name, current, label, disabled, idKey }: TControllerProps<TFieldValues> & TSelectProps) => {
   const { data } = useGetCategories({ current, idKey });
   return (
      <SelectInput
         disabled={disabled}
         options={data?.data ? data.data?.map((item) => ({ value: item.id, label: item.name })) : []}
         rules={{ required: 'Ангилалаа сонгоно уу' }}
         {...{ label, name, control }}
      />
   );
};

// export type TQTypes = keyof typeof qTypes;

const GroupAction = ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => {
   const [search] = useSearchParams({});
   const searchAsObject = Object.fromEntries(new URLSearchParams(search));

   return (
      <>
         <BreadCrumb pathList={[...breadcrumbs.map((item) => ({ ...item, isActive: false })), { to: '#', label: 'Тестийн сан үүсгэх', isActive: true }]} />
         {/* <Component title={questionAsset[searchAsObject.type as TQTypes]?.label} type={questionAsset[searchAsObject.type as TQTypes]?.type} /> */}
         <ActionWrapper type={searchAsObject.type as TQuestion} />
      </>
   );
};

export default GroupAction;
// eslint-disable-next-line react-refresh/only-export-components
export const InitialAnswer: TAnswers = { answer: '', is_correct: false, mark: 0 }; //sort_number: 0,

const inititalState = { question: '', score: 0, category_id: '', sub_category_id: '', answers: [], sub_questions: [] };

const ActionWrapper = ({ type }: { type: TQuestion }) => {
   const { typeid } = useParams();
   const [subType, setSubType] = useState<{ type: TQuestion; index: number }>({ type: 'checkbox', index: 0 });
   const [action, setAction] = useState<TAction<TQuestionTypes>>({ isOpen: false, type: 'add', data: {} as TQuestionTypes });
   const [showError, setShowError] = useState(false);
   const navigate = useNavigate();
   const Component = questionAsset[type as TQuestion]?.component;
   const {
      control,
      handleSubmit,
      watch,
      setValue,
      reset,
      formState: { isDirty },
   } = useForm<TQuestionTypes>({
      defaultValues: { ...inititalState, input_type: questionAsset[type as TQuestion]?.input_type }, //answers: InitialAnswer
   });

   const { fields, append, remove } = useFieldArray({ control, name: 'sub_questions' });

   useEffect(() => {
      if (typeid === 'create') {
         reset({ type: type, answers: [InitialAnswer, InitialAnswer] });
         return;
      }
      // anser -- iig sort hiij bgad reset hii
      // if(!!typeid){
      //    reset(data);
      // }

      // update deer ooroor avna
   }, [typeid]);

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
      // sort_number: 0,
      // sort_number
      // mutate({ ...data, answers: data.answers.map((el, index) => ({ ...el, sort_number: index })) }); // type: type,
      mutate({ ...data, answers: data.answers.map((el, index) => ({ ...el, sort_number: index })) }); // type: type,
   };

   const setClose = () => {
      setAction((prev) => ({ ...prev, isOpen: false }));
   };

   UsePrompt({ isBlocked: isDirty });
   // , type: TAction<TQuestionTypes>['type']
   const rowAction = (item: TQuestion, type: TAction<TQuestionTypes>['type'], data?: TAction<TQuestionTypes>['data'], index?: number) => {
      setSubType({ type: item, index: index ?? 0 });
      setAction({ isOpen: true, type: type, data: data });
   };

   return (
      <>
         <form onSubmit={handleSubmit(onSubmit)}>
            <Header
               title={questionAsset[type as TQuestion]?.label}
               action={
                  <Button disabled={!isDirty} isLoading={isPending} type="submit">
                     <BsSave className="text-sm mr-1" />
                     Хадгалах
                  </Button>
               }
            />
            <div className="wrapper p-7 pt-4 mb-5 flex gap-10 relative">
               <CategorySelect control={control} name="category_id" current="main_category" label="Үндсэн ангилал" />
               <CategorySelect control={control} disabled={!watch()?.category_id} idKey={watch()?.category_id} name="sub_category_id" current="sub_category" label="Дэд ангилал" />
               <div className="h-[1.34rem] w-0.5 bg-primary/40 absolute top-full left-10" />
            </div>

            <div className="grid gap-5 grid-cols-[1fr_260px]">
               <Component control={control} watch={watch} setValue={setValue} {...{ setShowError, showError }} />
               <div>
                  <div className="flex justify-center mb-4 w-full">
                     <SelectQuestionType rowAction={(item) => rowAction(item as TQuestion, 'add')}>
                        <Button type="button" variant="outline" size="lg" className={cn('flex items-center relative rounded-full py-5 shadow-sm w-full')}>
                           <MdOutlineAdd className="text-base" /> Нэмэлт асуулт нэмэх
                        </Button>
                     </SelectQuestionType>
                  </div>
                  {fields.length > 0 && (
                     <div className="wrapper relative">
                        <div className="p-3 px-4 border-b text-muted-text font-medium">Нэмэлт асуултууд</div>
                        {fields.map((item) => {
                           return (
                              <div key={item.id} className="group/items p-3 px-4 hover:bg-primary/10 cursor-pointer relative grid grid-cols-[18px_1fr] gap-1">
                                 <div>1</div>
                                 <div className="one_line">{item.question}</div>
                                 <ActionButtons editTrigger={() => rowAction(item.type, 'edit')} deleteTrigger={() => rowAction(item.type, 'delete')} />
                              </div>
                           );
                        })}

                        <div className="h-0.5 w-[1.34rem] bg-primary/40 absolute right-full top-6" />
                     </div>
                  )}
               </div>
            </div>
         </form>
         <Dialog
            className={cn('pt-0', action.type === 'delete' ? 'w-[600px]' : 'w-[800px]')}
            isOpen={action.isOpen}
            onOpenChange={(event) => setAction((prev) => ({ ...prev, isOpen: event }))}
            title="Асуулт дотор асуулт нэмэх"
         >
            <SubWrapper {...{ action, setClose, append }} type={subType.type} remove={() => remove(subType.index)} />
         </Dialog>
      </>
   );
};

const SubWrapper = ({
   type,
   action,
   setClose,
   append,
   remove,
}: TActionProps<TQuestionTypes> & { type: TQuestion; append: UseFieldArrayAppend<TQuestionTypes, 'sub_questions'>; remove: () => void }) => {
   const [showError, setShowError] = useState(false);
   const { control, handleSubmit, watch, setValue } = useForm<TQuestionTypes>({
      defaultValues: { ...inititalState, type: type, input_type: questionAsset[type as TQuestion]?.input_type }, //answers: InitialAnswer
   });

   const Component = questionAsset[type as TQuestion]?.component;

   const onSubmit = (data: TQuestionTypes) => {
      if (type === 'checkbox') {
         if (!watch()?.answers?.some((item) => item.is_correct)) {
            setShowError(true);
            return;
         }
      }

      if (action.type === 'add') {
         append(data);
      }

      setClose?.({});
   };

   if (action.type === 'delete') {
      return <DeleteContent setClose={setClose} submitAction={() => (remove(), setClose?.({}))} />;
   }

   // margaash guitseene deee

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
         <Component idPrefix="sub_questions" control={control} watch={watch} setValue={setValue} {...{ setShowError, showError }} />
         <div className="flex justify-end py-4">
            <Button type="submit">
               <BsSave className="text-sm mr-1" />
               Хадгалах
            </Button>
         </div>
      </form>
   );
};
