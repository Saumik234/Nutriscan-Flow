import React from 'react';
import { SupplementData } from '../types';
import { ChevronDown, AlertTriangle, CheckCircle, Activity, BookOpen, ShieldCheck } from 'lucide-react';

interface Props {
  data: SupplementData;
  onClose?: () => void;
}

const SupplementDetail: React.FC<Props> = ({ data, onClose }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mb-6 animate-fade-in-up">
      <div className="bg-emerald-600 p-4 text-white flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold">{data.productName}</h2>
          <p className="text-emerald-100 text-sm">{data.brand}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white hover:bg-emerald-700 p-1 rounded">
            <ChevronDown size={24} />
          </button>
        )}
      </div>

      <div className="p-5 space-y-6">
        {/* Verdict Badge */}
        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
          <h3 className="text-sm font-semibold text-emerald-800 uppercase tracking-wide mb-1">Our Verdict</h3>
          <p className="text-gray-700">{data.overallVerdict}</p>
        </div>

        {/* Ingredients Table */}
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
            <Activity className="text-emerald-500" size={20} /> Key Ingredients
          </h3>
          <div className="space-y-3">
            {data.ingredients.map((ing, idx) => (
              <div key={idx} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-800">{ing.name}</span>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      ing.efficacyRating.toLowerCase().includes('high') ? 'bg-green-100 text-green-700' :
                      ing.efficacyRating.toLowerCase().includes('moderate') ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {ing.efficacyRating} Efficacy
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      ing.safetyRating.toLowerCase().includes('safe') ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {ing.safetyRating}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{ing.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scientific Research */}
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-2">
            <BookOpen className="text-blue-500" size={20} /> Science & Evidence
          </h3>
          <div className="text-sm text-gray-600 leading-relaxed bg-blue-50 p-4 rounded-lg">
             <p className="mb-2"><span className="font-semibold text-blue-900">Research Backing:</span> {data.scientificResearch}</p>
             <p><span className="font-semibold text-blue-900">Quality of Evidence:</span> {data.qualityAssessment}</p>
          </div>
        </div>

        {/* Safety & Dosage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
             <h3 className="flex items-center gap-2 font-semibold text-red-800 mb-2">
               <AlertTriangle size={18} /> Safety & Interactions
             </h3>
             <p className="text-sm text-gray-700">{data.safetyConsiderations}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
             <h3 className="flex items-center gap-2 font-semibold text-purple-800 mb-2">
               <ShieldCheck size={18} /> Recommended Dosage
             </h3>
             <p className="text-sm text-gray-700">{data.recommendedDosage}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SupplementDetail;
