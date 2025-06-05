import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import CourseCard from '../components/CourseCard';
import { ChevronLeft } from 'lucide-react';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { categories, courses, videos, files, loading, error } = useData();
  
  // Find the category
  const category = categories.find(cat => cat.id === categoryId);
  
  // Get courses for this category
  const categoryCourses = courses.filter(course => course.categoryId === categoryId);
  
  // Get video and file counts for each course
  const getVideoCount = (courseId: string) => {
    return videos.filter(video => video.courseId === courseId).length;
  };
  
  const getFileCount = (courseId: string) => {
    return files.filter(file => file.courseId === courseId).length;
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
  
  if (!category) {
    return (
      <div className="bg-yellow-50 text-yellow-600 p-4 rounded-md">
        <p>Categoria não encontrada</p>
        <Link to="/" className="text-primary font-medium mt-2 inline-block">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Voltar para categorias
      </Link>
      
      <div className="rounded-xl overflow-hidden mb-8 relative h-48 md:h-64">
        <img 
          src={category.imageUrl} 
          alt={category.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
          <h1 className="text-3xl font-bold text-white mb-2">{category.title}</h1>
          <p className="text-white/90 max-w-2xl">{category.description}</p>
        </div>
      </div>
      
      {categoryCourses.length === 0 ? (
        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-blue-600">
            Não há cursos disponíveis nesta categoria ainda.
          </p>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Cursos em {category.title}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryCourses.map(course => (
              <CourseCard 
                key={course.id} 
                course={course}
                videoCount={getVideoCount(course.id)}
                fileCount={getFileCount(course.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;