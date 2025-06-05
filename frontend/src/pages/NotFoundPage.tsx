import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">Página Não Encontrada</h2>
        <p className="text-gray-600 mb-8">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors"
        >
          <Home className="h-5 w-5 mr-2" />
          Voltar para a Página Inicial
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;