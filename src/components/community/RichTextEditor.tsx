import React, { forwardRef } from 'react';
import { Editor as ToastEditor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import { processContentWithMediaEmbeds } from '@/utils/mediaUtils';
import { useSetupEditor } from '@/hooks/useSetupEditor';

interface RichTextEditorProps {
  initialValue?: string;
  height?: string;
  initialEditType?: 'wysiwyg' | 'markdown';
  placeholder?: string;
  previewStyle?: 'tab' | 'vertical';
}

// Forward ref to access the editor instance from parent components
const RichTextEditor = forwardRef<ToastEditor, RichTextEditorProps>(
  ({
    initialValue = ' ',
    height = '400px',
    initialEditType = 'wysiwyg',
    placeholder = '내용을 입력하세요...',
    previewStyle = 'vertical'
  }, ref) => {
    // Process the initial value to embed media like YouTube videos
    const processedInitialValue = React.useMemo(() => {
      return initialValue ? processContentWithMediaEmbeds(initialValue) : ' ';
    }, [initialValue]);
    
    // Setup the editor instance
    useSetupEditor(ref as React.RefObject<ToastEditor>);

return (
      <div className="rich-text-editor border rounded-md">
        <ToastEditor
          ref={ref}
          initialValue={processedInitialValue}
          height={height}
          initialEditType={initialEditType}
          placeholder={placeholder}
          previewStyle={previewStyle}
          useCommandShortcut={true}
          language="ko-KR"
        />
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
