import { Badge, Button, Header, ShiftingCountdown } from '@/components/custom';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useParams, useNavigate } from 'react-router-dom';
import { request } from '@/lib/core/request';
import { useMutation, useQuery } from '@tanstack/react-query';
import { VscSend } from 'react-icons/vsc';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { io, type Socket } from 'socket.io-client';
import { type TExam } from '@/pages/exams';
import { FinalRespnse } from '@/lib/sharedTypes';
import { type TQuestion, type AllTypesQuestionTypes } from '@/pages/questions';
import { SelectQuestion, OpenQuestion, FillQuestion } from './QTypeComponents';
import { TMyExamAsset } from './ExamsList';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getJwt } from '@/lib/core/request';
import { Controller, useForm, type Control, type FieldValues, type UseFormClearErrors } from 'react-hook-form';
import SubQuestions from './SubQuestions';
import { GiFinishLine } from 'react-icons/gi';
import { cn } from '@/lib/utils';
import { type TExamSection } from '@/pages/exams';
import { Input } from '@/components/ui/Input';
import { queryKeyOfEXam } from './ExamsList';

// const toConnect = () => {
//    if (getJwt()) {
//       return;
//    }

//    return { connected: false, on: () => false };
// };

const socket = io(import.meta.env.VITE_MAIN_URL, {
   extraHeaders: {
      // webid: getWebId(),
      authorization: getJwt() ?? '',
   },
   // autoConnect: false,
   reconnectionAttempts: 3,
   reconnectionDelay: 3000,
});

type PickedQuestionTypes = Pick<AllTypesQuestionTypes, 'answers' | 'input_type' | 'question' | 'type' | 'sub_questions' | 'score' | 'id'>;

export type TQuestionProps = {
   question: PickedQuestionTypes;
   socket?: Socket;
   progressId?: string;

   // fieldState: ControllerFieldState;
   // ref: RefCallBack;

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
      component: ({ question, field, socket, progressId, isFromInspector }: TQuestionProps) => <SelectQuestion {...{ question, field, socket, progressId, isFromInspector }} />,
   },
   text: {
      component: ({ question, field, socket, progressId, isFromInspector }: TQuestionProps) => <OpenQuestion {...{ question, field, socket, progressId, isFromInspector }} />,
   },
   fill: {
      component: ({ question, field, socket, progressId, isFromInspector }: TQuestionProps) => <FillQuestion {...{ question, field, socket, progressId, isFromInspector }} />,
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

const ExamStartAction = () => {
   const [timer, setTimer] = useState({ isStarted: false, isDone: false });
   // const [socketConnect, setSocketConnect] = useState({ isConnected: false });
   // console.log(socketConnect, "----->socketConnect")
   const {
      control,
      reset,
      watch,
      setError,
      clearErrors,
      // formState: { errors },
   } = useForm({ mode: 'onSubmit' });

   const navigate = useNavigate();
   const { inviteid } = useParams();

   // useEffect(() => {
   //    setSocketConnect({ isConnected: socket?.connected });
   //    // eslint-disable-next-line react-hooks/exhaustive-deps
   // }, [socket?.connected]);

   const { data: InviteDetail, isFetchedAfterMount } = useQuery({
      refetchOnMount: true,
      refetchOnReconnect: true,
      queryKey: [queryKeyOfEXam.getinvite], //inviteid
      queryFn: () => request<FinalRespnse<TMyExamAsset>>({ url: `user/exam/my-invites/id/${inviteid}` }),
   });

   console.log(InviteDetail?.data.exam, '--->exam id');
   console.log(isFetchedAfterMount, '-------------isFetchedAfterMount');

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
         }),
   }); // shalgaltiin yvts

   console.log(ProgressData?.data?.id, '-------------> ProgressData?.data?.id');

   const { data, isFetchedAfterMount: isExamMaterialFetched } = useQuery({
      // shalgaltiin material
      enabled: isProgressFetched,
      queryKey: [queryKeyOfEXam.getmyexam], //ProgressData?.data?.id
      queryFn: () => request<FinalRespnse<TExam>>({ offAlert: true, method: 'post', url: `user/exam/progress/${ProgressData?.data?.id}` }), // ProgressData?.data?.id
   });

   // console.log(data, '------->data');
   // filterBody: { variant_id: ProgressData?.data?.variant_id }

   const { mutate } = useMutation({
      mutationFn: () => request({ method: 'post', url: `user/exam/end/${ProgressData?.data.id}` }),
      onSuccess: () => {
         toast.success('Шалгалт амжилттай дууслаа');
         navigate('/');
         // setTimer({ isDone:true, isStarted:false });
      },
      onSettled: () => setTimer({ isDone: true, isStarted: false }),
   });

   useEffect(() => {
      if (ProgressData?.data?.progress) {
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
      if (timer.isDone) {
         mutate();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [timer.isDone]);

   const onExamSubmit = () => {
      let isInValid = false;
      Object.keys(watch())?.forEach((item) => {
         if (!watch(item) || watch(item)?.length === 0) {
            setError(item, { message: 'Хариулт аа оруулна уу', type: 'required' }, { shouldFocus: true });
            isInValid = true;
         }
      });

      if (!isInValid) {
         mutate();
      }
   };

   return (
      <>
         <Header className="pt-5" title={data?.data?.name} />
         <div className="py-0 grid grid-cols-[minmax(0,270px)_minmax(0,1fr)] gap-6 max-sm:grid-cols-1">
            <div className="wrapper p-0 h-min sticky top-2 z-40">
               {/* <div className="mb-2 text-muted-text absolute">Үлдсэн хугацаа</div> */}

               {timer.isStarted && <ShiftingCountdown endAt={ProgressData?.data?.end_at} timer={timer} FinalFinish={() => setTimer({ isStarted: false, isDone: true })} />}

               <div className="p-5">
                  <div className="pb-2 text-muted-text">
                     Вариант: <span className="text-text">{data?.data?.variants?.[0].name}</span>{' '}
                  </div>
                  <div className="text-muted-text">
                     Үргэлжилэх хугацаа: <span className="text-text">{data?.data?.duration_min} мин</span>{' '}
                  </div>
               </div>
            </div>
            <div className="mb-14">
               <QuestionActionSector
                  sectionData={data?.data?.variants?.[0]?.sections}
                  score_visible={data?.data.score_visible}
                  control={control}
                  clearErrors={clearErrors}
                  ProgressData={ProgressData}
               />
               <div className="flex justify-end">
                  <Popover>
                     <PopoverTrigger asChild>
                        <Button type="button">
                           Шалгалт дуусгах <VscSend className="mt-0.5" />
                        </Button>
                     </PopoverTrigger>
                     <PopoverContent align="end" side="top" sideOffset={25}>
                        <div className="mb-8 text-sm font-medium text-text">Та шалгалтыг дуусгахдаа итгэлтэй байна уу?</div>
                        <Button type="button" variant="outline" className="w-full" onClick={() => onExamSubmit()}>
                           {' '}
                           {/*onClick={() => mutate()}*/}
                           {/* removeCookie('webid', { path: '/', domain: process.env.REACT_APP_AUTH_COOKIE_STORAGE_DOMAIN, sameSite: 'Lax' }) */}
                           <GiFinishLine className="text-base" /> Дуусгах
                        </Button>
                     </PopoverContent>
                  </Popover>
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
   clearErrors?: UseFormClearErrors<FieldValues>;
   ProgressData?: FinalRespnse<TStarted> | undefined;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   control: Control<FieldValues, any>;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   scoreController?: Control<FieldValues, any>;
   isFromInspector?: boolean;
};

export const QuestionActionSector = ({ sectionData, score_visible, control, clearErrors, ProgressData, isFromInspector, scoreController }: TQuestionActionProps) => {
   return sectionData?.map((item, index) => {
      return (
         <div className="mb-10" key={index}>
            <div className="wrapper mb-2 p-8 py-4 text-sm border-b font-medium truncate border-t-[3px] border-t-primary">
               <span className="text-primary/80 font-semibold mr-3">{index + 1}.</span> {item.name}
            </div>
            <div>
               {item.questions?.map((element, ind) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const subQuestions = ProgressData?.data.progress?.find((el: any) => el.question_id === element.id)?.sub_questions ?? [];

                  return (
                     <div className="wrapper mb-2.5 px-0 py-6 relative" key={ind}>
                        <div className="px-8 flex items-center gap-3 justify-between mb-4">
                           <Badge variant="secondary" className="py-1 text-xs gap-2">
                              <span className="font-medium font-base">
                                 {index + 1}.{ind + 1}
                              </span>
                              <span className="text-muted-text"> - Асуулт</span>
                           </Badge>
                           {score_visible && (
                              <div className="flex gap-2">
                                 <Badge variant="secondary" className="py-1 text-xs gap-2">
                                    {isFromInspector && <span className="text-muted-text">Асуутын оноо - </span>}
                                    <span className="font-medium font-base">
                                       {element?.sub_questions?.length > 0 ? element.score - element?.sub_questions.reduce((a, b) => a + b.score, 0) : element.score}
                                    </span>
                                    {!isFromInspector && <span className="text-muted-text"> - Оноо</span>}
                                 </Badge>
                                 {isFromInspector && (
                                    <Controller
                                       control={scoreController}
                                       name={`score-${element.id}`}
                                       rules={{ required: 'Оноо өгнө үү' }}
                                       render={({ field, fieldState }) => {
                                          return (
                                             <div className="relative">
                                                <Input
                                                   {...field}
                                                   ref={field.ref}
                                                   onChange={(event) => field.onChange(event.target.value !== '' ? parseFloat(event.target.value) : undefined)}
                                                   type="number"
                                                   // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                   onWheel={(e:any) => e.target.blur()}
                                                   min={0}
                                                   className="w-46"
                                                   placeholder="Оноо өгөх..."
                                                   variant={fieldState?.error ? `error` : 'default'}
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
                           rules={{ required: true }}
                           render={({ field, fieldState }) => {
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              const parentOnChange = (value: any) => {
                                 clearErrors?.();
                                 field.onChange(value);
                              };
                              // if(element?.sub_questions){  }
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
                                          socket: socket,
                                          progressId: ProgressData?.data.id,
                                          isFromInspector: isFromInspector,
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
