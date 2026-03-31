import React, { useState, useRef, useEffect, useCallback } from "react";
import { Message, generateResponse, getWelcomeMessage } from "./data/chatEngine";
import { Language, translations } from "./data/translations";
import ChatMessage from "./components/ChatMessage";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import ApiKeyModal from "./components/ApiKeyModal";
import AiStatusBadge from "./components/AiStatusBadge";
import {
  initGroq,
  saveApiKey,
  getStoredApiKey,
  clearApiKey,
} from "./services/groqService";

const APP_VERSION = "1.2.0";

const QUICK_SUGGESTIONS: Record<Language, string[]> = {
  fr: [
    "J'ai de la fièvre et des frissons depuis 2 jours",
    "Comment prévenir le paludisme ?",
    "J'ai des maux de tête et je transpire beaucoup",
    "Où trouver un centre de santé à Cotonou ?",
    "Je tousse depuis 3 semaines",
    "J'ai des douleurs abdominales et de la diarrhée",
  ],
  fon: [
    "Mɔ́ nɛɖɔ̀ ɖe kɔkɔ́ gbà",
    "Nzokɔ yè ɖe hayi ɖe ɖo",
    "Mɛɖeɖea ɖe kɔkɔ́nɔ ɖe sa",
  ],
  yo: [
    "Mo ni iba ati ìrora fun ọjọ meji",
    "Báwo ni mo ṣe le dena arun malaria ?",
    "Ori mi n run o si n yo eebi",
  ],
};

const getSuggestions = (lang: Language): string[] => QUICK_SUGGESTIONS[lang] || QUICK_SUGGESTIONS.fr;

export default function App() {
  const [language, setLanguage] = useState<Language>("fr");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showApiModal, setShowApiModal] = useState(false);
  const [groqConnected, setGroqConnected] = useState(false);
  const [apiError, setApiError] = useState<string | undefined>();
  const [thinkingLabel, setThinkingLabel] = useState("Analyse en cours...");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const t = translations[language];

  // ── Init Groq depuis localStorage au démarrage ──
  useEffect(() => {
    const stored = getStoredApiKey();
    if (stored) {
      initGroq(stored);
      setGroqConnected(true);
    } else {
      // Proposer la config après un délai
      const timer = setTimeout(() => setShowApiModal(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // ── Message de bienvenue ──
  useEffect(() => {
    setMessages([getWelcomeMessage(language)]);
  }, [language]);

  // ── Auto-scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Thinking label dynamique ──
  useEffect(() => {
    if (!isLoading) return;
    const labels = groqConnected
      ? [
          "Groq IA analyse vos symptômes...",
          "Consultation de la base médicale...",
          "Génération de la réponse...",
        ]
      : [
          "Analyse en cours...",
          "Vérification des symptômes...",
          "Préparation de la réponse...",
        ];
    let i = 0;
    setThinkingLabel(labels[0]);
    const interval = setInterval(() => {
      i = (i + 1) % labels.length;
      setThinkingLabel(labels[i]);
    }, 1800);
    return () => clearInterval(interval);
  }, [isLoading, groqConnected]);

  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
        language,
      };

      const conversationHistory = [...messages, userMessage];
      setMessages(conversationHistory);
      setInput("");
      setIsLoading(true);
      setShowSuggestions(false);

      try {
        // Délai minimal pour UX (Groq est déjà rapide)
        const [response] = await Promise.all([
          generateResponse(text, conversationHistory, language),
          new Promise((resolve) => setTimeout(resolve, groqConnected ? 300 : 800)),
        ]);

        setMessages((prev) => [...prev, response]);
      } catch (err) {
        console.error("Send message error:", err);
        // Fallback message
        const errorMsg: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "⚠️ Une erreur s'est produite. Veuillez réessayer.\n\n⚕️ *Ceci n'est pas un diagnostic médical. Veuillez consulter un professionnel de santé.*",
          timestamp: new Date(),
          language,
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, language, groqConnected]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleQuickAction = useCallback(
    (msg: string) => sendMessage(msg),
    [sendMessage]
  );

  const handleNewChat = () => {
    setMessages([getWelcomeMessage(language)]);
    setShowSuggestions(true);
    setInput("");
  };

  // ── Gestion clé API ──
  const handleSaveApiKey = useCallback((key: string) => {
    setApiError(undefined);
    saveApiKey(key);
    setGroqConnected(true);
    setShowApiModal(false);

    // Message de confirmation
    const confirmMsg: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content:
        "✅ **Groq IA connectée avec succès !**\n\nMedichat utilise maintenant **LLaMA 3.3 70B** pour des réponses médicales plus précises, contextuelles et en temps réel.\n\n🌍 La traduction automatique en Fon et Yoruba est également activée.\n\nComment puis-je vous aider ?",
      timestamp: new Date(),
      language,
      aiPowered: true,
    };
    setMessages((prev) => [...prev, confirmMsg]);
  }, [language]);

  const handleSkipApiKey = useCallback(() => {
    setShowApiModal(false);
  }, []);

  const handleDisconnectGroq = useCallback(() => {
    clearApiKey();
    setGroqConnected(false);
    const disconnectMsg: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content:
        "🔌 **Groq IA déconnectée.** Medichat fonctionne maintenant en mode local.\n\nVous pouvez reconnecter l'IA à tout moment via le bouton **\"Connecter Groq IA\"**.",
      timestamp: new Date(),
      language,
    };
    setMessages((prev) => [...prev, disconnectMsg]);
  }, [language]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-['Inter',sans-serif]">
      {/* API Key Modal */}
      {showApiModal && (
        <ApiKeyModal
          onSave={handleSaveApiKey}
          onSkip={handleSkipApiKey}
          error={apiError}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        language={language}
        onLanguageChange={handleLanguageChange}
        onQuickAction={handleQuickAction}
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm flex-shrink-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center shadow">
              <span className="text-white font-black text-sm">M</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-sm leading-tight">Medichat</h1>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-gray-500">{t.appTagline}</span>
              </div>
            </div>
          </div>

          {/* AI Status Badge */}
          <div className="hidden sm:flex ml-3">
            <AiStatusBadge
              isConnected={groqConnected}
              onConfigure={() => { setApiError(undefined); setShowApiModal(true); }}
              onDisconnect={handleDisconnectGroq}
            />
          </div>

          {/* Emergency button */}
          <a
            href="tel:113"
            className="ml-auto flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors shadow-sm"
          >
            🚨 <span className="hidden sm:inline">{t.emergencyCall}</span>
            <span className="sm:hidden">113</span>
          </a>

          <button
            onClick={handleNewChat}
            className="hidden sm:flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-3 py-1.5 transition-colors"
          >
            ✏️ {t.newChat}
          </button>
        </header>

        {/* Groq Banner (mobile) */}
        {!groqConnected && (
          <div
            className="sm:hidden bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between cursor-pointer"
            onClick={() => { setApiError(undefined); setShowApiModal(true); }}
          >
            <span className="text-xs text-amber-800">
              ⚡ Connectez Groq pour de meilleures réponses
            </span>
            <span className="text-xs font-semibold text-amber-700 underline">Configurer →</span>
          </div>
        )}

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4">
          <div className="max-w-3xl mx-auto">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start mb-4 gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow ${
                  groqConnected
                    ? "bg-gradient-to-br from-violet-500 to-blue-500"
                    : "bg-gradient-to-br from-blue-500 to-emerald-500"
                }`}>
                  <span className="text-white text-sm font-bold">M</span>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className={`w-2 h-2 rounded-full animate-bounce ${groqConnected ? "bg-violet-400" : "bg-emerald-400"}`} style={{ animationDelay: "0ms" }} />
                      <span className={`w-2 h-2 rounded-full animate-bounce ${groqConnected ? "bg-violet-400" : "bg-emerald-400"}`} style={{ animationDelay: "150ms" }} />
                      <span className={`w-2 h-2 rounded-full animate-bounce ${groqConnected ? "bg-violet-400" : "bg-emerald-400"}`} style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-xs text-gray-400 transition-all">{thinkingLabel}</span>
                  </div>
                  {groqConnected && (
                    <div className="mt-1.5 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-violet-400 animate-pulse" />
                      <span className="text-[10px] text-violet-400 font-medium">LLaMA 3.3 · Groq</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick suggestions */}
            {showSuggestions && messages.length <= 1 && (
              <div className="mt-4">
                <p className="text-xs text-gray-400 text-center mb-3 uppercase tracking-wider font-semibold">
                  Questions fréquentes
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {getSuggestions(language).map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => sendMessage(suggestion)}
                      className="text-left text-sm text-gray-700 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-gray-200 rounded-xl px-4 py-3 transition-all shadow-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>

                {/* Groq CTA si non connecté */}
                {!groqConnected && (
                  <div
                    className="mt-4 bg-gradient-to-r from-violet-50 to-blue-50 border border-violet-200 rounded-xl p-4 cursor-pointer hover:border-violet-300 transition-all"
                    onClick={() => { setApiError(undefined); setShowApiModal(true); }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                        🤖
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-violet-800">
                          Activer Groq IA (LLaMA 3.3)
                        </p>
                        <p className="text-xs text-violet-600 mt-0.5">
                          Réponses médicales précises, multilingues et en temps réel — Gratuit
                        </p>
                      </div>
                      <span className="ml-auto text-violet-500 font-bold">→</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Medical disclaimer bar */}
        <div className="bg-amber-50 border-t border-amber-200 px-4 py-2 flex-shrink-0">
          <p className="text-xs text-amber-800 text-center leading-relaxed max-w-3xl mx-auto">
            ⚕️ <strong>Ceci n'est pas un diagnostic médical.</strong> Veuillez toujours consulter un professionnel de santé qualifié.
          </p>
        </div>

        {/* Input area */}
        <div className="bg-white border-t border-gray-200 px-3 sm:px-6 py-3 flex-shrink-0">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="flex gap-2 items-end">
              <div className={`flex-1 bg-gray-50 border rounded-2xl overflow-hidden transition-all ${
                groqConnected
                  ? "border-violet-300 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100"
                  : "border-gray-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100"
              }`}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    groqConnected
                      ? "Posez votre question médicale (Groq IA active)..."
                      : t.typePlaceholder
                  }
                  className="w-full bg-transparent px-4 py-3 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none max-h-32"
                  rows={1}
                  style={{ minHeight: "44px" }}
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`flex-shrink-0 w-11 h-11 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors shadow-sm ${
                  groqConnected
                    ? "bg-violet-600 hover:bg-violet-500"
                    : "bg-emerald-600 hover:bg-emerald-500"
                }`}
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex items-center justify-between mt-1.5 px-1">
              <p className="text-xs text-gray-400">
                Entrée pour envoyer · Shift+Entrée pour nouvelle ligne
              </p>
              {groqConnected && (
                <span className="text-[10px] text-violet-400 font-medium flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-violet-400 animate-pulse" />
                  Propulsé par Groq · LLaMA 3.3
                </span>
              )}
            </div>
          </form>
        </div>

        <Footer />
      </div>
    </div>
  );
}
