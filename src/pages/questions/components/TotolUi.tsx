import { cn } from '@/lib/utils';

type TTotalUipProps = {
   mainCount: number;
   additionalCount: number;
   isLine?: boolean;
};

const TotolUi = (props: TTotalUipProps) => {
   if (props.additionalCount === 0) return;
   return (
      <div className={cn('w-full flex items-center justify-between pt-5 relative overflow-hidden', props.isLine ? `pt-0 pl-12` : ``)}>
         <div className="flex gap-1 p-1 rounded-md text-muted-text text-xs bg-card-bg relative z-10">
            Нэмэлт
            <span className="font-light text-xs2 flex gap-1 leading-none">
               /<div className="font-semibold text-primary"> {props.additionalCount}</div>
            </span>
         </div>
         <div className="flex gap-1 p-1 rounded-md text-muted-text text-xs bg-card-bg relative z-10">
            Нийт
            <span className="font-light text-xs2 flex gap-1 leading-none">
               /<div className="font-semibold text-primary"> {props.mainCount + props.additionalCount}</div>
            </span>
         </div>

         {props.isLine && <div className="absolute bottom-23 right-full h-0.5 w-12 bg-primary/20" />}

         {!props.isLine && <div className="absolute bottom-3.5 left-16 h-full w-0.5 bg-primary/20" />}

         <div className="absolute bottom-23 left-1/2 -translate-x-1/2 h-0.5 w-full bg-primary/20" />
      </div>
   );
};

export default TotolUi;
