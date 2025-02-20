import { Badge, Button, Header, ShiftingCountdown, Progress, Dialog } from '@/components/custom';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useParams, useNavigate } from 'react-router-dom';
import { request } from '@/lib/core/request';
import { useMutation, useQuery } from '@tanstack/react-query';
import { VscSend } from 'react-icons/vsc';
// import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { io, type Socket } from 'socket.io-client';
import { type TExam } from '@/pages/exams';
import { FinalRespnse } from '@/lib/sharedTypes';
import { type TQuestion, type AllTypesQuestionTypes, TQuestionTypes } from '@/pages/questions';
import { SelectQuestion, OpenQuestion, FillQuestion } from './QTypeComponents';
import { TMyExamAsset } from './ExamsList';
import { IoClose } from 'react-icons/io5';
import { RiArrowDropRightLine } from 'react-icons/ri';
import { FaCheckCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { GoCheckCircle } from 'react-icons/go';
import { getJwt } from '@/lib/core/request';
import { Controller, useForm, type Control, type FieldValues } from 'react-hook-form';
import SubQuestions from './SubQuestions';
// import { GiFinishLine } from 'react-icons/gi';
import { cn, HtmlToText } from '@/lib/utils';
import { type TExamSection } from '@/pages/exams';
import { Input } from '@/components/ui/Input';
import { queryKeyOfEXam } from './ExamsList';

export const socket = io(import.meta.env.VITE_MAIN_URL, {
   extraHeaders: {
      // webid: getWebId(),
      authorization: getJwt() ?? '',
   },
   // autoConnect: false,
   reconnectionAttempts: 1,
   // reconnectionDelay: 3000,
});

type PickedQuestionTypes = Pick<AllTypesQuestionTypes, 'answers' | 'input_type' | 'question' | 'type' | 'sub_questions' | 'score' | 'id'>;

export type TQuestionProps = {
   question: PickedQuestionTypes;
   socket?: Socket;
   progressId?: string;

   // fieldState: ControllerFieldState;
   // ref: RefCallBack;

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   setLocalProgress?: React.Dispatch<React.SetStateAction<any[]>>;
   isFromInspector?: boolean;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   field: any;
   // field: ControllerRenderProps<FieldValues, string> | ControllerRenderProps<FieldValues, number>;
};

type TObjectPettern = {
   component: (props: TQuestionProps) => JSX.Element;
};

// eslint-disable-next-line react-refresh/only-export-components
export const questionAsset: { [Key in TQuestion]: TObjectPettern } = {
   checkbox: {
      component: ({ question, field, socket, progressId, isFromInspector, setLocalProgress }: TQuestionProps) => (
         <SelectQuestion {...{ question, field, socket, progressId, isFromInspector, setLocalProgress }} />
      ),
   },
   text: {
      component: ({ question, field, socket, progressId, isFromInspector, setLocalProgress }: TQuestionProps) => (
         <OpenQuestion {...{ question, field, socket, progressId, isFromInspector, setLocalProgress }} />
      ),
   },
   fill: {
      component: ({ question, field, socket, progressId, isFromInspector, setLocalProgress }: TQuestionProps) => (
         <FillQuestion {...{ question, field, socket, progressId, isFromInspector, setLocalProgress }} />
      ),
   },
};

type TStarted = {
   duration_min: number;
   end_at: string;
   variant_id: string;
   id: string;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   progress: any;
};
// total_score, created_at
const progressPercentage = (sections: TExamSection[], watch: any, localProgress: any) => {
   const allValues: TQuestionTypes[] = [];
   const isDoneValues: TQuestionTypes[] = [];
   sections?.forEach((item) => {
      item.questions?.forEach((el) => {
         const questionScore = el?.sub_questions?.length > 0 ? el.score - el?.sub_questions.reduce((a, b) => a + b.score, 0) : el.score;
         const isDone = questionScore > 0 && watch(`${el.id}`) && watch(`${el.id}`)?.length > 0;

         if (isDone) {
            isDoneValues.push(el);
         }
         if (questionScore > 0) {
            allValues.push(el);
         }

         el.sub_questions?.forEach((subitem) => {
            const foundSub = localProgress
               ?.find((que: { question_id: string }) => que.question_id === el.id)
               ?.sub_questions?.find((itemsub: { question_id: string }) => itemsub.question_id === subitem.id);
            const isDoneSub = (!!foundSub?.answer || !!foundSub?.choice || !!foundSub?.choice || !!foundSub?.choices?.length) ?? 0 > 0;

            if (isDoneSub) {
               isDoneValues.push(subitem);
            }

            allValues.push(subitem);
         });
      });
   });

   // const generateDone = allValues?.filter(item=>{
   //    item.question

   // })

   // console.log(allValues, '------------->');

   return (isDoneValues?.length / allValues?.length) * 100;
};

const ExamStartAction = () => {
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const [localProgress, setLocalProgress] = useState<any>([]);
   const [isOpen, setIsOpen] = useState(false);
   const [timer, setTimer] = useState({ isStarted: false, isDone: false });
   // const [socketConnect, setSocketConnect] = useState({ isConnected: false });
   const { control, reset, watch, handleSubmit } = useForm({ mode: 'onSubmit' });
   const [finishAlert, setFinishAlert] = useState(false);

   const navigate = useNavigate();
   const { inviteid } = useParams();

   // useEffect(() => {
   //    setSocketConnect({ isConnected: socket?.connected });
   //    // eslint-disable-next-line react-hooks/exhaustive-deps
   // }, [socket?.connected]);

   const { data: InviteDetail, isFetchedAfterMount } = useQuery({
      enabled: !finishAlert,
      refetchOnMount: true,
      refetchOnReconnect: true,
      queryKey: [queryKeyOfEXam.getinvite], //inviteid
      queryFn: () => request<FinalRespnse<TMyExamAsset>>({ url: `user/exam/my-invites/id/${inviteid}`, passToken: true }),
   });

   const {
      data: ProgressData,
      isError,
      isFetchedAfterMount: isProgressFetched,
   } = useQuery({
      staleTime: 0,
      enabled: isFetchedAfterMount,
      queryKey: [queryKeyOfEXam.startexam], //InviteDetail?.data?.exam_id
      queryFn: () =>
         request<FinalRespnse<TStarted>>({
            offAlert: true,
            method: 'post',
            url: `user/exam/start/${InviteDetail?.data?.exam_id}`,
            passToken: true,
         }),
   }); // shalgaltiin yvts

   const { data, isFetchedAfterMount: isExamMaterialFetched } = useQuery({
      // shalgaltiin material
      // enabled: isProgressFetched,
      enabled: isProgressFetched && !!ProgressData?.data?.id,
      queryKey: [queryKeyOfEXam.getmyexam], //ProgressData?.data?.id
      queryFn: () => request<FinalRespnse<TExam>>({ offAlert: true, method: 'post', url: `user/exam/progress/${ProgressData?.data?.id}`, passToken: true }), // ProgressData?.data?.id
   });

   const { mutate } = useMutation({
      mutationFn: () => request({ method: 'post', url: `user/exam/end/${ProgressData?.data.id}`, passToken: true }),
      onSuccess: () => {
         toast.success('Шалгалт амжилттай дууслаа');
         if (!finishAlert) {
            navigate('/');
         }

         // setFinishAlert(true);
         // setTimer({ isDone:true, isStarted:false });
      },
      // onSettled: () => setTimer({ isDone: true, isStarted: false }),
   });

   const { mutate: fullSaveMutate } = useMutation({
      mutationFn: () =>
         request({
            method: 'post',
            url: `user/progress/save/full`,
            offAlert: true,
            passToken: true,
            body: {
               id: ProgressData?.data?.id,
               progress: localProgress,
            },
         }),
      onSettled: () => {
         setTimer({ isDone: false, isStarted: false });
         mutate();
      },
   });

   useEffect(() => {
      if (ProgressData?.data?.progress) {
         setLocalProgress(ProgressData?.data?.progress ?? []);
         // daraa ene function iig sub question tei neg bolgo
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         const settleValue: any = {};
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         ProgressData?.data?.progress?.forEach((item: any) => {
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isProgressFetched, isExamMaterialFetched]);

   useEffect(() => {
      if (InviteDetail?.data?.status === 'ended' || isError) {
         navigate('/');
         return;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isFetchedAfterMount, isError]);

   // const FinalSubmit = () => {
   //    if (!isTimeOut) {
   //       mutate();
   //    }
   // };

   useEffect(() => {
      if (isProgressFetched && !!ProgressData?.data?.end_at) {
         setTimer({ isStarted: true, isDone: false });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isProgressFetched]);

   useEffect(() => {
      if (timer.isDone && !finishAlert) {
         setFinishAlert(true);
         fullSaveMutate();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [timer.isDone]);

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const onExamSubmit = () => {
      fullSaveMutate();
   };

   const progressPer = progressPercentage(data?.data?.variants?.[0]?.sections ?? [], watch, localProgress);

   const ProgressList = ({ isFinalValid }: { isFinalValid?: boolean }) => {
      return data?.data?.variants?.[0]?.sections?.map((item, index) => {
         const sortedQuestion = !data?.data?.scrumble_questions ? item.questions?.sort((a, b) => a?.sort_number - b?.sort_number) : item.questions;
         return (
            <div key={index}>
              {sortedQuestion?.length > 0 && <div className="truncate text-[11px] font-semibold mb-1 sticky top-0 bg-body-bg py-0.5">{item.name}</div>} 
               <div className="pl-2">
                  {sortedQuestion?.map((el, ind) => {
                     const questionScore = el?.sub_questions?.length > 0 ? el.score - el?.sub_questions.reduce((a, b) => a + b.score, 0) : el.score;

                     const isDone = questionScore > 0 && watch(`${el.id}`) && watch(`${el.id}`)?.length > 0;

                     return (
                        <div key={ind}>
                           {(watch(`${el.id}`) && watch(`${el.id}`)?.length > 0 && isFinalValid) || questionScore === 0 ? null : (
                              <div
                                 onClick={() => (document.querySelector(`#id-${index}-${ind}`)?.scrollIntoView(), setIsOpen(false))}
                                 className={cn(
                                    'grid grid-cols-[20px_1fr] py-1.5 items-center cursor-pointer hover:text-primary',
                                    isDone ? `text-green-600` : `text-muted-text`,
                                    isFinalValid ? `text-orange-500` : ``
                                 )}
                              >
                                 {questionScore > 0 ? (
                                    isDone ? (
                                       <FaCheckCircle className="text-[10px]" />
                                    ) : isFinalValid ? (
                                       <IoClose />
                                    ) : (
                                       <RiArrowDropRightLine className="text-base" />
                                    )
                                 ) : (
                                    <div />
                                 )}{' '}
                                 <span className="truncate">{el.input_type === 'essay' || el.input_type === 'select' ? HtmlToText({ html: el.question }) : el.question}</span>
                              </div>
                           )}

                           <div className="pl-4">
                              {el.sub_questions
                                 ?.sort((a, b) => a?.sort_number - b?.sort_number)
                                 ?.map((subitem, subind) => {
                                    const foundSub = localProgress
                                       ?.find((que: { question_id: string }) => que.question_id === el.id)
                                       ?.sub_questions?.find((itemsub: { question_id: string }) => itemsub.question_id === subitem.id);
                                    const isDoneSub = (!!foundSub?.answer || !!foundSub?.choice || !!foundSub?.choice || !!foundSub?.choices?.length) ?? 0 > 0;

                                    if (isDoneSub && isFinalValid) return;

                                    return (
                                       <div
                                          onClick={() => (document.querySelector(`#subid-${index + 1}-${ind + 1}-${subind + 1}`)?.scrollIntoView(), setIsOpen(false))}
                                          className={cn(
                                             'truncate py-1 grid grid-cols-[20px_1fr] items-center cursor-pointer hover:text-primary',
                                             isDoneSub ? `text-green-600` : `text-muted-text`,
                                             isFinalValid ? `text-orange-600` : ``
                                          )}
                                          key={subind}
                                       >
                                          {foundSub ? <FaCheckCircle className="text-[10px]" /> : isFinalValid ? <IoClose /> : <RiArrowDropRightLine className="text-base" />}{' '}
                                          {el.input_type === 'essay' || el.input_type === 'select' ? HtmlToText({ html: subitem.question }) : subitem.question}
                                       </div>
                                    );
                                 })}
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         );
      });
   };

   return (
      <>
         <Header className="pt-2.5" title={data?.data?.name} />
         <Dialog
            // className={cn('pt-0', action.type === 'delete' ? 'w-[600px]' : 'w-[800px]')}
            className="p-6 w-[300px]"
            isOpen={finishAlert}
            onOpenChange={() => null}
            title="Шалгалтын цаг дууслаа"
         >
            <div className="flex flex-col gap-8 items-center justify-center">
               <GoCheckCircle className="w-24 h-24 text-green-500" />
               <Button onClick={() => (setFinishAlert(false), navigate('/'))} className="w-full rounded-full" size="lg" variant="secondary">
                  Нүүр хуудас
               </Button>
            </div>
         </Dialog>
         <div className="py-0 grid grid-cols-[minmax(0,1fr)_minmax(0,280px)] gap-32 max-sm:grid-cols-1 max-sm:gap-6">
            <div className="sticky top-0 z-50 md:hidden">
               {timer.isStarted && inviteid && <ShiftingCountdown endAt={ProgressData?.data?.end_at} timer={timer} FinalFinish={() => setTimer({ isStarted: false, isDone: true })} />}
            </div>
            <form className="mb-14" onSubmit={handleSubmit(onExamSubmit)}>
               <QuestionActionSector
                  sectionData={data?.data?.variants?.[0]?.sections}
                  score_visible={data?.data.score_visible}
                  scrumble_questions={data?.data?.scrumble_questions}
                  control={control}
                  // clearErrors={clearErrors}
                  ProgressData={ProgressData}
                  setLocalProgress={setLocalProgress}
               />
               <div className="flex justify-end">
                  <Button type="button" onClick={() => setIsOpen(true)}>
                     Шалгалт дуусгах <VscSend className="mt-0.5" />
                  </Button>
               </div>
               <Dialog className="p-8 pt-0" title="Та шалгалтыг дуусгахдаа итгэлтэй байна уу?" isOpen={isOpen} onOpenChange={setIsOpen}>
                  <div className="pb-14 pt-2">{ProgressList({ isFinalValid: true })}</div>

                  <div className="flex justify-between sticky bottom-0 bg-card-bg">
                     <Button type="button" onClick={() => setIsOpen(false)} variant="outline">
                        Дахин шалгах
                     </Button>
                     <Button type="button" onClick={() => fullSaveMutate()}>
                        Шалгалт дуусгах <VscSend className="mt-0.5" />
                     </Button>
                  </div>
               </Dialog>
            </form>
            <div className="sticky top-2 z-40 h-min">
               {/* max-sm:fixed left-0 top-14 w-full */}

               <div className="wrapper p-0 mb-0">
                  {/* <div className="mb-2 text-muted-text absolute">Үлдсэн хугацаа</div> */}
                  <div className="max-md:hidden">
                     {timer.isStarted && inviteid && <ShiftingCountdown endAt={ProgressData?.data?.end_at} timer={timer} FinalFinish={() => setTimer({ isStarted: false, isDone: true })} />}
                  </div>

                  <div className="p-4">
                     <div className="pb-2 text-muted-text">
                        Хувилбар: <span className="text-text">{data?.data?.variants?.[0].name}</span>{' '}
                     </div>
                     <div className="text-muted-text">
                        Үргэлжлэх хугацаа: <span className="text-text">{data?.data?.duration_min} мин</span>{' '}
                     </div>
                  </div>
               </div>

               <div className="text-xs">
                  <div className="p-3 flex gap-3 items-center">
                     {progressPer === 100 && <FaCheckCircle className="text-green-600 text-base" />} <Progress value={progressPer ?? 0} />
                  </div>
                  <div className="overflow-y-auto max-h-[70dvh] p-4 pt-0">{ProgressList({})}</div>
               </div>
            </div>
         </div>
      </>
   );
};

export default ExamStartAction;

type TQuestionActionProps = {
   sectionData: TExamSection[] | undefined;
   score_visible?: boolean;
   // clearErrors?: UseFormClearErrors<FieldValues>;
   ProgressData?: FinalRespnse<TStarted> | undefined;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   control: Control<FieldValues, any>;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   scoreController?: Control<FieldValues, any>;
   isFromInspector?: boolean;
   scrumble_questions?: boolean;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   setLocalProgress?: React.Dispatch<React.SetStateAction<any[]>>;
};

export const QuestionActionSector = ({ sectionData, score_visible, control, ProgressData, isFromInspector, scoreController, setLocalProgress, scrumble_questions }: TQuestionActionProps) => {
   return sectionData?.map((item, index) => {
      const sortedQuestion = !scrumble_questions ? item.questions?.sort((a, b) => a?.sort_number - b?.sort_number) : item.questions;
      return (
         <div className="mb-10" key={index}>
            <div
               className={cn(
                  'wrapper p-6 py-3 text-sm border-b font-medium truncate border-t-[3px] rounded-b-sm border-t-primary sticky top-0 max-sm:top-14 h-min z-[10]',
                  `z-[calc(10 + ${index})]`,
                  !item?.description ? `mb-2 rounded-b-md` : `mb-0`
               )}
            >
               <span>
                  <span className="text-primary/80 font-semibold mr-2">{index + 1}.</span>{' '}
                  <span className={cn(item?.color ? `text-[${item.color?.replaceAll(`"`, '')}]` : ``)}>{item.name}</span>
               </span>
            </div>

            {item?.description && (
               <div className="wrapper p-7 py-3 mb-2 rounded-t-[0px]">
                  <div className="text-muted-text font-normal text-xs mt-1">{item?.description}</div>
               </div>
            )}

            <div>
               {sortedQuestion.map((element, ind) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const subQuestions = ProgressData?.data.progress?.find((el: any) => el.question_id === element.id)?.sub_questions ?? [];

                  // const questionScore = element?.sub_questions?.length > 0 ? element.score - element?.sub_questions.reduce((a, b) => a + b.score, 0) : element.score;
                  const questionScore = element.score;

                  return (
                     <div className="wrapper mb-2.5 px-0 py-6 relative" key={ind} id={`id-${index}-${ind}`}>
                        <div className="px-8 flex items-center gap-3 justify-between mb-4">
                           {questionScore > 0 ? (
                              <Badge variant="secondary" className="py-1 text-xs gap-2">
                                 <span className="font-medium font-base">
                                    {index + 1}.{ind + 1}
                                 </span>
                                 <span className="text-muted-text"> - Асуулт</span>
                              </Badge>
                           ) : (
                              <div />
                           )}
                           {score_visible && questionScore > 0 && (
                              <div className="flex gap-2">
                                 <Badge variant="secondary" className="py-1 text-xs gap-2">
                                    {isFromInspector && <span className="text-muted-text">Асуултын оноо - </span>}
                                    <span className="font-medium font-base">{questionScore}</span>
                                    {!isFromInspector && <span className="text-muted-text"> - Оноо</span>}
                                 </Badge>
                                 {isFromInspector && (
                                    <Controller
                                       control={scoreController}
                                       name={`score-${element.id}`}
                                       rules={{ required: element.type === 'checkbox' || element.input_type === 'fill_with_choice' ? false : 'Оноо өгнө үү' }}
                                       render={({ field, fieldState }) => {
                                          return (
                                             <div className="relative">
                                                <Input
                                                   {...field}
                                                   ref={field.ref}
                                                   disabled={element.type === 'checkbox' || element.input_type === 'fill_with_choice'}
                                                   type="number"
                                                   // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                   onWheel={(e: any) => e.target.blur()}
                                                   min={0}
                                                   className="w-46"
                                                   placeholder="Оноо өгөх..."
                                                   variant={fieldState?.error ? `error` : 'default'}
                                                   onFocus={(e) => e.target.select()}
                                                   onChange={(event) => field.onChange(event.target.value !== '' ? parseFloat(event.target.value) : undefined)}
                                                />
                                                <ErrorMessage error={fieldState?.error} />
                                             </div>
                                          );
                                       }}
                                    />
                                 )}
                              </div>
                           )}
                        </div>
                        <Controller
                           control={control}
                           name={element.id}
                           // rules={{ required: questionScore > 0 ? `Хариулт аа оруулна уу` : false }}
                           rules={{ required: false }}
                           render={({ field, fieldState }) => {
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              const parentOnChange = (value: any) => {
                                 // clearErrors?.();
                                 field.onChange(value);
                              };
                              return (
                                 <>
                                    <button
                                       className={cn(
                                          'border border-transparent rounded-md w-full cursor-default text-start px-8 py-3',
                                          fieldState?.error ? `border-danger-color/60 focus:outline-offset-1 focus:outline-danger-color focus:outline-1` : ``
                                       )}
                                       type="button"
                                       // onFocus={fieldState?.error?.ref?.focus?.() as React.FocusEventHandler<HTMLButtonElement> | undefined}
                                       // onFocus={!!fieldState?.error}
                                       ref={field.ref}
                                    >
                                       {questionAsset[element.type]?.component({
                                          question: element,
                                          field: { ...field, onChange: parentOnChange },
                                          progressId: ProgressData?.data.id,
                                          isFromInspector,
                                          setLocalProgress,
                                          socket,
                                       })}
                                       {fieldState?.error && <div className="text-danger-color text-end p-3">{fieldState?.error.message}</div>}
                                    </button>

                                    {element?.sub_questions?.length > 0 && (
                                       <SubQuestions
                                          subQuestionsValue={subQuestions}
                                          parentQuestion={element}
                                          parentValue={field.value}
                                          socket={socket}
                                          score_visible={score_visible}
                                          progressId={ProgressData?.data.id}
                                          isFromInspector={isFromInspector}
                                          questionIndex={`${index + 1}.${ind + 1}`}
                                          setLocalProgress={setLocalProgress}
                                       />
                                    )}
                                 </>
                              );
                           }}
                        />
                     </div>
                  );
               })}
            </div>
         </div>
      );
   });
};
