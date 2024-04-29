import { TextInput, Textarea, Button, Checkbox, Label, DatePicker } from '@/components/custom'; //Checkbox, Label
import { useForm } from 'react-hook-form';
// import { IoCloseOutline } from 'react-icons/io5';
import { PiFolderMinusLight } from 'react-icons/pi';

const ConfigAction = () => {
   const { control, handleSubmit } = useForm({ defaultValues: { score: '', question: '', startAt: '', endAt: '', group: '' } });
   const onSubmit = () => {
      // console.log(data, '-----------> data');
   };
   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <div className="grid grid-cols-[auto_1fr] gap-6 mb-8">
            <TextInput floatLabel={false} className="w-80" name="score" control={control} rules={{ required: 'Шалгалтын нэр оруулна уу' }} label="Шалгалтын нэр" placeholder="Нэр оруулах" />
            <Textarea
               className="w-full min-h-[100px]"
               name="question"
               control={control}
               rules={{ required: 'Шалгалтын тайлбар оруулна уу' }}
               label="Шалгалтын тайлбар"
               placeholder="Шалгалтын тайлбар дэлгэрэнгүй оруулах"
            />
         </div>

         <div className="grid grid-cols-[1fr_1fr] gap-6 mb-8">
            <TextInput name="group" control={control} label="Бүлэг" />
            <TextInput name="group" control={control} label="Дэд бүлэг" />
         </div>

         <div className="grid grid-cols-3 gap-6 mb-8">
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

         <div className="grid grid-cols-[1fr_1fr] gap-6 mb-2">
            <DatePicker rules={{ required: 'Эхлэх огноо оруулна уу' }} name="startAt" control={control} label="Эхлэх огноо" />
            <DatePicker rules={{ required: 'Дуусах огноо оруулна уу' }} name="endAt" control={control} label="Дуусах огноо" />
         </div>

         <div className="pt-7 flex justify-end">
            <Button type="submit" className="rounded-full">
               <PiFolderMinusLight className="text-lg mr-1" /> Шалгалт үүсгэх
            </Button>
         </div>
      </form>
   );
};

export default ConfigAction;
