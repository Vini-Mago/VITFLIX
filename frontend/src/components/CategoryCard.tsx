import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  courseCount: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, courseCount }) => {
  return (
    <Link 
      to={`/categoria/${category.id}`}
      className="card group transform hover:scale-105 transition-transform duration-300 animate-fade-in"
    >
      <div className="h-40 relative overflow-hidden rounded-t-lg">
        <img 
          src={category.imageUrl} 
          alt={category.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <h3 className="text-white font-bold text-xl p-4">{category.title}</h3>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{category.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-primary">
            {courseCount} {courseCount === 1 ? 'curso' : 'cursos'}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            Ver cursos
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;