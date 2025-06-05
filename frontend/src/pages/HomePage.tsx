import React from 'react';
import { useData } from '../hooks/useData';
import CategoryCard from '../components/CategoryCard';

const HomePage: React.FC = () => {
  const { categories, courses, loading, error } = useData();
  
  // Get course count for each category
  const getCourseCount = (categoryId: string) => {
    return courses.filter(course => course.categoryId === categoryId).length;
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
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo à EduFlix</h1>
        <p className="text-gray-600">
          Explore nossas categorias de cursos e comece a aprender
        </p>
      </div>
      
      {categories.length === 0 ? (
        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-blue-600">
            Não há categorias disponíveis no momento. O administrador precisa adicionar conteúdo.
          </p>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Categorias Disponíveis</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(category => (
              <CategoryCard 
                key={category.id} 
                category={category}
                courseCount={getCourseCount(category.id)}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Recent or featured courses section */}
      {courses.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Cursos em Destaque</h2>
          
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white mb-6">
            <h3 className="text-2xl font-bold mb-2">
              {courses[0].title}
            </h3>
            <p className="mb-4 opacity-90">{courses[0].description}</p>
            <a 
              href={`/curso/${courses[0].id}`}
              className="inline-block bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors"
            >
              Ver Curso
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;