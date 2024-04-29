import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type TTooltip = {
   children: React.ReactNode;
   content: React.ReactNode;
   isDisable?: boolean;
};

const TooltipComponent = ({ children, content, isDisable = false }: TTooltip) => {
   if (isDisable) return children;
   return (
      <TooltipProvider delayDuration={80}>
         <Tooltip>
            <TooltipTrigger className="appearance-none" >{children ?? <button>!</button>}</TooltipTrigger>
            <TooltipContent className="bg-[#000624] text-[#FFF]" side="right" align="center" sideOffset={10}>{content}</TooltipContent>
         </Tooltip>
      </TooltipProvider>
   );
};

export default TooltipComponent;
