import { useSearchParams } from 'react-router-dom';

const useSearchParam = () => {
   const [search, setSearch] = useSearchParams();
   const searchAsObject = Object.fromEntries(new URLSearchParams(search));

   const removeParam = (field: string) => {
      if (search.has(field)) {
         search.delete(field);
         setSearch(search);
      }
   };

   // const deleteTag = (tag) => {
   //    const includesTag = searchParams.getAll('tags').includes(tag);
   //    setSearchParams(prev => {
   //      if (includesTag) {
   //        const updatedTags = prev.getAll('tags').filter((el) => el !== tag);
   //        return { tags: updatedTags };
   //      }
   //    }
   // }
   return [searchAsObject, setSearch, removeParam];
};

export default useSearchParam;
