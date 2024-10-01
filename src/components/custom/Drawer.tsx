import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerPortal, DrawerOverlay, DrawerDescription } from '@/components/ui/drawer'; // DrawerClose, DrawerDescription
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
// import { Button } from '.';

type TDrawerCustom = {
   title: string;
   description?: string;
   children?: ReactNode;
   content: ReactNode;
   className?: string;
   titleClassName?: string;
   contentClassName?: string;

   open?: boolean;
   onOpenChange?: (open: boolean) => void;
};

const DrawerComponent = ({ title, children, content, description, className, titleClassName, contentClassName, ...props }: TDrawerCustom) => {
   return (
      <Drawer {...props}>
         {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}
         <DrawerPortal>
            <DrawerOverlay />
            <DrawerContent>
               <div className={cn('mx-auto w-full max-w-md', className)}>
                  <DrawerHeader className={cn('pt-8 pb-6', titleClassName)}>
                     <DrawerTitle>{title}</DrawerTitle>
                     {description && <DrawerDescription>{description}</DrawerDescription>}
                  </DrawerHeader>
                  <DrawerFooter className={cn("py-6 pb-14 max-h-[75dvh] overflow-y-auto", contentClassName)}>{content}</DrawerFooter>
               </div>
            </DrawerContent>
         </DrawerPortal>
      </Drawer>
   );
};

export default DrawerComponent;
//  data-vaul-no-drag
