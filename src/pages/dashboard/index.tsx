import { TBreadCrumb } from '@/components/custom/BreadCrumb';
import { Header, BreadCrumb } from '@/components/custom'; //BreadCrumb
import { Pie, Line, Bar } from 'react-chartjs-2';
import { useRef } from 'react';
import 'chart.js/auto'; // ADD THIS

const options = {
   responsive: true,
   plugins: {
      legend: {
         position: 'top' as const,
      },
      // title: {
      //    display: true,
      //    text: 'Шалгалтын үр дүн',
      // },
   },
};

const labels = ['January', 'February', 'March', 'April'];

const barData = {
   labels,
   datasets: [
      {
         label: 'Dataset 1',
         data: [33, 53, 85, 41],
         // backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
         label: 'Dataset 2',
         data: [10, 20, 55, 100],
         // backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
   ],
};

const Dashboard = ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => {
   const ref = useRef();
   const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr'],
      datasets: [
         {
            label: 'First dataset',
            data: [15, 53, 85, 41],
            fill: true,
            // backgroundColor: 'rgba(75,192,192,0.2)',
            // borderColor: 'rgba(75,192,192,1)',
         },
      ],
   };
   return (
      <div>
         <BreadCrumb pathList={breadcrumbs} />
         <Header title={breadcrumbs.find((item) => item.isActive)?.label} />
         {/* <Header title="Шалгалтын явц" /> */}
         <div className="grid grid-cols-[1fr_40%] gap-5">
            <div>
               <div className="grid grid-cols-2 mb-5 gap-5">
                  <div className="wrapper p-3 text-center">
                     <div className="text-muted-text mb-3 text-xs">Оролцсон ажилчдын тоо</div>
                     <div className="text-xl font-semibold">200</div>
                  </div>
                  <div className="wrapper p-3 text-center">
                     <div className="text-muted-text mb-3 text-xs">Оролцсон ажил горилогчийн тоо</div>
                     <div className="text-xl font-semibold">200</div>
                  </div>
               </div>
               <div className="wrapper p-0">
                  <div className="px-5 py-2 border-b text-xs2">Шалгалтын дундаж үзүүлэлт</div>
                  <div className="p-5">
                     <Line
                        // options={options}
                        // data={barData}
                        data={{
                           labels: labels,
                           datasets: [
                              {
                                 label: 'Dataset 1',
                                 data: [33, 53, 85, 41],
                                 // borderColor: 'rgb(255, 99, 132)',
                                 // backgroundColor: 'rgba(255, 99, 132, 0.5)',
                              },
                              {
                                 label: 'Dataset 2',
                                 data: [10, 20, 55, 100],
                                 // borderColor: 'rgb(53, 162, 235)',
                                 // backgroundColor: 'rgba(53, 162, 235, 0.5)',
                              },
                           ],
                        }}
                     />
                  </div>
               </div>
            </div>

            <div>
               <div className="wrapper mb-5">
                  <div className="px-5 py-2 border-b text-xs2">Шалгалтын дундаж үзүүлэлт</div>
                  <div className="p-5 px-3">
                     <Bar options={options} data={barData} />
                  </div>
               </div>
               <div className="wrapper p-0">
                  <div className="px-5 py-2 border-b text-xs2">Тэнцсэн үзүүлэлт</div>
                  <div className="px-10 py-4 pt-0">
                     <div></div>
                     <Pie
                        ref={ref}
                        data={data}
                        options={{
                           responsive: true,
                           // scales: {
                           //    y: {
                           //       beginAtZero: false,
                           //    },
                           // },
                           layout: {
                              padding: {
                                 left: 50,
                                 right: 50,
                                 bottom: 0,
                                 top: 0,
                              },
                           },
                           plugins: {
                              legend: {
                                 // fullSize:true,
                                 // maxWidth:1000,
                                 position: 'bottom' as const,
                              },
                           },
                        }}
                        // options={...}
                        // {...props}
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Dashboard;
