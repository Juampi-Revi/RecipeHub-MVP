import { useRef } from 'react';
import type { Recipe } from '../../types';
import { CarouselHeader } from '../atoms/CarouselHeader';
import { CarouselNavigation } from '../atoms/CarouselNavigation';
import { CarouselCard } from './CarouselCard';
import { CarouselSkeleton } from '../atoms/CarouselSkeleton';

interface RecipeCarouselProps {
  title: string;
  subtitle?: string;
  recipes: Recipe[];
  isLoading?: boolean;
  viewAllLink?: string;
}

export function RecipeCarousel({ 
  title, 
  subtitle, 
  recipes, 
  isLoading = false,
  viewAllLink 
}: RecipeCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Width of one card plus gap
      const currentScroll = scrollRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <CarouselHeader 
            title={title} 
            subtitle={subtitle} 
            viewAllLink={viewAllLink}
            isLoading={true}
          >
            <CarouselNavigation 
              onScrollLeft={() => scroll('left')} 
              onScrollRight={() => scroll('right')} 
            />
          </CarouselHeader>
          <CarouselSkeleton />
        </div>
      </section>
    );
  }

  if (!recipes.length) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <CarouselHeader 
          title={title} 
          subtitle={subtitle} 
          viewAllLink={viewAllLink}
        >
          <CarouselNavigation 
            onScrollLeft={() => scroll('left')} 
            onScrollRight={() => scroll('right')} 
          />
        </CarouselHeader>

        {/* Carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {recipes.map((recipe, index) => (
              <CarouselCard 
                key={recipe.id}
                recipe={recipe}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}