// import React from 'react';
// import styled from 'styled-components';

// type TError = {
//    error: string | undefined
// }

import { type ControllerFieldState } from "react-hook-form"

const ErrorMessage = ({ error }: { error: ControllerFieldState['error'] }) => {
   if (!error) return
   return (
      <div className="relative z-10 text-danger-color">
         <div className="absolute right-0 top-0.5 text-xs leading-3">{error?.message}</div>
      </div>
   )
}

export default ErrorMessage

// const StyledErrorMessage = styled.div`
//    position: absolute;
//    top: 110%;
//    right: 0;
//    font-size: 11px;
//    color: ${(props) => props.theme.dangerColor};
//    text-align: right;
// `;
