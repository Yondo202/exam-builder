import { TBreadCrumb } from '@/components/custom/BreadCrumb';
import { BreadCrumb, Header } from '@/components/custom';
import { Pie } from 'react-chartjs-2';
import { useRef } from 'react';
import 'chart.js/auto'; // ADD THIS

const Dashboard = ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => {
   const ref = useRef();
   const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
         {
            label: 'First dataset',
            data: [33, 53, 85, 41, 44, 65],
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
         <div className="grid grid-cols-3">
            <div className="wrapper">
               <div className='px-5 py-2 border-b text-sm'>Шалгалтын явц</div>
               <div className='p-5'>
                  <Pie
                     ref={ref}
                     data={data}
                     options={{
                        scales: {
                           y: {
                              beginAtZero: true,
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
   );
};

export default Dashboard;
