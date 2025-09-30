import { useRecipes } from '../hooks/useRecipes';
import { FeaturedRecipeCard } from '../components/molecules/FeaturedRecipeCard';
import { SearchSection } from '../components/molecules/SearchSection';
import { FeaturesSection } from '../components/organisms/FeaturesSection';
import { CTASection } from '../components/molecules/CTASection';
import { QuickRecipesGrid } from '../components/organisms/QuickRecipesGrid';

export function HomePage() {
  const { data: recipesData } = useRecipes({ page: 1, limit: 6 });

  const featuredRecipe = recipesData?.recipes?.[0];

  return (
    <div className="min-h-screen">
      {/* Featured Recipe Section */}
      {featuredRecipe && <FeaturedRecipeCard recipe={featuredRecipe} />}

      {/* Search Section */}
      <SearchSection />

      {/* Quick Recipes Grid */}
      {recipesData?.recipes && <QuickRecipesGrid recipes={recipesData.recipes} />}

      {/* Features Section */}
      <FeaturesSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}