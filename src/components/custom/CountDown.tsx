import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';

// NOTE: Change this date to whatever date you want to countdown to :)
// const COUNTDOWN_FROM = '12/31/2024';
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

type TShiftCountProps = {
   endAt?: string;
   FinalFinish?: () => void;
   extraSM?: boolean;
   timer?: {
      isStarted: boolean;
      isDone: boolean;
   };
};

const ShiftingCountdown = ({ endAt, FinalFinish, timer, extraSM }: TShiftCountProps) => {
   const [remaining, setRemaining] = useState({
      minutes: 0,
      seconds: 0,
      hours: 0,
   });

   const getTimeDifference = useCallback((countDownDate: Date) => {
      const currentTime = new Date().getTime();
      const distance = countDownDate.getTime() - currentTime;

      // const days = Math.floor(distance / DAY);
      const hours = Math.floor((distance % DAY) / HOUR);
      const minutes = Math.floor((distance % HOUR) / MINUTE);
      const seconds = Math.floor((distance % MINUTE) / SECOND);

      if (minutes <= 0 && seconds <= 0 && hours <= 0 && timer?.isStarted) {
         setRemaining({
            minutes: 0,
            seconds: 0,
            hours: 0,
         });
         FinalFinish?.();
         return; // end finish gedeg hariu butsaa
      }

      setRemaining({
         minutes,
         seconds,
         hours,
      });
   }, []);

   // console.log(endAt, '------>endAt');

   const startCountDown = useCallback(() => {
      const customDate = new Date(endAt ?? '');

      setInterval(() => {
         getTimeDifference(customDate);
      }, 1000);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [getTimeDifference]);

   useEffect(() => {
      startCountDown();
   }, [startCountDown]);

   return (
      <div className={cn('p-0.5', extraSM ? `rounded-md bg-none w-44` : `rounded-lg bg-primary/60`)}>
         <div className={cn('mx-auto w-full flex items-center bg-card-bg overflow-hidden', extraSM ? `rounded-md h-7 border border-primary/60` : `rounded-lg h-14 `)}>
            <CountdownItem num={remaining.hours} text="Цаг" extraSM={extraSM} />
            <CountdownItem num={remaining.minutes} text="Минут" extraSM={extraSM} />
            <CountdownItem num={remaining.seconds} text="Секунд" isAlert={remaining.hours === 0 && remaining.minutes === 0} extraSM={extraSM} />
         </div>
      </div>
   );
};

const CountdownItem = ({ num, text, isAlert, extraSM }: { num: number; text: string; isAlert?: boolean; extraSM?: boolean }) => {
   return (
      <div className=" w-1/3 h-auto flex flex-col gap-0.5 items-center justify-center border-r-[1px] last:border-none border-1 relative">
         <div className="w-full text-center relative overflow-hidden">
            <AnimatePresence mode="popLayout">
               <motion.span
                  key={num}
                  initial={{ y: '100%' }}
                  animate={{ y: '0%' }}
                  exit={{ y: '-100%' }}
                  transition={{ ease: 'backIn', duration: 0.65 }}
                  className={cn('block text-primary font-semibold overflow-hidden', extraSM ? `text-sm` : ` text-base`, num === 0 ? `text-muted-text` : ``, isAlert ? `text-orange-500` : ``)}
               >
                  {num}
               </motion.span>
            </AnimatePresence>
         </div>
         {!extraSM && <span className={cn('text-[10px] text-muted-text/70')}>{text}</span>}
      </div>
   );
};

export default ShiftingCountdown;
