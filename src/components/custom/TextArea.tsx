import { Controller, type FieldValues } from 'react-hook-form';
// import { FloatingLabelInput, FloatingLabelInputProps } from '@/components/ui/Input';
import { Label } from '.';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { TControllerProps } from '@/lib/sharedTypes';
import { Textarea, TextareaProps } from '@/components/ui/textarea';

const ControlTextArea = <TFieldValues extends FieldValues>({ control, className = '', name, rules, ...props }: TControllerProps<TFieldValues> & { label?: string } & TextareaProps) => {
   return (
      <div className={className}>
         <Controller
            control={control}
            name={name}
            rules={rules ?? { required: false }}
            render={({ field, fieldState }) => {
               return (
                  <>
                     <Label htmlFor={field.name}>
                        {props.label} {rules?.required && <span className="text-danger-color">*</span>}
                     </Label>
                     <Textarea id={field.name} {...field} {...props} className={fieldState?.error ? `border-danger-color focus:border-danger-color focus-visible:ring-danger-color` : ``} />
                     <ErrorMessage error={fieldState?.error} />
                  </>
               );
            }}
         />
      </div>
   );
};

export default ControlTextArea;
