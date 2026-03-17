import React from "react";
import { TriageResult } from "../data/triageEngine";

interface TriageCardProps {
  results: TriageResult[];
}

const urgencyConfig = {
  1: { bg: "bg-green-50", border: "border-green-300", badge: "bg-green-100 text-green-800", icon: "✅", dot: "bg-green-500" },
  2: { bg: "bg-yellow-50", border: "border-yellow-300", badge: "bg-yellow-100 text-yellow-800", icon: "⚠️", dot: "bg-yellow-500" },
  3: { bg: "bg-orange-50", border: "border-orange-300", badge: "bg-orange-100 text-orange-800", icon: "🔶", dot: "bg-orange-500" },
  4: { bg: "bg-red-50", border: "border-red-300", badge: "bg-red-100 text-red-800", icon: "🔴", dot: "bg-red-500" },
  5: { bg: "bg-purple-50", border: "border-purple-300", badge: "bg-purple-100 text-purple-900", icon: "🚨", dot: "bg-purple-600" },
};

const TriageCard: React.FC<TriageCardProps> = ({ results }) => {
  if (!results || results.length === 0) return null;
  const top = results[0];
  const config = urgencyConfig[top.rule.urgencyLevel];

  return (
    <div className={`mt-3 rounded-xl border-2 ${config.border} ${config.bg} overflow-hidden shadow-sm`}>
      {/* Header */}
      <div className={`px-4 py-2 flex items-center gap-2 border-b ${config.border}`}>
        <span className="text-lg">{config.icon}</span>
        <span className="font-bold text-sm text-gray-800">Analyse du Triage Médical</span>
        <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${config.badge}`}>
          {top.rule.urgencyLabel}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Disease */}
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Condition probable</p>
          <p className="text-sm font-bold text-gray-900">{top.rule.disease}</p>
        </div>

        {/* Matched symptoms */}
        {top.matchedSymptoms.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">Symptômes détectés</p>
            <div className="flex flex-wrap gap-1">
              {top.matchedSymptoms.map((s) => (
                <span key={s} className="text-xs bg-white border border-gray-200 rounded-full px-2 py-0.5 text-gray-700">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action */}
        <div className={`rounded-lg p-3 ${config.bg} border ${config.border}`}>
          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">Action recommandée</p>
          <p className="text-sm font-medium text-gray-900">{top.rule.action}</p>
        </div>

        {/* Recommendation */}
        <p className="text-xs text-gray-600 italic">{top.rule.recommendation}</p>

        {/* Score bar */}
        <div>
          <div className="flex justify-between mb-1">
            <p className="text-xs text-gray-400">Correspondance</p>
            <p className="text-xs text-gray-500 font-medium">{Math.round(top.matchScore * 100)}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${config.dot}`}
              style={{ width: `${Math.round(top.matchScore * 100)}%` }}
            />
          </div>
        </div>

        {/* Other results */}
        {results.length > 1 && (
          <div className="pt-1 border-t border-gray-200">
            <p className="text-xs text-gray-400 mb-1">Autres conditions possibles</p>
            {results.slice(1).map((r) => (
              <div key={r.rule.id} className="flex items-center gap-2 py-1">
                <span className={`w-2 h-2 rounded-full ${urgencyConfig[r.rule.urgencyLevel].dot}`} />
                <p className="text-xs text-gray-600">{r.rule.disease}</p>
                <span className={`ml-auto text-xs px-1.5 rounded ${urgencyConfig[r.rule.urgencyLevel].badge}`}>
                  {r.rule.urgencyLabel}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TriageCard;
