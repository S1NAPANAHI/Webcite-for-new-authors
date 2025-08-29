export interface ImageUploadProps {
    folder: string;
    onUpload: (url: string) => void;
    onError: (error: string) => void;
    onStart?: () => void;
    children: React.ReactNode;
    accept?: string;
    maxSizeMB?: number;
}
export declare const ImageUpload: React.FC<ImageUploadProps>;
export default ImageUpload;
