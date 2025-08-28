import * as React from 'react';

declare module 'react-quill' {
  import { Component, ComponentType, ForwardRefExoticComponent } from 'react';
  
  interface ReactQuillProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: string;
    defaultValue?: string;
    onChange?: (content: string, delta: any, source: string, editor: any) => void;
    onChangeSelection?: (range: any, source: string, editor: any) => void;
    onKeyPress?: React.KeyboardEventHandler;
    onKeyDown?: React.KeyboardEventHandler;
    onKeyUp?: React.KeyboardEventHandler;
    onClick?: React.MouseEventHandler;
    onFocus?: (range: any, source: string, editor: any) => void;
    onBlur?: (previousRange: any, source: string, editor: any) => void;
    onKeyPress?: React.KeyboardEventHandler;
    onKeyDown?: React.KeyboardEventHandler;
    onKeyUp?: React.KeyboardEventHandler;
    placeholder?: string;
    readOnly?: boolean;
    theme?: string;
    modules?: Record<string, any>;
    formats?: string[];
    children?: React.ReactElement<any>;
    bounds?: string | HTMLElement;
    scrollingContainer?: string | HTMLElement;
    style?: React.CSSProperties;
    className?: string;
    id?: string;
    ref?: React.Ref<ReactQuill>;
  }

  class ReactQuill extends Component<ReactQuillProps> {
    focus(): void;
    blur(): void;
    getEditor(): any;
    getBounds(index: number, length?: number): DOMRect;
    getSelection(focus?: boolean): any;
    getLength(): number;
    getHTML(): string;
    getText(range?: any): string;
    getContents(range?: any): any;
    setContents(delta: any): any;
    setText(text: string): any;
    updateContents(delta: any): any;
    setEditorSelection(range: any, source?: string): void;
    setEditorContents(editor: any, html: string): void;
  }

  export default ReactQuill;
}
