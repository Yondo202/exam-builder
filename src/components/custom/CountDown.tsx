import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// NOTE: Change this date to whatever date you want to countdown to :)
// const COUNTDOWN_FROM = '12/31/2024';
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const ShiftingCountdown = ({ toFinish }: { toFinish: Date }) => {
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const intervalRef: any = useRef(null);

   const [remaining, setRemaining] = useState({
      minutes: 0,
      seconds: 0,
      hours: 0,
   });

   useEffect(() => {
      intervalRef.current = setInterval(handleCountdown, 1000);

      return () => clearInterval(intervalRef.current || undefined);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const handleCountdown = () => {
      // const end = new Date(COUNTDOWN_FROM);
      const now = new Date();
      const distance = +toFinish - +now;

      // const days = Math.floor(distance / DAY);
      const hours = Math.floor((distance % DAY) / HOUR);
      const minutes = Math.floor((distance % HOUR) / MINUTE);
      const seconds = Math.floor((distance % MINUTE) / SECOND);

      // console.log(now, "------------------------>now")

      if (minutes <= 0 && seconds <= 0) {
         setRemaining({
            minutes: 0,
            seconds: 0,
            hours: 0,
         });
         return; // end finish gedeg hariu butsaa
      }

      setRemaining({
         minutes,
         seconds,
         hours,
      });
   };

   return (
      <div className="p-4 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg">
         <div className="w-full max-w-5xl mx-auto flex items-center bg-white rounded-md">
            <CountdownItem num={remaining.hours} text="hours" />
            <CountdownItem num={remaining.minutes} text="minutes" />
            <CountdownItem num={remaining.seconds} text="seconds" />
         </div>
      </div>
   );
};

const CountdownItem = ({ num, text }: { num: number; text: string }) => {
   return (
      <div className=" w-1/2 h-24 md:h-36 flex flex-col gap-1 md:gap-2 items-center justify-center border-r-[1px] last:border-none border-slate-200">
         <div className="w-full text-center relative overflow-hidden">
            <AnimatePresence mode="popLayout">
               <motion.span
                  key={num}
                  initial={{ y: '100%' }}
                  animate={{ y: '0%' }}
                  exit={{ y: '-100%' }}
                  transition={{ ease: 'backIn', duration: 0.75 }}
                  className="block text-2xl md:text-4xl lg:text-6xl xl:text-7xl text-black font-medium"
               >
                  {num}
               </motion.span>
            </AnimatePresence>
         </div>
         <span className="text-xs md:text-sm lg:text-base font-light text-slate-500">{text}</span>
      </div>
   );
};

export default ShiftingCountdown;
