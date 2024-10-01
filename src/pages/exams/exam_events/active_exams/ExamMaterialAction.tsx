/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Header, BreadCrumb, Button, Skeleton } from '@/components/custom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { type TExam, type TVariant } from '@/pages/exams';
import { FinalRespnse } from '@/lib/sharedTypes';
import { request } from '@/lib/core/request';
import { QuestionActionSector } from '@/pages/candidate/ExamStartAction';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { GetExamDetial } from './ExamMaterialList';
import { MdCheck } from 'react-icons/md';
import { useSubQuestion } from '@/lib/hooks/useZustand';

type TUserInExam = {
   firstname: string;
   lastname: string;
};

type TUserExam = {
   id: string;
   user: TUserInExam;
   employee: TUserInExam;
};

export const userAnswerToProgress = (item: any) => {
   if (item?.input_type === 'essay') {
      return item.user_answers?.[0]?.essay?.essay ?? '';
   }
   if (item?.type === 'text') {
      return item.user_answers?.[0]?.answer ?? '';
   }

   if (item?.input_type === 'select') {
      return item.user_answers?.[0]?.answer_id ?? '';
   }

   if (item?.input_type === 'multi_select') {
      return item.user_answers.map((item: any) => item.answer_id) ?? [];
   }

   if (item?.type === 'fill') {
      if (item?.input_type === 'fill') {
         return item.user_answers.map((item: any) => ({ answer: item.answer, fill_index: item?.fill_index })) ?? [];
      } else {
         return item.user_answers.map((item: any) => ({ id: item.answer_id, fill_index: item?.fill_index })) ?? [];
      }
   }
};
// daraa barag - QuestionActionSector - ene component iig tusad ni ashiglasan deer ym bn
const ExamMaterialAction = () => {
   const [tempLoading, setTempLoading] = useState(false);
   const navigate = useNavigate();
   // const [userAnswer, setUserAnswer] = useState([]);
   const isResult = useLocation()?.pathname?.startsWith('/handle/examresults');
   const pathname = useLocation()?.pathname;
   const sub: any = useSubQuestion();
   const { materialid, examid } = useParams();
   const { control, reset } = useForm();

   const { control: scoreController, handleSubmit, reset: scoreReset } = useForm({ mode: 'onSubmit' });

   const { data: examDAta } = GetExamDetial({ examid: examid });

   const { data, isFetchedAfterMount } = useQuery<FinalRespnse<Omit<TExam, 'variants' | 'user_exam'> & { variant: TVariant; user_exam: TUserExam }>>({
      queryKey: ['material', [materialid, pathname]],
      queryFn: () => request({ url: `user/inspector/submissions/detail/${materialid}` }),
   });

   const { mutate, isPending } = useMutation({
      mutationFn: (body) => request({ url: 'user/inspector/submittions/grade', method: 'post', body: { exam_given_id: materialid, question_answers: body } }),
      onSuccess: () => navigate(`/handle/${examDAta?.data?.id}`),
   });

   useEffect(() => {
      sub.setInitial();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   useEffect(() => {
      if (isFetchedAfterMount) {
         const questions: any = [];
         data?.data?.variant?.sections?.forEach((item) => questions.push(...item.questions));

         const settleValue: any = {};
         const scoreValues: any = {};
         questions?.forEach((item: any) => {
            const totalScore = item.user_answers?.reduce((a: any, b: any) => a + b?.mark, 0);
            // daraa soli

            // const finalScore = totalScore - (item?.sub_questions?.reduce((a: any, b: any) => a + b?.user_answers?.reduce((aa: any, bb: any) => aa + bb?.mark, 0), 0) ?? 0);

            scoreValues[`score-${item.id}`] = totalScore;

            settleValue[item.id] = userAnswerToProgress(item);
         });

         scoreReset(scoreValues);
         reset(settleValue);

         setTempLoading(true);
         return;
      }
      scoreReset();
      reset();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isFetchedAfterMount, pathname]);

   const onSubmit = (data: any) => {
      let isValid = true;
      Object.keys(sub.subValue)?.forEach((item) => {
         Object.keys(sub.subValue[item])?.forEach((elements) => {
            if (sub.subValue?.[item]?.[elements] === undefined) {
               sub.getErrors[item]?.(elements, { message: 'Оноо өгнө үү', type: 'required' }, { shouldFocus: true });
               isValid = false;
            }
         });
      });

      if (isValid) {
         const finalSubmitData: any = [];

         Object.keys(data)?.forEach((item: any) => {
            if (sub.subValue[item?.replace('score-', '')]) {
               const subQuestionAnswers: any = [];
               Object.keys(sub.subValue[item?.replace('score-', '')])?.forEach((element) => {
                  // console.log(parseFloat(sub.subValue?.[item?.replace('score-', '')]?.[element]),)

                  // console.log(sub.subValue?.[item?.replace('score-', '')]?.[element], "------------>sub.subValue?.[item?.replace('score-', '')]?.[element]")
                  subQuestionAnswers.push({ question_id: element?.replace('score-', ''), score: parseFloat(sub.subValue?.[item?.replace('score-', '')]?.[element]) });
               });

               finalSubmitData.push({ question_id: item?.replace('score-', ''), score: data[item], sub_question_answers: subQuestionAnswers });
            }

            finalSubmitData.push({ question_id: item?.replace('score-', ''), score: data[item] });
         });
         // sub_question_answers:[]
         mutate(finalSubmitData);
      }
   };

   const user_name = data?.data?.user_exam?.user
      ? `${data?.data?.user_exam?.user?.lastname?.slice(0, 1)}. ${data?.data?.user_exam?.user?.firstname}`
      : `${data?.data?.user_exam?.employee?.lastname?.slice(0, 1)}. ${data?.data?.user_exam?.employee?.firstname}`;

   return (
      <div>
         {/* <h1 onClick={setError}>test</h1> */}
         <BreadCrumb
            // pathList={[
            //    { label: 'Засах шалгалтууд', to: '/handle' },
            //    { label: examDAta?.data?.name, to: `/handle/${examDAta?.data?.id}` },
            //    { label: 'Материал засах', isActive: true, to: `/handle/${examDAta?.data?.id}/${data?.data?.id}` },
            // ]}

            pathList={[
               isResult ? { label: 'Шалгалтын үр дүн', to: '/handle/examresults' } : { label: 'Засах шалгалтууд', to: '/handle' },
               { label: examDAta?.data?.name, isActive: true, to: `/handle${isResult ? `/examresults` : ``}/${examDAta?.data?.id}` },

               { label: `Материал ${isResult ? `` : `засах`}`, isActive: true, to: `/handle${isResult ? `/examresults` : ``}/${examDAta?.data?.id}/${data?.data?.id}` },
            ]}
         />

         {!tempLoading ? (
            <>
               <Skeleton className="h-10 mb-4 mt-2" />
               <Skeleton className="h-[70dvh]" />
            </>
         ) : (
            <>
               <Header title={`${user_name} - материал засах`} />

               <form onSubmit={handleSubmit(onSubmit)}>
                  <QuestionActionSector
                     isFromInspector
                     sectionData={data?.data?.variant?.sections}
                     score_visible={true}
                     control={control}
                     scoreController={scoreController}
                     scrumble_questions={data?.data?.scrumble_questions}
                     // score_visible={data?.data.score_visible}
                     // ProgressData={ProgressData}
                  />

                  {!isResult && (
                     <div className="flex items-center justify-end gap-3 mb-4">
                        {/* <Button size="lg" variant="outline" className="rounded-full" type="button">
                              Түр хадгалах
                           </Button> */}
                        <Button isLoading={isPending} size="lg" className="rounded-full" type="submit">
                           <MdCheck className="text-lg" /> Засаж дуусгах
                        </Button>
                     </div>
                  )}
               </form>
            </>
         )}
      </div>
   );
};

export default ExamMaterialAction;
