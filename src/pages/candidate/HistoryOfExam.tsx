import { Header } from '@/components/custom';
// import { useQuery } from '@tanstack/react-query';
// import { request } from '@/lib/core/request';
// import { TMyExamAsset } from './ExamsList';
// import { FinalRespnse } from '@/lib/sharedTypes';

const HistoryOfExam = () => {
   // const { data, isLoading } = useQuery<FinalRespnse<TMyExamAsset[]>>({
   //    queryKey: ['history-list'],
   //    queryFn: () =>
   //       request({
   //          url: 'user/exam/my-submittions',
   //          method: 'post',
   //          offAlert: true,
   //          filterBody: {
   //             pagination: {
   //                page: 1,
   //                page_size: 1000,
   //             },
   //          },
   //       }),
   // });

   return (
      <div>
         <Header title="Шалгалтын түүх" className="pt-5" />
         {/* {isLoading ? (
            <>
               <Skeleton className="w-full h-60 rounded-lg" />
               <Skeleton className="w-full h-60 rounded-lg" />
               <Skeleton className="w-full h-60 rounded-lg" />
            </>
         ) : (
            <div></div>
         )} */}
         {/* <h1></h1> */}
      </div>
   );
};

export default HistoryOfExam;
