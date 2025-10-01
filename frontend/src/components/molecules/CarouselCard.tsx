import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Star, Users } from 'lucide-react';
import type { Recipe } from '../../types';

interface CarouselCardProps {
  recipe: Recipe;
  index: number;
}

export function CarouselCard({ recipe, index }: CarouselCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex-shrink-0 w-80"
    >
      <Link to={`/recipes/${recipe.id}`} className="group block">
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group-hover:border-orange-200 dark:group-hover:border-orange-800">
          {/* Image */}
          <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 overflow-hidden">
            {recipe.imageUrl ? (
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 bg-orange-200 dark:bg-orange-800 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🍽️</span>
                </div>
              </div>
            )}
            
            {/* Difficulty badge */}
            <div className="absolute top-3 left-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                recipe.difficulty === 'EASY' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : recipe.difficulty === 'MEDIUM'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {recipe.difficulty === 'EASY' ? 'Easy' : 
                 recipe.difficulty === 'MEDIUM' ? 'Medium' : 'Hard'}
              </span>
            </div>

            {/* Rating badge */}
            {recipe.averageRating && (
              <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs font-medium text-gray-900 dark:text-white">
                  {recipe.averageRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
              {recipe.title}
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
              {recipe.description}
            </p>

            {/* Meta info */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{recipe.prepTime + recipe.cookTime} min</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{recipe.servings} servings</span>
              </div>
            </div>

            {/* Author */}
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                    {recipe.author.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {recipe.author.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}