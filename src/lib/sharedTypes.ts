import { type Control, type RegisterOptions, type FieldValues, type FieldPath } from 'react-hook-form'


export type TAction<T> = {
    isOpen: boolean;
    type: 'add' | 'edit' | 'delete'
    data?: T;
 };

export type TActionProps<TData> = {
    select: TAction<TData>;
    setClose?: ({ isDelete }: { isDelete?: boolean }) => void;
    storeid?: string;
};

export type TControllerProps<TFieldValues extends FieldValues = FieldValues> = {
    control: Control<TFieldValues>
    name: FieldPath<TFieldValues>
    rules?: Exclude<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>
    className?: string
 } 


export const statusValues = {
    active: {
        label: 'Идэхтэй',
        key: 'active',
        //default sort startedAt
    },
    inactive: {
        label: 'Идэхгүй',
        key: 'inactive',
        //default sort endsAt
    },
    pending: {
        label: 'Хүлээгдэж байгаа',
        key: 'pending',
        //default sort createdAt
    },
    cancelled: {
        label: 'Татгалзсан',
        key: 'cancelled',
        //default sort createdAt
    },
} as const

export const types = {
    new: {
        label: 'Шинэ',
    },
    upgrade: {
        label: 'Дээшлүүлсэн',
    },
    downgrade: {
        label: 'Доошлуулсан',
    },
    renew: {
        label: 'Сунгасан',
    },
} as const


export type TStatus = keyof typeof statusValues
export type TSubTypes = keyof typeof types