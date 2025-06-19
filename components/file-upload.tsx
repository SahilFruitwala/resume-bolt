'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  type: string;
}

export function FileUpload({
  onFileSelect,
  selectedFile = null,
  type = "resume",
}: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setError(null);
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.random() * 15;
        });
      }, 100);

      // Simulate processing delay
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        setTimeout(() => {
          setIsUploading(false);
          onFileSelect(file);
        }, 500);
      }, 2000);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
      },
      maxSize: 5 * 1024 * 1024, // 5MB
      multiple: false,
      disabled: isUploading || !!selectedFile,
    });

  const removeFile = () => {
    onFileSelect(null);
    setUploadProgress(0);
    setError(null);
  };

  // Handle file rejections
  if (fileRejections.length > 0 && !error) {
    const rejection = fileRejections[0];
    if (rejection.errors[0]?.code === "file-too-large") {
      setError("File size must be less than 5MB");
    } else if (rejection.errors[0]?.code === "file-invalid-type") {
      setError("Only PDF files are supported");
    } else {
      setError("File upload failed. Please try again.");
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Upload className="mr-2 h-6 w-6 text-primary" />
        Upload {type.charAt(0).toUpperCase() + type.slice(1)}
      </h2>

      <AnimatePresence>
        {!selectedFile && !isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              {...getRootProps()}
              className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${
            isDragActive
              ? "border-primary bg-primary/10 dark:border-primary dark:bg-primary/10"
              : "border-border hover:border-primary hover:bg-accent dark:border-border dark:hover:border-primary dark:hover:bg-accent"
          }
          `}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">
                {isDragActive
                  ? `Drop your ${type} here`
                  : `Drag & drop your ${type}`}
              </p>
              <p className="text-muted-foreground mb-4">
                or click to browse files
              </p>
              <Button variant="outline">Choose File</Button>
              <p className="text-sm text-muted-foreground mt-4">
                PDF files only • Max size 5MB
              </p>
            </div>
          </motion.div>
        )}

        {isUploading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-foreground">
              Uploading {type}...
            </h3>
            <div className="max-w-xs mx-auto mb-2">
              <Progress value={uploadProgress} className="h-2" />
            </div>
            <p className="text-sm text-muted-foreground">
              {Math.round(uploadProgress)}% complete
            </p>
          </motion.div>
        )}

        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-success/10 border border-success/20 dark:bg-success/10 dark:border-success/30 rounded-lg p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="shrink-0">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-success">
                   {type.charAt(0).toUpperCase() + type.slice(1)}&nbsp; 
                    uploaded successfully
                  </h3>
                  <div className="mt-1 flex items-center text-sm text-success">
                    <FileText className="mr-1 h-4 w-4" />
                    <span className="font-medium">{selectedFile.name}</span>
                    <span className="ml-2">
                      ({formatFileSize(selectedFile.size)})
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-success hover:text-success/80"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-destructive/10 border border-destructive/20 dark:bg-destructive/10 dark:border-destructive/30 rounded-lg p-4"
          >
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-destructive mr-2" />
              <p className="text-sm font-medium text-destructive">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}