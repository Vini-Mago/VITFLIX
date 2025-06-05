import React from 'react';
import { File } from '../types';
import { FileText, Download, FileType } from 'lucide-react';

interface FileCardProps {
  file: File;
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  // Get icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FileText className="h-10 w-10 text-red-500" />;
    } else if (fileType.includes('word') || fileType.includes('doc')) {
      return <FileText className="h-10 w-10 text-blue-500" />;
    } else if (fileType.includes('excel') || fileType.includes('sheet')) {
      return <FileText className="h-10 w-10 text-green-500" />;
    } else if (fileType.includes('image')) {
      return <FileText className="h-10 w-10 text-purple-500" />;
    } else {
      return <FileType className="h-10 w-10 text-gray-500" />;
    }
  };
  
  return (
    <div className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 animate-fade-in">
      <div className="mr-4">
        {getFileIcon(file.fileType)}
      </div>
      <div className="flex-grow">
        <h3 className="font-medium text-gray-900">{file.title}</h3>
        <p className="text-xs text-gray-500 mt-1">
          {formatFileSize(file.fileSize)} • {file.fileType}
        </p>
      </div>
      <a 
        href={file.fileUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="ml-4 p-2 text-gray-600 hover:text-primary transition-colors"
        download
      >
        <Download className="h-5 w-5" />
      </a>
    </div>
  );
};

export default FileCard;