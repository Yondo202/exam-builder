import { NavLink, useLocation, useParams } from 'react-router-dom';
import { TavanbogdLogo } from '@/assets/svg';
import { Button, Tooltip } from '@/components/custom';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import RouteStore, { type TRouteOmit } from '@/lib/core/RouteStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CiLogout } from 'react-icons/ci';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { IoIosArrowForward } from 'react-icons/io';

const subHeight = 450;

const LeftMenu = () => {
   const [isHide, setIsHide] = useState(false);

   useEffect(() => {
      const menuStatus = localStorage.getItem('menu');
      setIsHide(menuStatus === 'isHide');
   }, []);

   const setHide = (condition: boolean) => {
      localStorage.setItem('menu', condition ? 'isHide' : 'isShow');
      setIsHide(condition);
   };

   return (
      <div
         className={cn(
            'relative h-lvh duration-300 transition-all flex flex-col justify-between border-r border-border text-sm text-muted-text bg-card-bg',
            isHide ? `w-[58px]` : `w-[240px]`
         )}
      >
         <ActionButton isHide={isHide} setHide={setHide} />
         <div>
            <div className="p-3 py-5">
               <TavanbogdLogo className="w-18 max-w-full" />
            </div>
            <div className="flex flex-col gap-0 pt-6">
               {RouteStore.map((Element, index) => {
                  return <NavLinkComponent key={index} isHide={isHide} Element={Element} />;
               })}
            </div>
         </div>

         <div className={cn('p-4 gap-4 grid  items-center border-t', isHide ? `grid-rows-auto` : `grid-cols-[1fr_auto]`)}>
            <div className="grid gap-3 grid-cols-[auto_1fr] items-center">
               <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>Y</AvatarFallback>
               </Avatar>
               {!isHide && <div className="one_line animate-scale duration-300">yondooo33@gmail.com</div>}
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

const NavLinkComponent = ({ isHide, Element }: { isHide: boolean; Element: TRouteOmit }) => {
   const navRef = useRef(null);
   const { typeid } = useParams();
   const { pathname } = useLocation();
   const [isActive, setIsActive] = useState(false);
   const withChild = !!Element.subMenu;

   useEffect(() => {
      // @ts-expect-error: Unreachable code error
      if (navRef?.current?.className?.includes?.('active')) {
         setIsActive(true);
         return;
      }
      setIsActive(false);
   }, [pathname, withChild]);

   return (
      <Tooltip content={Element.label} isDisable={!isHide}>
         <NavLink
            className={({ isActive }) =>
               `group relative grid grid-cols-[1fr_auto] items-center p-3 py-2 mb-3 text-xs2 border-l-2 hover:bg-primary/5 ${isHide ? `justify-center` : ``} ${
                  isActive ? `active border-l-primary bg-primary/10 ${Element.subMenu ? `mb-0` : ``}` : ' border-transparent'
               }`
            }
            to={Element.to}
            ref={navRef}
            end={false}
         >
            <div className="flex items-center gap-3">
               {Element.icon}
               {!isHide && <span className="animate-scale duration-300 z-10 group-[.active]:relative group-[.active]:font-medium group-[.active]:text-primary">{Element.label}</span>}
            </div>

            {!isHide && Element.subMenu ? <IoIosArrowForward className="w-4 h-4 transition-all group-[.active]:rotate-90" /> : null}
         </NavLink>
         {!isHide && Element.subMenu && (
            // subMenuHeight={El.subMenu?.filter((item) => item.name !== '#')?.length * subHeight}
            <div className={`bg-primary/10 overflow-hidden h-[${isActive ? Element.subMenu?.length * subHeight + 16 : 0}px] p-3 py-5 flex flex-col`}>
               {Element.subMenu?.map((item, index) => {
                  return (
                     <NavLink
                        key={index}
                        className={({ isActive }) => `w-full rounded-sm hover:bg-primary/10 ${isActive ? `text-text` : 'text-muted-text'}`}
                        to={`${Element.to}${item.to ? `/${item.to}` : ``}`}
                        end={item.to === '' ? (typeid ? false : true) : false}
                     >
                        <div className={`h-[${subHeight}px]`}>{item.label}</div>
                     </NavLink>
                  );
               })}
            </div>
         )}
      </Tooltip>
   );
};

const ActionButton = ({ isHide, setHide }: { isHide: boolean; setHide: (condition: boolean) => void }) => {
   return (
      <div className="absolute top-2/4 -right-6">
         <div className="group cursor-pointer flex h-6 w-6 flex-col items-center" onClick={() => setHide(!isHide)}>
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
