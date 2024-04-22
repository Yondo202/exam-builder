// declare module 'ckeditor5-custom-build';

declare global {
   interface ObjectConstructor {
      groupBy<T>(items: Iterable<T>, callbackfn: (value: T, index: number) => string): Record<string, T[]>;
   }

   interface MapConstructor {
      groupBy<T, U>(items: Iterable<T>, callbackfn: (value: T, index: number) => U): Map<U, T[]>;
   }
}