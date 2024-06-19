import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
   return (
      <textarea
         className={cn(
            // "flex min-h-[60px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
            `flex min-h-[80px] w-full rounded-md border transition-all border-border py-1.5 px-3.5 bg-card-bg hover:bg-hover-bg focus:hover:bg-card-bg text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-text/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-50`,
            className
         )}
         ref={ref}
         {...props}
      />
   );
});
Textarea.displayName = 'Textarea';

export { Textarea };