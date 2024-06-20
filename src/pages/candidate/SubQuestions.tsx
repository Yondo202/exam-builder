/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from '@/components/custom';
import { Controller, useForm } from 'react-hook-form';
import { type Socket } from 'socket.io-client';
import { type AllTypesQuestionTypes } from '@/pages/questions';
import { questionAsset } from './ExamStartAction';
import { Input } from '@/components/ui/Input';
import { HiArrowLongRight } from 'react-icons/hi2';
// import { IoIosArrowRoundForward } from 'react-icons/io';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useEffect } from 'react';
import { userAnswerToProgress } from '../exams/exam_events/active_exams/ExamMaterialAction';
import { useSubQuestion } from '@/lib/hooks/useZustand';
import { useParams } from 'react-router-dom';

type TSubQuestionProps = {
   // questions: PickedQuestionTypes[];
   parentQuestion: AllTypesQuestionTypes;
   progressId?: string;
   socket: Socket;
   score_visible?: boolean;
   isFromInspector?: boolean;
   questionIndex: string;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   subQuestionsValue: any;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   parentValue: any;
   setLocalProgress?: React.Dispatch<React.SetStateAction<any[]>>;
};

const SubQuestions = ({ parentQuestion, score_visible, socket, progressId, subQuestionsValue, parentValue, isFromInspector, questionIndex, setLocalProgress }: TSubQuestionProps) => {
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const sub: any = useSubQuestion();
   const { materialid, examid } = useParams()
   const { control, watch, reset } = useForm();
   const { control: scoreController, watch: scoreWatch, setError, clearErrors, reset: scoreReset } = useForm({ mode: 'all' });

   // console.log(parentQuestion, "---------------->parentQuestion")

   useEffect(() => {
      if (isFromInspector) {
         // zowhon shalgagch erhtei hund zorulsan ****
         const settleValue: any = {};
         const scoreValues: any = {};
         parentQuestion?.sub_questions?.forEach((item: any) => {
            const totalScore = item.user_answers?.reduce((a: any, b: any) => a + b?.mark, 0);
            // setValue(`score-${item.id}`, totalScore === 0 ? undefined : totalScore);
            scoreValues[`score-${item.id}`] = totalScore === 0 ? undefined : totalScore;

            settleValue[item.id] = userAnswerToProgress(item);
         });

         sub.setSubValue({ [parentQuestion.id]: scoreValues });
         sub.setErrors({ [parentQuestion.id]: setError });

         scoreReset(scoreValues);
         reset(settleValue);
         return;
      }

      if (subQuestionsValue) {
         const settleValue: any = {};
         subQuestionsValue?.forEach((item: any) => {
            // const item = tempArr.find((elem) => elem.id === item.question_id);
            if (item?.input_type === 'multi_select' || item?.type === 'fill') {
               settleValue[item.question_id ?? ''] = item.choices;
            }
            if (item?.input_type === 'select') {
               settleValue[item.question_id ?? ''] = item.choice;
            }
            if (item?.type === 'text') {
               settleValue[item.question_id ?? ''] = item.answer;
            }
         });
         reset(settleValue);
      }
      // useSubQuestion
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [materialid, examid]);

   const GenerateValue = () => {
      const additional = { question_id: parentQuestion.id, id: progressId, type: parentQuestion.type, input_type: parentQuestion.input_type };
      if (parentQuestion?.input_type === 'multi_select' || parentQuestion?.type === 'fill') {
         return { choices: parentValue, ...additional };
      }
      if (parentQuestion?.input_type === 'select') {
         return { choice: parentValue, ...additional };
      }
      if (parentQuestion?.type === 'text') {
         return { answer: parentValue, ...additional };
      }
   };

   const Convert = (itemName: string, value?: any) => {
      const found = parentQuestion.sub_questions?.find((element) => element.id === itemName);
      const subAssets = { type: found?.type, input_type: found?.input_type, question_id: itemName };
      if (found?.type === 'text') {
         return { ...subAssets, answer: value ? value : watch(itemName) };
      }

      if (found?.type === 'fill' || found?.input_type === 'multi_select') {
         return { ...subAssets, choices: value ? value : watch(itemName) };
      }

      if (found?.input_type === 'select') {
         return { ...subAssets, choice: value ? value : watch(itemName) };
      }
   };

   return (
      <div className="pt-8 pl-12 max-sm:pl-1">
         <div className="wrapper mb-2.5 p-8 py-3 text-sm border-b font-medium truncate border-t-[2px] border-t-primary">
            <span className="text-primary/80 font-semibold mr-3">{questionIndex}</span>
            Нэмэлт асуултууд
         </div>
         {parentQuestion?.sub_questions?.map((element, ind) => {
            return (
               <div className="wrapper mb-2.5 p-8 py-6 relative" key={ind}>
                  <div className="flex items-center gap-3 justify-between mb-7">
                     <div className="flex items-center gap-2">
                        {/* <Badge variant="secondary" className="py-1 text-xs gap-2">
                           <span className="font-medium font-base">{questionIndex}</span>
                        </Badge> */}
                        <span className="text-muted-text font-medium">{questionIndex}</span>
                        <span className="text-muted-text">
                           <HiArrowLongRight />
                        </span>
                        <Badge variant="secondary" className="py-1 text-[11px] gap-2">
                           <span className="font-medium font-base">{ind + 1}</span>
                           <span className="text-muted-text"> - Дэд асуулт</span>
                        </Badge>
                     </div>

                     <div className="flex gap-2">
                        {score_visible && (
                           <Badge variant="secondary" className="py-1 text-xs gap-2">
                              <span className="font-medium font-base">{element.score}</span>
                              <span className="text-muted-text"> - Оноо</span>
                           </Badge>
                        )}
                        {isFromInspector && (
                           <Controller
                              control={scoreController}
                              name={`score-${element.id}`}
                              rules={{ required: 'Оноо өгнө үү' }}
                              render={({ field, fieldState }) => {
                                 const CustomOnchange = (value: any) => {
                                    clearErrors();

                                    sub.setSubValue({ [parentQuestion.id]: { ...scoreWatch(), [field.name]: isNaN(parseFloat(value)) ? undefined : parseFloat(value) } });
                                    field.onChange(value);
                                 };
                                 return (
                                    <div className="relative">
                                       <Input
                                          {...field}
                                          ref={field.ref}
                                          onChange={(event) => CustomOnchange(event.target.value)}
                                          type="number"
                                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                          onWheel={(e: any) => e.target.blur()}
                                          className="w-46"
                                          placeholder="Оноо өгөх..."
                                          variant={fieldState?.error ? `error` : 'default'}
                                          onFocus={e => e.target.select()}
                                       />
                                       <ErrorMessage error={fieldState?.error} />
                                    </div>
                                 );
                              }}
                           />
                        )}
                     </div>
                  </div>
                  <Controller
                     control={control}
                     name={element.id}
                     rules={{ required: true }}
                     render={({ field }) => {
                        const subOnchange = (value: any) => {
                           field.onChange(value);
                           setLocalProgress?.((prev) => {
                              const FinalSubQuestion = Object.keys(watch())
                                 ?.filter((item) => !!watch(item))
                                 .map((item) => Convert(item, field.name === item ? value : undefined));

                              const changedRow = {
                                 ...GenerateValue(),
                                 sub_questions: FinalSubQuestion,
                              };

                              if (!isFromInspector) {
                                 socket?.emit('save_progress', JSON.stringify(changedRow));
                              }

                              return [...prev.filter((item) => item.question_id !== parentQuestion.id), changedRow];
                           });
                        };
                        return questionAsset[element.type]?.component({ question: element, field: { ...field, onChange: subOnchange }, isFromInspector: isFromInspector });
                     }}
                  />
               </div>
            );
         })}
      </div>
   );
};

export default SubQuestions;
