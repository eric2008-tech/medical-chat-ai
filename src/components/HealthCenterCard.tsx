import React from "react";
import { healthCenters } from "../data/knowledgeBase";

interface HealthCenterCardProps {
  limit?: number;
}

const HealthCenterCard: React.FC<HealthCenterCardProps> = ({ limit = 3 }) => {
  const centers = healthCenters.slice(0, limit);

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
        🏥 Centres de santé au Bénin
      </p>
      {centers.map((center) => (
        <div
          key={center.id}
          className="bg-white border border-blue-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-sm">🏥</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 leading-tight">{center.name}</p>
              <p className="text-xs text-blue-600 font-medium">{center.type}</p>
              <div className="mt-1.5 space-y-0.5">
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <span>📍</span> {center.city}
                </p>
                <a
                  href={`tel:${center.phone}`}
                  className="text-xs text-green-600 font-semibold flex items-center gap-1 hover:underline"
                >
                  <span>📞</span> {center.phone}
                </a>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {center.services.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HealthCenterCard;
