import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Users, Star, ArrowRight, Clock } from 'lucide-react';
// Using real food images from Unsplash
const heroCookingImg = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
const communitySharingImg = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';

export function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="relative bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 lg:py-24 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left Content */}
            <motion.div 
              className="text-center lg:text-left space-y-8"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-4">
                <motion.h1 
                  className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {t('home.heroTitle')}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 mt-2">
                    {t('home.heroSubtitle')}
                  </span>
                </motion.h1>
                
                <motion.p 
                  className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  {t('home.heroDescription')}
                </motion.p>
              </div>
              
              {/* Stats */}
              <motion.div 
                className="flex flex-wrap justify-center lg:justify-start gap-6 lg:gap-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="text-2xl lg:text-3xl font-bold text-orange-500">1000+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('home.stats.recipes')}</div>
                </div>
                <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="text-2xl lg:text-3xl font-bold text-red-500">500+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('home.stats.chefs')}</div>
                </div>
                <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="text-2xl lg:text-3xl font-bold text-yellow-500">4.9★</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('home.stats.rating')}</div>
                </div>
              </motion.div>
              
              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                <Link
                  to="/register"
                  className="group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2"
                >
                  <ChefHat className="w-5 h-5 group-hover:animate-bounce" />
                  {t('nav.signUp')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/recipes"
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-lg"
                >
                  {t('nav.browseRecipes')}
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Right Content - Food Images */}
            <motion.div 
              className="relative flex justify-center"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative w-full max-w-lg">
                {/* Main Food Image */}
                <motion.div 
                  className="relative z-20"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src={heroCookingImg} 
                    alt="Delicious pizza with fresh ingredients" 
                    className="w-full h-auto drop-shadow-2xl rounded-3xl"
                  />
                </motion.div>
                
                {/* Secondary Food Image */}
                <motion.div 
                  className="absolute -bottom-8 -right-8 z-10 w-3/5"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <img 
                    src={communitySharingImg} 
                    alt="Beautiful food preparation and cooking" 
                    className="w-full h-auto drop-shadow-xl rounded-2xl"
                  />
                </motion.div>
                
                {/* Floating Rating Badge */}
                <motion.div 
                  className="absolute top-4 -left-4 z-30 bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-xl border border-gray-100 dark:border-gray-700"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="font-bold text-xl text-gray-900 dark:text-white">4.9</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{t('home.badges.newRecipe')}</p>
                </motion.div>
                
                {/* Floating Community Badge */}
                <motion.div 
                  className="absolute bottom-16 -left-6 z-30 bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-xl border border-gray-100 dark:border-gray-700"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.4 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-orange-500" />
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{t('home.badges.activeCommunity')}</span>
                  </div>
                  <div className="flex -space-x-1">
                    <div className="w-5 h-5 bg-orange-500 rounded-full border-2 border-white"></div>
                    <div className="w-5 h-5 bg-red-500 rounded-full border-2 border-white"></div>
                    <div className="w-5 h-5 bg-yellow-500 rounded-full border-2 border-white"></div>
                    <div className="w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-xs text-white font-bold">+</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('features.whyChoose')}
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300">
              {t('features.everythingYouNeed')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: ChefHat,
                title: t('features.expertRecipes.title'),
                description: t('features.expertRecipes.description'),
                color: "orange"
              },
              {
                icon: Clock,
                title: t('features.quickCooking.title'),
                description: t('features.quickCooking.description'),
                color: "red"
              },
              {
                icon: Users,
                title: t('features.community.title'),
                description: t('features.community.description'),
                color: "green"
              },
              {
                icon: Star,
                title: t('features.ratedReviewed.title'),
                description: t('features.ratedReviewed.description'),
                color: "yellow"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                  <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center ${
                    feature.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30' :
                    feature.color === 'red' ? 'bg-red-100 dark:bg-red-900/30' :
                    feature.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                    'bg-yellow-100 dark:bg-yellow-900/30'
                  }`}>
                    <feature.icon className={`w-8 h-8 ${
                      feature.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                      feature.color === 'red' ? 'text-red-600 dark:text-red-400' :
                      feature.color === 'green' ? 'text-green-600 dark:text-green-400' :
                      'text-yellow-600 dark:text-yellow-400'
                    }`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-orange-500 via-red-500 to-red-600 dark:from-orange-700 dark:via-red-700 dark:to-red-800 relative overflow-hidden">
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              {t('home.cta.readyToCook')}
            </h2>
            <p className="text-lg lg:text-xl text-orange-100 mb-10 max-w-2xl mx-auto">
              {t('home.cta.joinCommunity')}
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-3 bg-white text-orange-600 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 group"
            >
              <ChefHat className="w-6 h-6 group-hover:animate-bounce" />
              {t('home.cta.getStartedToday')}
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}