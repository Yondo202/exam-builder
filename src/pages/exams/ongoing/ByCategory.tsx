import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Header, BreadCrumb, DataTable } from '@/components/custom'; //BreadCrumb
import { FinalRespnse } from '@/lib/sharedTypes';
import { useNavigate } from 'react-router-dom';
import { TBreadCrumb } from '@/components/custom/BreadCrumb';
import { request } from '@/lib/core/request';
import { ColumnDef } from '@tanstack/react-table';
import { CategorySelect } from '@/pages/questions/Action';

type TOngoungByCategory = {
   exams_id: string;
   exams_name: string;
   progressCount: string;
};

const ByCategory = ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => {
   const navigate = useNavigate()
   const { control, setValue, watch } = useForm({ defaultValues: { category_id: '', sub_category_id: '' } });
   const { data, isLoading } = useQuery({
      enabled: watch('category_id') !== '' && watch('sub_category_id') !== '',
      queryKey: ['ongoing/list', `${watch('category_id')} / ${watch('sub_category_id')}`],
      queryFn: () =>
         request<FinalRespnse<TOngoungByCategory[]>>({
            url: 'exam/ongoing/list',
            method: 'post',
            offAlert: true,
            filterBody: watch(),
         }),
   });

   return (
      <div>
         <BreadCrumb pathList={breadcrumbs} />
         <Header title={breadcrumbs.find((item) => item.isActive)?.label} />
         <div className="wrapper w-full mb-5">
            <div className="flex justify-start gap-5 w-96 p-4">
               <CategorySelect
                  control={control}
                  name="category_id"
                  current="main_category"
                  label="Үндсэн ангилал"
                  triggerClassName="rounded-full w-48 h-8"
                  onChange={() => {
                     setValue('sub_category_id', '');
                  }}
               />
               <CategorySelect
                  triggerClassName="rounded-full w-48 h-8"
                  control={control}
                  disabled={!watch('category_id')}
                  idKey={watch('category_id')}
                  name="sub_category_id"
                  current="sub_category"
                  label="Дэд ангилал"
               />
            </div>
         </div>

         <DataTable rowAction={({ data })=>navigate(`${data?.exams_id}=${data?.exams_name}`)} hideActionButton="delete" isLoading={isLoading} data={data?.data ?? []} columns={columnDef} />
      </div>
   );
};

export default ByCategory;

const columnDef: ColumnDef<TOngoungByCategory>[] = [
   {
      header: 'Шалгалтын нэр',
      accessorKey: 'exams_name',
   },
   {
      header: 'Явцын нийт тоо',
      accessorKey: 'progressCount',
   }
];
