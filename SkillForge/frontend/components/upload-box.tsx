"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";

interface UploadBoxProps {
  onFileSelect: (file: File) => void;
}

export function UploadBox({ onFileSelect }: UploadBoxProps) {
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  return (
    <Card className="border-dashed border-2">
      <CardContent className="p-8">
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center justify-center space-y-4">
            {fileName ? (
              <>
                <FileText className="w-12 h-12 text-primary" />
                <p className="text-sm font-medium">{fileName}</p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PDF files only</p>
                </div>
              </>
            )}
          </div>
          <input
            id="file-upload"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </CardContent>
    </Card>
  );
}
