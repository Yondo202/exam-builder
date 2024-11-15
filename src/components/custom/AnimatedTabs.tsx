import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

type TItems = {
   key: string;
   disabled?: boolean;
   labelRender?: React.ReactNode;
   label?: string;
};

type TTabs = {
   items: TItems[];
   activeKey: string;
   onChange: (key: TTabs['activeKey']) => void;
   className?: string;
   tabClassName?: string;
};

const AnimatedTabs = ({ items, activeKey, onChange, className, tabClassName }: TTabs) => {
   const [activeBorder, setActiveBorder] = useState({ width: 0, offsetLeft: 0 });

   const itemprops = { activeKey, onChange, tabClassName };
   //    className={className}
   return (
      <div className={cn('relative flex gap-5 mb-4 border-b', className)}>
         {items.map((item, index) => {
            return <Tabitems key={index} item={item} setActiveBorder={setActiveBorder} {...itemprops} />;
         })}
         <div
            style={{ width: `${activeBorder.width}px`, left: `${activeBorder.offsetLeft}px` }}
            className={cn('absolute bottom-0 border-b-[2px] border-primary h-full rounded-t-md bg-secondary/[0.02] transition-all duration-200')}
         />
      </div>
   );
};

export default AnimatedTabs;

type TTabitems = {
   setActiveBorder: React.Dispatch<React.SetStateAction<{ width: number; offsetLeft: number }>>;
   item: TItems;
   activeKey: TTabs['activeKey'];
   onChange: TTabs['onChange'];
   tabClassName?: string;
};

const Tabitems = ({ item, activeKey, onChange, setActiveBorder, tabClassName }: TTabitems) => {
   const elementRef = useRef<HTMLInputElement>(null);

   useEffect(() => {
      if (activeKey === item.key) {
         const current = elementRef?.current;
         setActiveBorder({ width: current?.offsetWidth ?? 0, offsetLeft: current?.offsetLeft ?? 0 });

         // setActiveBorder({ width: 0, offsetLeft: current?.offsetLeft ?? 0 });
         // setTimeout(() => {
         //    setActiveBorder({ width: current?.offsetWidth ?? 0, offsetLeft: current?.offsetLeft ?? 0 });
         // }, 120);
      }
   }, [activeKey, item.key, setActiveBorder]);

   return (
      <button
         disabled={item.disabled}
         onClick={() => onChange(item.key)}
         type="button"
         className={cn(
            'leading-[48px] text-muted-text/90 flex justify-center rounded-sm',
            tabClassName,
            activeKey === item.key ? 'text-secondary font-medium' : '',
            item?.disabled ? `disabled:opacity-50 disabled:cursor-not-allowed` : ``
         )}
      >
         <div ref={elementRef} className="px-3 hover:bg-hover-bg/50 rounded-t-sm">
            {item?.labelRender ?? item.label}
         </div>
      </button>
   );
};
