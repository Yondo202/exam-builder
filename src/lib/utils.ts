import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export const HtmlToText = ({ html }: { html: string }) => {
   const text = html?.replace(/(<([^>]+)>)/g, ' ').replace('&nbsp;', ' ');

   if (text?.replace(/\s/g, '').length === 0) {
      return null;
   } else {
      return text;
   }
};

function pad(number: number) {
   if (number < 10) {
      return '0' + number;
   }
   return number;
}

export function formatDateToCustomISO(date: Date, isHideTimeZone?:boolean) {
   const offset = date.getTimezoneOffset();
   const offsetHours = Math.abs(Math.floor(offset / 60));
   const offsetMinutes = Math.abs(offset % 60);
   const offsetSign = offset < 0 ? '+' : '-';

   if (isHideTimeZone) {
      const isoString =
         date.getFullYear() +
         '-' +
         pad(date.getMonth() + 1) +
         '-' +
         pad(date.getDate()) +
         'T' +
         pad(date.getHours()) +
         ':' +
         pad(date.getMinutes()) +
         ':' +
         pad(date.getSeconds()) 
         // offsetSign +
         // pad(offsetHours) +
         // ':' +
         // pad(offsetMinutes) +
         // ' ';
      // timeZoneAbbreviation;

      return isoString;
   }

   const isoString =
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate()) +
      'T' +
      pad(date.getHours()) +
      ':' +
      pad(date.getMinutes()) +
      ':' +
      pad(date.getSeconds()) +
      offsetSign +
      pad(offsetHours) +
      ':' +
      pad(offsetMinutes) +
      ' ';
   // timeZoneAbbreviation;

   return isoString;
}

export const finalRenderDate = (value: string) => {
   return formatDateToCustomISO(new Date(value))?.slice(0, 16)?.replace('T', ' / ');
};

export const RenderDateValue = (value: string) => {
   if (!value) return formatDateToCustomISO(new Date());
   return formatDateToCustomISO(new Date(value));
};
