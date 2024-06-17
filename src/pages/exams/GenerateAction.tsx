import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { MdAutoFixHigh } from 'react-icons/md';
import { GrManual } from 'react-icons/gr';
import { useParams } from 'react-router-dom';
import { type TAction } from '@/lib/sharedTypes';
import { useMutation } from '@tanstack/react-query';
import { Button, Dialog, TextInput } from '@/components/custom';
import { request } from '@/lib/core/request';
import { TExam } from '.';
import { queryClient } from '@/main';
import { cn } from '@/lib/utils';

const initialAsset = {
   manual: {
      label: 'Гараар асуулт оруулах',
      // type: 'text',
      description: 'Шалгалт хоосон үүсэх ба гараар асуултууд нэмж оруулна',
      icon: GrManual,
   },
   auto: {
      label: 'Авто-оор асуулт сонгох',
      // type: 'checkbox',
      description: 'Үүсгэсэн асуулт дундаас санамсаргүй байдлаар сонгогдоно',
      icon: MdAutoFixHigh,
   },
} as const;

type TInitialType = keyof typeof initialAsset;

type inititalSelect = {
   question_number: number;
   variant_number: number;
   section_number: number;
};

const GenerateAction = ({ examData, isLoading }: { examData?: TExam; isLoading?:boolean }) => {
   const { typeid } = useParams();
   const [initialAction, setInitialAction] = useState<Omit<TAction<TInitialType>, 'type'>>({ isOpen: false, data: 'manual' });
   const { control, handleSubmit } = useForm<inititalSelect>({ mode: 'onSubmit', defaultValues: { question_number: 10, variant_number: 1, section_number: 1 } });


   const { mutate: generateMutate, isPending: generateLoading } = useMutation({
      mutationFn: (body: inititalSelect) =>
         request({
            method: 'post',
            url: `exam/random/generate`,
            body: {
               exam_id: examData?.id,
               sub_category_id: examData?.sub_category_id,
               ...body,
            },
         }),
      onSuccess: () => {
         queryClient.resetQueries({ queryKey: ['exam', typeid] });
         //  setInitialAction({ isOpen: false });
      },
   });

   useEffect(() => {
      if(isLoading){
         return
      }
      if (examData?.variants?.length ?? 0 > 0) {
         return;
      }

      setInitialAction((prev) => ({ ...prev, isOpen: true }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isLoading]);

   const onSubmit = (data: inititalSelect) => {
      generateMutate(data);
   };

   return (
      <div>
         <Dialog
            className="p-10 grid grid-cols-2 gap-8 pb-14 w-[700px]"
            title="Шалгалтаа хэрхэн үүсгэхээ сонгоно уу"
            isOpen={initialAction.isOpen}
            onOpenChange={() => setInitialAction((prev) => ({ ...prev, isOpen: false }))}
         >
            {Object.keys(initialAsset)?.map((item, index) => {
               const Icon = initialAsset[item as TInitialType]?.icon;
               return (
                  <div key={index}>
                     <div
                        // to={`${breadcrumbs.find((item) => item.isActive)?.to}/create?type=${item}`}
                        onClick={() => (item === 'manual' ? setInitialAction({ isOpen: false }) : setInitialAction({ isOpen: true, data: item as TInitialType }))}
                        className={cn(
                           'group mb-5 p-4 hover:bg-primary/10 rounded-md cursor-pointer grid grid-cols-[auto_1fr] gap-4 border border-primary/20',
                           item === 'manual' && initialAction.data === 'auto' ? `opacity-50` : ``
                        )}
                     >
                        <Icon className="text-xl text-secondary mt-1" />

                        <div className="flex flex-col gap-3">
                           <span className="font-medium text-base">{initialAsset[item as TInitialType]?.label}</span>
                           <span className="text-muted-text text-xs2">{initialAsset[item as TInitialType]?.description}</span>
                        </div>
                     </div>

                     {item === 'auto' && initialAction.data === 'auto' && (
                        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
                           {/* <Label className="mb-0">Авто оруулах тохиргоо</Label> */}
                           <TextInput
                              name="question_number"
                              rules={{ required: true, min: { value: 0, message: '0 - ээс бага байх боломжгүй' } }}
                              control={control}
                              type="number"
                              label="Асуултын тоо"
                           />
                           <TextInput
                              name="variant_number"
                              rules={{ required: true, min: { value: 0, message: '0 - ээс бага байх боломжгүй' } }}
                              control={control}
                              type="number"
                              label="Вариантын тоо"
                           />
                           <TextInput
                              name="section_number"
                              rules={{ required: true, min: { value: 0, message: '0 - ээс бага байх боломжгүй' } }}
                              control={control}
                              type="number"
                              label="Дэд хэсэгийн тоо"
                           />
                           <Button isLoading={generateLoading} className="rounded-full">
                              Авто үүсгэх
                           </Button>
                        </form>
                     )}
                  </div>
               );
            })}
         </Dialog>
      </div>
   );
};

export default GenerateAction;
