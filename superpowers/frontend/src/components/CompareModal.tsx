import React from 'react';
import { CompareResult } from '../api/rest';

interface CompareModalProps {
  comparison: CompareResult['comparison'];
  onClose: () => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({ comparison, onClose }) => {
  const stats = ['intelligence', 'strength', 'speed', 'durability', 'power', 'combat'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Power Comparison</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Winner Announcement */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg p-6 mb-6 text-center">
            <p className="text-sm text-gray-800 mb-2">WINNER</p>
            <h3 className="text-4xl font-bold text-gray-900 mb-2">{comparison.winner.name}</h3>
            <p className="text-lg text-gray-800">
              Wins with {comparison.winPercentage}% power advantage
            </p>
            <p className="text-sm text-gray-700 mt-2">
              Power Difference: {comparison.powerDifference} points
            </p>
          </div>

          {/* Head to Head Comparison */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className={`p-4 rounded-lg ${comparison.winner.name === comparison.winner.name ? 'bg-green-100' : 'bg-gray-100'}`}>
                <p className="text-sm text-gray-600 mb-1">{comparison.winner.name}</p>
                <p className="text-3xl font-bold text-gray-900">{comparison.winner.totalPower}</p>
                <p className="text-xs text-gray-500">Total Power</p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <span className="text-4xl">⚔️</span>
            </div>

            <div className="text-center">
              <div className={`p-4 rounded-lg ${comparison.opponent.name === comparison.winner.name ? 'bg-green-100' : 'bg-gray-100'}`}>
                <p className="text-sm text-gray-600 mb-1">{comparison.opponent.name}</p>
                <p className="text-3xl font-bold text-gray-900">{comparison.opponent.totalPower}</p>
                <p className="text-xs text-gray-500">Total Power</p>
              </div>
            </div>
          </div>

          {/* Stat Breakdown */}
          <div className="mb-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Stat Breakdown</h4>
            <div className="space-y-4">
              {stats.map((stat) => {
                const breakdown = comparison.breakdown[stat];
                const isWinner = breakdown.winner === comparison.winner.name;
                const isTie = breakdown.winner === 'Tie';

                return (
                  <div key={stat} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold capitalize">{stat}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        isTie ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-800'
                      }`}>
                        {breakdown.winner}
                        {!isTie && ` +${breakdown.margin}`}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">{comparison.winner.name}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`${isWinner || isTie ? 'bg-green-500' : 'bg-red-500'} h-2 rounded-full`}
                              style={{ width: `${breakdown.winnerScore}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold">{breakdown.winnerScore}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{comparison.opponent.name}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`${!isWinner && !isTie ? 'bg-green-500' : 'bg-red-500'} h-2 rounded-full`}
                              style={{ width: `${breakdown.opponentScore}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold">{breakdown.opponentScore}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Analysis */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h4 className="font-bold text-blue-900 mb-2">Analysis</h4>
            <p className="text-blue-800">{comparison.analysis}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
