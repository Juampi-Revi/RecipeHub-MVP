import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function CTASection() {
  const { t } = useTranslation();

  return (
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
  );
}