import { ReactNode } from 'react';

const Header = ({ title, border = false, action }: { title?: string; border?: boolean; action?: ReactNode }) => {
   return (
      <div className={`pt-2 mb-4 flex items-center justify-between ${border ? `border-b` : ``}`}>
         <h3 className={`text-xl pb-4 font-normal ${border ? `border-b border-primary` : ``} `}>{title}</h3>
         {action}
      </div>
   );
};

export default Header;
