import { Badge, Button, Header, ShiftingCountdown } from '@/components/custom';
import { useParams, useNavigate } from 'react-router-dom';
import { request } from '@/lib/core/request';
import { useMutation, useQuery } from '@tanstack/react-query';
import { VscSend } from 'react-icons/vsc';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { io, type Socket } from 'socket.io-client';
import { type TExam } from '@/pages/exams';
import { type TQuestion, type AllTypesQuestionTypes } from '@/pages/questions';
import { SelectQuestion, OpenQuestion, FillQuestion } from './QTypeComponents';
import { TMyExamAsset } from './ExamsList';
import { FinalRespnse } from '@/lib/sharedTypes';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getJwt } from '@/lib/core/request';
import { Controller, useForm } from 'react-hook-form';
import SubQuestions from './SubQuestions';
import { GiFinishLine } from 'react-icons/gi';

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
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   field: any;
   // field: ControllerRenderProps<FieldValues, string> | ControllerRenderProps<FieldValues, number>;
};

type TObjectPettern = {
   component: ({ question }: TQuestionProps) => JSX.Element;
};

// eslint-disable-next-line react-refresh/only-export-components
export const questionAsset: { [Key in TQuestion]: TObjectPettern } = {
   checkbox: {
      component: ({ question, field, socket, progressId }: TQuestionProps) => <SelectQuestion {...{ question, field, socket, progressId }} />,
   },
   text: {
      component: ({ question, field, socket, progressId }: TQuestionProps) => <OpenQuestion {...{ question, field, socket, progressId }} />,
   },
   fill: {
      component: ({ question, field, socket, progressId }: TQuestionProps) => <FillQuestion {...{ question, field, socket, progressId }} />,
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
   const [isTimeOut, setIsTimeOut] = useState(false);
   // const [socketConnect, setSocketConnect] = useState({ isConnected: false });
   // console.log(socketConnect, "----->socketConnect")
   const { control, reset } = useForm({ mode: 'onChange' });

   const navigate = useNavigate();
   const { inviteid } = useParams();

   // useEffect(() => {
   //    setSocketConnect({ isConnected: socket?.connected });
   //    // eslint-disable-next-line react-hooks/exhaustive-deps
   // }, [socket?.connected]);

   const { data: InviteDetail, isFetchedAfterMount } = useQuery({
      queryKey: ['getinvite', inviteid],
      queryFn: () => request<FinalRespnse<TMyExamAsset>>({ url: `user/exam/my-invites/id/${inviteid}` }),
   });

   const {
      data: ProgressData,
      isError,
      isFetchedAfterMount: isProgressFetched,
   } = useQuery({
      enabled: !!InviteDetail?.data?.exam_id,
      queryKey: ['start-exam', inviteid],
      queryFn: () =>
         request<FinalRespnse<TStarted>>({
            offAlert: true,
            method: 'post',
            url: `user/exam/${InviteDetail?.data?.status === 'ongoing' ? `continue` : `start`}/${InviteDetail?.data?.exam_id}`,
         }),
   }); // shalgaltiin yvts

   const { data, isFetchedAfterMount: isExamMaterialFetched } = useQuery({
      // shalgaltiin material
      enabled: !!ProgressData?.data,
      queryKey: ['getmyexam', inviteid],
      queryFn: () => request<FinalRespnse<TExam>>({ offAlert: true, method: 'post', url: `user/exam/get/${InviteDetail?.data?.exam_id}` }),
   });

   // console.log(data, '------->data');
   // filterBody: { variant_id: ProgressData?.data?.variant_id }

   const { mutate } = useMutation({
      mutationFn: () => request({ method: 'post', url: `user/exam/end/${ProgressData?.data.id}` }),
      onSuccess: () => {
         toast.success('Шалгалт амжилттай дууслаа');
         navigate('/');
         setIsTimeOut(true);
      },
      onError: () => {
         setIsTimeOut(true);
      },
      onSettled: () => setIsTimeOut(true),
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

   const FinalFinish = () => {
      if (!isTimeOut) {
         mutate();
      }
   };

   // console.log(ProgressData, '-->ProgressData');
   // console.log(data?.data, '-->material');

   return (
      <>
         <Header className="pt-5" title={data?.data?.name} />
         <div className="py-0 grid grid-cols-[minmax(0,270px)_minmax(0,1fr)] gap-6 max-sm:grid-cols-1">
            <div className="wrapper p-0 h-min sticky top-2 z-40">
               {/* <div className="mb-2 text-muted-text absolute">Үлдсэн хугацаа</div> */}
               {!!ProgressData?.data?.end_at && <ShiftingCountdown isTimeOut={isTimeOut} toFinish={ProgressData?.data?.end_at} FinalFinish={FinalFinish} />}
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
               {data?.data?.variants?.[0]?.sections?.map((item, index) => {
                  return (
                     <div className="mb-10" key={index}>
                        <div className="wrapper mb-2.5 p-8 py-5 text-sm border-b font-medium truncate border-t-[3px] border-t-primary">
                           <span className="text-primary/80 font-semibold mr-3">{index + 1}.</span> {item.name}
                        </div>
                        <div>
                           {item.questions?.map((element, ind) => {
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              const subQuestions = ProgressData?.data.progress?.find((el: any) => el.question_id === element.id)?.sub_questions ?? [];

                              return (
                                 <div className="wrapper mb-2.5 p-8 py-6 relative" key={ind}>
                                    <div className="flex items-center gap-3 justify-between mb-7">
                                       <Badge variant="secondary" className="py-1 text-xs gap-2">
                                          <span className="font-medium font-base">
                                             {index + 1}.{ind + 1}
                                          </span>
                                          <span className="text-muted-text"> - Асуулт</span>
                                       </Badge>
                                       {data?.data.score_visible && (
                                          <Badge variant="secondary" className="py-1 text-xs gap-2">
                                             <span className="font-medium font-base">
                                                {element?.sub_questions?.length > 0 ? element.score - element?.sub_questions.reduce((a, b) => a + b.score, 0) : element.score}
                                             </span>
                                             <span className="text-muted-text"> - Оноо</span>
                                          </Badge>
                                       )}
                                    </div>
                                    <Controller
                                       control={control}
                                       name={element.id}
                                       rules={{ required: true }}
                                       render={({ field }) => {
                                          return (
                                             <div>
                                                {questionAsset[element.type]?.component({ question: element, field: field, socket: socket, progressId: ProgressData?.data.id ?? '' })}

                                                {element?.sub_questions?.length > 0 && (
                                                   <SubQuestions
                                                      subQuestionsValue={subQuestions}
                                                      parentQuestion={element}
                                                      socket={socket}
                                                      score_visible={data?.data.score_visible}
                                                      progressId={ProgressData?.data.id ?? ''}
                                                   />
                                                )}
                                             </div>
                                          );
                                       }}
                                    />
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  );
               })}
               <div className="flex justify-end">
                  <Popover>
                     <PopoverTrigger asChild>
                        <Button>
                           Шалгалт дуусгах <VscSend className="mt-0.5" />
                        </Button>
                     </PopoverTrigger>
                     <PopoverContent align="end" side="top" sideOffset={25}>
                        <div className="mb-8 text-base text-text">Та шалгалтыг дуусгахдаа итгэлтэй байна уу?</div>
                        <Button variant="outline" className="w-full" onClick={() => mutate()}>
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
