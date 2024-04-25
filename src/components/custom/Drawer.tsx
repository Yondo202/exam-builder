import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerPortal, DrawerOverlay, DrawerDescription } from '@/components/ui/drawer'; // DrawerClose, DrawerDescription
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
// import { Button } from '.';

type TDrawerCustom = {
   title: string;
   description?: string;
   children: ReactNode;
   content: ReactNode;
   className?: string;
};

const DrawerComponent = ({ title, children, content, description, className }: TDrawerCustom) => {
   return (
      <Drawer>
         {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}
         <DrawerPortal>
            <DrawerOverlay />
            <DrawerContent>
               <div className={cn('mx-auto w-full max-w-md', className)}>
                  <DrawerHeader className="pt-8 pb-6">
                     <DrawerTitle>{title}</DrawerTitle>
                     {description && <DrawerDescription>{description}</DrawerDescription>}
                  </DrawerHeader>
                  <DrawerFooter className="py-6 pb-14">{content}</DrawerFooter>
               </div>
            </DrawerContent>
         </DrawerPortal>
      </Drawer>
   );
};

export default DrawerComponent;
//  data-vaul-no-drag
