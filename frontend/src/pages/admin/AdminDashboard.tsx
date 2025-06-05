import React from 'react';
import { useData } from '../../hooks/useData';
import { Users, Film, FolderOpen, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { categories, courses, videos, files } = useData();
  
  const stats = [
    {
      label: 'Categorias',
      value: categories.length,
      icon: <FolderOpen className="h-8 w-8 text-blue-500" />,
      link: '/admin/categorias',
      color: 'bg-blue-50',
    },
    {
      label: 'Cursos',
      value: courses.length,
      icon: <Film className="h-8 w-8 text-green-500" />,
      link: '/admin/cursos',
      color: 'bg-green-50',
    },
    {
      label: 'Vídeos',
      value: videos.length,
      icon: <Film className="h-8 w-8 text-orange-500" />,
      link: '/admin/cursos',
      color: 'bg-orange-50',
    },
    {
      label: 'Arquivos',
      value: files.length,
      icon: <FileText className="h-8 w-8 text-purple-500" />,
      link: '/admin/cursos',
      color: 'bg-purple-50',
    },
  ];
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Painel Administrativo</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className={`${stat.color} p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center">
              <div className="mr-4">
                {stat.icon}
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-900">{stat.value}</h2>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Categorias Recentes</h2>
          
          {categories.length === 0 ? (
            <p className="text-gray-500">Nenhuma categoria cadastrada</p>
          ) : (
            <div className="space-y-3">
              {categories.slice(0, 5).map(category => (
                <Link
                  key={category.id}
                  to="/admin/categorias"
                  className="flex items-center p-3 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden mr-3 flex-shrink-0">
                    <img 
                      src={category.imageUrl} 
                      alt={category.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{category.title}</h3>
                    <p className="text-sm text-gray-500">
                      {category.courseIds.length} cursos
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <Link
            to="/admin/categorias"
            className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark"
          >
            Ver todas categorias →
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Cursos Recentes</h2>
          
          {courses.length === 0 ? (
            <p className="text-gray-500">Nenhum curso cadastrado</p>
          ) : (
            <div className="space-y-3">
              {courses.slice(0, 5).map(course => (
                <Link
                  key={course.id}
                  to="/admin/cursos"
                  className="flex items-center p-3 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden mr-3 flex-shrink-0">
                    <img 
                      src={course.imageUrl} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-500">
                      {course.videoIds.length} vídeos, {course.fileIds.length} arquivos
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <Link
            to="/admin/cursos"
            className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark"
          >
            Ver todos cursos →
          </Link>
        </div>
      </div>
      
      <div className="mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-2">Instruções de Uso</h2>
        <p className="opacity-90 mb-4">
          Esta é uma plataforma simples de gerenciamento de cursos online. Comece adicionando categorias,
          depois crie cursos dentro dessas categorias, e finalmente adicione vídeos e arquivos aos cursos.
        </p>
        <p className="opacity-90">
          Todos os dados são armazenados localmente no navegador usando localStorage.
          Não é necessário configurar um banco de dados.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;