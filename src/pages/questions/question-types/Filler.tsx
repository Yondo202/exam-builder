import { TextInput, Button, AnimatedTabs, Drawer, DeleteContent } from '@/components/custom';
import ActionButtons from '@/components/ActionButtons';
import { useForm, useFieldArray, Controller, type FieldArrayWithId, type UseFieldArrayAppend, type UseFieldArrayUpdate } from 'react-hook-form';
import { MdOutlineAdd } from 'react-icons/md';
import { BsQuestionSquare } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { GoDotFill } from 'react-icons/go';
import { type TQuestionTypes, type TInputTypeTab, type TInputType, TTempType, type TAnswers, type AllTypesQuestionTypes } from '..';
import { cn } from '@/lib/utils';
import { BsChatSquareText } from 'react-icons/bs';
import { type TObjectPettern, type TQTypesProps, ScoreInput } from '../Action';
import { ScoreValue } from '../components/TotolUi';
import { MarkTotal } from '../components/utils';
import { type TAction, type TActionProps } from '@/lib/sharedTypes'; //type TActionProps
import { FillArrayToString } from '../components/utils';
import { FillConverter } from '../components/utils';

const fillerTabItem: TInputTypeTab[] = [
   { label: 'Хариулт харагдахгүй', key: 'fill' },
   { label: 'Хариултын сонголт харагдана', key: 'fill_with_choice' },
];

type TQuestionTypesInFront = { [Key in TTempType]: Pick<TObjectPettern, 'label' | 'description' | 'icon'> };

const questionAsset: TQuestionTypesInFront = {
   question: {
      label: 'Асуулт хэсэг',
      description: 'Асуултын оролцогчид харагдах хэсэг',
      icon: BsChatSquareText,
   },
   answer: {
      label: 'Харуилт хэсэг',
      description: 'Шалгалтанд оролцогч нөхөж бичих хэсэг',
      icon: BsQuestionSquare,
   },

   wrong_answer: {
      label: 'Буруу хариултын сонголт',
      description: 'Шалгалтанд оролцогч нөхөж бичих хэсэг',
      icon: BsQuestionSquare,
   },
};

export const FillerSubmit = ({ answers }: { answers: TAnswers[] }) => {
   // let answers: TAnswers[] = [];
   return [...(answers?.filter((item) => item.temp_type === 'answer') ?? []), ...(answers?.filter((item) => item.temp_type === 'wrong_answer') ?? [])];
};

export const FillerSetConvert = ({ data }: { data?: AllTypesQuestionTypes }) => {
   // let answers: TAnswers[] = [];
   let finalAnswers: TAnswers[] = [];

   if (data?.type === 'fill') {
      let count = 0;

      const questionWithCorrectAnswer = FillConverter({ input: data?.question })?.map((item) => {
         if (item.temp_type === 'answer') {
            const foundAnswer = data?.answers.find((el) => el.answer === item.answer);
            const temp = { ...item, ...foundAnswer, fill_index: count };
            count++;
            return temp;
         }
         return item;
      });

      finalAnswers = [
         ...(questionWithCorrectAnswer ?? []),
         ...(data.answers.filter((item) => !item.is_correct)?.map((item) => ({ ...item, temp_type: 'wrong_answer' as TAnswers['temp_type'] })) ?? []),
      ];
   }

   return finalAnswers ?? [];
   // return [...(answers?.filter((item) => item.temp_type === 'answer') ?? []), ...(answers?.filter((item) => item.temp_type === 'wrong_answer') ?? [])];
};

// export const Filler = ({ idPrefix }: { title: string }) => {
export const Filler = ({ control, watch, idPrefix, setValue }: TQTypesProps) => {
   const [action, setAction] = useState<TAction<TAnswers>>({ isOpen: false, type: 'add', data: {} as TAnswers });
   const [subType, setSubType] = useState<{ temp_type: TTempType; index: number }>({ temp_type: 'answer', index: 0 });
   const { fields, append, remove, update } = useFieldArray({ control, keyName: '_id', name: 'answers' });

   const setClose = () => {
      setAction((prev) => ({ ...prev, isOpen: false }));
   };

   useEffect(() => {
      // let answers: TAnswers[] = [];
      // if (data.type === 'fill') {
      //    answers = [...(data.answers?.filter((item) => item.temp_type === 'answer') ?? []), ...(data.answers?.filter((item) => item.temp_type === 'wrong_answer') ?? [])];
      // }
      // answers: answers?.map((el, index) => ({ ...el, sort_number: index })),

      // mutate({
      //    ...data,
      //    score: data.score + subTotal,
      //    sort_number: 0,
      //    // question: data.type === 'fill' ? FillArrayToString({ answers: data.answers }) : data.question,
      //    answers: answers?.map((el, index) => ({ ...el, sort_number: index })),
      // });

      setValue('question', FillArrayToString({ answers: watch?.('answers') ?? [] }));

      setValue('score', MarkTotal({ answers: watch?.()?.answers }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [JSON.stringify(watch?.('answers'))]);

   const rowAction = (temp_type: TTempType, type: TAction<TAnswers>['type'], data?: TAction<TAnswers>['data'], index?: number) => {
      setSubType({ temp_type: temp_type, index: index ?? 0 });
      setAction({ isOpen: true, type: type, data: data });
   };

   const FieldsComponent = ({ isWrongAnswer, className }: { isWrongAnswer?: boolean; className?: string }) => {
      return (
         <div className={cn('group flex gap-x-2 gap-y-2 items-center flex-wrap', className)}>
            {fields.map((item, index) => {
               if (isWrongAnswer ? item.temp_type !== 'wrong_answer' : item.temp_type === 'wrong_answer') return;
               return (
                  <div
                     key={item._id}
                     className={cn(
                        'relative group/items bg-card-bg group-hover:opacity-40 border cursor-pointer rounded-md leading-[2.3rem] border-transparent group-hover:hover:opacity-100 group-hover:hover:border-primary/20  max-w-full transition-all duration-500 py-1 px-2 ', //group-hover:hover:px-3
                        item.temp_type === 'answer' ? `text-primary` : ``
                     )}
                  >
                     <div className="text-pretty">{item.answer}</div>

                     {item.temp_type === 'answer' && item.mark > 0 && <ScoreValue count={item.mark} />}

                     <ActionButtons
                        className="w-full -top-10 translate-y-1/2 -left-2"
                        editTrigger={() => rowAction(item.temp_type as TTempType, 'edit', item, index)}
                        deleteTrigger={() => rowAction(item.temp_type as TTempType, 'delete', item, index)}
                     />
                  </div>
               );
            })}
         </div>
      );
   };

   return (
      <div>
         <div className={cn('wrapper p-7 pt-0 mb-5', idPrefix ? `p-0 mb-4 border-none shadow-none` : ``)}>
            <Controller
               control={control}
               name="input_type"
               render={({ field }) => {
                  return (
                     <AnimatedTabs
                        className="mb-8 text-xs"
                        items={fillerTabItem}
                        activeKey={field.value}
                        onChange={(value) => {
                           field.onChange(value as TInputType);
                        }}
                     />
                  );
               }}
            />

            <ScoreInput {...{ watch, control, idPrefix, disabled: true }} className="flex items-center gap-0 mb-10" isLine />

            <div className="flex gap-y-2 items-center flex-wrap">
               <FieldsComponent />
               <Popover>
                  <PopoverTrigger asChild>
                     <Button className="rounded-full ml-2 bg-primary/10" variant="outline" size="icon" type="button">
                        <MdOutlineAdd className="text-lg" />
                     </Button>
                  </PopoverTrigger>

                  <PopoverContent className="p-6 w-78 flex flex-col gap-4" align="center" sideOffset={8}>
                     {Object.keys(questionAsset)
                        .filter((item) => item !== 'wrong_answer')
                        ?.map((item, index) => {
                           const Icon = questionAsset[item as TTempType]?.icon;
                           return (
                              <div
                                 // onClick={() => setQAction({ isOpen: true, type: item as TTempType })}
                                 onClick={() => rowAction(item as TTempType, 'add', undefined, fields.length)}
                                 className="group p-4 hover:bg-primary/5 rounded-md cursor-pointer grid grid-cols-[auto_1fr] gap-4 border border-primary/20"
                                 key={index}
                              >
                                 <Icon className="text-xl text-secondary mt-1" />

                                 <div className="flex flex-col gap-1">
                                    <span className="font-medium">{questionAsset[item as TTempType]?.label}</span>
                                    <span className="text-muted-text text-xs">{questionAsset[item as TTempType]?.description}</span>
                                 </div>
                              </div>
                           );
                        })}
                  </PopoverContent>
               </Popover>
            </div>
         </div>
         {watch?.('input_type') === 'fill_with_choice' && (
            <>
               <div className={cn('py-0 pb-0 flex justify-center mb-4', idPrefix ? `py-3` : ``)}>
                  <Button variant="outline" size="sm" type="button" className="rounded-full" onClick={() => rowAction('wrong_answer', 'add', undefined, fields.length)}>
                     <MdOutlineAdd className="text-base" />
                     Хариултанд буруу сонголт нэмэх
                  </Button>
               </div>
               <div className="wrapper">
                  <div className="p-4 px-4 border-b text-muted-text font-medium text-xs">Буруу сонголтууд</div>
                  <FieldsComponent isWrongAnswer className="p-4 text-muted-text" />
               </div>
            </>
         )}

         <Drawer
            open={action.isOpen}
            onOpenChange={(event) => setAction((prev) => ({ ...prev, isOpen: event }))}
            title={questionAsset[subType.temp_type]?.label}
            content={
               <FillerAnserAction
                  // onClose={() => setQAction({ isOpen: false, type: 'answer' })}
                  label={`${questionAsset[subType.temp_type]?.label} оруулах`}
                  temp_type={subType.temp_type}
                  {...{ append, fields, setClose, action, update }}
                  remove={() => remove(subType.index)}
                  indexKey={subType.index}
               />
            }
            className={`py-2 max-w-2xl`}
         />
      </div>
   );
};

export type TFillerActionProps = {
   // type: TQuestion;
   append: UseFieldArrayAppend<TQuestionTypes, 'answers'>;
   remove: () => void;
   update: UseFieldArrayUpdate<TQuestionTypes, 'answers'>;
   indexKey: number;
   fields: FieldArrayWithId<TQuestionTypes, 'answers', '_id'>[];
   label: string;
   temp_type: TTempType;
} & TActionProps<TAnswers>;

const FillerAnserAction = ({ temp_type, action, setClose, append, remove, update, indexKey, fields, label }: TFillerActionProps) => {
   const { control, handleSubmit, reset } = useForm<TAnswers>({
      defaultValues: { answer: '', mark: 0, is_correct: true, temp_type: temp_type }, // iscorrect - iig asuu
   });

   useEffect(() => {
      // if (action.type === 'add') {
      //    reset({ ...InitialonCreate({ type }) });
      //    return;
      // }

      if (action.type !== 'add') {
         reset(action.data);
      }
   }, [action.type, action.isOpen]);

   const onSubmit = (data: TAnswers) => {
      if (action.type === 'add') {
         append({ ...data, is_correct: temp_type !== 'wrong_answer' });
      }

      if (action.type === 'edit') {
         update(indexKey, { ...data, is_correct: temp_type !== 'wrong_answer' });
      }

      setClose?.({});
   };

   if (action.type === 'delete') {
      return <DeleteContent setClose={setClose} submitAction={() => (remove(), setClose?.({}))} />;
   }

   // edit deer active input iig haruulj medegd bas hooson ued haruul
   return (
      <form onSubmit={handleSubmit(onSubmit)} id="form-id" className={cn('py-6', temp_type === 'answer' ? `pt-0` : ``)}>
         {/* <TextInput floatLabel={false} className="w-72" placeholder={label} control={control} name="answer" rules={{ required: label }} autoFocus /> */}

         {temp_type === 'answer' && (
            <TextInput
               control={control}
               name="mark"
               rules={{ required: 'Хариултанд авах оноо', min: { message: 'Оноо - 0 байх боломжгүй', value: 0.001 } }}
               // sizes="lg"
               autoFocus
               beforeAddon={<GoDotFill className="text-xs" />}
               className="w-60 mb-5"
               label="Хариултанд авах оноо"
               type="number"
               // idPrefix={idPrefix}
            />
         )}

         <div className="py-6 flex items-center gap-2 flex-wrap">
            {fields.map((item, index) => {
               if (temp_type === 'wrong_answer' ? item.temp_type !== 'wrong_answer' : item.temp_type === 'wrong_answer') return;
               if (action.type !== 'add' && index === indexKey) {
                  return <TextInput key={item._id} floatLabel={false} className="w-72" placeholder={label} control={control} name="answer" rules={{ required: label }} autoFocus />;
               }
               return (
                  <div className="opacity-50" key={item._id}>
                     {item.answer}
                  </div>
               );
            })}

            {action.type === 'add' && <TextInput floatLabel={false} className="w-72" placeholder={label} control={control} name="answer" rules={{ required: label }} autoFocus />}
         </div>

         <div className="flex mt-7 justify-end">
            <Button form="form-id" className="ml-auto" type="submit">
               Хадгалах
            </Button>
         </div>
      </form>
   );
};
