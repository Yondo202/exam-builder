import { useEffect, useState } from 'react';
import { Drawer, TextInput, Button, Textarea, TabsList, Tabs, DeleteContent } from '@/components/custom'; //
import { type TAction, type TActionProps, ATypes } from '@/lib/sharedTypes'; // , type FinalRespnse
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { UseReFetch, request } from '@/lib/core/request';
import { type TVariant, type TExamSection } from '..';
import { IoMdAdd } from 'react-icons/io';
import ActionButtons from '@/components/ActionButtons';

type TVairantTabs = {
   exam_id?: string;
   variants?: TVariant[];
   variantId: string;
   setVariantId: (id: string) => void;
   // variants?: FinalRespnse<TVariant[]>;
   children: React.ReactNode;
};

const Variants = ({ exam_id, variants, variantId, setVariantId, children }: TVairantTabs) => {
   // const [current, setCurrent] = useState('');
   const [action, setAction] = useState<TAction<TVariant>>({ isOpen: false, type: 'add', data: {} as TVariant });

   // const { data } = useQuery({
   //    enabled: !!exam_id,
   //    queryKey: ['exam/variants', exam_id],
   //    queryFn: () =>
   //       request<FinalRespnse<TVariant[]>>({
   //          url: `exam/list/variant/${exam_id}`,
   //       }),
   // });
   // console.log(data?.data, '------------->data');
   // console.log('TabsList, TabsTrigger, Tabs, TabsContent,');

   return (
      <>
         <Tabs value={variantId}>
            <TabsList>
               {/* value={item.id} */}
               {variants?.map((item, index) => {
                  return (
                     <div
                        data-state={item.id === variantId ? 'active' : 'inactive'}
                        key={index}
                        onClick={() => setVariantId(item.id)}
                        className="relative group/items inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md px-3.5 py-2 text-xs2 font-medium transition-all data-[state=active]:bg-card-bg data-[state=active]:text-primary hover:bg-primary/5 data-[state=active]:shadow-sm"
                     >
                        {item.name}
                        {item.id === variantId && (
                           <ActionButtons
                              editTrigger={() => setAction({ data: item, type: 'edit', isOpen: true })}
                              deleteTrigger={() => setAction({ data: item, type: 'delete', isOpen: true })}
                              className="w-full -top-12 translate-y-1/2 -right-2 justify-end"
                           />
                        )}
                     </div>
                  );
               })}
               {(variants?.length ?? 0) < 7 && (
                  <Button
                     variant="ghost"
                     onClick={() => setAction((prev) => ({ ...prev, type: 'add', isOpen: true }))}
                     className=" ml-2 px-3 py-2 rounded-md cursor-pointer text-xs hover:bg-primary/5 hover:text-primary"
                  >
                     <IoMdAdd className="text-base" /> Хувилбар нэмэх
                  </Button>
               )}
            </TabsList>

            {children}
         </Tabs>

         <Drawer
            open={action.isOpen}
            onOpenChange={(event) => setAction((prev) => ({ ...prev, isOpen: event }))}
            title="Хувилбар"
            content={<VariantAction exam_id={exam_id} action={action} setClose={() => setAction((prev) => ({ ...prev, isOpen: false }))} />}
            className={`py-10 pt-7 max-w-lg`}
         />
      </>
   );
};

export default Variants;

type TSectionAction = {
   exam_id?: string;
} & TActionProps<TVariant>;

const VariantAction = ({ exam_id, setClose, action }: TSectionAction) => {
   const {
      control,
      handleSubmit,
      formState: { isDirty },
      reset,
   } = useForm<TVariant>({ defaultValues: { name: '', description: '' } });

   useEffect(() => {
      if (action.type !== 'add') {
         reset(action.data);
         return;
      }
      reset({ name: '', description: '' });
   }, []);

   const { mutate, isPending } = useMutation({
      mutationFn: (body?: TVariant) =>
         request<TVariant>({
            method: ATypes[action.type]?.apiMethod,
            url: `exam/variant/${action.type === 'add' ? exam_id : action.data?.id}`,
            body: body,
         }),
      onSuccess: () => {
         UseReFetch({ queryKey: 'exam', queryId: exam_id });
         setClose?.({});
      },
   });

   const onSubmit = (data: TVariant) => {
      mutate(data);
   };

   if (action.type === 'delete') {
      return <DeleteContent setClose={setClose} submitAction={() => mutate(undefined)} isLoading={isPending} className="pb-6" />;
   }

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <TextInput
            className="mb-5"
            floatLabel={false}
            autoFocus={true}
            placeholder={`Хувилбарын нэр`}
            label={`Хувилбарын нэр оруулах`}
            name="name"
            control={control}
            rules={{ required: `Хувилбар оруулна уу` }}
         />

         <Textarea
            // floatLabel={current !== 'sub_category'}
            placeholder={`Хувилбарын тайлбар`}
            label={`Хувилбарын тайлбар оруулах`}
            name="description"
            control={control}
            rules={{ required: false }}
         />

         <div className="flex justify-end w-full pt-10">
            <Button isLoading={isPending} type="submit" disabled={!isDirty}>
               Хадгалах
            </Button>
         </div>
      </form>
   );
};

type TVairantAction = {
   exam_id?: string;
} & TActionProps<TExamSection>;

export const SectionAction = ({ exam_id, setClose, action }: TVairantAction) => {
   const {
      control,
      handleSubmit,
      formState: { isDirty },
      reset,
   } = useForm<TExamSection>({ defaultValues: { name: '', description: '' } });

   useEffect(() => {
      if (action.type !== 'add') {
         reset(action.data);
         return;
      }
      reset({ name: '', description: '' });
   }, []);

   const { mutate, isPending } = useMutation({
      mutationFn: (body?: TExamSection) =>
         request<TExamSection>({
            method: ATypes[action.type]?.apiMethod,
            url: `exam/variant/${action.type === 'add' ? exam_id : action.data?.id}`,
            body: body,
         }),
      onSuccess: () => {
         UseReFetch({ queryKey: 'exam', queryId: exam_id });
         setClose?.({});
      },
   });

   const onSubmit = (data: TExamSection) => {
      mutate({ ...data, sort_number: 0 });
   };

   if (action.type === 'delete') {
      return <DeleteContent setClose={setClose} submitAction={() => mutate(undefined)} isLoading={isPending} className="pb-6" />;
   }

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <TextInput
            className="mb-5"
            floatLabel={false}
            autoFocus={true}
            placeholder={`Хувилбарын нэр`}
            label={`Хувилбарын нэр оруулах`}
            name="name"
            control={control}
            rules={{ required: `Хувилбар оруулна уу` }}
         />

         <Textarea
            // floatLabel={current !== 'sub_category'}
            placeholder={`Хувилбарын тайлбар`}
            label={`Хувилбарын тайлбар оруулах`}
            name="description"
            control={control}
            rules={{ required: false }}
         />

         <div className="flex justify-end w-full pt-10">
            <Button isLoading={isPending} type="submit" disabled={!isDirty}>
               Хадгалах
            </Button>
         </div>
      </form>
   );
};
