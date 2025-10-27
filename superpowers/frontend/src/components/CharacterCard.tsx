import React from 'react';

interface Character {
  id: string;
  name: string;
  totalPower: number;
  image: {
    url: string;
  };
  biography: {
    alignment: string;
    publisher: string | null;
  };
}

interface CharacterCardProps {
  character: Character;
  onViewDetails: (id: string) => void;
  onSelectForComparison?: (id: string) => void;
  isSelected?: boolean;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onViewDetails,
  onSelectForComparison,
  isSelected = false,
}) => {
  const alignmentColors = {
    good: 'bg-hero-good',
    bad: 'bg-hero-bad',
    neutral: 'bg-hero-neutral',
  };

  const alignmentColor = alignmentColors[character.biography.alignment as keyof typeof alignmentColors] || 'bg-gray-500';

  return (
    <div
      className={`bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-200 hover:scale-105 ${
        isSelected ? 'ring-4 ring-yellow-400' : ''
      }`}
    >
      <div className="relative">
        <img
          src={character.image.url}
          alt={character.name}
          className="w-full h-64 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=No+Image';
          }}
        />
        <div className={`absolute top-2 right-2 ${alignmentColor} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
          {character.biography.alignment}
        </div>
        <div className="absolute bottom-2 left-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
          ⚡ {character.totalPower}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{character.name}</h3>
        {character.biography.publisher && (
          <p className="text-sm text-gray-600 mb-3">{character.biography.publisher}</p>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(character.id)}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            View Details
          </button>
          {onSelectForComparison && (
            <button
              onClick={() => onSelectForComparison(character.id)}
              className={`flex-1 font-semibold py-2 px-4 rounded transition-colors ${
                isSelected
                  ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {isSelected ? 'Selected' : 'Compare'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
