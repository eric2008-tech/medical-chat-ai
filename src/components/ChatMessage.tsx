import React from "react";
import { Message } from "../data/chatEngine";
import TriageCard from "./TriageCard";
import HealthCenterCard from "./HealthCenterCard";

interface ChatMessageProps {
  message: Message;
}

function formatContent(text: string): React.ReactNode {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    // Bold: **text**
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const formatted = parts.map((part, j) =>
      j % 2 === 1 ? <strong key={j}>{part}</strong> : part
    );
    return (
      <span key={i}>
        {formatted}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";
  const isEmergency = message.isEmergency;

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] bg-emerald-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
          <p className="text-sm leading-relaxed">{message.content}</p>
          <p className="text-xs text-emerald-200 mt-1 text-right">
            {message.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4 gap-2">
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow ${
        message.aiPowered
          ? "bg-gradient-to-br from-violet-500 to-blue-500"
          : "bg-gradient-to-br from-blue-500 to-emerald-500"
      }`}>
        <span className="text-white text-sm font-bold">M</span>
      </div>

      <div className="max-w-[85%]">
        {/* Emergency banner */}
        {isEmergency && (
          <div className="mb-2 bg-red-600 text-white rounded-xl px-4 py-2 flex items-center gap-2 animate-pulse">
            <span className="text-lg">🚨</span>
            <span className="text-sm font-bold">URGENCE MÉDICALE DÉTECTÉE</span>
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm ${
            isEmergency
              ? "bg-red-50 border-2 border-red-300"
              : "bg-white border border-gray-100"
          }`}
        >
          <p className="text-sm leading-relaxed text-gray-800">
            {formatContent(message.content)}
          </p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-400">
              {message.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </p>
            {message.aiPowered && (
              <span className="text-[10px] text-violet-400 font-medium flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-violet-400 animate-pulse" />
                Groq · LLaMA 3.3
              </span>
            )}
          </div>
        </div>

        {/* Triage results */}
        {message.triageResults && message.triageResults.length > 0 && (
          <TriageCard results={message.triageResults} />
        )}

        {/* Health centers */}
        {message.showCenters && <HealthCenterCard limit={3} />}

        {/* Disease prevention quick tips */}
        {message.suggestedDiseases && message.suggestedDiseases.length > 0 && (
          <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3">
            <p className="text-xs font-semibold text-blue-700 mb-2">💡 Conseils de prévention</p>
            {message.suggestedDiseases[0].prevention.slice(0, 3).map((p, i) => (
              <p key={i} className="text-xs text-blue-800 flex gap-1.5 mb-1">
                <span className="text-blue-400 flex-shrink-0">•</span> {p}
              </p>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <p className="text-xs text-amber-800 leading-relaxed">
            ⚕️ <strong>Ceci n'est pas un diagnostic médical.</strong> Veuillez consulter un professionnel de santé.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
