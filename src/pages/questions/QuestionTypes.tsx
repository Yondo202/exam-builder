import { TextInput, Textarea, Button, Checkbox, Label, CkEditor } from '@/components/custom';
import { useForm } from 'react-hook-form';
import { IoCloseOutline } from 'react-icons/io5';
import { MdOutlineAdd } from 'react-icons/md';
import { BsSave } from "react-icons/bs";

export const WithSelect = () => {
   const { control } = useForm({ defaultValues: { question: '', score: '' } });
   return (
      <>
         <TextInput floatLabel={false} className="w-72 mb-5" name="score" control={control} label="Асуултын оноо" placeholder="Оноо оруулах" type="number" />
         <Textarea className="w-full min-h-[100px]" name="question" control={control} label="Асуулт оруулах" placeholder="Асуултаа дэлгэрэнгүй оруулах" />
         <div className="py-5 text-secondary/70">Хариулт</div>

         <div className="grid grid-cols-[1fr_1fr] gap-x-10 gap-y-6">
            <div className="grid grid-cols-[auto_1fr] items-center gap-2 relative">
               <Button size="icon" variant="ghost" className="rounded-full">
                  <IoCloseOutline className="text-[22px] text-danger-color " />
               </Button>
               <TextInput sizes="lg" beforeAddon={<span className="font-light ml-1 text-base">1.</span>} className="w-full" name="question" control={control} label="Хариулт оруулах" />
               <div className="flex items-center gap-3 px-3 absolute right-[1px] top-[1px] bottom-[1px] w-36 rounded-md bg-card-bg">
                  <Checkbox id="123" />
                  <Label htmlFor="123" className="m-0">
                     Зөв хариулт
                  </Label>
               </div>
            </div>
         </div>
         <div className="py-8 pb-0 flex justify-between">
            <Button variant="outline" className="rounded-md">
               <MdOutlineAdd className="text-base" /> Нэмэлт асуулт нэмэх
            </Button>
            <Button className="rounded-md"><BsSave className="text-sm mr-1" /> Хадгалах</Button>
         </div>
      </>
   );
};

export const OpenQuestion = () => {
   const { control } = useForm({ defaultValues: { question: '', score: '' } });
   return (
      <>
         <TextInput floatLabel={false} className="w-72 mb-5" name="score" control={control} label="Асуултын оноо" placeholder="Оноо оруулах" type="number" />
         <Textarea className="w-full min-h-[100px]" name="question" control={control} label="Асуулт оруулах" placeholder="Асуултаа дэлгэрэнгүй оруулах" />

         <div className="py-8 pb-0 flex justify-end">
            <Button className="rounded-md"><BsSave className="text-sm mr-1" /> Хадгалах</Button>
         </div>
      </>
   );
};

export const WithMedia = () => {
   const { control } = useForm({ defaultValues: { question: '', score: '' } });
   return (
      <>
         <TextInput floatLabel={false} className="w-72 mb-5" name="score" control={control} label="Асуултын оноо" placeholder="Оноо оруулах" type="number" />
         <Label htmlFor="123">Асуулт оруулах</Label>
         <CkEditor />

         <div className="py-8 pb-0 flex justify-end">
            <Button className="rounded-md"> <BsSave className="text-sm mr-1" /> Хадгалах</Button>
         </div>
      </>
   );
};

export const WithAdditional = () => {
   const { control } = useForm({ defaultValues: { question: '', score: '' } });
   return (
      <>
         <TextInput floatLabel={false} className="w-72 mb-5" name="score" control={control} label="Асуултын оноо" placeholder="Оноо оруулах" type="number" />
         <Textarea className="w-full min-h-[100px]" name="question" control={control} label="Асуулт оруулах" placeholder="Асуултаа оруулах" />
         <div className="py-5 text-secondary/70">Нэмэлт асуулт</div>

         <div className="grid grid-cols-[1fr_1fr] gap-x-10 gap-y-6">
            <div className="grid grid-cols-[auto_1fr] items-center gap-2">
               <Button size="icon" variant="ghost" className="rounded-full">
                  <IoCloseOutline className="text-[22px] text-danger-color " />
               </Button>
               <TextInput sizes="lg" beforeAddon={<span className="font-light ml-1 text-base">1.</span>} className="w-full" name="question" control={control} label="Асуулт оруулах" />
            </div>
         </div>
         <div className="py-8 pb-0 flex justify-between">
            <Button variant="outline" className="rounded-md">
               <MdOutlineAdd className="text-base" /> Нэмэлт асуулт нэмэх
            </Button>
            <Button className="rounded-md"><BsSave className="text-sm mr-1" /> Хадгалах</Button>
         </div>
      </>
   );
};
