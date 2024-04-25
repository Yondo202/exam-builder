import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { IoHomeOutline } from 'react-icons/io5';
import { LiaSlashSolid } from 'react-icons/lia';

export type TBreadCrumb = {
   label: string; // daraa enum aas av
   isActive?: boolean; // daraa enum aas av
   to: string;
};

type TBreadCrumbProps = {
   pathList: TBreadCrumb[];
};

const BreadCrumb = ({ pathList }: TBreadCrumbProps) => {
   const location = useLocation();
   if (pathList.length === 0) {
      return null;
   }

   return (
      <Breadcrumb className="py-4">
         <BreadcrumbList>
            <BreadcrumbItem>
               <Link to="/">
                  <IoHomeOutline />
               </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
               <LiaSlashSolid className="-rotate-[32deg]" />
            </BreadcrumbSeparator>
            {pathList.map((item, index) => {
               return (
                  <React.Fragment key={index}>
                     <BreadcrumbItem>
                        <Link to={item.to === '#' ? location.pathname + location.search : item.to} className={`text-xs text-muted-text ${item?.isActive ? `text-text font-normal` : ``}`}>
                           {item.label}
                        </Link>
                     </BreadcrumbItem>
                     {index !== pathList.length - 1 && (
                        <BreadcrumbSeparator>
                           <LiaSlashSolid className="-rotate-[32deg]" />
                        </BreadcrumbSeparator>
                     )}
                  </React.Fragment>
               );
            })}
         </BreadcrumbList>
      </Breadcrumb>
   );
};

export default BreadCrumb;
