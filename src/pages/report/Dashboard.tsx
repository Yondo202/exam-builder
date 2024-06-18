import { TBreadCrumb } from '@/components/custom/BreadCrumb';
import { Header, BreadCrumb, DatePicker, Loading } from '@/components/custom'; //BreadCrumb
import { Bar, Pie } from 'react-chartjs-2'; //Pie, Line
import 'chart.js/auto'; // ADD THIS
import { useQuery } from '@tanstack/react-query';
import { request } from '@/lib/core/request';
import { formatDateToCustomISO } from '@/lib/utils';
import { FinalRespnse } from '@/lib/sharedTypes';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { subDays, endOfDay, startOfDay } from 'date-fns';

type TExamResult = {
   exam_count: string;
   invited_user_count: string;
   given_exam_count: string;

   exam_name: string;
   category: string;
   sub_category: string;

   status: string;
};

type TDashboard = {
   exam_result: TExamResult[];
   category_result: TExamResult[];
   sub_category_result: TExamResult[];
   alt_result: TExamResult[]; // status uusiig enum aas av
};

type RangeFilter = {
   start_range: string;
   end_range: string;
};

// https://back-exam.tavanbogd.mn/dashboard
const Dashboard = ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => {
   const { control, watch, reset } = useForm<RangeFilter>({ defaultValues: { start_range: '', end_range: '' } });
   const { data, isPending } = useQuery({
      enabled: watch('end_range') !== '' && watch('start_range') !== '',
      queryKey: ['dashboard', watch()],
      queryFn: () =>
         request<FinalRespnse<TDashboard>>({
            url: 'dashboard',
            method: 'post',
            offAlert: true,
            filterBody: {
               range: watch(),
            },
         }),
   });

   const generateColors = (num: number) => {
      const colors = [];
      for (let i = 0; i < num; i++) {
         const r = Math.floor(Math.random() * 255);
         const g = Math.floor(Math.random() * 255);
         const b = Math.floor(Math.random() * 255);
         colors.push(`rgba(${r}, ${g}, ${b}, 0.2)`);
      }
      return colors;
   };

   useEffect(() => {
      const currentDate = new Date();
      const pastDate = startOfDay(subDays(currentDate, 7));
      const Today = endOfDay(currentDate);

      reset({ start_range: formatDateToCustomISO(pastDate, true), end_range: formatDateToCustomISO(Today, true) });
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const examResults = data?.data.exam_result ?? [];
   const backgroundColors = generateColors(examResults.length);
   // const borderColors = backgroundColors.map((color) => color.replace('0.2', '1'));

   return (
      <div>
         <Loading load={isPending} />
         <BreadCrumb pathList={breadcrumbs} />
         <Header title={breadcrumbs.find((item) => item.isActive)?.label} />
         <div className="grid grid-cols-2 gap-5 mb-5">
            <div>
               <div className="mb-5 wrapper">
                  <div className="px-5 py-2 border-b text-xs2">Огноогоор шүүх</div>
                  <div className="grid grid-cols-2 items-center gap-5 p-5 pt-3">
                     <DatePicker triggerClassName="h-[32px] rounded-full" hideClose className="w-full" name="start_range" label="Эхлэх огноо" control={control} />
                     <DatePicker triggerClassName="h-[32px] rounded-full" hideClose className="w-full" name="end_range" label="Дуусах огноо" control={control} />
                  </div>

                  {/* <div className="p-5 pt-0">sdgkjsdkgj</div> */}
               </div>
               <div className="wrapper p-0">
                  <div className="px-5 py-2 border-b text-xs2">Шалгалтанд уригдсан хүний тоо</div>
                  <div className="p-5">
                     <Bar
                        height={230}
                        options={{
                           responsive: true,
                           plugins: {
                              legend: {
                                 display: false,
                              },
                           },
                        }}
                        data={{
                           labels: ['Шалгалтанд уригдсан хүний тоо'],
                           datasets:
                              examResults?.map((item) => {
                                 return {
                                    label: item.exam_name,
                                    data: [+item.invited_user_count],
                                 };
                              }) ?? [],
                        }}
                     />
                  </div>
               </div>
            </div>

            <div className="wrapper mb-5 h-full">
               <div className="px-5 py-2 border-b text-xs2">Шалгалтыг өгсөн тоо</div>
               <div className="p-5 px-3">
                  <Pie
                     height={100}
                     data={{
                        // labels: ['Шалгалтанд уригдсан хүний тоо'],
                        labels: examResults?.map((item) => item.exam_name),
                        datasets: [
                           {
                              label: 'Шалгалтыг өгсөн тоо',
                              data: examResults?.map((item) => +item.given_exam_count),
                              backgroundColor: backgroundColors,
                              // borderColor: borderColors,
                              // borderWidth: 1,
                           },
                        ],
                     }}
                  />
               </div>
            </div>
         </div>

         <div className="wrapper mb-5">
            <div className="px-5 py-2 border-b text-xs2">Үндсэн ангилалаар</div>
            <div className="p-5 px-3">
               <Bar
                  height={70}
                  options={{
                     responsive: true,
                  }}
                  data={{
                     labels: data?.data?.category_result?.map((item) => item.category),
                     datasets: [
                        {
                           label: 'Шалгалтанд урисан хүний тоо',
                           data: examResults?.map((item) => +item.invited_user_count),
                        },
                        {
                           label: 'Шалгалтыг өгсөн тоо',
                           data: examResults?.map((item) => +item.given_exam_count),
                        },
                        {
                           label: 'Хамаарах шалгалтын тоо',
                           data: examResults?.map((item) => +item.exam_count),
                        },
                     ],
                  }}
               />
            </div>
         </div>

         <div className="wrapper mb-5">
            <div className="px-5 py-2 border-b text-xs2">Дэд ангилалаар</div>
            <div className="p-5 px-3">
               <Bar
                  height={70}
                  options={{
                     responsive: true,
                  }}
                  data={{
                     labels: data?.data?.sub_category_result?.map((item) => item.sub_category),
                     datasets: [
                        {
                           label: 'Шалгалтанд урисан хүний тоо',
                           data: examResults?.map((item) => +item.invited_user_count),
                        },
                        {
                           label: 'Шалгалтыг өгсөн тоо',
                           data: examResults?.map((item) => +item.given_exam_count),
                        },
                        {
                           label: 'Хамаарах шалгалтын тоо',
                           data: examResults?.map((item) => +item.exam_count),
                        },
                     ],
                  }}
               />
            </div>
         </div>
      </div>
   );
};

export default Dashboard;
