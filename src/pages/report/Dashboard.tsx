import { TBreadCrumb } from '@/components/custom/BreadCrumb';
import { Header, BreadCrumb, DatePicker, Loading, DataTable } from '@/components/custom'; //BreadCrumb
import { useQuery } from '@tanstack/react-query';
import { request } from '@/lib/core/request';
import { formatDateToCustomISO } from '@/lib/utils';
// import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FinalRespnse } from '@/lib/sharedTypes';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { subDays, endOfDay, startOfDay } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
// Хянах самбар

type TExamResult = {
   exam_count: string;
   invited_user_count: string;
   given_exam_count: string;
   exam_name: string;
   category: string;
   sub_category: string;
   status: string;
   avg_score: string;
};

type TotalValues = {
   total_attempt_count: string;
   total_invited_count: string;
   total_uniq_attempt_count: string;
};

type TDashboard = {
   exam_result: TExamResult[];
   category_result: TExamResult[];
   sub_category_result: TExamResult[];
   alt_result: TExamResult[]; // status uusiig enum aas av
   total_result: TotalValues[]; // status uusiig enum aas av

   total_user_count: number;
};

type RangeFilter = {
   start_range: string;
   end_range: string;
};

// const config = {
//    legend: {
//       direction: 'row',
//       position: { vertical: 'top', horizontal: 'middle' },
//       padding: -6,

//       labelStyle: {
//          fontSize: 11,
//          // fill: 'blue',
//       },
//    },
// };

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

   const { data: AttemptStatsData, isPending: StatsLoading } = useQuery({
      enabled: watch('end_range') !== '' && watch('start_range') !== '',
      queryKey: ['attempt/stats', watch()],
      queryFn: () =>
         request<FinalRespnse<TAttemptStats>>({
            url: 'attempt/stats',
            method: 'post',
            offAlert: true,
            filterBody: {
               range: watch(),
            },
         }),
   });

   // const generateColors = (num: number) => {
   //    const colors = [];
   //    for (let i = 0; i < num; i++) {
   //       const r = Math.floor(Math.random() * 255);
   //       const g = Math.floor(Math.random() * 255);
   //       const b = Math.floor(Math.random() * 255);
   //       colors.push(`rgba(${r}, ${g}, ${b}, 0.2)`);
   //    }
   //    return colors;
   // };

   useEffect(() => {
      const currentDate = new Date();
      const pastDate = startOfDay(subDays(currentDate, 7));
      const Today = endOfDay(currentDate);

      reset({ start_range: formatDateToCustomISO(pastDate, true), end_range: formatDateToCustomISO(Today, true) });
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const examResults = data?.data.exam_result ?? [];
   // const backgroundColors = generateColors(examResults.length);
   // const borderColors = backgroundColors.map((color) => color.replace('0.2', '1'));

   // console.log(AttemptStatsData, "----->AttemptStatsData")

   return (
      <div>
         <Loading load={isPending} />
         <BreadCrumb pathList={breadcrumbs} />
         <Header title={breadcrumbs.find((item) => item.isActive)?.label} />
         <div className="grid grid-cols-[40%_1fr] gap-5 mb-5">
            <div className="grid grid-row-[auto_1fr]">
               <div className="mb-5 wrapper">
                  <div className="grid grid-rows items-center gap-5 p-5 pt-3">
                     <DatePicker triggerClassName="h-[32px] rounded-full" hideClose className="w-full" name="start_range" label="Эхлэх огноо" control={control} />
                     <DatePicker triggerClassName="h-[32px] rounded-full" hideClose className="w-full" name="end_range" label="Дуусах огноо" control={control} />
                  </div>
               </div>

               <div className="mb-5 p-2 wrapper h-full">
                  <div className="grid grid-rows items-center gap-5 p-5 pt-3 justify-center h-full">
                     <div className="flex flex-col items-center gap-2">
                        <span className="text-muted-text text-xs">Нийт оролцсон хэрэглэгчид</span>
                        <span className="text-primary font-medium text-lg">{data?.data?.total_result?.at(0)?.total_uniq_attempt_count}</span>
                     </div>
                     <div className="flex flex-col items-center gap-2">
                        <span className="text-muted-text text-xs">Идэвхитэй хэрэглэгчид</span>
                        <span className="text-primary font-medium text-lg">{data?.data?.total_user_count ?? 0}</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="wrapper mb-5 h-full">
               <div className="px-5 py-2 border-b text-xs2">Шалгалтыг өгсөн тоо</div>
               <div className="p-5 px-3">
                  <PieChart
                     slotProps={{
                        // legend: { hidden: true },

                        legend: {
                           // direction: 'column',
                           position: { vertical: 'top', horizontal: 'right' },
                           padding: -120,
                           // seriesToDisplay:"",
                           labelStyle: {
                              fontSize: 11,
                              // fill: 'blue',
                           },
                        },
                     }}
                     series={[
                        {
                           data: examResults?.map((item) => ({ label: () => `${item?.exam_name}`, value: +item.given_exam_count })),
                           innerRadius: 30,
                           paddingAngle: 1,
                           cornerRadius: 5,
                           highlightScope: { faded: 'global', highlighted: 'item' },
                           faded: { innerRadius: 20, additionalRadius: -20, color: 'gray' },
                        },
                     ]}
                     width={480}
                     height={300}
                  />
               </div>
            </div>
         </div>

         <div className="wrapper mb-5">
            <div className="px-5 py-2 border-b text-xs2">Үндсэн ангилалаар</div>
            <div className="p-5 px-3">
               <BarChart
                  xAxis={[{ scaleType: 'band', data: data?.data?.category_result?.map((item) => item.category) ?? [] }]}
                  series={[
                     {
                        data: data?.data?.category_result?.map((item) => +item.invited_user_count) ?? [],
                        label: 'Шалгалтанд урисан хүний тоо',
                     },
                     {
                        data: data?.data?.category_result?.map((item) => +item.given_exam_count) ?? [],
                        label: 'Шалгалтыг өгсөн тоо',
                     },
                     {
                        data: data?.data?.category_result?.map((item) => +item.exam_count) ?? [],
                        label: 'Хамаарах шалгалтын тоо',
                     },
                  ]}
                  height={300}
                  slotProps={{
                     legend: {
                        direction: 'row',
                        position: { vertical: 'top', horizontal: 'middle' },
                        padding: -6,

                        labelStyle: {
                           fontSize: 11,
                           // fill: 'blue',
                        },
                     },
                  }}
               />
            </div>
         </div>

         <div className="wrapper mb-5">
            <div className="px-5 py-2 border-b text-xs2">Дэд ангилалаар</div>
            <div className="p-5 px-3">
               {/* <Bar
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
               /> */}

               <BarChart
                  xAxis={[{ scaleType: 'band', data: data?.data?.sub_category_result?.map((item) => item.sub_category) ?? [] }]}
                  series={[
                     {
                        data: data?.data?.sub_category_result?.map((item) => +item.invited_user_count) ?? [],
                        label: 'Шалгалтанд урисан хүний тоо',
                     },
                     {
                        data: data?.data?.sub_category_result?.map((item) => +item.given_exam_count) ?? [],
                        label: 'Шалгалтыг өгсөн тоо',
                     },
                     {
                        data: data?.data?.sub_category_result?.map((item) => +item.exam_count) ?? [],
                        label: 'Хамаарах шалгалтын тоо',
                     },
                  ]}
                  height={300}
                  slotProps={{
                     legend: {
                        direction: 'row',
                        position: { vertical: 'top', horizontal: 'middle' },
                        padding: -6,

                        labelStyle: {
                           fontSize: 11,
                           // fill: 'blue',
                        },
                     },
                  }}
               />
            </div>
         </div>

         <DataTable headAction={<div className='text-primary text-base'>Шалгалтын үзүүлэлтүүд</div>} hideColumnVisibleAction isLoading={StatsLoading} data={Array.isArray(AttemptStatsData?.data) ? AttemptStatsData?.data : []} columns={columnDef} />

         {/* <div className="wrapper mb-5">
            <div className="px-5 py-2 border-b text-xs2">Дундаж оноо</div>
            <div className="p-5">
               <Bar
                  height={70}
                  options={{
                     responsive: true,
                  }}
                  data={{
                     labels: ['Дундаж оноо'],
                     datasets:
                        examResults?.map((item) => {
                           return {
                              label: item.exam_name,
                              data: [+item.avg_score],
                           };
                        }) ?? [],
                  }}
               />
            </div>
         </div> */}
      </div>
   );
};

export default Dashboard;

type TAttemptStats = {
   [`Шалгалтын нэр`]: string;
   [`Урисан тоо`]: string;
   [`Оролдлого тоо`]: string;
   [`Хэрэглэгч (Давтагдашгүй)`]: string;
   [`Тэнцсэн`]: string;
   [`Унасан`]: string;
};

const columnDef: ColumnDef<TAttemptStats>[] = [
   {
      accessorKey: 'Шалгалтын нэр',
   },
   {
      accessorKey: 'Оролдлого тоо',
   },
   {
      accessorKey: 'Хэрэглэгч (Давтагдашгүй)',
   },
   {
      accessorKey: 'Тэнцсэн',
   },
   {
      accessorKey: 'Унасан',
   },
];
