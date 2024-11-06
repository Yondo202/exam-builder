import { Empty } from '@/assets/svg';
import { Header, Skeleton, Badge, BreadCrumb } from '@/components/custom';
import { useQuery } from '@tanstack/react-query';
import { request } from '@/lib/core/request';
import { finalRenderDate, cn } from '@/lib/utils';
import { StatusLabels } from './ExamsList';
// import { TMyExamAsset } from './ExamsList';
import { useParams, useLocation, useSearchParams } from 'react-router-dom';
import { type TMaterialList, SubmissionTypes } from '../exams/exam_events/active_exams/ExamMaterialList';
// import { TUserInfo } from '../exams/exam_events/active_exams/ExamMaterialList';
import { FinalRespnse } from '@/lib/sharedTypes';
import { TUserEmployee } from '@/lib/sharedTypes';

// interface GroupBy<T> {
//    [key: string]: T[];
// }
// searchAsObject

const HistoryOfExam = () => {
   const { userid } = useParams();
   const [search] = useSearchParams({});
   const searchAsObject = Object.fromEntries(new URLSearchParams(search));
   const pathname = useLocation()?.pathname;

   const { data: userDetail } = useQuery({
      enabled: !!userid,
      queryKey: ['user-detail', userid],
      queryFn: () => request<FinalRespnse<TUserEmployee>>({ url: `user/detail${searchAsObject?.type === 'emp' ? `/employee` : ``}?id=${userid}` }),
   });

   // const { data, refetch, isLoading } = useQuery({
   //    enabled: !!detailData.id,
   //    queryKey: ['user-detail', detailData.id],
   //    queryFn: () => request<FinalRespnse<TUserEmployee>>({ url: `user/detail${detailData?.empid ? `/employee` : ``}?id=${detailData.id}` }),
   // });

   const { data, isLoading } = useQuery<FinalRespnse<TMaterialList[]>>({
      queryKey: ['users/exam/history/', userid ?? ''],
      queryFn: () =>
         request({
            url: userid ? `user/submissions/list?id=${userid}` : 'user/exam/my-submittions',
            method: 'post',
            offAlert: true,
            filterBody: {
               user_id: userid, // zohon user hostory deer
               pagination: {
                  page: 1,
                  page_size: 1000,
               },
            },
         }),
   });

   // const grouped = groupBy(data?.data?.map((item) => ({ ...item, temp_exam_code: item?.user_exam?.exam?.code })) ?? [], 'temp_exam_code');
   // console.log(pathname.startsWith(`/users/roles`), '----------->pathname');

   return (
      <>
         {!!userid && (
            <BreadCrumb
               pathList={[
                  { label: pathname.startsWith(`/users/roles`) ? `Хэрэглэгчийн эрх` : 'Хэрэглэгчид', to: pathname.startsWith(`/users/roles`) ? '/users/roles' : '/users' },
                  { label: `Шалгалтын түүх - ${userDetail?.data?.lastname?.slice(0, 1) ?? ''}. ${userDetail?.data?.firstname ?? ''}`, to: '#', isActive: true },
               ]}
            />
         )}
         {userid && userDetail?.data?.lastname && userDetail?.data?.firstname ? (
            <Header title={`Шалгалтын түүх - ${userDetail?.data?.lastname?.slice(0, 1)}. ${userDetail?.data?.firstname}`} className="pt-2" />
         ) : (
            <Header title="Шалгалтын түүх" className="pt-5" />
         )}
         {data?.data?.length === 0 && !isLoading && (
            <div className="flex h-48 w-full flex-col items-center justify-center gap-5">
               <Empty className="dark:opacity-30" />
               <div className="text-muted-text opacity-70">Шалгалт түүх байхгүй байна</div>
            </div>
         )}
         {isLoading ? (
            <div className="grid grid-cols-3 gap-6 max-sm:grid-cols-1">
               <Skeleton className="w-full h-60 rounded-lg" />
               <Skeleton className="w-full h-60 rounded-lg" />
               <Skeleton className="w-full h-60 rounded-lg" />
            </div>
         ) : (
            // Object.keys(grouped)?.map((element, ind) => {
            // return (
            <div className="grid grid-cols-3 gap-6 max-sm:grid-cols-1 pb-3 mb-3">
               {data?.data?.map((item, index) => {
                  const persentage = (item.attempt_score / item?.variant?.achievable_score) * 100;
                  return (
                     <div className="wrapper p-0 group hover:shadow-md " key={index}>
                        <div className="text-base font-normal px-5 py-3 border-b">
                           <div className="truncate font-medium">{item.user_exam?.exam?.name}</div>
                           {/* <div className="truncate text-xs text-muted-text">{item.user_exam.exam.description}</div> */}

                           <div className="flex items-center gap-2 text-muted-text text-xs pt-2">
                              Шалгалтын
                              <Badge variant="secondary" className="font-medium text-[10px] px-2">
                                 {item?.attempt_no > 1 ? `${item?.attempt_no}-удаагийн` : `эхний`}
                              </Badge>{' '}
                              оролдлого
                           </div>
                        </div>

                        <div className="p-5 relative overflow-hidden">
                           <div className="flex items-center gap-2 text-muted-text mb-3">
                              Ш / материалийн төлөв:{' '}
                              <Badge variant="secondary" className={cn('text-[11px] font-medium', item?.status !== 'not_graded_yet' ? `bg-green-200/30 text-green-600` : ``)}>
                                 {SubmissionTypes[item?.status]}
                              </Badge>
                           </div>

                           <div className="flex items-center gap-2 text-muted-text mb-3">
                              Тэнцсэн эсэх:{' '}
                              <Badge variant="secondary" className={cn('text-[11px] font-medium', item.passed ? `bg-green-400/10 text-green-600 border-green-300` : ``)}>
                                 {item?.status === 'not_graded_yet' ? `Хүлээгдэж байгаа` : item.passed ? `Тэнцсэн` : ` Тэнцээгүй`}
                              </Badge>
                           </div>

                           {item?.grade_visible && (
                              <div className="flex items-center gap-2 text-muted-text mb-3">
                                 Авсан хувь: <span className="text-text">{(isNaN(persentage) ? 0 : persentage)?.toLocaleString()} %</span>
                              </div>
                           )}

                           <div className="flex items-center gap-2 text-muted-text mb-3">
                              Ш / эхэлсэн огноо: <span className="text-text">{finalRenderDate(item?.start_date)}</span>
                           </div>
                           <div className="flex items-center gap-2 text-muted-text mb-3">
                              Ш / дуусгасан огноо: <span className="text-text">{finalRenderDate(item?.end_date)}</span>
                           </div>

                           <div className="flex items-center gap-2 text-muted-text mb-3">
                              Төлөв:{' '}
                              <Badge variant="secondary" className="font-medium py-1 text-[11px]">
                                 {StatusLabels[item?.user_exam?.status]}
                              </Badge>
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>
            // );
            // })
         )}
      </>
   );
};

export default HistoryOfExam;
