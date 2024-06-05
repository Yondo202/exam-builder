import { addMinutes } from 'date-fns'; //  subHours, differenceInSeconds, differenceInMinutes
import { ShiftingCountdown } from '@/components/custom';
import { useParams } from 'react-router-dom';
import { request } from '@/lib/core/request';
// import { FinalRespnse } from '@/lib/sharedTypes';
import { useQuery } from '@tanstack/react-query';
// import { finalRenderDate } from '@/lib/utils';

const ExamStartAction = () => {
   const { examid } = useParams();
   const { data } = useQuery({ queryKey: ['getmyexam'], queryFn: () => request({ method:'post', url: `user/exam/get/${examid}` }) });
   // const startAT = '2024-06-05T17:29:00.000Z';
   const startAT = new Date();

   // const start = subHours(startAT, 8);
   const end = addMinutes(startAT, 61); // hariu ni hasah garah uchraas
   // const end = addMinutes(subHours(startAT, 8), -30.2); // hariu ni hasah garah uchraas
   // const renderMenute = differenceInMinutes(start, end);
   // const renderSecond = differenceInSeconds(start, end) - differenceInMinutes(start, end) * 60;

   // console.log(end, '----------------->end');

   // /user/exam/get/{exam_id}

   console.log(data, '------------------------>');
   return (
      <div className="py-8 grid grid-cols-[270px_auto] gap-10">
         <div className="wrapper p-5">
            info sector
            <div>{/* {renderMenute} : {renderSecond} секунд */}</div>
         </div>
         <div className="wrapper p-5">
            main actions
            <ShiftingCountdown toFinish={end} />
         </div>
      </div>
   );
};

export default ExamStartAction;
