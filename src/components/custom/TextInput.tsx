import { Controller, type FieldValues } from 'react-hook-form';
import { FloatingLabelInput, FloatingLabelInputProps } from '@/components/ui/Input';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { TControllerProps } from '@/lib/sharedTypes';

const ControlInput = <TFieldValues extends FieldValues>({ control, floatLabel, className = '', name, rules, label, ...props }: TControllerProps<TFieldValues> & FloatingLabelInputProps) => {
   return (
      <div className={className}>
         <Controller
            control={control}
            name={name}
            rules={rules ?? { required: false }}
            render={({ field, fieldState }) => {
               const inputProps = {
                  ...field,
                  label: label,
                  id: field.name,
                  type: 'text',
                  ...props,
                  floatLabel,
                  requiredInput: rules?.required,
               };
               return (
                  <>
                     <FloatingLabelInput {...inputProps} placeholder={floatLabel === false ? props.placeholder : ``} variant={fieldState?.error ? `error` : 'default'} />
                     <ErrorMessage error={fieldState?.error} />
                  </>
               );
            }}
         />
      </div>
   );
};

export default ControlInput;
