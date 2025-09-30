import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Users, Star, Clock, Heart, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Recipe } from '../../types';

interface FeaturedRecipeCardProps {
  recipe: Recipe;
}

export function FeaturedRecipeCard({ recipe }: FeaturedRecipeCardProps) {
  const { t } = useTranslation();

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('home.featured.title', 'Featured Recipe')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('home.featured.subtitle', 'Discover the most popular recipe from our community')}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Recipe Image */}
              <div className="relative h-64 lg:h-96 bg-gradient-to-br from-orange-400 to-red-500">
                {recipe.imageUrl ? (
                  <img 
                    src={recipe.imageUrl} 
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ChefHat className="w-20 h-20 text-white opacity-50" />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-full px-3 py-1 flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {recipe.averageRating?.toFixed(1) || '5.0'}
                  </span>
                </div>
              </div>
              
              {/* Recipe Content */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                      {recipe.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 px-3 py-2 rounded-full">
                      <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <span className="text-orange-800 dark:text-orange-200">
                        {recipe.cookTime} min
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-full">
                      <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-green-800 dark:text-green-200">
                        {recipe.servings} {t('recipe.servings', 'servings')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-3 py-2 rounded-full">
                      <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-blue-800 dark:text-blue-200 capitalize">
                        {recipe.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Link
                      to={`/recipes/${recipe.id}`}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold text-center transition-all duration-300 transform hover:scale-105"
                    >
                      {t('home.featured.viewRecipe', 'View Recipe')}
                    </Link>
                    <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-xl transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}