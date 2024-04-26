import { useQuery } from '@tanstack/react-query';
import { request } from '@/lib/core/request';
import { DataTable, BreadCrumb, Header, Button } from '@/components/custom';
import { ColumnDef } from '@tanstack/react-table';
import { TBreadCrumb } from '@/components/custom/BreadCrumb';
import { MdOutlineAdd } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiCheck } from 'react-icons/fi';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { qTypes, type TQTypes } from './Action';

export type TGroup = {
   userId: number;
   id: number;
   title: string;
   completed: boolean;
};

// eslint-disable-next-line react-refresh/only-export-components

const Groups = ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => {
   const { data = [], isLoading } = useQuery({ queryKey: ['groups'], queryFn: () => request<TGroup[]>({ mainUrl: 'https://jsonplaceholder.typicode.com/', url: 'todos' }) });

   return (
      <div>
         <BreadCrumb pathList={breadcrumbs} />
         <Header
            title={breadcrumbs.find((item) => item.isActive)?.label}
            action={
               <Popover>
                  <PopoverTrigger asChild>
                     <Button className="rounded-full">
                        <MdOutlineAdd className='text-base' /> Асуумж нэмэх <FiChevronDown />
                     </Button>
                  </PopoverTrigger>

                  <PopoverContent align="end" sideOffset={8}>
                     {Object.keys(qTypes)?.map((item, index) => {
                        return (
                           <Link
                              to={`${breadcrumbs.find((item) => item.isActive)?.to}/create?type=${item}`}
                              className="group p-3 hover:bg-hover-bg rounded-md cursor-pointer flex items-center justify-between gap-3"
                              key={index}
                           >
                              {qTypes[item as TQTypes]?.label} <FiCheck className="opacity-0 group-hover:opacity-100" />
                           </Link>
                        );
                     })}
                  </PopoverContent>
               </Popover>
            }
         />
         <DataTable data={data} columns={columnDef} isLoading={isLoading} />
      </div>
   );
};

export default Groups;

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
