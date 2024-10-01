import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type TTooltip = {
   children: React.ReactNode;
   content: React.ReactNode;
   isDisable?: boolean;
   side?: 'right' | 'top' | 'bottom' | 'left' | undefined;
   className?: string;
};

const TooltipComponent = ({ children, content, isDisable = false, side, className = '' }: TTooltip) => {
   if (isDisable) return children;
   return (
      <TooltipProvider delayDuration={80}>
         <Tooltip>
            <TooltipTrigger className={cn('appearance-none', className)}>{children ?? <button>!</button>}</TooltipTrigger>
            <TooltipContent className="bg-[#000624] text-[#FFF] max-w-72 p-4" side={side ?? 'right'} align="center" sideOffset={10}>
               {content}
            </TooltipContent>
         </Tooltip>
      </TooltipProvider>
   );
};

export default TooltipComponent;
