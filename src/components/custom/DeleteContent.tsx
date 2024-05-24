import { cn } from '@/lib/utils';
import { Delete } from '@/assets/svg';
import { Button } from '@/components/custom';
import { GoTrash } from 'react-icons/go';

type TDeleteContent = {
   className?: string;
   isLoading?: boolean;
   setClose?: ({ isDelete }: { isDelete:boolean }) => void;
   submitAction: () => void;
};

// type TRoleAction = {
//     select: TAction<TRolesData>;
//     setClose: () => void;
//     storeid: string;
//  };

const DeleteContent = ({ className, isLoading, setClose, submitAction }: TDeleteContent) => {
   return (
      <div className={cn('flex gap-8 mb-6 px-5', className)}>
         <Delete />
         <div className="flex flex-col justify-between">
            <div className="font-normal text-lg">Мэдээллийг устгахдаа итгэлтэй байна уу?</div>
            <div className="flex items-center justify-end gap-5">
               <Button onClick={()=>setClose?.({ isDelete:true })} variant="outline" type='button'>
                  Болих
               </Button>
               <Button isLoading={isLoading} onClick={submitAction} variant="destructive" type='button'>
                  <GoTrash /> Устгах
               </Button>
            </div>
         </div>
      </div>
   );
};

export default DeleteContent;
