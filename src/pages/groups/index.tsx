// import { useMatches, matchRoutes, matchPath } from "react-router-dom"
import { useQuery } from '@tanstack/react-query';
import { request } from '@/lib/core/request';
import { useState } from 'react';
import { DataTable, BreadCrumb, AnimatedTabs, Drawer, Button, TextInput } from '@/components/custom';
import { ColumnDef } from '@tanstack/react-table';
import { TBreadCrumb } from '@/components/custom/BreadCrumb';
import { useForm } from 'react-hook-form';
import { MdOutlineAdd } from "react-icons/md";

export type TGroup = {
   userId: number;
   id: number;
   title: string;
   completed: boolean;
};

const groupAsset = [
   { label: 'Үндсэн бүлэг', key: 'main_group' },
   { label: 'Дэд бүлэг', key: 'sub_group' },
];

const Groups = ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => {
   const [current, setCurrent] = useState(groupAsset[0]?.key);
   const { data = [], isLoading } = useQuery({ queryKey: ['groups'], queryFn: () => request<TGroup[]>({ mainUrl: 'https://jsonplaceholder.typicode.com/', url: 'todos' }) });

   return (
      <div>
         <BreadCrumb pathList={breadcrumbs} />
         <AnimatedTabs items={groupAsset} activeKey={current} onChange={(e) => setCurrent(e)} />
         <DataTable
            data={data}
            columns={columnDef}
            isLoading={isLoading}
            headAction={
               <Drawer title="Үндсэн бүлэг нэмэх" content={<GroupAction />} className="py-10">
                  <Button size="sm" className="rounded-full" variant="outline">
                     <MdOutlineAdd /> {current === 'main_group' ? ` Бүлэг нэмэх` : `Дэд бүлэг нэмэх`}
                  </Button>
               </Drawer>
            }
         />
      </div>
   );
};

export default Groups;

const GroupAction = () => {
   const { control, handleSubmit } = useForm({ defaultValues: { name: '' } });
   const onSubmit = (data: object) => {
      console.log(data, '=-=>data');
   };
   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <TextInput autoFocus label="Бүлэгийн нэр оруулах" placeholder="Бүлэгийн нэр оруулах" name="name" control={control} rules={{ required: 'Бүлэгийн нэр оруулна уу' }} />
         <div className="flex justify-end w-full pt-8">
            <Button type="submit">Хадгалах</Button>
         </div>
      </form>
   );
};

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
