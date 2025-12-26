import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { searchSupplementDatabase } from '../services/geminiService';
import { SupplementData } from '../types';
import SupplementDetail from './SupplementDetail';

const SupplementSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SupplementData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setSearched(true);
    setResults([]); // Clear previous

    try {
      const data = await searchSupplementDatabase(query);
      setResults(data);
    } catch (error) {
      console.error("Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Supplement Database</h2>
        <p className="text-gray-500">Search by product name, brand, or ingredient for science-based reviews.</p>
      </div>

      <form onSubmit={handleSearch} className="mb-8 relative">
        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Creatine Monohydrate, Optimum Nutrition Whey..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
        />
        <button 
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-2 bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-70"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
          <p className="text-gray-500 text-sm">Analyzing scientific literature...</p>
        </div>
      )}

      {!isLoading && searched && results.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
           <p className="text-gray-500">No supplements found matching your search.</p>
        </div>
      )}

      <div className="space-y-6">
        {results.map((item, index) => (
          <SupplementDetail key={index} data={item} />
        ))}
      </div>
    </div>
  );
};

export default SupplementSearch;
