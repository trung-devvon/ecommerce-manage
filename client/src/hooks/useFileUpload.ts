import { useState, useCallback } from 'react';

interface UseFileInputProps {
  maxSizeMB?: number
  maxFiles?: number
}

interface UseFileInputResult {
  files: File[];
  linkImages: string[];
  isValid: boolean;
  errors: string[];
  handleFilesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
  clear: () => void;
}

const useFileInput = ({
  maxSizeMB = 2,
  maxFiles = 5
}: UseFileInputProps = {}): UseFileInputResult => {
  const [files, setFiles] = useState<File[]>([]);
  const [linkImages, setLinkImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const isValid = files.length > 0 && errors.length === 0;

  const handleFilesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles: File[] = [];
    const newErrors: string[] = [];

    if (selectedFiles.length > maxFiles) {
      newErrors.push(`Bạn chỉ có thể chọn tối đa ${maxFiles} file.`);
    } else {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        if (file.size / 1024 / 1024 > maxSizeMB) {
          newErrors.push(`File "${file.name}" vượt quá giới hạn kích thước ${maxSizeMB}MB.`);
        } else {
          newFiles.push(file);
        }
      }
    }

    setFiles(newFiles);
    setErrors(newErrors);

    const newLinkImages = newFiles.map((file) => URL.createObjectURL(file));
    setLinkImages(prevLinks => {
      // Revoke old object URLs to prevent memory leaks
      prevLinks.forEach(URL.revokeObjectURL);
      return newLinkImages;
    });
    
    // Reset input value
    e.target.value = '';
  }, [maxFiles, maxSizeMB]);

  const removeFile = useCallback((index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setLinkImages(prevLinkImages => {
      // Revoke the object URL being removed
      URL.revokeObjectURL(prevLinkImages[index]);
      return prevLinkImages.filter((_, i) => i !== index);
    });
  }, []);

  const clear = useCallback(() => {
    // Revoke all object URLs
    linkImages.forEach(URL.revokeObjectURL);
    setFiles([]);
    setLinkImages([]);
    setErrors([]);
  }, [linkImages]);

  return {
    files,
    linkImages,
    isValid,
    errors,
    handleFilesChange,
    removeFile,
    clear
  };
};

export default useFileInput;