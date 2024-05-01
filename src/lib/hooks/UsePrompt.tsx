import {  unstable_usePrompt } from 'react-router-dom';

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
   // const blocker = useBlocker(({ currentLocation, nextLocation }) => {
   //    // isBlocked && currentLocation.pathname !== nextLocation.pathname
   //    return false;
   // });

   unstable_usePrompt({
      message: 'Та гарахдаа итгэлтэй байна уу',
      when: ({ currentLocation, nextLocation }) => isBlocked && currentLocation.pathname !== nextLocation.pathname,
   });

   // return <>{children}</>;
};

export default UsePrompt
