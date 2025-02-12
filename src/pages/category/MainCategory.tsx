// import { useMatches, matchRoutes, matchPath } from "react-router-dom"
import { useQuery } from '@tanstack/react-query';
import { request } from '@/lib/core/request';
import { useEffect, useState } from 'react';
import { BreadCrumb, Drawer, Button, Header } from '@/components/custom';
import { type FinalRespnse, type TAction } from '@/lib/sharedTypes';
import { TBreadCrumb } from '@/components/custom/BreadCrumb';
import { MdOutlineAdd } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import { BiUser } from 'react-icons/bi';
import { MdDateRange } from 'react-icons/md';
import { TiFlowMerge } from 'react-icons/ti';
import GroupAction, { type TCategory, catAsset, type TKeys } from './Action';
import { cn } from '@/lib/utils';
import { Empty } from '@/assets/svg';

// eslint-disable-next-line react-refresh/only-export-components
export const useGetCategories = ({ current, idKey, disabled }: { current: TKeys; idKey?: string; disabled?: boolean }) => {
   return useQuery({
      enabled: !disabled,
      queryKey: [`category/${current}`, `${current}${idKey ?? ''}`],
      queryFn: () =>
         request<FinalRespnse<TCategory[]>>({
            method: 'post',
            url: catAsset[current]?.url,
            offAlert: true,
            filterBody: {
               category_id: idKey,
            },
         }),
   });
};

const Groups = ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => {
   const [search, setSearch] = useSearchParams({});
   const searchAsObject = Object.fromEntries(new URLSearchParams(search));
   // const [mainCat, setMainCat] = useState<TOption[]>([]);
   const [action, setAction] = useState<TAction<TCategory>>({ isOpen: false, type: 'add', data: {} as TCategory });
   const [current, setCurrent] = useState<TKeys>('main_category');
   // const [selectedMainCategory, setSelectedMainCategory] = useState<TCategory>();

   const { data } = useQuery({
      queryKey: [`category/main_category`, 'main_category'],
      queryFn: () =>
         request<FinalRespnse<TCategory[]>>({
            method: 'post',
            url: 'cats/list/category',
            offAlert: true,
         }),
   });

   useEffect(() => {
      if (searchAsObject?.catid) {
         setCurrent('sub_category');
         return;
      }
      setCurrent('main_category');
   }, [searchAsObject?.catid]);

   const setClose = () => {
      setAction((prev) => ({ ...prev, isOpen: false }));
   };

   const rowAction = (data: TAction<TCategory>) => {
      setAction(data);
   };

   const subCategories = data?.data?.find((item) => item.id === searchAsObject?.catid)?.sub_categories;

   return (
      <div>
         {/* <BreadCrumb pathList={breadcrumbs} /> */}

         {current === 'sub_category' ? (
            <BreadCrumb
               pathList={[
                  { label: data?.data?.find((item) => item.id === searchAsObject?.catid)?.name, to: '/category' },
                  { label: 'Дэд ангилалууд', to: '#', isActive: true },
               ]}
            />
         ) : (
            <BreadCrumb pathList={breadcrumbs} />
         )}

         <div className={cn('flex flex-col transition-all', current === 'sub_category' ? `flex-col-reverse` : ``)}>
            <Header
               className={cn('', current === 'sub_category' ? `` : `mb-10`)}
               title={catAsset[current]?.label}
               action={
                  <Drawer
                     open={action.isOpen}
                     onOpenChange={(event) => setAction((prev) => ({ ...prev, isOpen: event }))}
                     title={action.type === 'delete' ? '' : `${catAsset[current]?.label} ${action.type === 'add' ? `нэмэх` : `засах`}`}
                     content={
                        <GroupAction {...{ cat_id: searchAsObject?.catid, current, setClose, action, options: data?.data.map((item) => ({ label: item.name, value: item.id })) ?? [] }} />
                     }
                     className={`py-10 max-w-lg`}
                  >
                     <Button className="rounded-full" size="sm" onClick={() => setAction((prev) => ({ ...prev, isOpen: true, type: 'add' }))}>
                        <MdOutlineAdd className="text-base" /> {catAsset[current]?.label} нэмэх
                     </Button>
                  </Drawer>
               }
            />

            <div className={cn('grid grid-cols-3 gap-6 transition-all', searchAsObject?.catid ? `grid-cols-1 mt-5 mb-5` : `mb-10`)}>
               {data?.data.map((item, index) => {
                  let isSelected = false;
                  if (searchAsObject?.catid) {
                     isSelected = searchAsObject?.catid !== item.id;
                  }
                  if (!isSelected) {
                     return (
                        <CardItem
                           className={searchAsObject?.catid ? `flex flex-row justify-between items-center` : ``}
                           childClassName={searchAsObject?.catid ? `border-none mb-0 p-0` : ``}
                           onClick={(el) => {
                              if (el === 'sub') {
                                 setSearch({ catid: item.id });
                                 setCurrent('sub_category');
                                 return;
                              }

                              rowAction({ data: item, type: 'edit', isOpen: true });
                           }}
                           key={index}
                           item={item}
                           isMain={!searchAsObject?.catid}
                        />
                     );
                  }
               })}
            </div>
         </div>

         {current === 'sub_category' && (
            <>
               {subCategories && subCategories?.length > 0 ? (
                  <div className="grid grid-cols-3 gap-6">
                     {subCategories?.map((item, index) => {
                        return <CardItem onClick={() => rowAction({ data: item, type: 'edit', isOpen: true })} key={index} item={item} />;
                     })}
                  </div>
               ) : (
                  <div className="flex h-48 w-full flex-col items-center justify-center gap-5">
                     <Empty className="dark:opacity-30" />
                     <div className="text-muted-text opacity-70">Мэдээлэл байхгүй байна</div>
                  </div>
               )}
            </>
         )}
      </div>
   );
};

export default Groups;

import { BsPencil } from 'react-icons/bs';

const CardItem = ({
   item,
   onClick,
   className,
   childClassName,
   isMain,
}: {
   item: TCategory;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   onClick: (item?: string | any) => void;
   className?: string;
   childClassName?: string;
   isMain?: boolean;
}) => {
   return (
      <div
         onClick={() => (isMain ? null : onClick())}
         className={cn('wrapper group flex flex-col gap-y-4 p-4 px-5 rounded-md relative cursor-pointer transition-shadow hover:shadow-md hover:border-primary', className ?? '')}
      >
         <div className="font-medium text-[15px] truncate">{item.name}</div>

         <div className={cn('px-5 -mx-5 text-muted-text flex justify-between gap-2 border-b pb-2', childClassName ?? '')}>
            <div className="flex items-center gap-1.5">
               <TiFlowMerge className="text-muted-text" /> <div>Нийт дэд бүлэг</div>
            </div>
            <div className="flex items-center gap-1.5">
               <div className="font-medium">{item.sub_categories?.length}</div>
            </div>
         </div>

         <div className="text-muted-text flex justify-between gap-6">
            <div className="flex items-center gap-1.5">
               <MdDateRange /> {item.created_at?.slice(0, 10).replace('T', ' ')}
            </div>
            <div className="flex items-center gap-1.5">
               <BiUser /> {item.created_employee?.firstname}
            </div>
         </div>
         {isMain && (
            <div className="absolute top-0 left-0 w-full h-full transition-all rounded-lg duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center backdrop-blur-sm gap-2">
               <Button onClick={() => onClick('sub')} type="button" size="sm" className="rounded-full">
                  Дэд ангилал
               </Button>
               <Button onClick={() => onClick()} variant="outline" type="button" size="sm" className="rounded-full">
                  <BsPencil /> Засах
               </Button>
            </div>
         )}
      </div>
   );
};
