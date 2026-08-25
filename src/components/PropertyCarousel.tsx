import React, { useRef } from 'react';
import { Property, CurrencyCode } from '../types';
import { PropertyCard } from './PropertyCard';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface PropertyCarouselProps {
  title: string;
  badge?: string;
  description?: string;
  properties: Property[];
  currency: CurrencyCode;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onViewCategoryAll?: () => void;
}

export const PropertyCarousel: React.FC<PropertyCarouselProps> = ({
  title,
  badge,
  description,
  properties,
  currency,
  savedIds,
  onToggleSave,
  onSelectProperty,
  onViewCategoryAll,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (properties.length === 0) {
    return null;
  }

  return (
    <section className="py-8 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Carousel Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {title}
              </h2>
              {badge && (
                <span className="px-3 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-[11px] font-extrabold tracking-wide">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl font-medium">
                {description}
              </p>
            )}
          </div>

          {/* Controls & View All */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {onViewCategoryAll && (
              <button
                onClick={onViewCategoryAll}
                className="text-xs font-bold text-slate-900 hover:text-slate-700 flex items-center gap-1 mr-2 transition-colors cursor-pointer"
              >
                <span>View All ({properties.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleScroll('left')}
                className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 transition-all border border-slate-200 shadow-xs active:scale-95 cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 transition-all border border-slate-200 shadow-xs active:scale-95 cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Horizontal Scroll Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto pb-4 pt-1 custom-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {properties.map((property) => (
            <div key={property.id} className="snap-start flex-shrink-0">
              <PropertyCard
                property={property}
                currency={currency}
                isSaved={savedIds.includes(property.id)}
                onToggleSave={onToggleSave}
                onSelectProperty={onSelectProperty}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
