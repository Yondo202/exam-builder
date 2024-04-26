import { useQuery } from '@tanstack/react-query';
import { request } from '@/lib/core/request';
import { DataTable, BreadCrumb, Header, Button, Drawer } from '@/components/custom';
import { ColumnDef } from '@tanstack/react-table';
import { TBreadCrumb } from '@/components/custom/BreadCrumb';
import { MdOutlineAdd } from 'react-icons/md';
import ConfigAction from '@/pages/exams/ConfigAction';

export type TGroup = {
   userId: number;
   id: number;
   title: string;
   completed: boolean;
};

// eslint-disable-next-line react-refresh/only-export-components

const Exams = ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => {
   const { data = [], isLoading } = useQuery({ queryKey: ['groups'], queryFn: () => request<TGroup[]>({ mainUrl: 'https://jsonplaceholder.typicode.com/', url: 'todos' }) });

   return (
      <div>
         <BreadCrumb pathList={breadcrumbs} />
         <Header
            title={breadcrumbs.find((item) => item.isActive)?.label}
            action={
               <Drawer title="Шалгалтын тохиргоо" content={<ConfigAction />} className="py-2 max-w-4xl" titleClassName='pt-2 pb-3'>
                  <Button className="rounded-full">
                     <MdOutlineAdd className="text-base" /> Шалгалт үүсгэх
                  </Button>
               </Drawer>
            }
         />
         <DataTable data={data} columns={columnDef} isLoading={isLoading} />
      </div>
   );
};

export default Exams;

const columnDef: ColumnDef<TGroup>[] = [
   {
      header: 'userId',
      accessorKey: 'userId',
      // size:500,
   },
   {
      header: 'Гарчиг',
      accessorKey: 'title',
   },
   {
      header: 'completed',
      accessorKey: 'completed',
   },
   {
      header: 'id',
      accessorKey: 'id',
   },
];
