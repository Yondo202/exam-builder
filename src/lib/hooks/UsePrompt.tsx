// import { unstable_usePrompt } from 'react-router-dom';
// import { useEffect } from 'react';

// const CustomBlocker = ({ isBlocked, children }: { isBlocked: boolean; children: ReactNode }) => {
//    const blocker = useBlocker(({ currentLocation, nextLocation }) => {
//       // isBlocked && currentLocation.pathname !== nextLocation.pathname
//       return false;
//    });

//    console.log(blocker.state, '------->blocker');
//    return <>{children}</>;
// };

// export default CustomBlocker;

export const UsePrompt = ({ isBlocked }: { isBlocked: boolean }) => {
   return isBlocked;
   // daraa eniig nem


   // useEffect(() => {
   //    // eslint-disable-next-line @typescript-eslint/no-explicit-any
   //    const handleBeforeUnload = (event: any) => {
   //       if (isBlocked) {
   //          event.preventDefault();
   //          // event.returnValue = `Гарахадаа итгэлтэй байна уу?`;
   //          // return `Гарахадаа итгэлтэй байна уу?`;
   //       }
   //    };
   //    window.addEventListener('beforeunload', handleBeforeUnload);
   //    return () => {
   //       window.removeEventListener('beforeunload', handleBeforeUnload);
   //    };
   // }, [isBlocked]);

   // unstable_usePrompt({
   //    message: 'Та гарахдаа итгэлтэй байна уу',
   //    when: ({ currentLocation, nextLocation }) => isBlocked && currentLocation.pathname !== nextLocation.pathname,
   // });
};

export default UsePrompt;
