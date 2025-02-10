import { TextInput, Textarea, Button, Checkbox, Label, AnimatedTabs, Sortable, SortableDragHandle, SortableItem, Skeleton, CkEditor } from '@/components/custom';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useFieldArray, Controller } from 'react-hook-form';
import { IoCloseOutline } from 'react-icons/io5';
import { MdOutlineAdd } from 'react-icons/md';
import { useEffect } from 'react';
import { GoDotFill } from 'react-icons/go';
import { type TInputTypeTab, type TInputType } from '..';
import { cn } from '@/lib/utils';
import { type TQTypesProps, InitialAnswer, ScoreInput } from '../Action';
import { PiDotsSixVerticalBold } from 'react-icons/pi';
import { MarkTotal } from '../components/utils';

const SelectTypes: TInputTypeTab[] = [
   { label: 'Нэг зөв хариулттай', key: 'select' },
   { label: 'Олон зөв хариулттай', key: 'multi_select' }
]

export const WithSelect = ({ control, watch, setValue, clearErrors, idPrefix }: TQTypesProps) => {
   const { fields, append, remove, move } = useFieldArray({ control, keyName: '_id', name: 'answers', rules: { required: 'Хариултаа оруулна уу' } })

   useEffect(() => {
      if (watch?.('input_type') === 'multi_select') {
         setValue('score', MarkTotal({ answers: watch()?.answers }));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [JSON.stringify(watch?.('answers')), watch?.('input_type')])

   // console.log(, "watch?.('sub_questions')?.reduce((a, b) => a + b.score, 0)")

   return (
      <div className={cn('wrapper p-7 pt-0 mb-4 relative', idPrefix ? `p-0 mb-4 border-none shadow-none` : ``)}>
         <Controller
            control={control}
            name="input_type"
            render={({ field }) => {
               return (
                  <AnimatedTabs
                     className="text-xs mb-8"
                     items={SelectTypes}
                     activeKey={field.value}
                     onChange={(value) => {
                        if (value === 'select') {
                           setValue(
                              'answers',
                              fields.map((item) => ({ ...item, is_correct: false, mark: 0 }))
                           );
                        }

                        setValue('score', 0);
                        field.onChange(value as TInputType);
                     }}
                  />
               );
            }}
         />
         {watch?.('input_type') === 'multi_select' ? (
            <div className="pb-12 grid grid-cols-[1fr_auto] gap-8">
               <Textarea
                  className="w-full min-h-[100px]"
                  name="question"
                  control={control}
                  label="Асуулт оруулах"
                  placeholder="Асуултаа дэлгэрэнгүй оруулах"
                  rules={{ required: 'Асуулт оруулах' }}
                  idPrefix={idPrefix}
               />
               <ScoreInput {...{ watch, control, idPrefix, disabled: watch?.('input_type') === 'multi_select' }} />
            </div>
         ) : (
            <div className='mb-6'>
               <ScoreInput {...{ watch, control, idPrefix, isPossibleZero: true }} className="flex items-center gap-0 mb-5" isLine />
               <Controller
                  control={control}
                  name="question"
                  rules={{ required: 'Асуулт оруулах' }}
                  // label="Асуулт оруулах"
                  // rules={{ required: false }}
                  render={({ field, fieldState }) => {
                     return (
                        <>
                           <Label htmlFor={field.name}>
                              Асуулт оруулах <span className="text-danger-color">*</span>
                           </Label>
                           <CkEditor value={field.value} setValue={(val) => field.onChange(val)} />
                           <ErrorMessage error={fieldState?.error} />
                        </>
                     );
                  }}
               />
            </div>
         )}

         {/* <div className={cn('grid grid-cols-[1fr_1fr] gap-x-10 gap-y-6', watch?.()?.input_type === 'multi_select' && 'grid-cols-[1fr]')}> */}
         <Sortable
            value={fields.map((item) => ({ ...item, id: item._id }))}
            onMove={({ activeIndex, overIndex }) => move(activeIndex, overIndex)}
            overlay={
               <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-sm" />
                  <Skeleton className="h-11 w-full rounded-sm" />
                  <Skeleton className="size-8 shrink-0 rounded-sm" />
                  {/* <Skeleton className="size-8 shrink-0 rounded-sm" /> */}
               </div>
            }
         >
            <div className={cn('grid grid-cols-1 gap-y-6')}>
               <div className='flex justify-between border-b pb-2 text-muted-text text-xs'>Хариултууд: <span><span className='text-primary'>{watch?.('answers')?.filter(item=>item.answer?.length > 0)?.length}</span> / {watch?.('answers')?.length} </span></div>
               {fields?.map((item, index) => {
                  return (
                     <SortableItem key={item._id} value={item._id} asChild>
                        <div key={item._id} className={cn('grid grid-cols-[auto_1fr_auto] items-center gap-3', watch?.()?.input_type === 'multi_select' && `grid-cols-[auto_1fr_auto_auto]`)}>
                           <SortableDragHandle variant="ghost" size="icon" className="size-8 shrink-0">
                              <PiDotsSixVerticalBold className="text-lg text-muted-text" aria-hidden="true" />
                           </SortableDragHandle>
                           <div className="relative">
                              {/* <TextInput
                                 control={control}
                                 name={`answers.${index}.answer`}
                                 rules={{ required: 'Хариултаа оруулна уу' }}
                                 sizes="lg"
                                 beforeAddon={<span className="font-light ml-1 text-base">{index + 1}.</span>}
                                 className="w-full"
                                 label="Хариулт оруулах"
                                 idPrefix={idPrefix}
                              /> */}
                              <Textarea
                                 control={control}
                                 name={`answers.${index}.answer`}
                                 rules={{ required: 'Хариултаа оруулна уу' }}
                                 // sizes="lg"
                                 // beforeAddon={<span className="font-light ml-1 text-base">{index + 1}.</span>}
                                 className="w-full pr-36 h-9 min-h-9"
                                 // label="Хариулт оруулах"
                                 placeholder='Хариулт оруулах'
                                 idPrefix={idPrefix}
                              />

                              <Controller
                                 control={control}
                                 name={`answers.${index}.is_correct` as const}
                                 render={({ field, fieldState }) => {
                                    return (
                                       <div className="flex items-center gap-3 px-4 absolute right-[1px] top-[1px] bottom-[1px] w-36 rounded-md bg-card-bg">
                                          <Checkbox
                                             name={field.name}
                                             id={`${idPrefix ?? ''}${field.name}`}
                                             checked={field.value}
                                             className={fieldState.error ? 'border-danger-color' : ''}
                                             onCheckedChange={(event) => {
                                                if (event) {
                                                   clearErrors?.('answers.0.is_correct');
                                                   clearErrors?.('answers.1.is_correct');
                                                }
                                                const newValue = watch?.()?.answers.map((element, ind) =>
                                                   ind === index
                                                      ? { ...element, mark: event ? element.mark : 0, is_correct: event ? true : false }
                                                      : watch()?.input_type === 'select'
                                                      ? { ...element, is_correct: false }
                                                      : element
                                                );
                                                setValue('answers', newValue ?? []);
                                                field.onChange(event);
                                             }}
                                          />
                                          <Label htmlFor={`${idPrefix ?? ''}${field.name}`} className={cn('m-0', fieldState.error ? `text-danger-color` : ``)}>
                                             Зөв хариулт
                                          </Label>
                                       </div>
                                    );
                                 }}
                              />
                           </div>

                           {watch?.()?.input_type === 'multi_select' ? (
                              <div className="w-48">
                                 {item.is_correct ? (
                                    <TextInput
                                       control={control}
                                       name={`answers.${index}.mark`}
                                       // rules={{ required: 'Хариултанд харгалзах оноо' }}
                                       rules={{ required: 'Хариултын оноо', min: { message: 'Оноо - 0 байх боломжгүй', value: 0.001 } }}
                                       sizes="lg"
                                       autoFocus
                                       beforeAddon={<GoDotFill className="text-xs" />}
                                       className="w-full"
                                       label="Харгалзах оноо"
                                       type="number"
                                       idPrefix={idPrefix}
                                    />
                                 ) : (
                                    <span className="text-muted-text opacity-60">
                                       <span className="text-lg font-medium">0 / </span> оноо
                                    </span>
                                 )}
                              </div>
                           ) : null}

                           <Button disabled={fields.length === 2} onClick={() => remove(index)} size="icon" variant="ghost" className="rounded-full" type="button">
                              <IoCloseOutline className="text-[22px] text-danger-color " />
                           </Button>
                        </div>
                     </SortableItem>
                  );
               })}
            </div>
         </Sortable>

         <div className="py-6 pb-0 flex justify-center">
            <Button onClick={() => append(InitialAnswer)} variant="outline" size="sm" type="button" className="rounded-full ">
               <MdOutlineAdd className="text-base" /> Хариулт нэмэх
            </Button>
         </div>

         {/* {showError && (
            <div className="text-danger-color flex items-center gap-2 absolute right-4 -top-3 bg-card-bg px-4 py-1 rounded-md">
               <div className="relative">
                  <IoWarningOutline className="text-sm" />
                  <IoWarningOutline className="text-sm animate-ping absolute top-0 left-0" />
               </div>
               Зөв хариултаа сонгоно уу!
            </div>
         )} */}
      </div>
   );
};
