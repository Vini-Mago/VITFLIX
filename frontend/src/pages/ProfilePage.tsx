import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import CourseCard from '../components/CourseCard';
import { User, LogOut } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { courses, videos, files } = useData();
  const [activeTab, setActiveTab] = useState('profile');
  
  if (!user) {
    return null;
  }
  
  // Get enrolled courses
  const enrolledCourses = courses.filter(course => 
    user.enrolledCourses.includes(course.id)
  );
  
  // Get video and file counts for each course
  const getVideoCount = (courseId: string) => {
    return videos.filter(video => video.courseId === courseId).length;
  };
  
  const getFileCount = (courseId: string) => {
    return files.filter(file => file.courseId === courseId).length;
  };
  
  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-gray-400" />
              )}
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h1>
              <p className="text-gray-600 mb-2">{user.email}</p>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {user.role === 'admin' ? 'Administrador' : 'Aluno'}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                  {enrolledCourses.length} cursos inscritos
                </span>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </button>
          </div>
        </div>
        
        <div className="border-t border-gray-100">
          <div className="flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-3 text-center font-medium text-sm ${
                activeTab === 'profile' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Perfil
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex-1 py-3 text-center font-medium text-sm ${
                activeTab === 'courses' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Meus Cursos
            </button>
          </div>
        </div>
      </div>
      
      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Informações da Conta</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <div className="p-2 bg-gray-50 rounded-md text-gray-800 border border-gray-200">
                {user.name}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="p-2 bg-gray-50 rounded-md text-gray-800 border border-gray-200">
                {user.email}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Conta
              </label>
              <div className="p-2 bg-gray-50 rounded-md text-gray-800 border border-gray-200">
                {user.role === 'admin' ? 'Administrador' : 'Aluno'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Registro
              </label>
              <div className="p-2 bg-gray-50 rounded-md text-gray-800 border border-gray-200">
                {new Date(user.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'courses' && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Meus Cursos</h2>
          
          {enrolledCourses.length === 0 ? (
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-blue-600">
                Você ainda não está inscrito em nenhum curso.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map(course => (
                <CourseCard 
                  key={course.id} 
                  course={course}
                  videoCount={getVideoCount(course.id)}
                  fileCount={getFileCount(course.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;