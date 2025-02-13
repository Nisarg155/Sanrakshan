declare module 'pdfjs-dist' {
    export const getDocument: any;
    export const GlobalWorkerOptions: {
      workerSrc: string;
    };
    export const version: string;
  }
  
  declare module 'pdfjs-dist/build/pdf.worker.mjs' {}
  