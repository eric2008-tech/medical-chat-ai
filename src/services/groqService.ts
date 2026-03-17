// ============================================================
// MEDICHAT — SERVICE GROQ (LLaMA)
// Connexion à l'API Groq pour des réponses médicales précises
// ============================================================

import Groq from "groq-sdk";
import { Language } from "../data/translations";
import { TriageResult } from "../data/triageEngine";

// ============================================================
// CONFIGURATION
// ============================================================
let groqClient: Groq | null = null;

export function initGroq(apiKey: string): void {
  groqClient = new Groq({
    apiKey,
    dangerouslyAllowBrowser: true, // Client-side usage
  });
}

export function isGroqReady(): boolean {
  return groqClient !== null;
}

export function getStoredApiKey(): string | null {
  return localStorage.getItem("medichat_groq_api_key");
}

export function saveApiKey(key: string): void {
  localStorage.setItem("medichat_groq_api_key", key);
  initGroq(key);
}

export function clearApiKey(): void {
  localStorage.removeItem("medichat_groq_api_key");
  groqClient = null;
}

// ============================================================
// SYSTEM PROMPT MÉDICAL
// ============================================================
function buildSystemPrompt(language: Language): string {
  const langInstructions: Record<Language, string> = {
    fr: "Tu dois répondre UNIQUEMENT en français.",
    fon: "Tu dois répondre principalement en français mais avec des mots clés en langue Fon du Bénin quand c'est approprié.",
    yo: "Tu dois répondre principalement en français mais avec des mots clés en Yoruba quand c'est approprié.",
  };

  return `Tu es Medichat, un assistant médical IA spécialisé pour le Bénin et l'Afrique de l'Ouest.

RÔLE ET MISSION :
- Tu aides les populations béninoises à mieux comprendre leurs symptômes
- Tu effectues un triage médical préliminaire (jamais un diagnostic)
- Tu orientes vers les centres de santé appropriés
- Tu sensibilises à la prévention des maladies courantes

MALADIES PRIORITAIRES AU BÉNIN :
- Paludisme (malaria) — très fréquent
- VIH/SIDA — prévention et dépistage
- Tuberculose — symptômes respiratoires persistants
- Hypertension artérielle
- Infections respiratoires aiguës
- Diarrhées et maladies diarrhéiques
- Fièvre typhoïde

CONTRAINTES ABSOLUES :
1. Tu ne poses JAMAIS de diagnostic médical définitif
2. Tu dois TOUJOURS terminer par : "⚕️ Ceci n'est pas un diagnostic médical. Veuillez consulter un professionnel de santé."
3. En cas d'urgence (convulsions, perte de conscience, hémorragie, douleur thoracique intense), orienter IMMÉDIATEMENT vers le 113
4. Rester dans le domaine médical et de la santé
5. Adapter le langage au contexte africain béninois (ressources disponibles, réalités locales)

FORMAT DE RÉPONSE :
- Réponses claires et structurées avec des emojis appropriés
- Utiliser des points et listes pour la lisibilité
- Niveau de langage accessible à tous (pas trop technique)
- Maximum 300 mots par réponse

${langInstructions[language]}

CONTEXTE GÉOGRAPHIQUE :
- Centres de santé de référence : CNHU de Cotonou, Hôpital de Zone, CSCOM
- Numéro d'urgence au Bénin : 113
- Réalités locales : accès limité à l'eau potable, zones rurales, automédication courante`;
}

// ============================================================
// TRADUCTION AUTOMATIQUE VIA GROQ
// ============================================================
export async function translateText(
  text: string,
  targetLanguage: Language
): Promise<string> {
  if (!groqClient || targetLanguage === "fr") return text;

  const langNames: Record<Language, string> = {
    fr: "français",
    fon: "Fon (langue locale du Bénin)",
    yo: "Yoruba (langue locale du Bénin et Nigeria)",
  };

  try {
    const completion = await groqClient.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `Tu es un traducteur expert en langues africaines. Traduis le texte suivant en ${langNames[targetLanguage]}. 
          Garde les emojis et la structure. Pour les termes médicaux sans équivalent exact, garde le terme français entre parenthèses.
          Réponds UNIQUEMENT avec la traduction, sans explication.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.3,
      max_tokens: 600,
    });

    return completion.choices[0]?.message?.content || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}

// ============================================================
// ANALYSE MÉDICALE ENRICHIE VIA GROQ
// ============================================================
export interface GroqMedicalResponse {
  content: string;
  isEmergency: boolean;
  urgencyLevel: number;
  suggestedActions: string[];
  preventionTips: string[];
}

export async function analyzeWithGroq(
  userMessage: string,
  detectedSymptoms: string[],
  triageResults: TriageResult[],
  language: Language,
  conversationHistory: { role: "user" | "assistant"; content: string }[]
): Promise<GroqMedicalResponse> {
  if (!groqClient) {
    throw new Error("Groq client not initialized");
  }

  // Contexte de triage local pour enrichir la réponse Groq
  const triageContext =
    triageResults.length > 0
      ? `\n\nANALYSE PRÉLIMINAIRE LOCALE :
${triageResults
  .slice(0, 3)
  .map(
    (r) => `- ${r.rule.disease} (urgence: ${r.rule.urgencyLevel}/5) — ${r.rule.urgencyLabel}
  Action: ${r.rule.action}`
  )
  .join("\n")}`
      : "";

  const symptomsContext =
    detectedSymptoms.length > 0
      ? `\n\nSYMPTÔMES DÉTECTÉS : ${detectedSymptoms.join(", ")}`
      : "";

  // Historique de conversation (limité aux 6 derniers messages)
  const recentHistory = conversationHistory.slice(-6).map((msg) => ({
    role: msg.role as "user" | "assistant",
    content: msg.content,
  }));

  try {
    const completion = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(language) + triageContext + symptomsContext,
        },
        ...recentHistory,
        {
          role: "user",
          content: userMessage,
        },
      ],
      temperature: 0.4,
      max_tokens: 800,
      stream: false,
    });

    const responseContent =
      completion.choices[0]?.message?.content ||
      "Je suis désolé, je n'ai pas pu générer une réponse. Veuillez réessayer.";

    // Détection d'urgence dans la réponse
    const emergencyKeywords = [
      "urgence", "immédiat", "113", "appeler", "secours",
      "danger", "convulsion", "inconscient", "hémorragie",
    ];
    const isEmergency =
      emergencyKeywords.some((k) => responseContent.toLowerCase().includes(k)) ||
      triageResults.some((r) => r.rule.urgencyLevel >= 5);

    const urgencyLevel = triageResults.length > 0
      ? Math.max(...triageResults.map((r) => r.rule.urgencyLevel))
      : 1;

    // Extraire les suggestions d'action (si présentes)
    const suggestedActions = triageResults
      .slice(0, 2)
      .map((r) => r.rule.action)
      .filter(Boolean);

    const preventionTips = triageResults
      .slice(0, 2)
      .map((r) => r.rule.recommendation)
      .filter(Boolean);

    return {
      content: responseContent,
      isEmergency,
      urgencyLevel,
      suggestedActions,
      preventionTips,
    };
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    console.error("Groq API error:", err);

    if (err?.status === 401) {
      throw new Error("CLE_INVALIDE");
    } else if (err?.status === 429) {
      throw new Error("QUOTA_DEPASSE");
    } else {
      throw new Error("ERREUR_API");
    }
  }
}

// ============================================================
// QUESTION DE SUIVI INTELLIGENTE
// ============================================================
export async function generateFollowUpQuestion(
  symptoms: string[],
  language: Language
): Promise<string> {
  if (!groqClient || symptoms.length === 0) return "";

  try {
    const completion = await groqClient.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `Tu es Medichat, assistant médical pour le Bénin. 
          Génère UNE SEULE question de suivi courte et pertinente (max 20 mots) pour mieux comprendre les symptômes du patient.
          La question doit être en ${language === "fr" ? "français" : language === "fon" ? "Fon/français" : "Yoruba/français"}.
          Réponds UNIQUEMENT avec la question, sans introduction.`,
        },
        {
          role: "user",
          content: `Symptômes rapportés : ${symptoms.join(", ")}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 80,
    });

    return completion.choices[0]?.message?.content || "";
  } catch {
    return "";
  }
}

// ============================================================
// RÉSUMÉ DE CONSULTATION
// ============================================================
export async function generateConsultationSummary(
  messages: { role: string; content: string }[],
  _language: Language
): Promise<string> {
  if (!groqClient) return "";

  try {
    const conversation = messages
      .filter((m) => m.role !== "system")
      .slice(-10)
      .map((m) => `${m.role === "user" ? "Patient" : "Medichat"}: ${m.content}`)
      .join("\n\n");

    const completion = await groqClient.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `Tu es Medichat. Génère un résumé de consultation médical structuré en français avec :
          1. Symptômes principaux mentionnés
          2. Évaluation préliminaire
          3. Actions recommandées
          4. Rappel : ce n'est pas un diagnostic médical
          Maximum 150 mots.`,
        },
        {
          role: "user",
          content: `Résume cette consultation :\n\n${conversation}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 300,
    });

    return completion.choices[0]?.message?.content || "";
  } catch {
    return "";
  }
}
