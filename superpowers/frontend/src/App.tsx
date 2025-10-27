import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { SEARCH_CHARACTERS, GET_CHARACTER } from './graphql/queries';
import { CharacterCard } from './components/CharacterCard';
import { CharacterDetail } from './components/CharacterDetail';
import { CompareModal } from './components/CompareModal';
import { compareCharacters, CompareResult } from './api/rest';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [alignment, setAlignment] = useState('');
  const [sortBy, setSortBy] = useState('NAME_ASC');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [comparison, setComparison] = useState<CompareResult['comparison'] | null>(null);

  // Search characters query
  const { data, loading, error } = useQuery(SEARCH_CHARACTERS, {
    variables: {
      searchTerm: searchTerm || null,
      alignment: alignment || null,
      sortBy,
      limit: 50,
      offset: 0,
    },
  });

  // Get character details query
  const { data: characterData } = useQuery(GET_CHARACTER, {
    variables: { id: selectedCharacterId },
    skip: !selectedCharacterId,
  });

  const handleSelectForComparison = (id: string) => {
    setSelectedForComparison((prev) => {
      if (prev.includes(id)) {
        return prev.filter((charId) => charId !== id);
      } else if (prev.length < 2) {
        return [...prev, id];
      } else {
        // Replace the first selection
        return [prev[1], id];
      }
    });
  };

  const handleCompare = async () => {
    if (selectedForComparison.length === 2) {
      try {
        const result = await compareCharacters(selectedForComparison as [string, string]);
        setComparison(result.comparison);
      } catch (err) {
        console.error('Failed to compare characters:', err);
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-choco-primary to-choco-navy mb-4">
            ⚡ Superpowers
          </h1>
          <p className="text-gray-600 mb-4">Compare character abilities and discover who's the strongest!</p>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search characters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-choco-primary"
            />

            <select
              value={alignment}
              onChange={(e) => setAlignment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-choco-primary"
            >
              <option value="">All Alignments</option>
              <option value="good">Good</option>
              <option value="bad">Bad</option>
              <option value="neutral">Neutral</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-choco-primary"
            >
              <option value="NAME_ASC">Name (A-Z)</option>
              <option value="NAME_DESC">Name (Z-A)</option>
              <option value="POWER_DESC">Power (High-Low)</option>
              <option value="POWER_ASC">Power (Low-High)</option>
            </select>

            <button
              onClick={handleCompare}
              disabled={selectedForComparison.length !== 2}
              style={selectedForComparison.length === 2 ? { backgroundColor: '#3D6BFF' } : {}}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedForComparison.length === 2
                  ? 'hover:opacity-90 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Compare Selected ({selectedForComparison.length}/2)
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-choco-primary to-choco-navy rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="text-white max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">Explore Superpowers</h2>
              <p className="text-choco-accent text-lg mb-4">
                Discover 50 iconic heroes, villains, and antiheroes from Marvel and DC. Compare their abilities, view detailed stats,
                and find out who would win in an epic battle!
              </p>
              <div className="flex gap-4 text-sm">
                <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-lg">
                  <span className="font-bold text-xl">{data?.searchCharacters.totalCount || 50}</span>
                  <span className="text-choco-accent ml-2">Characters</span>
                </div>
                <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-lg">
                  <span className="font-bold text-xl">Marvel & DC</span>
                  <span className="text-choco-accent ml-2">Universes</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex gap-6 text-6xl">
              <div className="text-center">
                <div>⭐</div>
                <div className="text-xs text-choco-accent mt-2">Heroes</div>
              </div>
              <div className="text-center">
                <div>💀</div>
                <div className="text-xs text-choco-accent mt-2">Villains</div>
              </div>
              <div className="text-center">
                <div>⚖️</div>
                <div className="text-xs text-choco-accent mt-2">Neutral</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-8">
        {loading && (
          <div className="text-center text-white text-xl">Loading characters...</div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error loading characters: {error.message}
          </div>
        )}

        {data && (
          <>
            <div className="mb-6 text-white">
              <p className="text-lg">
                Found <span className="font-bold">{data.searchCharacters.totalCount}</span> characters
              </p>
            </div>

            {/* List View */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Character
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Publisher
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Alignment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Power
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.searchCharacters.characters.map((character: any) => {
                    // Get icon based on alignment only
                    const getIcon = () => {
                      const alignment = character.biography.alignment;

                      if (alignment === 'good') return '⭐';
                      if (alignment === 'bad') return '💀';
                      return '⚖️';
                    };

                    return (
                    <tr key={character.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getIcon()}</span>
                          <div className="text-sm font-medium text-gray-900">{character.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{character.biography.publisher || 'Unknown'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          character.biography.alignment === 'good' ? 'bg-green-100 text-green-800' :
                          character.biography.alignment === 'bad' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {character.biography.alignment}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-choco-primary">{character.totalPower}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => setSelectedCharacterId(character.id)}
                          className="text-choco-primary hover:text-choco-navy font-semibold"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleSelectForComparison(character.id)}
                          className={`font-semibold ${
                            selectedForComparison.includes(character.id)
                              ? 'text-choco-navy hover:text-choco-purple'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          {selectedForComparison.includes(character.id) ? '✓ Selected' : 'Compare'}
                        </button>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {/* Character Detail Modal */}
      {characterData && characterData.getCharacter && (
        <CharacterDetail
          character={characterData.getCharacter}
          onClose={() => setSelectedCharacterId(null)}
        />
      )}

      {/* Comparison Modal */}
      {comparison && (
        <CompareModal
          comparison={comparison}
          onClose={() => {
            setComparison(null);
            setSelectedForComparison([]);
          }}
        />
      )}

      {/* Footer */}
      <footer className="bg-white mt-12 py-6 text-center text-gray-600">
        <p>Built with ⚡ by <span className="font-bold text-choco-primary">Anaïs van Asselt</span> at <span className="font-bold text-choco-primary">Choco</span> for API Test Automation Workshops</p>
      </footer>
    </div>
  );
}

export default App;
