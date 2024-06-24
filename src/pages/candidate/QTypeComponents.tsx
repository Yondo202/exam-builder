import { TQuestionProps } from './ExamStartAction';
import { Checkbox, Label, CkEditor, Badge } from '@/components/custom';
import './Style.css'; // Ensure this path is correct
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { type TAnswers } from '../questions';
import { RxCheck } from 'react-icons/rx';
import { cn } from '@/lib/utils';

// progressId - baihgu bol sub_question l gesen ug

export const SelectQuestion = ({ question, field, socket, progressId, isFromInspector, setLocalProgress }: TQuestionProps) => {
   const onChangeFunc = (event: boolean, item: TAnswers) => {
      const finalAsset = {
         type: question.type,
         input_type: question.input_type,
         question_id: field.name,
         id: progressId,
      };

      if (question.input_type === 'multi_select') {
         const multiAnswer = event ? (field.value ? [...field.value, item.id] : [item.id]) : field.value.filter((element: string) => element !== item.id);
         field?.onChange?.(multiAnswer);

         if (progressId) {
            setLocalProgress?.((prev) => {
               const found = prev.find((item) => item.question_id === field.name) ?? {};

               return [...prev.filter((item) => item.question_id !== field.name), { sub_questions: found.sub_questions ?? null, ...finalAsset, choices: multiAnswer }];
            });

            socket?.emit(
               'save_progress',
               JSON.stringify({
                  choices: multiAnswer,
                  sub_questions: null,
                  ...finalAsset,
               })
            );
         }

         return;
      }

      const sinlgeAnswer = event ? item.id : ``;

      field.onChange(sinlgeAnswer);
      if (progressId) {
         setLocalProgress?.((prev) => {
            const found = prev.find((item) => item.question_id === field.name) ?? {};

            return [...prev.filter((item) => item.question_id !== field.name), { sub_questions: found.sub_questions ?? null, ...finalAsset, choice: sinlgeAnswer }];
         });

         socket?.emit(
            'save_progress',
            JSON.stringify({
               choice: sinlgeAnswer,
               sub_questions: null,
               ...finalAsset,
            })
         );
      }
   };

   return (
      <>
         <div className="mb-4 text-sm leading-6">{question.question}</div>

         <div className="pb-4 text-primary flex justify-between items-center">
            <span>{isFromInspector ? `Оролцогчийн хариулт` : `Хариулт`} </span>{' '}
            {question.input_type === 'multi_select' && (
               <Badge variant="secondary" className="opacity-70 text-green-600">
                  Дээд тал нь 2 хариулт сонгох боломжтой
               </Badge>
            )}
         </div>

         <div className="grid grid-cols-1 gap-y-4 gap-x-5 max-sm:grid-cols-1">
            {question?.answers?.map((item, index) => {
               const isChecked = question.input_type === 'multi_select' ? field.value?.some((element: string) => element === item.id) : field.value === item.id;
               const isDisabled = question.input_type === 'multi_select' && !isChecked && field.value?.length >= 2;
               return (
                  <div key={index} className="grid items-center gap-2 grid-cols-[auto_minmax(0,1fr)]">
                     {/* <span className="text-muted-text/70 text-sm">{index + 1}.</span> */}
                     <label
                        htmlFor={`${item.id}${question.id}`}
                        className={cn('flex items-center gap-3 border border-border/80 px-3 py-2 rounded-md cursor-pointer', isFromInspector && isChecked ? `border-green-500` : ``)}
                     >
                        <Checkbox
                           checked={isChecked}
                           disabled={isDisabled || isFromInspector}
                           onCheckedChange={(event: boolean) => onChangeFunc(event, item)}
                           id={`${item.id}${question.id}`}
                           className="disabled:opacity-90"
                        />
                        <Label htmlFor={`${item.id}${question.id}`} className="mb-0 select-none text-text">
                           {/* truncate */}
                           {item.answer}
                        </Label>
                     </label>
                  </div>
               );
            })}
         </div>

         {isFromInspector && (
            <div className="p-5 px-8 pt-3 mt-5 border border-y-primary/20 bg-primary/5 -mx-8">
               <div className="mb-4 text-secondary">Зөв хариулт</div>
               <div className="grid grid-cols-1 gap-y-4 gap-x-5 max-sm:grid-cols-1">
                  {question?.answers?.map((item, index) => {
                     return (
                        <div key={index} className="grid items-center gap-2 grid-cols-[auto_minmax(0,1fr)]">
                           {/* <span className="text-muted-text/70 text-sm">{index + 1}. </span> */}
                           <label
                              htmlFor={item.id}
                              className={cn(
                                 'flex items-center gap-3 border border-border/80 px-3 py-2 rounded-md cursor-pointer',
                                 isFromInspector && item.is_correct ? `border-green-500` : ``
                              )}
                           >
                              <Checkbox checked={item.is_correct} disabled={true || isFromInspector} className="disabled:opacity-90" />
                              <Label htmlFor={item.id} className="mb-0 select-none text-text">
                                 {/* truncate */}
                                 {item.answer}
                              </Label>
                           </label>
                        </div>
                     );
                  })}
               </div>
            </div>
         )}
      </>
   );
};

type TFillAnswer = {
   answer: string;
   fill_index: number;
};

export const FillQuestion = ({ question, field, socket, progressId, isFromInspector, setLocalProgress }: TQuestionProps) => {
   const [questionArr, setQuestionArr] = useState<string[]>([]);
   useEffect(() => {
      let count = 0;
      const questionConverted = question.question.split(' ')?.map((item) => {
         if (item === '{{answer}}') {
            const temp = `{{answer-${count}}}`;
            count++;
            return temp;
         }
         return item;
      });

      setQuestionArr(questionConverted);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const onChangeFunc = (value: string, key: number) => {
      const toSetValue = { [question.input_type === 'fill' ? `answer` : `id`]: value, fill_index: key };
      const FillValues = field.value ? [...field.value.filter((item: TFillAnswer) => item.fill_index !== key), toSetValue] : [toSetValue];
      field?.onChange?.(FillValues);

      if (progressId) {
         const finalAsset = {
            type: question.type,
            input_type: question.input_type,
            question_id: field.name,
            id: progressId,
            choices: FillValues,
         };

         setLocalProgress?.((prev) => {
            const found = prev.find((item) => item.question_id === field.name) ?? {};

            return [...prev.filter((item) => item.question_id !== field.name), { sub_questions: found.sub_questions ?? null, ...finalAsset }];
         });

         socket?.emit(
            'save_progress',
            JSON.stringify({
               ...finalAsset,
               sub_questions: null,
            })
         );
      }
   };

   return (
      <>
         <div className="pb-6 text-sm flex flex-wrap gap-1 gap-y-1.5 items-center">
            {questionArr?.map((item, index) => {
               const fieldKey = item.startsWith('{{answer-') ? +item.replace('{{answer-', '')?.replace('}}', '') : 0;
               const inputValue = field.value?.find((item: TFillAnswer) => item.fill_index === fieldKey);
               return (
                  <div className="leading-7" key={index}>
                     {item.startsWith('{{answer-') ? (
                        question.input_type === 'fill' ? (
                           isFromInspector ? (
                              <Badge variant="secondary" className="font-medium mx-1 rounded-md py-1">
                                 {inputValue?.answer}
                              </Badge>
                           ) : (
                              <Textarea
                                 value={inputValue?.answer}
                                 onChange={(event) => onChangeFunc(event?.target?.value, fieldKey)}
                                 className={cn('w-56 mx-2', inputValue?.answer?.length > 25 ? `min-h-[80px]` : `h-9  min-h-9`)}
                                 // sizes="sm"
                                 placeholder="Хариулт......."
                                 disabled={!!isFromInspector}
                              />
                           )
                        ) : (
                           // inputValue?.answer?.length > 30 ? (
                           //    <Textarea
                           //       value={inputValue?.answer}
                           //       onChange={(event) => onChangeFunc(event?.target?.value, fieldKey)}
                           //       className="w-56 mx-2"
                           //       // sizes="sm"
                           //       placeholder="Хариулт......."
                           //       disabled={!!isFromInspector}
                           //    />
                           // ) : (
                           //    <Input
                           //       value={inputValue?.answer}
                           //       onChange={(event) => onChangeFunc(event?.target?.value, fieldKey)}
                           //       className="w-56 mx-2"
                           //       sizes="sm"
                           //       placeholder="Хариулт......."
                           //       disabled={!!isFromInspector}
                           //    />
                           // )
                           <Select disabled={!!isFromInspector} value={inputValue?.id} onValueChange={(value) => onChangeFunc(value, fieldKey)}>
                              <SelectTrigger className="w-56 data-[placeholder]:text-muted-text/40 text-xs2">
                                 <SelectValue placeholder={'Сонго...'} className="placeholder:text-muted-text/20 " />
                              </SelectTrigger>
                              <SelectContent>
                                 {question.answers?.map((item, index) => (
                                    <SelectItem key={index} value={item.id ?? ''}>
                                       {item.answer}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                        )
                     ) : (
                        item
                     )}
                  </div>
               );
            })}
         </div>

         {question.input_type === 'fill_with_choice' && (
            <>
               <div className="pb-2 mb-2 text-primary/70 flex justify-between items-center">
                  <span>Сонгох боломжтой хариултууд</span>
                  {/* <Badge variant="secondary" className="opacity-70 text-green-600 rounded-full">
                     Нөхөх хэсэг дээрээс сонгоно уу
                  </Badge> */}
               </div>
               <div className="flex items-center flex-wrap gap-3">
                  {question.answers?.map((item, index) => {
                     const isSelected = field.value?.some((el: { id: string }) => el.id === item.id);
                     return (
                        <Badge variant="secondary" className={cn('rounded-full gap-1.5 transition-all text-primary/70', isSelected ? `border-green-300 text-green-600` : ``)} key={index}>
                           {isSelected && <RxCheck className="text-lg text-green-600" />} <span className=" text-[11px] "> {item.answer}</span>
                        </Badge>
                     );
                  })}
               </div>
            </>
         )}

         {isFromInspector && (
            <div className="p-5 pt-3 mt-5 border border-y-primary/40 bg-green-200/20 -mx-8">
               <div className="mb-4 text-secondary">Зөв хариулт</div>
               <div className="pb-6 text-sm flex flex-wrap gap-1 gap-y-1.5 items-center">
                  {questionArr?.map((item, index) => {
                     const fieldKey = item.startsWith('{{answer-') ? +item.replace('{{answer-', '')?.replace('}}', '') : 0;
                     const inputValue = question.answers.find((item) => item.fill_index === fieldKey);

                     // console.log(fieldKey, '------------->tem');

                     // if (!correctAnswer) {
                     //    inputValue = field.value?.find((item: TFillAnswer) => item.fill_index === fieldKey);
                     // } else {
                     //    inputValue = question.answers.find((item) => item.fill_index === fieldKey);
                     // }

                     // console.log(inputValue, '---------------->inputValue');

                     return (
                        <div className="leading-7" key={index}>
                           {item.startsWith('{{answer-') ? (
                              question.input_type === 'fill' ? (
                                 isFromInspector ? (
                                    <Badge variant="secondary" className="font-medium mx-1 rounded-md py-1">
                                       {inputValue?.answer}
                                    </Badge>
                                 ) : (
                                    <Input
                                       value={inputValue?.answer}
                                       onChange={(event) => onChangeFunc(event?.target?.value, fieldKey)}
                                       className="w-56 mx-2"
                                       sizes="sm"
                                       placeholder="Хариулт......."
                                       disabled={true}
                                    />
                                 )
                              ) : (
                                 <Select disabled={true} value={inputValue?.id} onValueChange={(value) => onChangeFunc(value, fieldKey)}>
                                    <SelectTrigger className="w-56 data-[placeholder]:text-muted-text/40 text-xs2">
                                       <SelectValue placeholder={'Сонго...'} className="placeholder:text-muted-text/20 " />
                                    </SelectTrigger>
                                    <SelectContent>
                                       {question.answers?.map((item, index) => (
                                          <SelectItem key={index} value={item.id ?? ''}>
                                             {item.answer}
                                          </SelectItem>
                                       ))}
                                    </SelectContent>
                                 </Select>
                              )
                           ) : (
                              item
                           )}
                        </div>
                     );
                  })}
               </div>
            </div>
         )}
      </>
   );
};

export const OpenQuestion = ({ question, field, socket, progressId, isFromInspector, setLocalProgress }: TQuestionProps) => {
   const onChangeFunc = (value: string) => {
      field?.onChange?.(value);
      if (progressId) {
         const finalAsset = {
            question_id: field.name,
            answer: value,
            id: progressId,
            type: question.type,
            input_type: question.input_type,
         };

         setLocalProgress?.((prev) => {
            const found = prev.find((item) => item.question_id === field.name) ?? {};

            return [...prev.filter((item) => item.question_id !== field.name), { sub_questions: found.sub_questions ?? null, ...finalAsset }];
         });

         socket?.emit(
            'save_progress',
            JSON.stringify({
               ...finalAsset,
               sub_questions: null,
            })
         );
      }
   };

   const questionScore = question?.sub_questions?.length > 0 ? question.score - question?.sub_questions.reduce((a, b) => a + b.score, 0) : question.score;

   return (
      <div>
         <div className="mb-4 text-sm leading-6">
            {question.input_type === 'essay' ? (
               <article className="prose-sm dark:prose-invert">
                  <span dangerouslySetInnerHTML={{ __html: question.question }} />
               </article>
            ) : (
               question.question
            )}
         </div>

         {questionScore > 0 && (
            <>
               <div className="pb-3 text-primary/70">Хариулт {isFromInspector ? `- шалгуулагчын` : ``}</div>
               {question.input_type === 'text' ? (
                  isFromInspector ? (
                     field.value
                  ) : (
                     <Textarea disabled={!!isFromInspector} placeholder="Хариулт оруулах..." value={field.value} onChange={(event) => onChangeFunc(event?.target?.value)} />
                  )
               ) : isFromInspector ? (
                  <article className="prose-sm dark:prose-invert">
                     <span dangerouslySetInnerHTML={{ __html: field.value }} />
                  </article>
               ) : (
                  <CkEditor disabled={!!isFromInspector} value={field.value} setValue={(value) => onChangeFunc(value)} />
               )}
            </>
         )}
      </div>
   );
};

// const AlertOfError = forwardRef<HTMLButtonElement, { fieldSta }>(() => {
//    return (
//       <button
//          className={cn('border border-transparent rounded-md w-full', fieldState?.error ? `border-danger-color focus:outline-offset-1 focus:outline-danger-color focus:outline-1` : ``)}
//          type="button"
//          onFocus={fieldState?.error?.ref?.focus()}
//          ref={fRef}
//       >
//          <div>{fieldState?.error?.message}</div>
//       </button>
//    );
// });
