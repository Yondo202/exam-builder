import { Controller, type FieldValues } from 'react-hook-form';
// import { FloatingLabelInput, FloatingLabelInputProps } from '@/components/ui/Input';
import { Label } from '.';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { TControllerProps } from '@/lib/sharedTypes';
import { Textarea, TextareaProps } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const ControlTextArea = <TFieldValues extends FieldValues>({
   control,
   parentClassName = '',
   name,
   rules,
   idPrefix,
   isDynamicHeight,
   ...props
}: TControllerProps<TFieldValues> & { label?: string; parentClassName?: string; idPrefix?: string; isDynamicHeight?: boolean } & TextareaProps) => {
   return (
      <div className={parentClassName}>
         <Controller
            control={control}
            name={name}
            rules={rules ?? { required: false }}
            render={({ field, fieldState }) => {
               return (
                  <>
                     {!!props.label && (
                        <Label htmlFor={`${idPrefix ?? ''}${field.name}`}>
                           {props.label} {rules?.required && <span className="text-danger-color">*</span>}
                        </Label>
                     )}
                     <Textarea
                        id={`${idPrefix ?? ''}${field.name}`}
                        {...field}
                        {...props}
                        className={cn(
                           fieldState?.error ? `border-danger-color focus:border-danger-color focus-visible:ring-danger-color` : ``,
                           isDynamicHeight ? (field?.value?.length > 25 ? `min-h-[100px]` : `h-9  min-h-9`) : ``,
                           props.className
                        )}
                        // className={`${props.className} ${fieldState?.error ? `border-danger-color focus:border-danger-color focus-visible:ring-danger-color` : ``}`}
                     />
                     <ErrorMessage error={fieldState?.error} />
                  </>
               );
            }}
         />
      </div>
   );
};

export default ControlTextArea;
