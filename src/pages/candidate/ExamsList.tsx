// import React from 'react';
import { Badge, Button, Header, Skeleton, Dialog } from '@/components/custom';
import { request } from '@/lib/core/request';
import { FinalRespnse } from '@/lib/sharedTypes';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { PiExam } from 'react-icons/pi';
import { finalRenderDate } from '@/lib/utils';
import { type TAction } from '@/lib/sharedTypes';
import { VscSend } from 'react-icons/vsc';
import { LiaHourglassStartSolid, LiaArrowRightSolid } from 'react-icons/lia';
import { useEffect, useState } from 'react';
import { queryClient } from '@/main';
import { Empty } from '@/assets/svg';

// enum UserExamStatusEnum {
//    ongoing = 'ONGOING',
//    submitted = 'SUBMITTED',
//    created = 'CREATED',
//    ended = 'ENDED',
// }

type StatusTypes = 'ongoing' | 'submitted' | 'created' | 'ended';

type TInviteStatus = { [Key in StatusTypes]: string };

// eslint-disable-next-line react-refresh/only-export-components
export const StatusLabels: TInviteStatus = {
   created: 'Шинэ',
   ongoing: 'Үргэлжилж байгаа',
   submitted: 'Шалгалт өгсөн',
   ended: 'Дууссан',
};

// { [Key in TQuestion]: TObjectPettern }
export type TMyEXam = {
   name: string;
   description: string;
   duration_min: number;
   active_start_at: string;
   active_end_at: string;
   category: { name: string };
   sub_category: { name: string };
   take_per_user: number;
};

export type TMyExamAsset = {
   id: string;
   created_at: string;
   exam_id: string;
   status: StatusTypes;
   attempt: number;
   exam: TMyEXam;
};

type TQueryKeyOfEXamTypes = 'getinvite' | 'startexam' | 'getmyexam';
type TQuestionTypesInFront = { [Key in TQueryKeyOfEXamTypes]?: string };

// eslint-disable-next-line react-refresh/only-export-components
export const queryKeyOfEXam: TQuestionTypesInFront = {
   getinvite: 'getinvite',
   startexam: 'startexam',
   getmyexam: 'getmyexam',
} as const;

const ExamsList = () => {
   const [action, setAction] = useState<TAction<TMyExamAsset>>({ isOpen: false, type: 'add', data: {} as TMyExamAsset });
   const navigate = useNavigate();
   const { data, isLoading } = useQuery<FinalRespnse<TMyExamAsset[]>>({ queryKey: ['my-invites'], queryFn: () => request({ url: 'user/exam/my-invites' }) });

   useEffect(() => {
      queryClient.removeQueries({ queryKey: [queryKeyOfEXam.getinvite], exact: true });
      queryClient.removeQueries({ queryKey: [queryKeyOfEXam.startexam], exact: true });
      queryClient.removeQueries({ queryKey: [queryKeyOfEXam.getmyexam], exact: true });

      queryClient.resetQueries({ queryKey: ['my-invites'], exact: true });
   }, []);

   // console.log(data?.data, '--------->');
   // dahin {5} oroldlogo hiih bolomjtoi -

   const StartExamNavigate = ({ id }: { id: string }) => {
      navigate(id);
      // queryClient.removeQueries({ queryKey, exact: true })
   };

   return (
      <div className="h-[calc(100dvh-56px)] overflow-y-auto">
         <Header title="Шалгалтын жагсаалт" className="pt-5" />
         <div className="grid grid-cols-3 gap-6 max-sm:grid-cols-1">
            {isLoading ? (
               <>
                  <Skeleton className="w-full h-60 rounded-lg" />
                  <Skeleton className="w-full h-60 rounded-lg" />
                  <Skeleton className="w-full h-60 rounded-lg" />
               </>
            ) : data?.data?.length ?? 0 > 0 ? (
               data?.data?.map((item, index) => {
                  return (
                     <div className="wrapper p-0 group hover:shadow-md" key={index}>
                        <div className="text-base font-normal px-5 py-3 border-b">
                           <div className="truncate font-medium mb-1">{item.exam?.name}</div>
                           <div className="truncate text-xs text-muted-text">{item.exam?.description}</div>
                        </div>

                        <div className="p-5 relative overflow-hidden">
                           <div className="flex items-center gap-2 text-muted-text mb-3">
                              Төлөв:{' '}
                              <Badge variant="secondary" className="font-medium py-1">
                                 {StatusLabels[item.status]}
                              </Badge>
                           </div>
                           <div className="flex items-center gap-2 text-muted-text mb-3">
                              Үргэлжилэх хугацаа:{' '}
                              <span className="font-medium text-secondary">
                                 {item.exam?.duration_min} <span className="font-normal text-muted-text">- мин</span>{' '}
                              </span>
                           </div>
                           <div className="flex items-center gap-2 text-muted-text mb-3">
                              Эхлэх огноо: <span className="text-text ">{finalRenderDate(item.exam?.active_start_at)}</span>
                           </div>
                           <div className="flex items-center gap-2 text-muted-text mb-3">
                              Дуусах огноо: <span className="text-text">{finalRenderDate(item.exam?.active_end_at)}</span>
                           </div>

                           <div className="flex items-center gap-2 text-muted-text mb-3">
                              Дахин шалгалт өгөх
                              <Badge variant="secondary" className="text-[10px] font-medium">
                                 {item.exam?.take_per_user - item.attempt}
                              </Badge>{' '}
                              эрх байна
                           </div>

                           <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 pt-2 opacity-70">
                              <Badge variant="secondary" className="py-1 max-w-full text-[10px]">
                                 <span className="one_line">{item.exam?.category?.name} </span>
                              </Badge>
                              <LiaArrowRightSolid className="text-muted-text" />
                              <Badge variant="secondary" className="py-1 text-[10px]">
                                 <span className="one_line">{item.exam?.sub_category?.name} </span>
                              </Badge>
                           </div>

                           <div className="absolute top-full left-0 w-full h-full transition-all rounded-lg duration-300 opacity-0 group-hover:top-0 group-hover:opacity-100 flex items-center justify-center backdrop-blur-sm">
                              {item.status !== 'ended' ? (
                                 <Button
                                    size="lg"
                                    className="group/button rounded-full opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 hover:bg-primary"
                                    onClick={() => (item.status === 'ongoing' ? StartExamNavigate({ id: `/${item.id}` }) : setAction({ data: item, isOpen: true, type: 'edit' }))}
                                 >
                                    <PiExam className="text-lg" />
                                    <span>{item.status === 'ongoing' ? `Шалгалт үргэлжлүүлэх` : `Шалгалт өгөх`} </span>
                                    <VscSend className="mt-0.5 scale-0 opacity-0 -translate-x-full transition-all group-hover/button:scale-100 group-hover/button:opacity-100 group-hover/button:translate-x-0" />
                                 </Button>
                              ) : (
                                 <Button type="button" className="bg-danger-color color-[#FFF] rounded-full hover:bg-danger-color">
                                    Шалгалт өгөх эрх дууссан байна
                                 </Button>
                              )}
                           </div>
                        </div>

                        {action.data?.id === item.id && (
                           <Dialog title="Шалгалт эхлүүлэх" isOpen={action.isOpen} onOpenChange={(e) => setAction((prev) => ({ ...prev, isOpen: e }))}>
                              <div className="pb-8">
                                 <div className="truncate font-medium text-lg">{action?.data?.exam?.name}</div>
                                 <div className="text-xs2 text-muted-text mb-8">{action.data?.exam?.description}</div>

                                 <div className="flex items-center gap-2 text-muted-text text-sm mb-8">
                                    Үргэлжилэх хугацаа:
                                    <span className="font-medium text-secondary">
                                       {action.data?.exam?.duration_min} <span className="font-normal text-muted-text">- мин</span>{' '}
                                    </span>
                                 </div>
                                 <Button
                                    size="lg"
                                    className="group/button rounded-full w-full"
                                    onClick={() => (setAction((prev) => ({ ...prev, isOpen: false })), StartExamNavigate({ id: `/${action?.data?.id}` }))}
                                 >
                                    <LiaHourglassStartSolid className="text-lg rotate-180 transition-all group-hover/button:rotate-0" />
                                    <span>Шалгалт эхлэх</span>
                                    <VscSend className="mt-0.5 scale-0 opacity-0 -translate-x-full transition-all group-hover/button:scale-100 group-hover/button:opacity-100 group-hover/button:translate-x-0" />
                                 </Button>
                              </div>
                           </Dialog>
                        )}
                     </div>
                  );
               })
            ) : (
               <div className="flex h-48 w-full flex-col items-center justify-center gap-5">
                  <Empty className="dark:opacity-30" />
                  <div className="text-muted-text opacity-70">Мэдээлэл байхгүй байна</div>
               </div>
            )}

            {/* <div className='wrapper p-4'>Бизнесийн удирдлага</div>
            <div className='wrapper p-4'>Мэдээлэл</div> */}
         </div>
      </div>
   );
};

export default ExamsList;
