import { TextInput, Textarea, Button, Checkbox, Label } from '@/components/custom'; //Checkbox, Label
import { useForm } from 'react-hook-form';
// import { IoCloseOutline } from 'react-icons/io5';
import { PiFolderMinusLight } from "react-icons/pi";

const ConfigAction = () => {
   const { control } = useForm({ defaultValues: { question: '', score: '' } });
   return (
      <>
         <div className="grid grid-cols-[auto_1fr] gap-5 mb-4">
            <TextInput floatLabel={false} className="w-80" name="score" control={control} label="Шалгалтын нэр" placeholder="Нэр оруулах" type="number" />
            <Textarea className="w-full min-h-[100px]" name="question" control={control} label="Шалгалтын тайлбар" placeholder="Шалгалтын тайлбар дэлгэрэнгүй оруулах" />
         </div>

         <div className="grid grid-cols-[1fr_1fr] gap-5 mb-4">
            <TextInput className="w-full" name="score" control={control} label="Бүлэг" />
            <TextInput className="w-full" name="score" control={control} label="Дэд бүлэг" />
         </div>

         <div className="grid grid-cols-3 gap-5 mb-4">
            <div className="flex items-center gap-3">
               <Checkbox /> <Label className="m-0">АГ/Ажилтан хүссэн цагтаа шалгалт өгөх</Label>
            </div>
            <div className="flex items-center gap-3">
               <Checkbox /> <Label className="m-0">Шалгалт хувилбартай эсэх</Label>
            </div>
            <div className="flex items-center gap-3">
               <Checkbox /> <Label className="m-0">Шалгалт дууссаны дараа дүн харуулах</Label>
            </div>
         </div>

         <div className="grid grid-cols-[1fr_1fr] gap-5 mb-3">
            <TextInput className="w-full" name="score" control={control} label="Бүлэг" />
            <TextInput className="w-full" name="score" control={control} label="Дэд бүлэг" />
         </div>
         <div className="grid grid-cols-[1fr_1fr] gap-5 mb-3">
            <TextInput className="w-full" name="score" control={control} label="Бүлэг" />
            <TextInput className="w-full" name="score" control={control} label="Дэд бүлэг" />
         </div>

         <div className="pt-7 flex justify-end">
            <Button  className="rounded-full">
               <PiFolderMinusLight className="text-base" /> Шалгалт үүсгэх
            </Button>
         </div>
      </>
   );
};

export default ConfigAction;
