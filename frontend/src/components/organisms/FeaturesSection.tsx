import { motion } from 'framer-motion';
import { ChefHat, Clock, Users, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FeatureCard } from '../atoms/FeatureCard';

export function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: ChefHat,
      title: t('features.expertRecipes.title'),
      description: t('features.expertRecipes.description'),
      color: "orange" as const
    },
    {
      icon: Clock,
      title: t('features.quickCooking.title'),
      description: t('features.quickCooking.description'),
      color: "red" as const
    },
    {
      icon: Users,
      title: t('features.community.title'),
      description: t('features.community.description'),
      color: "green" as const
    },
    {
      icon: Star,
      title: t('features.ratedReviewed.title'),
      description: t('features.ratedReviewed.description'),
      color: "yellow" as const
    }
  ];

  return (
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
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}