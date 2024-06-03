import { cn } from '@/lib/utils';
import { Button } from './custom';
import { BsPencil } from 'react-icons/bs';
import { GoTrash } from 'react-icons/go';

type TActionProps = {
   deleteTrigger?: () => void;
   editTrigger?: () => void;
   className?: string;
   hideActionButton?: 'delete' | 'edit';
};

// daraa ni QuestionTypes - iin filler deer bas data table deer nemeed og
const ActionButtons = ({ deleteTrigger, editTrigger, className, hideActionButton }: TActionProps) => {
   return (
      <div
         className={cn(
            'flex cursor-default items-center gap-2 absolute z-50 top-1/2 -translate-y-1/2 right-1 transition-all opacity-0 scale-50 duration-200 group-hover/items:opacity-100 group-hover/items:scale-100',
            className
         )}
      >
         {hideActionButton !== 'edit' && (
            <Button onClick={editTrigger} variant="outline" className="rounded-full h-8 w-8 min-w-8 shadow-sm" size="icon" type="button">
               <BsPencil className="text-xs2" />
            </Button>
         )}
         {hideActionButton !== 'delete' && (
            <Button onClick={deleteTrigger} variant="outline" className="rounded-full h-8 w-8 min-w-8 shadow-sm" size="icon" type="button">
               <GoTrash className="text-xs2" />
            </Button>
         )}
      </div>
   );
};

export default ActionButtons;
