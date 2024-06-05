import { LogoSector, UserProfileSector } from './LeftMenu';
import { TUserEmployee } from '@/lib/sharedTypes';
import { GrHistory } from 'react-icons/gr';

const TopMenu = ({ userdata }: { userdata?: TUserEmployee }) => {
   return (
      <div className="h-[56px] bg-card-bg flex justify-center px-3 border-b shadow-md">
         <div className="custom-container flex items-center justify-between">
            <LogoSector className="p-0" />
            <div className="flex">
               <div className="flex items-center gap-2.5 px-5 text-xs text-muted-text border-r cursor-pointer hover:text-secondary">
                  <GrHistory /> <span>Шалгалтын түүх</span>
               </div>
               <UserProfileSector className="border-t-none pr-0" userdata={userdata} />
            </div>
         </div>
      </div>
   );
};

export default TopMenu;
