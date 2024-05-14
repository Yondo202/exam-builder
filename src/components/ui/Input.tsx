import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import Label from '@/components/ui/Label';
import { ValidationRule } from 'react-hook-form';

const InputVariants = cva(
   `flex w-full rounded-md border py-1.5 bg-card-bg hover:bg-hover-bg focus:hover:bg-card-bg text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-text/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted-bg`,
   {
      variants: {
         variant: {
            default: 'border-border ring-ring',
            error: 'border-danger-color ring-danger-color focus-visible:ring-danger-color focus:border-danger-color',
         },
         sizes: {
            default: 'h-9 px-3.5',
            sm: 'h-8 px-3 text-xs',
            lg: 'h-11 px-4 text-base',
         },
      },
      defaultVariants: {
         variant: 'default',
         sizes: 'default',
      },
   }
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof InputVariants> {
   asChild?: boolean;
   isLoading?: boolean;
}

// export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, variant = 'default', sizes = 'default', ...props }, ref) => {
   return <input type={type} className={cn(InputVariants({ variant, sizes, className }))} ref={ref} {...props} />;
});
Input.displayName = 'Input';

const FloatingInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
   return <Input placeholder=" " className={cn('peer', className)} ref={ref} {...props} />;
});

FloatingInput.displayName = 'FloatingInput';

const FloatingLabel = React.forwardRef<React.ElementRef<typeof Label>, React.ComponentPropsWithoutRef<typeof Label>>(({ className, ...props }, ref) => {
   return (
      <Label
         className={cn(
            //peer-focus:secondary peer-focus:dark:secondary / sain oilgosongui
            `absolute start-2 top-1.5 z-10 origin-[0] -translate-y-5 scale-75 transform rounded-md bg-card-bg px-2 text-sm text-muted-text/50 duration-300
             peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:bg-transparent 
             peer-focus:-top-[4px] peer-focus:text-primary peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:bg-card-bg peer-focus:px-2.5 peer-focus:py-[3px]`,
            className
         )}
         ref={ref}
         {...props}
      />
   );
});
FloatingLabel.displayName = 'FloatingLabel';

export type TInputPropsAddition = {
   label?: string;
   floatLabel?: boolean;
   beforeAddon?: React.ReactNode;
};

export type FloatingLabelInputProps = InputProps & TInputPropsAddition & { requiredInput?: string | ValidationRule<boolean>; idPrefix?: string };

const FloatingLabelInput = React.forwardRef<React.ElementRef<typeof FloatingInput>, React.PropsWithoutRef<FloatingLabelInputProps>>(
   ({ id, label, floatLabel = true, requiredInput, beforeAddon, ...props }, ref) => {
      const ids = React.useId();

      return (
         <div className="relative">
            {!floatLabel && label && (
               <Label htmlFor={id ?? ids}>
                  {label} {requiredInput ? <span className="text-danger-color">*</span> : ``}
               </Label>
            )}
            <FloatingInput ref={ref} id={id ?? ids} {...props} className={`${props.className} ${beforeAddon ? `pl-9` : ``}`} />

            <div className={cn('absolute left-2 top-1/2 w-4 -translate-y-1/2 text-muted-text peer-focus:text-primary text-lg', props.sizes === 'sm' ? 'text-base' : `text-lg`)}>
               {beforeAddon}
            </div>

            {floatLabel && (
               <FloatingLabel htmlFor={id ?? ids} className={`${props.sizes === 'sm' ? `text-xs` : ``} ${beforeAddon ? `peer-placeholder-shown:pl-8` : ``}`}>
                  {label}
               </FloatingLabel>
            )}
         </div>
      );
   }
);

FloatingLabelInput.displayName = 'FloatingLabelInput';

export { FloatingLabelInput, Input };
