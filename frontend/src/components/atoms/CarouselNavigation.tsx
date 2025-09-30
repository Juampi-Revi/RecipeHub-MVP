import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselNavigationProps {
  onScrollLeft: () => void;
  onScrollRight: () => void;
}

export function CarouselNavigation({ onScrollLeft, onScrollRight }: CarouselNavigationProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onScrollLeft}
        className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>
      <button
        onClick={onScrollRight}
        className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>
    </div>
  );
}