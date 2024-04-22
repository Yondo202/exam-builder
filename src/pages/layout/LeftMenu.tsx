import { NavLink } from 'react-router-dom';
import { TavanbogdLogo } from '@/assets/svg';
import { Button, Tooltip } from '@/components/custom';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import RouteStore from '@/lib/core/RouteStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CiLogout } from 'react-icons/ci';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const LeftMenu = () => {
   const [isHide, setIsHide] = useState(false);
   //    const { user } = useAuthState();

   return (
      <div
         className={cn(
            'relative h-lvh duration-200 transition-all flex flex-col justify-between border-r border-border text-sm text-muted-text bg-card-bg',
            isHide ? `w-[58px]` : `w-[240px]`
         )}
      >
         <ActionButton isHide={isHide} setIsHide={setIsHide} />
         <div>
            <div className="p-3 py-5">
               <TavanbogdLogo className="w-18 max-w-full" />
            </div>
            <div className="flex flex-col gap-3 pt-6">
               {RouteStore.map((Element, index) => {
                  return (
                     <Tooltip content={Element.label} key={index} isDisable={!isHide}>
                        <NavLink
                           {...Element}
                           // className="group relative flex items-center gap-3 p-3 py-2 text-xs2 border-l-2 hover:bg-primary/5"
                           className={({ isActive }) =>
                              `group relative flex items-center gap-3 p-3 py-2 text-xs2 border-l-2 hover:bg-primary/5 ${isHide ? `justify-center` : ``} ${
                                 isActive ? 'active border-primary' : ' border-transparent'
                              }`
                           }
                           to={Element.to}
                           end={false}
                        >
                           {Element.icon}
                           {!isHide && <span className="z-10 group-[.active]:relative group-[.active]:font-medium group-[.active]:text-primary">{Element.label}</span>}
                        </NavLink>
                     </Tooltip>
                  );
               })}
            </div>
         </div>

         <div className={cn('p-4 gap-4 grid  items-center border-t', isHide ? `grid-rows-auto` : `grid-cols-[1fr_auto]`)}>
            <div className="grid gap-3 grid-cols-[auto_1fr] items-center">
               <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>Y</AvatarFallback>
               </Avatar>
               {!isHide && <div className="one_line">yondooo33@gmail.com</div>}
            </div>
            <Popover>
               <PopoverTrigger asChild>
                  <Button size="icon" variant="outline" className="rotate-180 rounded-full">
                     <CiLogout />
                  </Button>
               </PopoverTrigger>
               <PopoverContent align="end" side="right" sideOffset={25}>
                  <div className="mb-6 text-base text-muted-text">Та гарахдаа итгэлтэй байна уу?</div>
                  <Button variant="outline" className="w-full">
                     <CiLogout /> Гарах
                  </Button>
               </PopoverContent>
            </Popover>
         </div>
      </div>
   );
};

export default LeftMenu;
{
   /* <div className="-z-1 ease absolute -left-[160px] top-0 h-full w-full rounded-r-full bg-primary/10 opacity-0 transition-all duration-300 group-[.active]:-left-10 group-[.active]:opacity-100" /> */
}

const ActionButton = ({ isHide, setIsHide }: { isHide: boolean; setIsHide: React.Dispatch<React.SetStateAction<boolean>> }) => {
   return (
      <div className="absolute top-2/4 -right-6">
         <div className="group cursor-pointer flex h-6 w-6 flex-col items-center" onClick={() => setIsHide((prev) => !prev)}>
            <div
               className={cn(
                  'h-3 w-1 rounded-t-full bg-hover-bg transition-all group-hover:rounded-full group-hover:translate-y-[2px] group-hover:bg-primary',
                  isHide ? `group-hover:-rotate-[15deg]` : `group-hover:rotate-[15deg]`
               )}
            />
            <div
               className={cn(
                  'h-3 w-1 rounded-b-full bg-hover-bg transition-all group-hover:rounded-full group-hover:-translate-y-[2px] group-hover:bg-primary',
                  isHide ? `group-hover:rotate-[15deg]` : `group-hover:-rotate-[15deg]`
               )}
            />
         </div>
      </div>
   );
};
