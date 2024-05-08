import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Controller, type FieldValues } from 'react-hook-form';
import { Empty } from '@/assets/svg';
import { SelectProps } from '@radix-ui/react-select';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Label from '@/components/ui/Label';
import { cn } from '@/lib/utils';
import { TControllerProps } from '@/lib/sharedTypes';
import { useId } from 'react';

export type TOption = {
   label: string;
   value: string;
};

type TSelectProps = {
   options: TOption[];
   label?: string;
} & SelectProps;

const SelectInput = <TFieldValues extends FieldValues>({ options, control, className = '', name, rules, label, ...props }: TControllerProps<TFieldValues> & TSelectProps) => {
   const id = useId();
   return (
      <div className={cn('w-full', className)}>
         <Controller
            control={control}
            name={name}
            rules={rules ?? { required: false }}
            render={({ fieldState, field }) => {
               return (
                  <>
                     <Label htmlFor={id}>
                        {label} {rules?.required && <span className="text-danger-color">*</span>}
                     </Label>
                     <Select
                        // defaultValue={defaultPageSize.toString()}
                        // onValueChange={(e) => {
                        //    table.setPageSize(Number(e));
                        // }}
                        value={field.value}
                        onValueChange={(event) => field.onChange(event)}
                        {...props}
                     >
                        <SelectTrigger
                           id={id}
                           ref={field.ref}
                           className={cn(
                              'w-full text-sm p-4 py-1 h-10 relative data-[placeholder]:text-muted-text/50 hover:bg-hover-bg ',
                              fieldState.error ? `border-danger-color focus:outline-offset-1 focus:outline-danger-color focus:outline-1` : ``
                           )}
                        >
                           <SelectValue placeholder="Сонго..." className="placeholder:text-muted-text/20" />
                        </SelectTrigger>
                        <SelectContent>
                           {options?.length > 0 ? (
                              options?.map((item, index) => (
                                 <SelectItem key={index} value={item.value}>
                                    {item.label}
                                 </SelectItem>
                              ))
                           ) : (
                              <div className='flex flex-col gap-4 justify-center items-center p-2 py-4'>
                                 <Empty className="dark:opacity-30" />
                                 <div className="text-muted-text opacity-70">Мэдээлэл байхгүй байна</div>
                              </div>
                           )}
                        </SelectContent>
                     </Select>
                     <ErrorMessage error={fieldState?.error} />
                  </>
               );
            }}
         />
      </div>
   );
};

export default SelectInput;
