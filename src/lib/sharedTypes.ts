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


export enum UserRolesEnum {
   CANDIDATE = 'candidate',
   SUPER_ADMIN = 'super_admin',
   COMPANY_ADMIN = 'company_admin',
   INSPECTOR = 'inspector',
   //   EMPLYOEE = 'employee_admin',
}

export const UserRolesAsset = {
   candidate: {
      label: 'Оролцогч',
   },
   super_admin: {
      label: 'Супер админ',
   },
   company_admin: {
      label: 'Байгууллагын админ',
   },
   inspector: {
      label: 'Шалгагч',
   },
};

export type TUserRoles = keyof typeof UserRolesAsset;

export type TRolesAssetType = {
   id: string;
   role: TUserRoles;
   user_id: string;
};

export type TUserEmployee = {
   id: string;
   firstname: string;
   lastname: string;
   company_name: string; // odoo deer - company_name
   phone: string;
   dep_name: string;
   hired_date: string;
   created_at?: string;
   email: string;
   password: string;
   regno: string;
   private_number?: string;
   // gantshan enuugeer ylgana
   empid: string;

   // candidate
   position_applied: string;
   company_applied: string;
   gender: 'male' | 'female';
   birth_date: string;
   age: number;
   force_password_change:boolean
   roles: TRolesAssetType[];
};