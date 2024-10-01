import { type TAnswers } from '..';
import { InitialAnswer } from '../Action';

export const FillConverter = ({ input }: { input: string }) => {
   // const input = 'answers1 {{ question1 }} answer2 {{ question4 }} answer3 answer4';
   // Step 1: Split the string by '{{'

   const parts = input.split('{{');

   // Step 2: Initialize an array to hold the results
   // const result: Pick<TAnswers, 'temp_type' | 'answer'>[] = [];
   const result: TAnswers[] = [];

   // Step 3: Process each part
   parts.forEach((part) => {
      part = part.trim().replace("\n", ""); // Trim any extra spaces

      if (part.includes('}}')) {
         // If part contains '}}', it's a question-answer pair
         const [question, answer] = part.split('}}').map((str) => str.trim());
         // Add the question to the result array
         result.push({ ...InitialAnswer,  answer: question, temp_type: 'answer' });

         // Add the answer to the result array
         result.push({ ...InitialAnswer, is_correct:true, answer: answer, temp_type: 'question' });
      } else {
         // Otherwise, it's just an answer
         result.push({ ...InitialAnswer, is_correct:true, answer: part, temp_type: 'question' });
      }
   });

   return result?.filter((item) => !!item.answer);
   // Print the result
};

export const FillArrayToString = ({ answers }: { answers: Pick<TAnswers, 'temp_type' | 'answer'| 'is_correct'>[] }) => {

   // is_correct - false ued- zowhon buruu songoltuud gesen ug - bas wrong answer
   return answers.filter(item=>item.temp_type !== "wrong_answer" || !!item.is_correct).map((item) => (item.temp_type === 'answer' ? `{{ ${item.answer} }}` : item.answer)).join(' ');
   // Print the result
};

export const MarkTotal = ({ answers }: { answers?: Pick<TAnswers, 'mark'>[] }) => {
   return answers?.map((item) => item.mark).reduce((prev, curr) => prev + curr, 0) ?? 0;
   // Print the result
};