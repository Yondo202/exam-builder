import { Empty, Loading } from '@/assets/svg';
import * as React from 'react';
import {
   ColumnDef,
   ColumnFiltersState,
   // SortingState,
   VisibilityState,
   flexRender,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   useReactTable,
   RowSelectionState,
   type PaginationState,
   type Row,
   // type Table as TableType,
} from '@tanstack/react-table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Checkbox } from '@/components/ui/checkbox';
import { FloatingLabelInput } from '@/components/ui/Input';
import Button from '@/components/ui/button';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// import { GoTrash, GoPencil } from 'react-icons/go';
// import { RxDotsHorizontal } from 'react-icons/rx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PiPath } from 'react-icons/pi';
import { BiSearchAlt } from 'react-icons/bi';
import { BsArrowDown, BsArrowUp } from 'react-icons/bs';
import { TfiArrowsVertical } from 'react-icons/tfi';
import { TAction } from '@/lib/sharedTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ActionButtons from '@/components/ActionButtons';

// export type TRowAction<T> = {
//    type:'edit' | 'delete' | 'add'
//    data: T
// }
export type TPagination = {
   total: number;
} & PaginationState;

interface DataTableProps<T> {
   columns: ColumnDef<T>[];
   data: T[];
   isLoading?: boolean;
   rowAction?: (props: TAction<T>) => void;
   headAction?: React.ReactNode;
   hideAction?: boolean;
   hidePagination?: boolean;
   hideSearch?: boolean;
   isOneLineHead?: boolean;
   initialHideColumn?: string[];
   hideColumnVisibleAction?: boolean;
   defaultPageSize?: number;
   defaultSortField?: string;
   headActionClassName?: string;
   rowSelection?: RowSelectionState;
   setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>;
   enableMultiRowSelection?: boolean;
   size?: 'sm' | 'md';

   // server actions
   isSelectRow?: boolean;
   manualPagination?: boolean;
   pagination?: TPagination;
   setPagination?: React.Dispatch<React.SetStateAction<TPagination>>;

   hideActionButton?: 'delete' | 'edit';

   search?: string;
   setSearch?: React.Dispatch<React.SetStateAction<string>>;
}

const defaultSize = 10;
const colSize = 180.666; // ene value auto oor avagdaj baigaa bolohoor .666 gej speacial oruulsan

// Row<T>

export default function DataTable<T extends object>({
   columns,
   data = [],
   isLoading,
   rowAction,
   headAction,
   hideAction,
   isSelectRow,
   defaultPageSize = defaultSize,
   // defaultSortField,
   size = 'md',
   rowSelection,
   setRowSelection,

   enableMultiRowSelection = true,
   ...rest
}: DataTableProps<T>) {
   const [globalFilter, setGlobalFilter] = React.useState('');
   // const [sorting, setSorting] = React.useState<SortingState>([
   //    {
   //       id: defaultSortField ?? 'updated_at',
   //       desc: true,
   //    },
   // ]);
   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
   const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

   const checkAcion = {
      id: 'select',
      // header: ({ table }: { table: TableType<T> }) => {
      //    return (
      //       <Checkbox
      //          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
      //          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      //          aria-label="Select all"
      //       />
      //    );
      // },
      cell: ({ row }: { row: Row<T> }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
      enableSorting: false,
      enableHiding: false,
      size: 60,
   };

   const columnReturn = () => {
      if (rowSelection) {
         return [checkAcion, ...columns];
      }

      return columns;
   };
   const cols = {
      withoutAction: rowSelection ? [checkAcion, ...columns] : columns,
      withAction: [
         ...columnReturn(),
         {
            id: 'actions',
            size: 80,
            enableHiding: false,
            cell: ({ row }: { row: Row<T> }) => {
               // const rowdata = row.original
               const action = { data: row.original, isOpen: true };
               return (
                  <div className="relative">
                     <ActionButtons
                        hideActionButton={rest.hideActionButton}
                        className="right-3"
                        deleteTrigger={() => rowAction?.({ type: 'delete', ...action })}
                        editTrigger={() => rowAction?.({ type: 'edit', ...action })}
                     />
                  </div>
               );
            },
         },
      ],
   };

   useEffect(()=>{
      if(rest.initialHideColumn){
         const temp: VisibilityState | undefined = {}
         rest.initialHideColumn?.forEach(item=>{
            temp[item] = false
         })
         setColumnVisibility(temp)
      }
   },[rest.initialHideColumn])

   // rest.setPagination
   const ServerAction = (isManual?: boolean) => {
      if (isManual && rest.pagination) {
         return {
            manualPagination: rest.manualPagination,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onPaginationChange: (state: any) => rest.setPagination?.(state),
            pageCount: Math.ceil(rest.pagination?.total / rest?.pagination?.pageSize) ?? -1,
            state: {
               pagination: rest.pagination,
            },
            initialState: {
               pagination: {
                  pageIndex: rest.pagination.pageIndex,
                  pageSize: rest.pagination.pageSize,
               },
            },
         };
      } else {
         return {};
      }
   };

   const table = useReactTable({
      data,
      columns: cols[hideAction ? `withoutAction` : `withAction`],
      // onSortingChange: setSorting, // daraa eniig butsaaj hii
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      onGlobalFilterChange: setGlobalFilter,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getRowId: (row: any) => row?.id,
      ...ServerAction(rest.manualPagination),

      enableMultiRowSelection: enableMultiRowSelection,
      state: {
         ...ServerAction(rest.manualPagination).state,
         // sorting,
         columnFilters,
         columnVisibility,
         rowSelection: rowSelection ?? {},
         globalFilter,
      },
      initialState: {
         pagination: rest.manualPagination
            ? ServerAction(rest.manualPagination).initialState?.pagination
            : {
                 pageIndex: 0,
                 pageSize: defaultPageSize,
              },
         // sorting: [
         //    {
         //       id: 'updated_at',
         //       desc: true,
         //    },
         // ],
      },
      defaultColumn: {
         size: colSize, //starting column size
         minSize: 40, //enforced during column resizing
         maxSize: 500, //enforced during column resizing
      },
   });

   // console.log(
   //    table.getSelectedRowModel().rows?.map((item) => item.original),
   //    '===============. table.getIsAllPageRowsSelected()'
   // );

   return (
      <div className="w-full">
         <div className="wrapper overflow-hidden">
            <div className="flex items-end justify-between px-4 py-5">
               {!rest.hideSearch ? (
                  <DebouncedInput
                     value={rest.setSearch ? rest.search ?? '' : globalFilter ?? ''}
                     onChange={(value) => (rest.setSearch ? rest.setSearch(value) : setGlobalFilter(value))}
                     debounce={500}
                  />
               ) : (
                  <div />
               )}

               <div className={cn('flex items-center gap-3', rest.headActionClassName)}>
                  {headAction}

                  {!rest.hideColumnVisibleAction && (
                     <Popover>
                        <PopoverTrigger asChild>
                           <Button variant="outline" size="icon" className="ml-auto rounded-full">
                              {/* Харагдац <ChevronDownIcon className="ml-2 h-4 w-4" /> */}
                              <PiPath className="text-secondary" />
                           </Button>
                        </PopoverTrigger>

                        <PopoverContent align="end">
                           {table
                              .getAllColumns()
                              .filter((column) => column.getCanHide())
                              .map((column) => {
                                 return (
                                    <div className="flex gap-3.5 py-1.5" key={column.id}>
                                       <Checkbox checked={column.getIsVisible()} id={column.id} onCheckedChange={(value) => column.toggleVisibility(!!value)} aria-label="Select all" />
                                       <label className="truncate cursor-pointer" htmlFor={column.id}>
                                          {column?.columnDef?.header?.toString()}
                                       </label>
                                    </div>
                                 );
                              })}
                        </PopoverContent>
                     </Popover>
                  )}
               </div>

               {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="outline" size="icon" className="ml-auto">
                        <Route size={17} strokeWidth={1.4} className="stroke-primary" />
                     </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                     {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                           return (
                              <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                                 {column?.columnDef?.header?.toString()}
                              </DropdownMenuCheckboxItem>
                           )
                        })}
                  </DropdownMenuContent>
               </DropdownMenu> */}
            </div>

            <Table className={size === 'sm' ? 'text-xs' : ''}>
               <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                     <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                           const size = header.column.getSize();
                           return (
                              <TableHead
                                 key={header.id}
                                 style={{ width: size, maxWidth: size }}
                                 {...{
                                    onClick: header.column.getToggleSortingHandler(),
                                 }}
                                 className={header.column.getCanSort() ? `hover:bg-hover-bg ${header.column.getIsSorted() ? `bg-hover-bg` : ``}` : ``}
                              >
                                 <div className={`relative ${header.column.getCanSort() ? `cursor-pointer` : ``}`}>
                                    {/* {header.column.getCanSort() && !header.column.getIsSorted() && <TwoSideArrow />} */}
                                    {/* <div className="w-full"></div>  */}
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    <div className="absolute right-px top-2/4 -translate-y-2/4">
                                       {header.column.getCanSort() && !header.column.getIsSorted() && <TfiArrowsVertical className="opacity-50 text-xs" />}
                                       {{
                                          asc: <BsArrowUp className="text-xs text-primary" />,
                                          desc: <BsArrowDown className="text-xs text-primary" />,
                                       }[header.column.getIsSorted() as string] ?? null}
                                    </div>
                                 </div>
                              </TableHead>
                           );
                        })}
                     </TableRow>
                  ))}
               </TableHeader>
               <TableBody>
                  {!isLoading && table.getRowModel().rows?.length > 0 ? (
                     table.getRowModel().rows.map((row) => (
                        <TableRow
                           key={row.id}
                           data-state={row.getIsSelected() && 'selected'}
                           onClick={() => (isSelectRow ? row.toggleSelected(!row.getIsSelected()) : null)}
                           className="hover:bg-muted-bg cursor-pointer group/items"
                        >
                           {row.getVisibleCells().map((cell) => {
                              const sizeCol = cell.column.getSize();

                              // checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)}

                              return (
                                 <TableCell
                                    key={cell.id}
                                    onClick={() => (cell.column.id !== 'actions' && cell.column.id !== 'as_action' ? rowAction?.({ type: 'edit', data: row.original, isOpen: true }) : null)}
                                    // style={size !== colSize ? { width: size, maxWidth: size } : {}}
                                    style={{ width: sizeCol, maxWidth: sizeCol }}
                                    className={`one_line ${cell.column.id === 'actions' || cell.column.id === 'as_action' ? `p-0` : ``} ${size === 'sm' ? 'py-2' : ``} ${
                                       cell.column.getIsSorted() ? `bg-hover-bg/30` : ``
                                    }`}
                                 >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                 </TableCell>
                              );
                           })}
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell colSpan={columns.length + 2}>
                           <div className="flex h-48 w-full flex-col items-center justify-center gap-5">
                              {isLoading ? (
                                 <Loading className="w-12 animate-spin fill-primary" />
                              ) : (
                                 <>
                                    <Empty className="dark:opacity-30" />
                                    <div className="text-muted-text opacity-70">Мэдээлэл байхгүй байна</div>
                                 </>
                              )}
                           </div>
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </div>
         {/*table.getRowModel().rows?.length - ene ch bj bolno*/}
         {table.getPageCount() !== 0 && !rest.hidePagination && (
            <div className="flex w-full items-center justify-between space-x-2 py-4">
               <Select
                  defaultValue={defaultPageSize.toString()}
                  onValueChange={(e) => {
                     table.setPageSize(Number(e));
                  }}
               >
                  <SelectTrigger className="w-[65px] text-xs p-2.5 py-1.5 h-8">
                     <SelectValue placeholder="5" />
                  </SelectTrigger>
                  <SelectContent>
                     {[defaultPageSize, 20, 30, 40, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={pageSize.toString()}>
                           {pageSize}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>

               {!!rest.pagination?.total && (
                  <div className="flex items-center gap-2 text-xs2">
                     <span className="text-muted-text">Нийт:</span>
                     {rest.pagination?.total}
                  </div>
               )}

               <Pagination>
                  <PaginationContent>
                     <PaginationItem>
                        <PaginationPrevious className="text-xs" size="sm" isActive={table.getCanPreviousPage()} onClick={() => table.previousPage()} href="#" />
                     </PaginationItem>

                     {Array.from({ length: table.getPageCount() > 5 ? 5 : table.getPageCount() })?.map((_, index) => {
                        return (
                           <PaginationItem key={index}>
                              <PaginationLink className="border-border" onClick={() => table.setPageIndex(index)} isActive={index === table.getState().pagination?.pageIndex} href="#">
                                 {index + 1}
                              </PaginationLink>
                           </PaginationItem>
                        );
                     })}

                     {table.getPageCount() > 6 && (
                        <PaginationItem>
                           <Select
                              value={
                                 table.getPageCount() === table.getState().pagination?.pageIndex + 1
                                    ? ''
                                    : (table.getState().pagination?.pageIndex < 5 ? '' : table.getState().pagination?.pageIndex ?? '').toString()
                              }
                              onValueChange={(e) => {
                                 table.setPageIndex(Number(e));
                              }}
                           >
                              <SelectTrigger hideIcon className="w-8 h-7 text-xs p-0 flex items-center justify-center">
                                 <SelectValue placeholder="..." />
                              </SelectTrigger>
                              <SelectContent align="end">
                                 {Array.from({ length: table.getPageCount() - 6 }).map((_, index) => (
                                    <SelectItem key={index + 5} value={(index + 5).toString()}>
                                       {index + 6}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                        </PaginationItem>
                     )}

                     {table.getPageCount() > 5 && (
                        <PaginationItem>
                           <PaginationLink
                              className="border-border"
                              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                              isActive={table.getPageCount() - 1 === table.getState().pagination?.pageIndex}
                              href="#"
                           >
                              {table.getPageCount()}
                           </PaginationLink>
                        </PaginationItem>
                     )}

                     <PaginationItem>
                        <PaginationNext className="text-xs" size="sm" isActive={table.getCanNextPage()} onClick={() => (table.getCanNextPage() ? table.nextPage() : null)} href="#" />
                     </PaginationItem>
                  </PaginationContent>
               </Pagination>
            </div>
         )}
      </div>
   );
}

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type TBounceProps = {
   value: string;
   onChange: (value: string) => void;
   debounce: number;
};

export function DebouncedInput({ value: initialValue, onChange, debounce = 700 }: TBounceProps) {
   const [value, setValue] = useState(initialValue);

   useEffect(() => {
      setValue(initialValue);
   }, [initialValue]);

   useEffect(() => {
      const timeout = setTimeout(() => {
         onChange(value);
      }, debounce);

      return () => clearTimeout(timeout);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [debounce, value]);

   return (
      <FloatingLabelInput
         beforeAddon={<BiSearchAlt className="text-lg" />}
         className="w-64 rounded-full"
         sizes="sm"
         value={value}
         onChange={(e) => setValue(e.target.value)}
         label="Бүх талбараар хайх..."
      />
   );
}
