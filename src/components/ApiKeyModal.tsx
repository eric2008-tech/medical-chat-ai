// ============================================================
// MEDICHAT — MODAL CONFIGURATION CLÉ API GROQ
// ============================================================

import React, { useState } from "react";

interface ApiKeyModalProps {
  onSave: (key: string) => void;
  onSkip: () => void;
  error?: string;
}

export default function ApiKeyModal({ onSave, onSkip, error }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsValidating(true);
    await new Promise((r) => setTimeout(r, 500));
    setIsValidating(false);
    onSave(apiKey.trim());
  };

  const isValidFormat = apiKey.startsWith("gsk_") && apiKey.length > 20;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-600 to-blue-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔑</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">Connecter Groq AI</h2>
              <p className="text-emerald-100 text-sm">LLaMA 3.3 — Gratuit</p>
            </div>
          </div>
          <p className="text-emerald-100 text-sm mt-2 leading-relaxed">
            Connectez Medichat à Groq pour des réponses médicales précises, 
            intelligentes et une traduction automatique.
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
            <p className="text-blue-800 font-semibold text-sm mb-2">📋 Comment obtenir votre clé gratuite :</p>
            <ol className="text-blue-700 text-sm space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                Allez sur <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-blue-900">console.groq.com</a>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                Créez un compte gratuit
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                Cliquez sur <strong>"API Keys"</strong> → <strong>"Create API Key"</strong>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">4</span>
                Copiez la clé (commence par <code className="bg-blue-100 px-1 rounded">gsk_</code>)
              </li>
            </ol>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-start gap-2">
              <span className="text-red-500 flex-shrink-0">⚠️</span>
              <div>
                <p className="text-red-800 text-sm font-semibold">
                  {error === "CLE_INVALIDE" ? "Clé API invalide" :
                   error === "QUOTA_DEPASSE" ? "Quota dépassé" : "Erreur de connexion"}
                </p>
                <p className="text-red-600 text-xs mt-0.5">
                  {error === "CLE_INVALIDE" ? "Vérifiez votre clé API Groq." :
                   error === "QUOTA_DEPASSE" ? "Attendez quelques minutes." : "Vérifiez votre connexion internet."}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Clé API Groq
              </label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="gsk_xxxxxxxxxxxxxxxxxxxx"
                  className={`w-full border rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 transition-all ${
                    apiKey && !isValidFormat
                      ? "border-red-300 focus:ring-red-200 bg-red-50"
                      : isValidFormat
                      ? "border-green-400 focus:ring-green-200 bg-green-50"
                      : "border-gray-300 focus:ring-emerald-200 focus:border-emerald-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  {showKey ? "🙈" : "👁️"}
                </button>
              </div>
              {apiKey && !isValidFormat && (
                <p className="text-xs text-red-500 mt-1">
                  La clé doit commencer par "gsk_" et contenir au moins 20 caractères
                </p>
              )}
              {isValidFormat && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  ✅ Format valide
                </p>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 flex items-start gap-2">
              <span>🔒</span>
              <p>Votre clé est stockée <strong>localement sur votre appareil</strong> uniquement. Elle n'est jamais envoyée à nos serveurs.</p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onSkip}
                className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl py-3 text-sm font-semibold transition-colors"
              >
                Continuer sans IA
              </button>
              <button
                type="submit"
                disabled={!isValidFormat || isValidating}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {isValidating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Validation...
                  </>
                ) : (
                  <>🚀 Connecter Groq</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
