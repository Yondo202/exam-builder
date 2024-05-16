import { Empty, Loading } from '@/assets/svg';
import * as React from 'react';
import {
   ColumnDef,
   ColumnFiltersState,
   SortingState,
   VisibilityState,
   flexRender,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   useReactTable,
   type Row,
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

interface DataTableProps<T> {
   columns: ColumnDef<T>[];
   data: T[];
   isLoading?: boolean;
   rowAction?: (props: TAction<T>) => void;
   headAction?: React.ReactNode;
   hideAction?: boolean;
   defaultPageSize?: number;
}
const defaultSize = 10;
const colSize = 180.666; // ene value auto oor avagdaj baigaa bolohoor .666 gej speacial oruulsan

// Row<T>

export default function DataTable<T extends object>({ columns, data = [], isLoading, rowAction, headAction, hideAction, defaultPageSize = defaultSize }: DataTableProps<T>) {
   const [globalFilter, setGlobalFilter] = React.useState('');
   const [sorting, setSorting] = React.useState<SortingState>([]);
   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
   const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
   const [rowSelection, setRowSelection] = React.useState({});

   const cols = {
      withoutAction: columns,
      withAction: [
         // {
         //    id: 'select',
         //    header: ({ table }) => (
         //       <Checkbox
         //          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
         //          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
         //          aria-label="Select all"
         //       />
         //    ),
         //    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
         //    enableSorting: false,
         //    enableHiding: false,
         //    size: 40,
         // },
         ...columns,
         {
            id: 'actions',
            size: 70,
            enableHiding: false,
            cell: ({ row }: { row: Row<T> }) => {
               // const rowdata = row.original
               const action = { data: row.original, isOpen: true };
               return (
                  <div className="relative">
                     <ActionButtons className='right-3' deleteTrigger={() => rowAction?.({ type: 'delete', ...action })} editTrigger={() => rowAction?.({ type: 'edit', ...action })} />
                  </div>
               );
            },
         },
      ],
   };

   const table = useReactTable({
      data,
      columns: cols[hideAction ? `withoutAction` : `withAction`],
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      onGlobalFilterChange: setGlobalFilter,
      state: {
         sorting,
         columnFilters,
         columnVisibility,
         rowSelection,
         globalFilter,
      },
      initialState: {
         pagination: {
            pageIndex: 0,
            pageSize: defaultPageSize,
         },
      },
      defaultColumn: {
         size: colSize, //starting column size
         minSize: 40, //enforced during column resizing
         maxSize: 500, //enforced during column resizing
      },
   });

   return (
      <div className="w-full">
         <div className="wrapper overflow-hidden">
            <div className="flex items-center justify-between px-4 py-5">
               <FloatingLabelInput
                  // label="Нэрээр хайх..."
                  // value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                  // onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
                  beforeAddon={<BiSearchAlt className="text-lg" />}
                  className="w-64 rounded-full"
                  sizes="sm"
                  value={globalFilter ?? ''}
                  onChange={(e) => setGlobalFilter(String(e.target.value))}
                  label="Бүх талбараар хайх..."
               />

               <div className="flex items-center gap-3">
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
                                    <label className="one_line cursor-pointer" htmlFor={column.id}>
                                       {column?.columnDef?.header?.toString()}
                                    </label>
                                 </div>
                              );
                           })}
                     </PopoverContent>
                  </Popover>
                  {headAction}
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

            <Table>
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
                                 <div className={`relative text-sm ${header.column.getCanSort() ? `cursor-pointer` : ``}`}>
                                    {/* {header.column.getCanSort() && !header.column.getIsSorted() && <TwoSideArrow />} */}
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    <div className="absolute right-px top-2/4 -translate-y-2/4">
                                       {header.column.getCanSort() && !header.column.getIsSorted() && <TfiArrowsVertical className="opacity-50" />}
                                       {{
                                          asc: <BsArrowUp />,
                                          desc: <BsArrowDown />,
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
                        <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className="hover:bg-muted-bg cursor-pointer group/items">
                           {row.getVisibleCells().map((cell) => {
                              const size = cell.column.getSize();
                              return (
                                 <TableCell
                                    key={cell.id}
                                    onClick={() => (cell.column.id !== 'actions' ? rowAction?.({ type: 'edit', data: row.original, isOpen: true }) : null)}
                                    // style={size !== colSize ? { width: size, maxWidth: size } : {}}
                                    style={{ width: size, maxWidth: size }}
                                    className={`one_line ${cell.column.id === 'actions' ? `p-0` : ``} ${cell.column.getIsSorted() ? `bg-primary/5` : ``}`}
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
         {table.getPageCount() !== 0 && (
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
