import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
// import BottomGradient from "@/lib/BottomGradient";
import { TbLoader2 } from "react-icons/tb";

import { cn } from '@/lib/utils'

// const hoverShine: string =
//    'before:ease overflow-hidden transition-all before:absolute before:right-0 before:top-0 before:h-14 before:w-10 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:before:-translate-x-96'
export const buttonVariants = cva(
  "inline-flex items-center gap-2 text-text justify-center whitespace-nowrap rounded-md text-sm font-normal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-slate-300",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-[#FFF] hover:bg-primary/80",
        destructive:
          "bg-hover-bg/20 border border-danger-color/30 text-danger-color hover:bg-hover-bg",
        outline:
          "border border-border bg-card-bg text-primary hover:bg-slate-100 hover:bg-hover-bg",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-7 px-3 text-xs",
        lg: "h-10 px-8",
        icon: "h-7 w-7 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)


export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
   asChild?: boolean
   isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, isLoading = false, size, asChild = false, ...props }, ref) => {
   const Comp = asChild ? Slot : 'button'
   return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} disabled={isLoading ? true : props.disabled}>
         {isLoading && <TbLoader2 className="mr-2 h-4 w-4 animate-spin" />}
         {props.children}
         {/* <BottomGradient /> */}
      </Comp>
   )
})
Button.displayName = 'Button'

export default Button

{
   /* <button class="before:ease relative h-12 w-40 overflow-hidden border border-green-500 bg-green-500 text-white shadow-2xl transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-green-500 hover:before:-translate-x-40">
  <span relative="relative z-10">Shine</span>
</button>; */
}

