import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerPortal, DrawerOverlay, DrawerDescription } from '@/components/ui/drawer'; // DrawerClose, DrawerDescription
import { ReactNode } from 'react';
// import { Button } from '.';

type TDrawerCustom = {
   title: string;
   description?: string;
   children: ReactNode;
   content: ReactNode;
};

const DrawerComponent = ({ title, children, content, description }: TDrawerCustom) => {
   return (
      <Drawer >
         {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}
         <DrawerPortal>
            <DrawerOverlay />
            <DrawerContent> 
               <div className="mx-auto w-full max-w-md">
                  <DrawerHeader className="pt-8">
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