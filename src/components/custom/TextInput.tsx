import { Controller, type FieldValues } from 'react-hook-form';
import { TControllerProps } from '@/lib/sharedTypes';
import { FloatingLabelInput, FloatingLabelInputProps } from '@/components/ui/Input';
import ErrorMessage from '@/components/ui/ErrorMessage';

const ControlInput = <TFieldValues extends FieldValues>({
   control,
   floatLabel,
   className = '',
   name,
   rules,
   idPrefix,
   label,
   ...props
}: TControllerProps<TFieldValues> & FloatingLabelInputProps) => {
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
                  id: `${idPrefix ?? ''}${field.name}`,
                  type: 'text',
                  ...props,
                  // onFocus:event.target.select(),
                  floatLabel,
                  requiredInput: rules?.required,
                  onFocus: (event: { target: { select: () => void } }) => {
                     if (props.type === 'number') {
                        event.target.select();
                     }
                  },
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                     const value = props.type === 'number' ? parseFloat(e.target.value) : e.target.value;
                     // if (props.type === 'number' && !isNaN(value)) {
                     //    field?.onChange?.('');
                     // } else {
                     //    field?.onChange?.(value);
                     // }
                     // console.log(!value, '--------->value');
                     if(props.type === 'number'){
                        field?.onChange?.(!value ? 0 : value)
                     }else{
                        field?.onChange?.(value);
                     }
                     
                  },
               };
               return (
                  <>
                     <FloatingLabelInput {...inputProps} ref={field.ref} placeholder={floatLabel === false ? props.placeholder : ``} variant={fieldState?.error ? `error` : 'default'} />
                     <ErrorMessage error={fieldState?.error} />
                  </>
               );
            }}
         />
      </div>
   );
};

export default ControlInput;
