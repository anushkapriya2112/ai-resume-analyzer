import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { formatBytes } from "~/lib/utils";

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0] || null;
      setFile(selectedFile);
      onFileSelect(selectedFile);
    },
    [onFileSelect]
  );

  const maxFileSize = 20 * 1024 * 1024; // 20 MB in bytes

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: maxFileSize,
  });

  const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setFile(null);
    onFileSelect(null);
  };

  return (
    <div className="w-full gradient-border">
      <div {...getRootProps()}>
        <input {...getInputProps()} />

        <div className="space-y-4 cursor-pointer">
          {file ? (
            <div
              className="uploader-selected-file"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src="/images/pdf.png"
                alt="PDF"
                className="size-10"
              />

              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 truncate max-w-xs items-center justify-center">
                    {file.name}
                  </p>

                  <p className="text-sm text-gray-500 items-center justify-center">
                    {formatBytes(file.size)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="p-2 cursor-pointer"
                onClick={handleRemoveFile}
                aria-label="Remove selected PDF"
                title="Remove PDF"
              >
                <img
                  src="/icons/cross.svg"
                  alt="remove"
                  className="w-4 h-4"
                />
              </button>
            </div>
          ) : (
            <div>
              <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                <img
                  src="/icons/info.svg"
                  alt="upload"
                  className="size-20"
                />
              </div>

              <p className="text-lg text-gray-500 items-center justify-center">
                <span className="font-semibold">
                  {isDragActive ? "Drop file here" : "Click to upload"}
                </span>{" "}
                or drag and drop
              </p>

              <p className="text-lg text-gray-500 items-center justify-center">
                PDF (max {formatBytes(maxFileSize)})
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;