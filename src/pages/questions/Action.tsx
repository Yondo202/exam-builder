import { BreadCrumb, SelectInput } from '@/components/custom';
import { useSearchParams } from 'react-router-dom';
import { TBreadCrumb } from '@/components/custom/BreadCrumb';
import { useGetCategories, type TKeys } from '../category';
import { type FieldValues } from 'react-hook-form';
import { TControllerProps } from '@/lib/sharedTypes';
import { WithSelect, OpenQuestion, Filler } from './QuestionTypes';
import { TQuestion } from '.';
import { IconType } from 'react-icons/lib';
import { GoCheckCircle } from 'react-icons/go';
import { IoTextOutline } from "react-icons/io5";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

// import { BsSave } from 'react-icons/bs';
// eslint-disable-next-line react-refresh/only-export-components
// [ multi_select, select, text, drag_drop, multi_drag_drop ] - essay hassan

export type TQTypes = 'withSelect' | 'openQuestion' | 'filler';
// | 'withAdditional';

export type TObjectPettern = {
   label: string;
   component: ({ title, type }: { title: string; type: TQuestion }) => JSX.Element;
   type: TQuestion;
   description:string
   icon:IconType
};

type TQuestionTypesInFront = { [Key in TQTypes]: TObjectPettern };

export const questionAsset: TQuestionTypesInFront = {
   withSelect: {
      label: 'Сонголттой асуулт',
      component: WithSelect,
      type: 'checkbox',
      description:'Нэг болон олон сонголттой тест',
      icon:GoCheckCircle 
   },
   openQuestion: {
      label: 'Нээлттэй асуулт',
      component: OpenQuestion,
      type: 'text',
      description:'Энгийн болон Эссэ бичих боломжтой',
      icon:IoTextOutline
   },
   filler: {
      label: 'Нөхөж бичих',
      component: Filler,
      type: 'text',
      description:'Өгүүлбэр дунд хариулт нөхөж оруулах боломжтой',
      icon:HiOutlineDotsHorizontal
   },
};

type TSelectProps = { current: TKeys; label: string; disabled?: boolean; idKey?: string };

export const CategorySelect = <TFieldValues extends FieldValues>({ control, name, current, label, disabled, idKey }: TControllerProps<TFieldValues> & TSelectProps) => {
   const { data } = useGetCategories({ current, idKey });
   return (
      <SelectInput
         disabled={disabled}
         options={data?.data ? data.data?.map((item) => ({ value: item.id, label: item.name })) : []}
         rules={{ required: 'Ангилалаа сонгоно уу' }}
         {...{ label, name, control }}
      />
   );
};

// export type TQTypes = keyof typeof qTypes;

const GroupAction = ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => {
   const [search] = useSearchParams({});
   const searchAsObject = Object.fromEntries(new URLSearchParams(search));
   const Component = questionAsset[searchAsObject.type as TQTypes]?.component;

   return (
      <>
         <BreadCrumb pathList={[...breadcrumbs.map((item) => ({ ...item, isActive: false })), { to: '#', label: 'Тестийн сан үүсгэх', isActive: true }]} />
         <Component title={questionAsset[searchAsObject.type as TQTypes]?.label} type={questionAsset[searchAsObject.type as TQTypes]?.type} />
      </>
   );
};

export default GroupAction;
