import { BreadCrumb, Button, Dialog, Header, TabsContent, AnimatedTabs, DataTable, DeleteContent, Tooltip } from '@/components/custom';
import { TBreadCrumb } from '@/components/custom/BreadCrumb';
// import { Drawer, TextInput, Button, Textarea, TabsList, Tabs, TabsContent } from '@/components/custom'; //
// import { CiSaveUp1 } from 'react-icons/ci';
import { useMutation, useQuery } from '@tanstack/react-query';
import { type TExam, onlyCompanyAdmin } from '.';
import { type FinalRespnse, type TAction, type TUserEmployee } from '@/lib/sharedTypes';
import { useParams } from 'react-router-dom';
import { request } from '@/lib/core/request';
import Config from './actions/Config';
import Variants from './actions/Variants';
import { RowSelectionState } from '@tanstack/react-table';
import Section from './actions/Section';
import { useEffect, useState } from 'react';
import { VscSend } from 'react-icons/vsc';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Employee, { empColumnDef } from '@/pages/users';
import Candidates, { canditateColumnDef } from '@/pages/users/Candidates';
import { RiUserSearchLine, RiUserStarLine } from 'react-icons/ri';
import { cn } from '@/lib/utils';
import GenerateAction from './GenerateAction';

type inviteTypes = 'user' | 'emp' | 'inspector';
type TInviteAsset = { isOpen: boolean; type: inviteTypes; is_inspector?: boolean };

const userType = {
   user: {
      label: 'Ажил горилогч',
      description: 'Өөрийн үүсгэсэн хэрэглэгчид',
      icon: <RiUserSearchLine className="text-base mt-1" />,
      // url: 'cats/list/category',
   },
   emp: {
      label: 'Ажилтан',
      description: 'Байгууллагын ажилтан, Ажиллаж буй хүн',
      icon: <RiUserStarLine className="text-base mt-1" />,
      // url: 'cats/list/sub-category',
   },
} as const;

export type TKeys = keyof typeof userType;

const mainInviteTabs = {
   inspector: {
      label: 'Шалгалт засагчид',
      url: 'exam/invites/inspectors',
   },
   candidate: {
      label: 'Оролцогчид',
      url: 'exam/invites',
   },
} as const;

export type TMainKeys = keyof typeof mainInviteTabs;

export type TInvitedCandidate = {
   created_at: string;
   user: TUserEmployee;
   employee: TUserEmployee;
};

const initialFetch = {
   pagination: {
      page: 1,
      page_size: 1000,
   },
   sort: {
      field: 'created_at',
      order: 'DESC',
   },
};

const ExamAction = ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => {
   const isCompAdmin = onlyCompanyAdmin();
   const [validInvite, setValidInvite] = useState(false);
   const [mainInviteType, setMainInviteType] = useState<TMainKeys>('inspector');
   const [current, setCurrent] = useState<TKeys>('user');
   const [invite, setInvite] = useState<TInviteAsset>({ isOpen: false, type: 'emp', is_inspector: false });
   const { typeid } = useParams();
   const [variantId, setVariantId] = useState('');

   const { data, isFetchedAfterMount, isRefetching, isLoading } = useQuery({
      queryKey: ['exam', typeid],
      queryFn: () =>
         request<FinalRespnse<TExam>>({
            url: `exam/id/${typeid}`,
         }),
   });

   const { data: invitedUsers, refetch } = useQuery({
      queryKey: [`exam_with_users/${mainInviteType}`, [typeid, mainInviteType]],
      queryFn: () =>
         request<FinalRespnse<TInvitedCandidate[]>>({
            method: 'post',
            url: mainInviteTabs[mainInviteType]?.url,
            offAlert: true,
            filterBody: {
               exam_id: typeid ?? '',
               ...initialFetch,
            },
         }),
   });

   useEffect(() => {
      if (data?.data?.variants?.length ?? 0 > 0) {
         setVariantId(data?.data?.variants?.[0]?.id ?? '');
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isFetchedAfterMount, isRefetching]);

   const [deleteAction, setDeleteAction] = useState({ isOpen: false, data: {} as TUserEmployee });

   const { mutate, isPending } = useMutation({
      mutationFn: () =>
         request({
            method: 'delete',
            url: `user/exam/invite${mainInviteType === 'inspector' ? '/inspector' : current !== 'user' ? `/${current}` : ``}`,
            body: { user_id: deleteAction.data.id, exam_id: typeid },
         }),
      onSuccess: () => {
         refetch();
         setDeleteAction({ isOpen: false, data: {} as TUserEmployee });
      },
   });

   const rowAction = (data: TAction<TUserEmployee>) => {
      if (data.type !== 'delete') return;
      setDeleteAction({ isOpen: true, data: data.data as TUserEmployee });
   };

   const isValidInviteUser = data?.data?.variants && data?.data?.variants?.length > 0 && validInvite;
   const invitedTable = { defaultPageSize: 1000, hidePagination: true, rowAction: rowAction }; // hideAction: true,
   const inviteActionProps = { type: invite.type, exam_id: typeid, setClose: () => (setInvite((prev) => ({ ...prev, isOpen: false })), refetch()) };

   console.log(data, "------>data?.data")

   return (
      <>
         {variantId === '' && <GenerateAction examData={data?.data} isLoading={isLoading} />}
         <Dialog isOpen={deleteAction.isOpen} onOpenChange={(e) => setDeleteAction((prev) => ({ ...prev, isOpen: e }))}>
            <DeleteContent isLoading={isPending} submitAction={() => mutate()} setClose={() => setDeleteAction((prev) => ({ ...prev, isOpen: false }))} />
         </Dialog>

         <BreadCrumb pathList={[...breadcrumbs.map((item) => ({ ...item, to: isCompAdmin ? '/' : item.to, isActive: false })), { to: '#', label: data?.data?.name ?? '', isActive: true }]} />

         <Header
            title="Шалгалтын материал"
            action={
               <div className="flex gap-4">
                  <Button onClick={() => setInvite({ isOpen: true, type: 'inspector', is_inspector: true })} className="rounded-full" variant="outline" disabled={!isValidInviteUser}>
                     Шалгагч урих
                  </Button>
                  <Popover>
                     <PopoverTrigger asChild>
                        <Button className="rounded-full" variant="outline" disabled={!isValidInviteUser}>
                           Оролцогч урих
                        </Button>
                     </PopoverTrigger>

                     <PopoverContent className="p-6 w-78 flex flex-col gap-4" align="end" sideOffset={8}>
                        {Object.keys(userType)?.map((Item, index) => {
                           return (
                              <div
                                 key={index}
                                 onClick={() => setInvite({ isOpen: true, type: Item as TKeys })}
                                 className="group p-4 hover:bg-primary/5 rounded-md cursor-pointer grid grid-cols-[auto_1fr] gap-4 border border-primary/20"
                              >
                                 {userType[Item as TKeys]?.icon}
                                 <div className="flex flex-col gap-1">
                                    <span className="font-medium">{userType[Item as TKeys]?.label}</span>
                                    <span className="text-muted-text text-xs">{userType[Item as TKeys]?.description}</span>
                                 </div>
                              </div>
                           );
                        })}
                     </PopoverContent>
                  </Popover>
               </div>
            }
         />

         <Config data={data} isCompAdmin={isCompAdmin} />

         {!isCompAdmin && (
            <Variants variantId={variantId} setVariantId={setVariantId} exam_id={data?.data?.id} variants={data?.data?.variants ?? []}>
               {data?.data?.variants?.map((item, index) => {
                  return (
                     <TabsContent key={index} value={item.id}>
                        <Section variant_id={variantId} setValidInvite={setValidInvite} parentData={data?.data} />
                     </TabsContent>
                  );
               })}
            </Variants>
         )}

         {!isLoading && (
            <div className={cn('mt-5 relative')}>
               {!isValidInviteUser && (
                  <Tooltip content="Та эхлээд асуултаа оруулна уу">
                     <div className="absolute top-0 left-0 w-full h-full bg-white/70 rounded-md z-50" />
                  </Tooltip>
               )}
               <AnimatedTabs
                  items={Object.keys(mainInviteTabs)?.map((item) => ({ label: mainInviteTabs[item as TMainKeys]?.label, key: item }))}
                  activeKey={mainInviteType}
                  onChange={(value) => setMainInviteType(value as TMainKeys)}
               />
               {mainInviteType === 'candidate' && (
                  <AnimatedTabs
                     className="text-xs"
                     items={Object.keys(userType)?.map((item) => ({
                        key: item,
                        labelRender: (
                           <div className="flex items-center gap-2">
                              {userType[item as TKeys]?.icon} {userType[item as TKeys]?.label}
                           </div>
                        ),
                     }))}
                     activeKey={current}
                     onChange={(value) => setCurrent(value as TKeys)}
                  />
               )}
               {current === 'user' && mainInviteType === 'candidate' ? (
                  <DataTable
                     {...invitedTable}
                     hideActionButton="edit"
                     data={invitedUsers?.data?.filter((item) => !!item.user)?.map((item) => ({ invited_date: item.created_at, ...item.user })) ?? []}
                     columns={canditateColumnDef}
                  />
               ) : (
                  <DataTable
                     {...invitedTable}
                     hideActionButton="edit"
                     data={invitedUsers?.data?.filter((item) => !!item.employee)?.map((item) => ({ invited_date: item.created_at, ...item.employee })) ?? []}
                     columns={empColumnDef}
                  />
               )}
            </div>
         )}

         <Dialog title="Шалгалтанд урих" className={`p-6 pt-0 w-[80dvw]`} isOpen={invite.isOpen} onOpenChange={(e) => setInvite((prev) => ({ ...prev, isOpen: e }))}>
            {invite.type === 'user' ? (
               <Candidates fromAction={(row) => <FromActionComponent row={row} {...inviteActionProps} />} />
            ) : (
               <Employee is_inspector={invite.is_inspector} breadcrumbs={[]} fromAction={(row) => <FromActionComponent row={row} {...inviteActionProps} />} />
            )}
         </Dialog>
      </>
   );
};

export default ExamAction;

const FromActionComponent = ({ row, type, exam_id, setClose }: { row: RowSelectionState; type: inviteTypes; exam_id?: string; setClose: () => void }) => {
   let addition = '/employee';
   if (type === 'user') {
      addition = '';
   }
   const { data, isLoading } = useQuery({
      enabled: !!Object.keys(row)?.at(0),
      queryKey: ['user_detail', Object.keys(row)?.at(0)],
      queryFn: () => request<FinalRespnse<TUserEmployee>>({ url: `user/detail${addition}?id=${Object.keys(row)?.at(0)}` }),
   });

   const { mutate, isPending } = useMutation({
      mutationFn: () =>
         request({
            method: 'post',
            url: `user/exam/invite${type !== 'user' ? `/${type}` : ``}`,
            body: {
               user_id: data?.data?.id,
               exam_id: exam_id,
            },
         }),
      onSuccess: () => {
         setClose();
      },
   });

   return (
      <div className="sticky z-20 top-0 left-0 bg-card-bg flex justify-between items-center mb-2 py-2">
         <div className="text-muted-text">
            Сонгогдсон {type === 'user' ? `ажил горилогч` : `ажилтан`}: <span className="text-primary font-semibold">{data?.data?.firstname}</span>
         </div>
         <Button isLoading={isPending || isLoading} onClick={() => mutate()} className="rounded-full">
            Шалгалтанд урих <VscSend />
         </Button>
      </div>
   );
};
