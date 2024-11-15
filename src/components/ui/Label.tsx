import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'

import { cn } from '@/lib/utils'

const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>>(({ className, ...props }, ref) => (
   <LabelPrimitive.Root
      ref={ref}
      className={cn('mb-2 inline-block text-xs select-text font-normal text-muted-text cursor-pointer leading-2 peer-disabled:cursor-not-allowed', className)}
      {...props}
   />
))
Label.displayName = LabelPrimitive.Root.displayName

export default Label
//  peer-disabled:opacity-70