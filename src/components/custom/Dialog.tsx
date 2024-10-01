import { DialogContent, DialogHeader, DialogTitle, Dialog } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type TDialogProps = {
   children: React.ReactNode;
   title?: string;
   isOpen: boolean;
   onOpenChange: (open: boolean) => void;
   className?: string;
};

const DialogComponent = ({ children, title, isOpen, onOpenChange, className }: TDialogProps) => {
   return (
      <Dialog onOpenChange={onOpenChange} open={isOpen}>
         {/* <DialogTrigger>Open</DialogTrigger> */}
         <DialogContent className='max-sm:w-full'>
            <DialogHeader>
               <DialogTitle>{title}</DialogTitle>
               {/* <DialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</DialogDescription> */}
            </DialogHeader>
            <div className={cn('w-[600px] max-h-[80dvh] max-w-full overflow-y-auto p-6 pb-0 relative max-sm:w-full', className)}>{children}</div>
         </DialogContent>
      </Dialog>
   );
};

export default DialogComponent;
