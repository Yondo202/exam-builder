import { Empty } from '@/assets/svg';
import { Header, Skeleton, Badge } from '@/components/custom';
import { useQuery } from '@tanstack/react-query';
import { request } from '@/lib/core/request';
import { finalRenderDate, cn } from '@/lib/utils';
import { StatusLabels } from './ExamsList';
// import { TMyExamAsset } from './ExamsList';
import { type TMaterialList, SubmissionTypes } from '../exams/exam_events/active_exams/ExamMaterialList';
// import { TUserInfo } from '../exams/exam_events/active_exams/ExamMaterialList';
import { FinalRespnse } from '@/lib/sharedTypes';

// interface GroupBy<T> {
//    [key: string]: T[];
// }

// function groupBy<T>(array: T[], key: keyof T): GroupBy<T> {
//    return array.reduce((result, currentItem) => {
//       const groupKey = currentItem[key] as unknown as string; // casting to string
//       if (!result[groupKey]) {
//          result[groupKey] = [];
//       }
//       result[groupKey].push(currentItem);
//       return result;
//    }, {} as GroupBy<T>);
// }

const HistoryOfExam = () => {
   const { data, isLoading } = useQuery<FinalRespnse<TMaterialList[]>>({
      queryKey: ['history-list'],
      queryFn: () =>
         request({
            url: 'user/exam/my-submittions',
            method: 'post',
            offAlert: true,
            filterBody: {
               pagination: {
                  page: 1,
                  page_size: 1000,
               },
            },
         }),
   });

   // const grouped = groupBy(data?.data?.map((item) => ({ ...item, temp_exam_code: item?.user_exam?.exam?.code })) ?? [], 'temp_exam_code');

   return (
      <div>
         <Header title="Шалгалтын түүх" className="pt-5" />
         {data?.data?.length === 0 && !isLoading && (
            <div className="flex h-48 w-full flex-col items-center justify-center gap-5">
               <Empty className="dark:opacity-30" />
               <div className="text-muted-text opacity-70">Мэдээлэл байхгүй байна</div>
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
            <div className="grid grid-cols-3 gap-6 max-sm:grid-cols-1 border-b pb-3 mb-3">
               {data?.data?.map((item, index) => {
                  return (
                     <div className="wrapper p-0 group hover:shadow-md " key={index}>
                        <div className="text-base font-normal px-5 py-3 border-b">
                           <div className="truncate font-medium">{item.user_exam?.exam?.name}</div>
                           {/* <div className="truncate text-xs text-muted-text">{item.user_exam.exam.description}</div> */}

                           <div className="flex items-center gap-2 text-muted-text text-xs pt-2">
                              Шалгалтын
                              <Badge variant="secondary" className="font-medium text-[11px] px-2">
                                 {item?.attempt_no > 1 ? item?.attempt_no : `эхний`}
                              </Badge>{' '}
                              - оролдлого
                           </div>
                        </div>

                        <div className="p-5 relative overflow-hidden">
                           <div className="flex items-center gap-2 text-muted-text mb-3">
                              Ш / материалийн төлөв:{' '}
                              <Badge variant="secondary" className={cn('font-normal py-1', item?.status !== 'not_graded_yet' ? `bg-green-200/30 text-green-600` : ``)}>
                                 {SubmissionTypes[item?.status]}
                              </Badge>
                           </div>

                           <div className="flex items-center gap-2 text-muted-text mb-3">
                              Ш / эхэлсэн огноо: <span className="text-text ">{finalRenderDate(item?.start_date)}</span>
                           </div>
                           <div className="flex items-center gap-2 text-muted-text mb-3">
                              Ш / дуусгасан огноо: <span className="text-text">{finalRenderDate(item?.end_date)}</span>
                           </div>

                           <div className="flex items-center gap-2 text-muted-text mb-3">
                              Төлөв:{' '}
                              <Badge variant="secondary" className="font-medium py-1">
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
      </div>
   );
};

export default HistoryOfExam;
