import React from 'react';

interface CharacterDetailProps {
  character: {
    id: string;
    name: string;
    totalPower: number;
    image: {
      url: string;
    };
    powerstats: {
      intelligence: string;
      strength: string;
      speed: string;
      durability: string;
      power: string;
      combat: string;
    };
    biography: {
      fullName: string;
      aliases: string[];
      placeOfBirth: string;
      alignment: string;
      publisher: string | null;
      firstAppearance: string;
    };
    appearance: {
      gender: string;
      race: string | null;
      height: string[];
      weight: string[];
    };
    work: {
      occupation: string;
      base: string;
    };
  };
  onClose: () => void;
}

export const CharacterDetail: React.FC<CharacterDetailProps> = ({ character, onClose }) => {
  const stats = [
    { name: 'Intelligence', value: parseInt(character.powerstats.intelligence) || 0, bgColor: '#3D6BFF' },
    { name: 'Strength', value: parseInt(character.powerstats.strength) || 0, bgColor: '#0B145B' },
    { name: 'Speed', value: parseInt(character.powerstats.speed) || 0, bgColor: '#C0D5FF' },
    { name: 'Durability', value: parseInt(character.powerstats.durability) || 0, bgColor: '#AFC9FF' },
    { name: 'Power', value: parseInt(character.powerstats.power) || 0, bgColor: '#3F2665' },
    { name: 'Combat', value: parseInt(character.powerstats.combat) || 0, bgColor: '#3D6BFF' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{character.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Image and Basic Info */}
            <div>
              <img
                src={character.image.url}
                alt={character.name}
                className="w-full rounded-lg shadow-lg mb-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x600?text=No+Image';
                }}
              />
              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">Biography</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-semibold">Full Name:</span> {character.biography.fullName}</p>
                  <p><span className="font-semibold">Alignment:</span> {character.biography.alignment}</p>
                  {character.biography.publisher && (
                    <p><span className="font-semibold">Publisher:</span> {character.biography.publisher}</p>
                  )}
                  <p><span className="font-semibold">Place of Birth:</span> {character.biography.placeOfBirth}</p>
                  <p><span className="font-semibold">First Appearance:</span> {character.biography.firstAppearance}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Stats and Details */}
            <div className="space-y-4">
              <div className="bg-choco-lightBlue/30 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Total Power</p>
                <p className="text-4xl font-bold text-choco-primary">{character.totalPower}</p>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-3">Power Stats</h3>
                <div className="space-y-3">
                  {stats.map((stat) => (
                    <div key={stat.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold">{stat.name}</span>
                        <span className="text-gray-600">{stat.value}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all duration-500"
                          style={{ width: `${stat.value}%`, backgroundColor: stat.bgColor }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">Appearance</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="font-semibold">Gender:</p>
                    <p>{character.appearance.gender}</p>
                  </div>
                  {character.appearance.race && (
                    <div>
                      <p className="font-semibold">Race:</p>
                      <p>{character.appearance.race}</p>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">Height:</p>
                    <p>{character.appearance.height.join(', ')}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Weight:</p>
                    <p>{character.appearance.weight.join(', ')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">Work</h3>
                <div className="text-sm space-y-1">
                  <p><span className="font-semibold">Occupation:</span> {character.work.occupation}</p>
                  <p><span className="font-semibold">Base:</span> {character.work.base}</p>
                </div>
              </div>

              {character.biography.aliases && character.biography.aliases.length > 0 && (
                <div className="bg-gray-100 rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-2">Aliases</h3>
                  <div className="flex flex-wrap gap-2">
                    {character.biography.aliases.map((alias, idx) => (
                      <span
                        key={idx}
                        className="bg-white px-3 py-1 rounded-full text-sm text-gray-700"
                      >
                        {alias}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
