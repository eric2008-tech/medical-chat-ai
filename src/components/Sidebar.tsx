import React from "react";
import { Language, translations } from "../data/translations";
import { medicalKnowledgeBase } from "../data/knowledgeBase";

interface SidebarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onQuickAction: (msg: string) => void;
  onNewChat?: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "fon", label: "Fon", flag: "🇧🇯" },
  { code: "yo", label: "Yoruba", flag: "🇧🇯" },
];

const Sidebar: React.FC<SidebarProps> = ({
  language,
  onLanguageChange,
  onQuickAction,
  onNewChat: _onNewChat,
  isOpen,
  onClose,
}) => {
  const t = translations[language];

  const quickActions = [
    { label: t.quickSymptoms, message: "J'ai des symptômes, pouvez-vous m'aider ?" },
    { label: t.quickPrevention, message: "Donnez-moi des conseils de prévention contre le paludisme" },
    { label: t.quickCenters, message: "Où trouver un centre de santé proche ?" },
    { label: t.quickEmergency, message: "J'ai une urgence médicale" },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-slate-900 to-slate-800 z-30 transition-transform duration-300 flex flex-col shadow-2xl
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-lg">M</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">Medichat</h1>
              <p className="text-emerald-400 text-xs">Assistant Médical IA</p>
            </div>
            <button
              onClick={onClose}
              className="ml-auto text-slate-400 hover:text-white lg:hidden"
            >
              ✕
            </button>
          </div>
          <div className="mt-3 bg-emerald-900/50 rounded-lg px-3 py-2">
            <p className="text-emerald-300 text-xs text-center">🇧🇯 Conçu pour le Bénin</p>
          </div>
        </div>

        {/* Language selector */}
        <div className="p-4 border-b border-slate-700">
          <p className="text-slate-400 text-xs uppercase font-semibold mb-2 tracking-wider">🌍 {t.language}</p>
          <div className="flex gap-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onLanguageChange(lang.code)}
                className={`flex-1 text-xs py-1.5 px-1 rounded-lg font-medium transition-all ${
                  language === lang.code
                    ? "bg-emerald-500 text-white shadow-md"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {lang.flag} {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="p-4 border-b border-slate-700">
          <p className="text-slate-400 text-xs uppercase font-semibold mb-2 tracking-wider">⚡ Actions rapides</p>
          <div className="space-y-1.5">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => {
                  onQuickAction(action.message);
                  onClose();
                }}
                className="w-full text-left text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg px-3 py-2 transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Diseases info */}
        <div className="p-4 flex-1 overflow-y-auto">
          <p className="text-slate-400 text-xs uppercase font-semibold mb-2 tracking-wider">📋 Maladies prioritaires</p>
          <div className="space-y-1">
            {medicalKnowledgeBase.map((disease) => (
              <button
                key={disease.id}
                onClick={() => {
                  onQuickAction(`Donne-moi des informations sur ${disease.name}`);
                  onClose();
                }}
                className="w-full text-left flex items-center gap-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg px-3 py-2 transition-colors group"
              >
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    disease.severity === "critical"
                      ? "bg-purple-400"
                      : disease.severity === "high"
                      ? "bg-red-400"
                      : disease.severity === "moderate"
                      ? "bg-orange-400"
                      : "bg-green-400"
                  }`}
                />
                <span className="flex-1 truncate">{disease.name}</span>
                {disease.nameLocal?.fon && (
                  <span className="text-xs text-slate-500 group-hover:text-slate-400 flex-shrink-0">
                    {disease.nameLocal.fon}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Emergency */}
        <div className="p-4 border-t border-slate-700">
          <a
            href="tel:113"
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white rounded-xl py-3 font-semibold text-sm transition-colors shadow-lg"
          >
            🚨 Urgences : 113
          </a>
          <p className="text-slate-500 text-xs text-center mt-2">CNHU: +229 21 30 01 55</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
