import { Textarea, Label, CkEditor, AnimatedTabs } from '@/components/custom';
import { Controller } from 'react-hook-form';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { type TInputTypeTab, type TInputType } from '..';
import { cn } from '@/lib/utils';
import { type TQTypesProps, ScoreInput } from '../Action';

const SelectInputTypes: TInputTypeTab[] = [
   { label: 'Богино хариулттай', key: 'text' },
   { label: 'Урт хариулт (форматтай)', key: 'richtext' },
   { label: 'Дүрс зурагтай - асуулт / хариулт', key: 'essay' },
];

export const OpenQuestion = ({ control, watch, idPrefix }: TQTypesProps) => {
   return (
      <div className={cn('wrapper p-7 pt-0 mb-5', idPrefix ? `p-0 mb-4 border-none shadow-none` : ``)}>
         {/* <div className="pb-12 flex justify-between items-end"></div> */}
         <Controller
            control={control}
            name="input_type"
            render={({ field }) => {
               return (
                  <AnimatedTabs
                     className="mb-8 text-xs"
                     items={SelectInputTypes}
                     activeKey={field.value}
                     onChange={(value) => {
                        field.onChange(value as TInputType);
                     }}
                  />
               );
            }}
         />

         <ScoreInput {...{ watch, control, idPrefix, isPossibleZero:true }} className="flex items-center gap-0 mb-8" isLine />

         {watch?.()?.input_type === 'essay' ? (
            <>
               <Controller
                  control={control}
                  name="question"
                  // rules={{ required: 'Асуулт оруулах' }}
                  rules={{ required: false }}
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
            </>
         ) : (
            <Textarea
               className={cn('w-full transition-all', watch?.()?.input_type === 'richtext' ? `min-h-[220px]` : `min-h-[80px]`)}
               name="question"
               control={control}
               label="Асуулт оруулах"
               placeholder="Асуултаа дэлгэрэнгүй оруулах"
               // rules={{ required: 'Асуулт оруулах' }}
               idPrefix={idPrefix}
            />
         )}
      </div>
   );
};
