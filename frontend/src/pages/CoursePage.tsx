import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import VideoCard from '../components/VideoCard';
import FileCard from '../components/FileCard';
import { ChevronLeft, User, Calendar } from 'lucide-react';

const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses, categories, videos, files, loading, error } = useData();
  
  // Find the course
  const course = courses.find(c => c.id === courseId);
  
  // Get category
  const category = course ? categories.find(cat => cat.id === course.categoryId) : undefined;
  
  // Get videos and files for this course
  const courseVideos = videos
    .filter(video => video.courseId === courseId)
    .sort((a, b) => a.order - b.order);
  
  const courseFiles = files.filter(file => file.courseId === courseId);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-lg text-gray-600">Carregando...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        <p>Erro ao carregar dados: {error}</p>
      </div>
    );
  }
  
  if (!course || !category) {
    return (
      <div className="bg-yellow-50 text-yellow-600 p-4 rounded-md">
        <p>Curso não encontrado</p>
        <Link to="/" className="text-primary font-medium mt-2 inline-block">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <Link 
        to={`/categoria/${category.id}`} 
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Voltar para {category.title}
      </Link>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3 h-48 md:h-auto">
            <img 
              src={course.imageUrl} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 md:w-2/3">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
            <p className="text-gray-600 mb-4">{course.description}</p>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1 text-primary" />
                <span>Professor: {course.instructor}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-primary" />
                <span>Adicionado em: {formatDate(course.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Conteúdo do Curso
          </h2>
          
          {courseVideos.length === 0 ? (
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-blue-600">
                Este curso ainda não possui vídeos.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {courseVideos.map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Materiais do Curso
          </h2>
          
          {courseFiles.length === 0 ? (
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-blue-600">
                Este curso ainda não possui arquivos.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {courseFiles.map(file => (
                <FileCard key={file.id} file={file} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;