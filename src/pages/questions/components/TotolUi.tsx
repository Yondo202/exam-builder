type TTotalUipProps = {
   mainCount: number;
   additionalCount: number;
};

const TotolUi = (props: TTotalUipProps) => {
   if (props.additionalCount === 0) return;
   return (
      <div>
         <div className="w-full flex items-center justify-between pt-4 relative overflow-hidden">
            <div className="flex gap-1 p-1 rounded-md text-muted-text text-xs bg-card-bg relative z-10">
               Үндсэн
               <span className="font-light text-sm flex gap-1 leading-none">
                  /<div className="font-semibold text-primary"> {props.mainCount}</div>
               </span>
            </div>
            <div className="flex gap-1 p-1 rounded-md text-muted-text text-xs bg-card-bg relative z-10">
               Нэмэлт
               <span className="font-light text-sm flex gap-1 leading-none">
                  /<div className="font-semibold text-primary"> {props.additionalCount}</div>
               </span>
            </div>
            <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 h-full w-0.5 bg-primary/20" />
            <div className="absolute bottom-23 left-1/2 -translate-x-1/2 h-0.5 w-full bg-primary/20" />
         </div>
      </div>
   );
};

export default TotolUi;
