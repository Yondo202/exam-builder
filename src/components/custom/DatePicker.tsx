import { DateSvg } from '@/assets/svg';
import { formatISO, parseISO } from 'date-fns';
import { mn } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/button';
import { Controller, type FieldValues } from 'react-hook-form';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '../ui/Input';
import { IoClose } from 'react-icons/io5';
import { TControllerProps } from '@/lib/sharedTypes';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '.';
import ErrorMessage from '@/components/ui/ErrorMessage';

export const DatePicker = <TFieldValues extends FieldValues>({ control, className = '', name, rules, ...props }: TControllerProps<TFieldValues> & { label?: string }) => {
   return (
      <div className={cn('', className)}>
         <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field, fieldState }) => {
               return (
                  <>
                     <Label htmlFor={field.name}>
                        {props.label} {rules?.required ? <span className="text-danger-color">*</span> : ``}
                     </Label>
                     <Popover>
                        <PopoverTrigger asChild>
                           <Button
                              id={field.name}
                              variant="outline"
                              className={cn(
                                 'relative  w-full h-[36px] justify-between text-left font-normal text-text pr-3 cursor-pointer',
                                 !field.value && 'text-muted-text/50',
                                 fieldState.error ? `border-danger-color` : ``
                              )}
                           >
                              <Input
                                 ref={field.ref}
                                 onChange={(e) => e}
                                 variant="error"
                                 className={cn(
                                    'absolute -z-10 top-0 left-0 w-full h-full border-none outline-offset-2 opacity-0 rounded-md bg-transparent hover:bg-transparent focus:hover:bg-transparent',
                                    fieldState.error ? `opacity-1 text-transparent focus-visible:ring-2 ring-danger-color` : ``
                                 )}
                              />

                              {field.value ? field.value?.slice(0, 10) : <span>Сонгох...</span>}
                              {field.value ? (
                                 <IoClose onClick={() => field.onChange('')} className={cn('ml-2 h-[18px] w-[18px] text-secondary cursor-pointer hover:text-primary')} />
                              ) : (
                                 <DateSvg className={cn('ml-2 h-[18px] w-[18px] text-secondary')} />
                              )}
                           </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                           <Calendar
                              locale={mn}
                              mode="single"
                              ISOWeek
                              selected={parseISO(field.value)}
                              onSelect={(event) => {
                                 field.onChange?.(formatISO(new Date(event ?? '')));
                              }}
                              initialFocus
                           />
                        </PopoverContent>
                     </Popover>
                     <ErrorMessage error={fieldState?.error} />
                  </>
               );
            }}
         />
      </div>
   );
};
