"use client";

import React, { useState, useRef } from "react";
import { FileText, X, Upload } from "lucide-react";
import clsx from "clsx";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  maxSizeMB?: number;
  disabled?: boolean;
}

export const FileUpload = ({ onFileSelect, maxSizeMB = 2, disabled = false }: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError("");

    if (!file) return;

    // 파일 크기 검증 (2MB = 2 * 1024 * 1024 bytes)
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`${maxSizeMB}MB 이하의 파일을 업로드해주세요.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // PDF 파일 타입 검증
    if (file.type !== "application/pdf") {
      setError("PDF 파일만 업로드 가능합니다.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <button onClick={handleClick} disabled={disabled} className={clsx("flex items-center gap-1 md:gap-[6px] transition-opacity", disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-80 cursor-pointer")}>
          <Upload className="w-5 h-5" />
          <span className="text-xs md:text-sm">파일 업로드하기</span>

          <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" disabled={disabled} />
        </button>
      ) : (
        <div className="flex items-center gap-2 p-2 bg-purple-50 border border-purple-200 rounded-lg">
          {/* PDF 아이콘 */}
          <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />

          {/* 파일 정보 */}
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate font-medium">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
          </div>

          {/* 제거 버튼 */}
          <button onClick={handleRemoveFile} disabled={disabled} className="p-1 hover:bg-purple-100 rounded transition-colors flex-shrink-0" aria-label="파일 제거">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
