const Header = ({ title, border = true }: { title?: string; border?: boolean }) => {
   return (
      <div className={`pt-3 mb-5 flex ${border ? `border-b` : ``}`}>
         <h3 className={`text-xl pb-4 font-normal ${border ? `border-b border-primary` : ``} `}>{title}</h3>
      </div>
   );
};

export default Header;
