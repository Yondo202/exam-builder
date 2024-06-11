// import { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import './CkEditor.css';
import CustomEditor from 'ckeditor5-custom-build';

type TCkEditor = {
   value: string;
   setValue: (value: string) => void;
   disabled?:boolean
};

const CkEditorComponent = ({ value, setValue, disabled }: TCkEditor) => {
   // const [value, setValue] = useState('');
   
   return (
      // <Suspense fallback={<Loading load={true} />}>
      <div className="ckeditor">
         <CKEditor
            editor={CustomEditor}
            data={value}
            config={{}}
            disabled={!!disabled}
            // onReady={(editor) => {
            //    console.log(editor, "============>")
            //    // editor.ui.view.editable.element.style.minHeight = '500px';
            //    // You can store the "editor" and use when it is needed.
            //    // console.log('Editor is ready to use!', editor);
            // }}
            onChange={(_, editor) => {
               const data = editor.getData();
               // console.log({ event, editor, data });
               //    setChange(name, data);
               setValue(data);
            }}
            // onBlur={(event, editor) => {
            //    console.log('Blur.', editor);
            // }}
            // onFocus={(event, editor) => {
            //    console.log('Focus.', editor);
            // }}
         />
      </div>
      // </Suspense>
   );
};

export default CkEditorComponent;
