/* eslint-disable @typescript-eslint/no-explicit-any */
import { Header } from '@/components/custom';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { type TExam, type TVariant } from '@/pages/exams';
import { FinalRespnse } from '@/lib/sharedTypes';
import { request } from '@/lib/core/request';
import { QuestionActionSector } from '@/pages/candidate/ExamStartAction';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

const ExamMaterialAction = () => {
   // const [userAnswer, setUserAnswer] = useState([]);
   const { materialid } = useParams(); //examid
   const { control, reset } = useForm();

   const { control: scoreController } = useForm({ mode: 'onSubmit' });

   const { data, isFetchedAfterMount } = useQuery<FinalRespnse<Omit<TExam, 'variants'> & { variant: TVariant }>>({
      queryKey: ['material'],
      queryFn: () => request({ url: `user/inspector/submissions/detail/${materialid}` }),
   });

   useEffect(() => {
      if (isFetchedAfterMount) {
         // if(data?.data?.variant.sections?.)
         const questions: any = [];
         data?.data?.variant.sections?.forEach((item) => questions.push(...item.questions));
         const settleValue: any = {};

         questions?.forEach((item: any) => {
            // console.log(item, '--------->item');
            // if (item.sub_questions) {
            //    // zaa sub_question iig nemey daa1 // use
            // }

            if (item?.type === 'text') {
               settleValue[item.id] = item.user_answers?.[0]?.answer ?? '';
            }

            if (item?.input_type === 'select') {
               settleValue[item.id] = item.user_answers?.[0]?.answer_id ?? '';
            }

            if (item?.input_type === 'multi_select') {
               settleValue[item.id] = item.user_answers.map((item: any) => item.answer_id) ?? [];
            }
            if (item?.type === 'fill') {
               if (item?.input_type === 'fill') {
                  settleValue[item.id] = item.user_answers.map((item: any) => ({ answer: item.answer, fill_index: item?.fill_index })) ?? [];
               } else {
                  settleValue[item.id] = item.user_answers.map((item: any) => ({ id: item.answer_id, fill_index: item?.fill_index })) ?? [];
               }
            }
         });
         reset(settleValue);
      }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isFetchedAfterMount]);

   // console.log(data, 'data---------------->');
   // console.log(watch(), 'watch');

   return (
      <div>
         {/* <BreadCrumb
            pathList={[
               { to: '/handle/', label: 'Засах шалгалтууд' },
               { to: `/handle/${examid}`, label: 'material' },
               { to: `/handle/${examid}/${materialid}`, isActive: true, label: 'material' },
            ]}
         /> */}
         <Header title="Shalgalt zasah" />

         <QuestionActionSector
            isFromInspector
            sectionData={data?.data?.variant?.sections}
            score_visible={true}
            control={control}
            scoreController={scoreController}
            // ProgressData={ProgressData}
         />
      </div>
   );
};

export default ExamMaterialAction;
