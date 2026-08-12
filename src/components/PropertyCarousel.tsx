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
    <section className="py-8 border-b border-slate-200/60 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Carousel Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#102033] tracking-tight">
                {title}
              </h2>
              {badge && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#167A5A] border border-emerald-200 text-[11px] font-bold">
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
                className="text-xs font-bold text-[#102033] hover:text-[#167A5A] flex items-center gap-1 mr-2 transition-colors cursor-pointer"
              >
                <span>View All ({properties.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleScroll('left')}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200/80 active:scale-95 cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200/80 active:scale-95 cursor-pointer"
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
