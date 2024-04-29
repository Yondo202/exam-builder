import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Controller, type FieldValues } from 'react-hook-form';
import { SelectProps } from '@radix-ui/react-select';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Label from '@/components/ui/Label';
import { Input } from '../ui/Input';
import { cn } from '@/lib/utils';
import { TControllerProps } from '@/lib/sharedTypes';
import { useId } from 'react';

type TOption = {
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
                     <Label htmlFor={id}>{label}</Label>
                     <Select
                        // defaultValue={defaultPageSize.toString()}
                        // onValueChange={(e) => {
                        //    table.setPageSize(Number(e));
                        // }}
                        value={field.value}
                        onValueChange={(event) => field.onChange(event)}
                        {...props}
                     >
                        <SelectTrigger id={id} className={cn('w-full text-xs p-4 py-1 h-10 relative data-[placeholder]:text-muted-text/50', fieldState.error ? `border-danger-color` : ``)}>
                           {/* <input
                              ref={field.ref}
                              className={cn(
                                 'absolute top-0 left-0 w-full h-full border-none outline-offset-2 opacity-0 rounded-md bg-transparent focus:outline-danger-color',
                                 fieldState.error ? `opacity-1 text-transparent` : ``
                              )}
                           /> */}

                           <Input
                              ref={field.ref}
                              onChange={(e) => e}
                              variant="error"
                              className={cn(
                                 'absolute -z-10 top-0 left-0 w-full h-full border-none outline-offset-2 opacity-0 rounded-md bg-transparent hover:bg-transparent focus:hover:bg-transparent',
                                 fieldState.error ? `opacity-1 text-transparent focus-visible:ring-2 ring-danger-color` : ``
                              )}
                           />
                           <SelectValue placeholder="Сонго..." className="placeholder:text-muted-text/20" />
                        </SelectTrigger>
                        <SelectContent>
                           {options?.map((item, index) => (
                              <SelectItem key={index} value={item.value}>
                                 {item.label}
                              </SelectItem>
                           ))}
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
