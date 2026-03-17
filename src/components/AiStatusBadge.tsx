// ============================================================
// MEDICHAT — BADGE STATUT IA
// ============================================================

interface AiStatusBadgeProps {
  isConnected: boolean;
  onConfigure: () => void;
  onDisconnect: () => void;
}

export default function AiStatusBadge({ isConnected, onConfigure, onDisconnect }: AiStatusBadgeProps) {
  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full px-3 py-1 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Groq IA Connectée
        </div>
        <button
          onClick={onDisconnect}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          title="Déconnecter l'IA"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onConfigure}
      className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 rounded-full px-3 py-1 text-xs font-semibold transition-colors"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      Connecter Groq IA
    </button>
  );
}
