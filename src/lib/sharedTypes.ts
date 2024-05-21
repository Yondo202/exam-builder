import { type Control, type RegisterOptions, type FieldValues, type FieldPath } from 'react-hook-form';

export const ATypes = {
   add: {
      apiMethod: 'post',
   },
   edit: {
      apiMethod: 'put',
   },
   delete: {
      apiMethod: 'delete',
   },
} as const;

export type TAction<T> = {
   isOpen: boolean;
   type: keyof typeof ATypes;
   data?: T;
};

export type TActionProps<TData> = {
   action: TAction<TData>;
   setClose?: ({ isDelete }: { isDelete?: boolean }) => void;
   // storeid?: string;
};

export type TControllerProps<TFieldValues extends FieldValues = FieldValues> = {
   control: Control<TFieldValues>;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   name: FieldPath<TFieldValues> | never;
   rules?: Exclude<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>;
   className?: string;
};

type TMeta = {
   page: number;
   page_size: number;
   total: number;
};

export type FinalRespnse<T> = {
   meta: TMeta;
   // data: T[];
   data: T;
};

// export const statusValues = {
//    active: {
//       label: 'Идэхтэй',
//       key: 'active',
//       //default sort startedAt
//    },
//    inactive: {
//       label: 'Идэхгүй',
//       key: 'inactive',
//       //default sort endsAt
//    },
//    pending: {
//       label: 'Хүлээгдэж байгаа',
//       key: 'pending',
//       //default sort createdAt
//    },
//    cancelled: {
//       label: 'Татгалзсан',
//       key: 'cancelled',
//       //default sort createdAt
//    },
// } as const;

// export const types = {
//    new: {
//       label: 'Шинэ',
//    },
//    upgrade: {
//       label: 'Дээшлүүлсэн',
//    },
//    downgrade: {
//       label: 'Доошлуулсан',
//    },
//    renew: {
//       label: 'Сунгасан',
//    },
// } as const;

// export type TStatus = keyof typeof statusValues;
// export type TSubTypes = keyof typeof types;
