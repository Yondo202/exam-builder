import './svg.css';

const Checksvg = () => {
   return (
      <div>
         <svg
            className="h-[1.4rem] w-[1.4rem] -mt-[2px] animate-scale"
            viewBox="0 0 133 133"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            // xmlns:xlink="http://www.w3.org/1999/xlink"
         >
            <g id="check-group" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
               {/* <circle id="filled-circle" cx="66.5" fill="#38bdf8" cy="66.5" r="54.5" /> */}
               {/* <circle id="white-circle" fill="#FFFFFF" cx="66.5" cy="66.5" r="55.5" /> */}
               {/* <circle id="outline" stroke="#38bdf8" strokeWidth="4" cx="66.5" cy="66.5" r="54.5" /> */}
               <polyline id="check" stroke="#FFFFFF" strokeWidth="9.5" points="41 70 56 85 92 49" />
            </g>
         </svg>
      </div>
   );
};

export default Checksvg;

// fill="red"
