// import { useMatches, matchRoutes, matchPath } from "react-router-dom"
import { useMutation } from '@tanstack/react-query';
import { request, UseReFetch } from '@/lib/core/request';
import { useEffect, useState } from 'react';
import { Button, TextInput, DeleteContent, SelectInput, type TOption, UsePrompt } from '@/components/custom';
import { type TActionProps, ATypes } from '@/lib/sharedTypes';
import { BsListNested } from 'react-icons/bs';
import { useForm } from 'react-hook-form';

export type TCategory = {
   id: string;
   name: string;
   created_at?: string;
   updated_at?: string;
   sub_categories?: TCategory[];
   category_id?: string;
   created_employee?: { lastname: string; firstname: string };
   cat_id?: string;
   // org_id:string
};

export const catAsset = {
   main_category: {
      label: 'Үндсэн ангилал',
      url: 'cats/list/category',
   },
   sub_category: {
      label: 'Дэд ангилал',
      url: 'cats/list/sub-category',
   },
} as const;

export type TKeys = keyof typeof catAsset;

const GroupAction = ({ current, action, setClose, options, cat_id }: TActionProps<TCategory> & { current: TKeys; options: TOption[]; cat_id?: string }) => {
   const [isDelete, setDelete] = useState(false);
   const {
      control,
      handleSubmit,
      reset,
      setValue,
      formState: { isDirty },
   } = useForm({ defaultValues: { name: '', cat_id: '' } });
   const actionUrl = catAsset[current]?.url?.replace('/list', '');

   const { isPending, mutate } = useMutation({
      mutationKey: [`category/${current}`, current],
      mutationFn: (body?: Omit<TCategory, 'id'> | undefined) =>
         request<Omit<TCategory, 'id'>>({
            method: ATypes[!body ? 'delete' : action.type]?.apiMethod,
            url: action.type !== 'add' ? actionUrl + `/${action.data?.id}` : actionUrl,
            body: body,
            filterBody: {
               pagination: {
                  page: 1,
                  page_size: 20,
               },
            },
         }),
      onSuccess: () => {
         setClose?.({});
         //  UseReFetch({ queryKey: `category/${current}`, queryId: current });
         UseReFetch({ queryKey: `category/main_category`, queryId: `main_category` });
      },
   });

   useEffect(() => {
      if (action.type !== 'add') {
         if (current === 'sub_category') {
            reset({ ...action.data, cat_id: action.data?.category_id });
            return;
         }
         reset(action.data);
      }

      if (current === 'sub_category') {
         setValue('cat_id', cat_id ?? '');
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [action.isOpen]);

   const onSubmit = (data: Omit<TCategory, 'id'>) => {
      mutate(data);
   };

   UsePrompt?.({ isBlocked: isDirty });

   if (isDelete) {
      return <DeleteContent setClose={setClose} submitAction={() => mutate(undefined)} isLoading={isPending} className="pb-6" />;
   }

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         {current === 'sub_category' && (
            <SelectInput
               options={options}
               label={`${catAsset['main_category']?.label} сонгох`}
               control={control}
               className="mb-10"
               disabled={current === 'sub_category'}
               name="cat_id"
               rules={{ required: `${catAsset['main_category']?.label} сонго` }}
            />
         )}

         <TextInput
            floatLabel={current !== 'sub_category'}
            autoFocus={current !== 'sub_category'}
            placeholder={`${catAsset[current]?.label}ын нэр`}
            label={`${catAsset[current]?.label}ын нэр оруулах`}
            name="name"
            control={control}
            rules={{ required: `${catAsset[current]?.label} оруулна уу` }}
         />
         <div className="flex justify-between w-full pt-6">
            {action.type === 'edit' ? (
               <Button variant="destructive" isLoading={isPending} type="button" onClick={() => setDelete(true)}>
                  Устгах
               </Button>
            ) : (
               <div />
            )}

            <Button isLoading={isPending} type="submit" disabled={!isDirty}>
               Хадгалах
            </Button>
         </div>

         {current !== 'sub_category' && (
            <div className="mt-3">
               <div className="text-primary mb-2 flex gap-2 items-center">
                  <BsListNested className="text-base" /> Дэд бүлэгийн жагсаалт
               </div>
               {action.data?.sub_categories?.map((item, index) => {
                  return (
                     <div key={index} className="flex items-center gap-2 border border-primary/10 rounded-md px-4 py-2 mb-2">
                        <span className="text-primary"> {index + 1}.</span> {item.name}
                     </div>
                  );
               })}
            </div>
         )}
      </form>
   );
};

export default GroupAction;
