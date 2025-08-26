// Global type declarations

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module 'react-markdown' {
  const ReactMarkdown: any;
  export default ReactMarkdown;
}

declare module 'remark-gfm' {
  const gfm: any;
  export default gfm;
}

declare module 'remark-math' {
  const math: any;
  export default math;
}

declare module 'rehype-katex' {
  const katex: any;
  export default katex;
}

// Add type declarations for environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    readonly VITE_DEBUG?: string;
  }
}

// Add global types
interface Window {
  ENV: {
    VITE_SUPABASE_URL: string;
    VITE_SUPABASE_ANON_KEY: string;
    VITE_DEBUG?: string;
  };
}
