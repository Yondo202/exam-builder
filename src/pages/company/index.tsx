// import { useMatches, matchRoutes, matchPath } from "react-router-dom"
import { TBreadCrumb } from '@/components/custom/BreadCrumb';
// import { useMatches, matchRoutes, matchPath } from "react-router-dom"
import { useMutation } from '@tanstack/react-query';
import { request, UseReFetch } from '@/lib/core/request';
import { DataTable, Drawer, Button, TextInput, UsePrompt, Header, BreadCrumb } from '@/components/custom';
import { type FinalRespnse, type TAction, type TActionProps } from '@/lib/sharedTypes';
import { ColumnDef } from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import { MdOutlineAdd } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

type TCompany = {
   id: string;
   name: string;
   created_at: string;

   green_id: 'FIN';
   odoo_id: 'TBF';
};

const Company = ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => {
   const [action, setAction] = useState<TAction<TCompany>>({ isOpen: false, type: 'add', data: {} as TCompany });

   const { data, isLoading } = useQuery({
      queryKey: [`company`],
      queryFn: () =>
         request<FinalRespnse<TCompany[]>>({
            method: 'post',
            url: `org/list`,
            offAlert: true,
            filterBody: {
               pagination: {
                  page: 1,
                  page_size: 100,
               },
            },
         }),
   });

   const setClose = () => {
      setAction((prev) => ({ ...prev, isOpen: false }));
   };

   return (
      <>
         <BreadCrumb pathList={breadcrumbs} />
         <Header
            title="Байгууллага"
            // action={
            //    <SelectQuestionType rowAction={rowAction}>
            //       <Button>
            //          <MdOutlineAdd className="text-base" /> Асуумж нэмэх <FiChevronDown />
            //       </Button>
            //    </SelectQuestionType>
            // }
         />
         <DataTable
            rowAction={(data) => setAction(data)}
            headAction={
               <Drawer
                  open={action.isOpen}
                  onOpenChange={(event) => setAction((prev) => ({ ...prev, isOpen: event }))}
                  title="Байгууллага"
                  content={<CompanyAction setClose={setClose} action={action} />}
                  className={`py-10 max-w-2xl`}
               >
                  <Button size="sm" className="rounded-full" variant="outline" onClick={() => setAction((prev) => ({ ...prev, isOpen: true, type: 'add' }))}>
                     <MdOutlineAdd /> Байгууллага
                  </Button>
               </Drawer>
            }
            defaultSortField="created_at"
            data={data?.data ?? []}
            columns={columnDef}
            isLoading={isLoading}
         />
      </>
   );
};

export default Company;

const CompanyAction = ({ setClose, action }: TActionProps<TCompany>) => {
   const {
      control,
      handleSubmit,
      reset,
      formState: { isDirty },
   } = useForm<TCompany>({
      defaultValues: {
         name: '',
         green_id: 'FIN',
         odoo_id: 'TBF',
      },
   });

   // green_id:'FIN'
   // odoo_id:'TBF'

   const { isPending, mutate } = useMutation({
      mutationFn: (body?: TCompany) =>
         request<TCompany>({
            method: 'post',
            url: action.type === 'add' ? `org/register` : `org/update/${action.data?.id}`,
            body: body,
         }),
      onSuccess: () => {
         //resdata - deer password irj baigaa
         setClose?.({});
         UseReFetch({ queryKey: `company` });
      },
   });

   useEffect(() => {
      if (action.type !== 'add') {
         reset(action.data ?? {});
         return;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [action.isOpen]);

   const onSubmit = (data: TCompany) => {
      mutate(data);
   };

   UsePrompt?.({ isBlocked: isDirty });

   //    if (action.type === 'delete') {
   //       return <DeleteContent setClose={setClose} submitAction={() => mutate(undefined)} isLoading={isPending} className="pb-6" />;
   //    }

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <TextInput floatLabel={false} autoFocus placeholder="Байгууллагын нэр" label="Байгууллагын нэр" name="name" control={control} rules={{ required: `Байгууллагын нэр` }} />

         <div className="flex justify-end w-full pt-10">
            <Button isLoading={isPending} type="submit" disabled={!isDirty}>
               Хадгалах
            </Button>
         </div>
      </form>
   );
};

const columnDef: ColumnDef<TCompany>[] = [
   {
      header: 'Байгууллагын нэр',
      accessorKey: 'name',
   },
   {
      header: 'Үүсгэсэн огноо',
      accessorKey: 'created_at',
      cell: ({ row }) => row.original?.created_at?.slice(0, 16).replace('T', ' '),
   },
];
