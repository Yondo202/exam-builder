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
};

const AnimatedTabs = ({ items, activeKey, onChange, className }: TTabs) => {
   const [activeBorder, setActiveBorder] = useState({ width: 0, offsetLeft: 0 });

   const itemprops = { activeKey, onChange };
   //    className={className}
   return (
      <div className={cn('relative flex gap-5 mb-4 border-b', className)}>
         {items.map((item, index) => {
            return <Tabitems key={index} item={item} setActiveBorder={setActiveBorder} {...itemprops} />;
         })}
         <div
            style={{ width: `${activeBorder.width}px`, left: `${activeBorder.offsetLeft}px` }}
            className={cn('absolute bottom-0 h-[2px] rounded-t-sm bg-secondary transition-all duration-200')}
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
};

const Tabitems = ({ item, activeKey, onChange, setActiveBorder }: TTabitems) => {
   const elementRef = useRef<HTMLInputElement>(null);

   useEffect(() => {
      if (activeKey === item.key) {
         const current = elementRef?.current;
         setActiveBorder({ width: 0, offsetLeft: current?.offsetLeft ?? 0 });
         setTimeout(() => {
            setActiveBorder({ width: current?.offsetWidth ?? 0, offsetLeft: current?.offsetLeft ?? 0 });
         }, 120);
      }
   }, [activeKey, item.key, setActiveBorder]);

   return (
      <button
         disabled={item.disabled}
         onClick={() => onChange(item.key)}
         //  className={`tab_item ${item.disabled ? `disabled` : ``} ${activeKey === item.key ? `active_tab` : ``}`}
         className={cn(
            'leading-[48px] text-muted-text font-medium select-none flex justify-center rounded-sm',
            activeKey === item.key ? 'text-secondary' : '',
            item?.disabled ? `disabled:opacity-50` : ``
         )}
      >
         <div ref={elementRef} className="px-2 hover:bg-hover-bg/50 rounded-t-sm">
            {item?.labelRender ?? item.label}
         </div>
      </button>
   );
};
