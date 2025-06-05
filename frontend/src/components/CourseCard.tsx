import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../types';
import { Film, FileText } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  videoCount: number;
  fileCount: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, videoCount, fileCount }) => {
  return (
    <Link 
      to={`/curso/${course.id}`}
      className="card group transform hover:scale-105 transition-transform duration-300 animate-fade-in"
    >
      <div className="h-40 relative overflow-hidden rounded-t-lg">
        <img 
          src={course.imageUrl} 
          alt={course.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <h3 className="text-white font-bold text-lg p-4">{course.title}</h3>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{course.description}</p>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>Professor: {course.instructor}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <div className="flex items-center text-xs">
              <Film className="h-4 w-4 text-primary mr-1" />
              <span>{videoCount} {videoCount === 1 ? 'vídeo' : 'vídeos'}</span>
            </div>
            <div className="flex items-center text-xs">
              <FileText className="h-4 w-4 text-primary mr-1" />
              <span>{fileCount} {fileCount === 1 ? 'arquivo' : 'arquivos'}</span>
            </div>
          </div>
          <span className="text-xs text-primary bg-blue-50 px-2 py-1 rounded-full">
            Acessar
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;