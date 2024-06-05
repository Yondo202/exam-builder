// import React from 'react';
import { Badge, Button, Header, Skeleton } from '@/components/custom';
import { request } from '@/lib/core/request';
import { FinalRespnse } from '@/lib/sharedTypes';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { finalRenderDate } from '@/lib/utils';
import { VscSend } from 'react-icons/vsc';
import { LiaHourglassStartSolid, LiaArrowRightSolid } from 'react-icons/lia';

type TMyEXam = {
   name: string;
   description: string;
   duration_min: number;
   active_start_at: string;
   active_end_at: string;
   category: { name: string };
   sub_category: { name: string };
};

type TMyExamAsset = {
   created_at: string;
   exam_id: string;
   exam: TMyEXam;
};

const ExamsList = () => {
   const navigate = useNavigate();
   const { data, isLoading } = useQuery<FinalRespnse<TMyExamAsset[]>>({ queryKey: ['my-invites'], queryFn: () => request({ url: 'user/exam/my-invites' }) });

   return (
      <div className="h-[calc(100dvh-56px)] overflow-y-auto">
         <Header title="Шалгалтын жагсаалт" className="pt-5" />
         <div className="grid grid-cols-3 gap-6 max-sm:grid-cols-1">
            {isLoading ? (
               <>
                  <Skeleton className="w-full" />
               </>
            ) : (
               data?.data?.map((item, index) => {
                  return (
                     <div className="wrapper p-0 group hover:shadow-md" key={index}>
                        <div className="text-base font-normal px-5 py-3 border-b">
                           <div className="one_line font-medium mb-1">{item.exam?.name}</div>
                           <div className="one_line text-xs text-muted-text">{item.exam?.description}</div>
                        </div>

                        <div className="p-5 relative overflow-hidden">
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

                           <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 pt-2">
                              <Badge variant="secondary" className="py-1 max-w-full">
                                 <span className="one_line">{item.exam?.category?.name} </span>
                              </Badge>
                              <LiaArrowRightSolid className="text-muted-text" />
                              <Badge variant="secondary" className="py-1">
                                 <span className="one_line">{item.exam?.sub_category?.name} </span>
                              </Badge>
                           </div>

                           <div className="absolute top-full left-0 w-full h-full transition-all rounded-lg duration-300 opacity-0 group-hover:top-0 group-hover:opacity-100 flex items-center justify-center backdrop-blur-sm">
                              <Button
                                 size="lg"
                                 className="group/button rounded-full opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 hover:bg-primary"
                                 onClick={() => navigate(`/${item.exam_id}`)}
                              >
                                 <LiaHourglassStartSolid className="text-lg rotate-180 transition-all group-hover/button:rotate-0" /> Шалгалт эхлүүлэх{' '}
                                 <VscSend className="mt-0.5 scale-0 opacity-0 -translate-x-full transition-all group-hover/button:scale-100 group-hover/button:opacity-100 group-hover/button:translate-x-0" />
                              </Button>
                           </div>
                        </div>
                     </div>
                  );
               })
            )}

            {/* <div className='wrapper p-4'>Бизнесийн удирдлага</div>
            <div className='wrapper p-4'>Мэдээлэл</div> */}
         </div>
      </div>
   );
};

export default ExamsList;
