import { BreadCrumb, Button, Header } from '@/components/custom';
import { TBreadCrumb } from '@/components/custom/BreadCrumb';
import { MdOutlineAdd } from 'react-icons/md';
import { CiSaveUp1 } from 'react-icons/ci';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const ExamAction = ({ breadcrumbs }: { breadcrumbs: TBreadCrumb[] }) => {
   //  const { control } = useForm({ defaultValues: { group: '', sub_group: '', question: '', score: '' } });
   //  const [search] = useSearchParams({});
   //  const searchAsObject = Object.fromEntries(new URLSearchParams(search));

   return (
      <div>
         <BreadCrumb pathList={[...breadcrumbs.map((item) => ({ ...item, isActive: false })), { to: '#', label: 'Шалгалтын материал', isActive: true }]} />
         <Header title="Шалгалтын материал" />
         <div className="wrapper py-5">
            <div className="px-6 pb-5 mb-4 text-muted-text font-medium text-sm flex gap-3 justify-between ">
               Асуумжын жагсаалт
               <Button variant="outline" className="rounded-full">
                  <MdOutlineAdd className="text-base" />
                  Асуумж нэмэх
               </Button>
            </div>

            <Accordion type="multiple" className="px-6">
               <AccordionItem value="item-1" className="border rounded-lg bg-primary/10 mb-3">
                  <AccordionTrigger>Is it accessible?</AccordionTrigger>
                  <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
               </AccordionItem>
               <AccordionItem value="item-2" className="border rounded-lg bg-primary/10">
                  <AccordionTrigger>Is it accessible?</AccordionTrigger>
                  <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
               </AccordionItem>
            </Accordion>

            <div className='flex justify-end p-6 pt-8 pb-0'>
               <Button className="rounded-full">
                  <CiSaveUp1 className="text-base" />
                  Хадгалах
               </Button>
            </div>
         </div>
      </div>
   );
};

export default ExamAction;
