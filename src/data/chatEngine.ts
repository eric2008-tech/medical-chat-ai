// ============================================================
// MEDICHAT — MOTEUR DE CHAT IA
// Pipeline NLP : détection intention → extraction symptômes → triage
// + Intégration Groq (LLaMA 3.3) pour réponses enrichies
// ============================================================

import { performTriage, extractSymptomsFromText, TriageResult } from "./triageEngine";
import { medicalKnowledgeBase, healthCenters, Disease } from "./knowledgeBase";
import { Language, translations } from "./translations";
import { analyzeWithGroq, isGroqReady } from "../services/groqService";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  triageResults?: TriageResult[];
  detectedSymptoms?: string[];
  suggestedDiseases?: Disease[];
  showCenters?: boolean;
  isEmergency?: boolean;
  language?: Language;
  aiPowered?: boolean;
}

export type IntentType =
  | "symptoms"
  | "prevention"
  | "disease_info"
  | "find_center"
  | "emergency"
  | "greeting"
  | "general_health"
  | "unknown";

export interface Intent {
  type: IntentType;
  confidence: number;
  entities: string[];
}

// ============================================================
// CLASSIFICATION DES INTENTIONS (NLP simulé)
// ============================================================
export function classifyIntent(text: string): Intent {
  const lower = text.toLowerCase();

  const patterns: { type: IntentType; keywords: string[]; weight: number }[] = [
    {
      type: "emergency",
      keywords: [
        "urgence", "aide", "mourir", "grave", "danger", "sauve", "convulsion",
        "inconscient", "perd connaissance", "hémorragie", "saigner beaucoup",
        "emergency", "critical", "pàjáwìrì", "hwenu vívɛ́",
      ],
      weight: 3,
    },
    {
      type: "symptoms",
      keywords: [
        "j'ai", "je ressens", "je souffre", "symptôme", "mal", "douleur",
        "fièvre", "toux", "fatigue", "vomissement", "diarrhée", "nausée",
        "frisson", "vertiges", "essoufflement", "je me sens", "un peu mal",
        "ça fait mal", "courbature", "transpire", "sueur", "pâle",
        "hwɛjijɔ", "àmì àìsàn",
      ],
      weight: 2,
    },
    {
      type: "prevention",
      keywords: [
        "prévenir", "prévention", "éviter", "protéger", "comment ne pas",
        "vaccin", "moustiquaire", "hygiène", "se protéger", "prophylaxie",
        "gbɔjɛjɛ", "ìdènà",
      ],
      weight: 2,
    },
    {
      type: "disease_info",
      keywords: [
        "paludisme", "malaria", "tuberculose", "sida", "vih", "diabète",
        "hypertension", "typhoïde", "choléra", "méningite", "grippe",
        "c'est quoi", "qu'est-ce que", "informations sur", "parle-moi de",
        "aho", "ibà", "kpèvi",
      ],
      weight: 2,
    },
    {
      type: "find_center",
      keywords: [
        "centre de santé", "hôpital", "médecin", "clinique", "dispensaire",
        "où aller", "trouver", "proche", "localisation", "adresse",
        "suklɛ", "ilé ìwòsàn",
      ],
      weight: 2,
    },
    {
      type: "greeting",
      keywords: [
        "bonjour", "bonsoir", "salut", "hello", "hi", "bonne journée",
        "comment vas-tu", "ça va", "e káàbọ̀", "ɛ̃",
      ],
      weight: 1,
    },
    {
      type: "general_health",
      keywords: [
        "santé", "conseil", "alimentation", "exercice", "dormir", "eau",
        "nutrition", "vitamine", "médicament", "traitement",
      ],
      weight: 1,
    },
  ];

  let bestMatch: { type: IntentType; score: number } = { type: "unknown", score: 0 };
  const entities: string[] = [];

  for (const pattern of patterns) {
    let score = 0;
    for (const keyword of pattern.keywords) {
      if (lower.includes(keyword)) {
        score += pattern.weight;
        entities.push(keyword);
      }
    }
    if (score > bestMatch.score) {
      bestMatch = { type: pattern.type, score };
    }
  }

  return {
    type: bestMatch.type,
    confidence: Math.min(bestMatch.score / 5, 1),
    entities: [...new Set(entities)],
  };
}

// ============================================================
// DÉTECTION DE LANGUE
// ============================================================
export function detectLanguage(text: string): Language {
  const fonKeywords = ["un nyí", "nǔ e hwɛ", "dokita", "azɔn", "hwɛjijɔ", "sɛ́n", "ɖò", "wà"];
  const yorubaKeywords = ["àìsàn", "dókítà", "àmì", "ìlera", "pàjáwìrì", "ìdènà", "fẹ́", "ní"];

  const lower = text.toLowerCase();
  const fonScore = fonKeywords.filter((k) => lower.includes(k)).length;
  const yorubaScore = yorubaKeywords.filter((k) => lower.includes(k)).length;

  if (fonScore > yorubaScore && fonScore > 0) return "fon";
  if (yorubaScore > fonScore && yorubaScore > 0) return "yo";
  return "fr";
}

// ============================================================
// GÉNÉRATION DE RÉPONSE (avec Groq si disponible)
// ============================================================
export async function generateResponse(
  userMessage: string,
  conversationHistory: Message[],
  currentLanguage: Language
): Promise<Message> {
  const intent = classifyIntent(userMessage);
  const detectedSymptoms = extractSymptomsFromText(userMessage);
  const triageResults = detectedSymptoms.length > 0 ? performTriage(detectedSymptoms) : [];
  const isEmergencyLocal = triageResults.some((r) => r.rule.urgencyLevel >= 5);

  // ——— Toujours traiter les urgences en local (sécurité) ———
  if (intent.type === "emergency" || isEmergencyLocal) {
    return {
      id: Date.now().toString(),
      role: "assistant",
      content: generateEmergencyResponse(currentLanguage),
      timestamp: new Date(),
      triageResults: triageResults.length > 0 ? triageResults : undefined,
      detectedSymptoms: detectedSymptoms.length > 0 ? detectedSymptoms : undefined,
      showCenters: true,
      isEmergency: true,
      language: currentLanguage,
    };
  }

  // ——— Groq disponible → réponse IA enrichie ———
  if (isGroqReady()) {
    try {
      const historyForGroq = conversationHistory
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-8)
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

      const groqResponse = await analyzeWithGroq(
        userMessage,
        detectedSymptoms,
        triageResults,
        currentLanguage,
        historyForGroq
      );

      const suggestedDiseases = getSuggestedDiseases(triageResults);

      return {
        id: Date.now().toString(),
        role: "assistant",
        content: groqResponse.content,
        timestamp: new Date(),
        triageResults: triageResults.length > 0 ? triageResults : undefined,
        detectedSymptoms: detectedSymptoms.length > 0 ? detectedSymptoms : undefined,
        suggestedDiseases: suggestedDiseases.length > 0 ? suggestedDiseases : undefined,
        showCenters:
          groqResponse.isEmergency ||
          triageResults.some((r) => r.rule.urgencyLevel >= 3) ||
          intent.type === "find_center",
        isEmergency: groqResponse.isEmergency,
        language: currentLanguage,
        aiPowered: true,
      };
    } catch (error: unknown) {
      const err = error as Error;
      // Fallback local si erreur Groq
      return generateLocalResponse(
        userMessage,
        conversationHistory,
        currentLanguage,
        intent,
        detectedSymptoms,
        triageResults,
        err.message
      );
    }
  }

  // ——— Mode local (sans Groq) ———
  return generateLocalResponse(
    userMessage,
    conversationHistory,
    currentLanguage,
    intent,
    detectedSymptoms,
    triageResults
  );
}

// ============================================================
// RÉPONSE LOCALE (sans Groq)
// ============================================================
function generateLocalResponse(
  userMessage: string,
  _conversationHistory: Message[],
  currentLanguage: Language,
  intent: Intent,
  detectedSymptoms: string[],
  triageResults: TriageResult[],
  errorCode?: string
): Message {
  let content = "";
  let showCenters = false;
  let suggestedDiseases: Disease[] = [];
  const isEmergency = triageResults.some((r) => r.rule.urgencyLevel >= 5);

  // Afficher un message d'erreur si Groq a échoué
  if (errorCode) {
    const errorMessages: Record<string, string> = {
      CLE_INVALIDE: "⚠️ **Clé API invalide.** Veuillez vérifier votre clé Groq dans les paramètres.\n\n",
      QUOTA_DEPASSE: "⚠️ **Quota Groq dépassé.** Mode local activé temporairement.\n\n",
      ERREUR_API: "⚠️ **Connexion Groq indisponible.** Mode local activé.\n\n",
    };
    content = errorMessages[errorCode] || "";
  }

  switch (intent.type) {
    case "symptoms":
      if (detectedSymptoms.length > 0) {
        content += generateSymptomResponse(detectedSymptoms, triageResults, currentLanguage);
        showCenters = triageResults.some((r) => r.rule.urgencyLevel >= 3);
        suggestedDiseases = getSuggestedDiseases(triageResults);
      } else {
        content += generateAskSymptomsResponse(currentLanguage);
      }
      break;
    case "prevention":
      content += generatePreventionResponse(userMessage, currentLanguage);
      break;
    case "disease_info":
      content += generateDiseaseInfoResponse(userMessage, currentLanguage);
      break;
    case "find_center":
      content += generateHealthCenterResponse(currentLanguage);
      showCenters = true;
      break;
    case "greeting":
      content += generateGreetingResponse(currentLanguage);
      break;
    case "general_health":
      content += generateGeneralHealthResponse(currentLanguage);
      break;
    default:
      if (detectedSymptoms.length > 0) {
        content += generateSymptomResponse(detectedSymptoms, triageResults, currentLanguage);
        showCenters = triageResults.some((r) => r.rule.urgencyLevel >= 3);
        suggestedDiseases = getSuggestedDiseases(triageResults);
      } else {
        content += generateDefaultResponse(currentLanguage);
      }
  }

  return {
    id: Date.now().toString(),
    role: "assistant",
    content,
    timestamp: new Date(),
    triageResults: triageResults.length > 0 ? triageResults : undefined,
    detectedSymptoms: detectedSymptoms.length > 0 ? detectedSymptoms : undefined,
    suggestedDiseases: suggestedDiseases.length > 0 ? suggestedDiseases : undefined,
    showCenters,
    isEmergency,
    language: currentLanguage,
    aiPowered: false,
  };
}

function generateSymptomResponse(
  symptoms: string[],
  triageResults: TriageResult[],
  lang: Language
): string {
  const t = translations[lang];

  if (triageResults.length === 0) {
    return lang === "fr"
      ? `J'ai détecté les symptômes suivants : **${symptoms.join(", ")}**.\n\nJe n'ai pas pu identifier une condition spécifique. Veuillez consulter un professionnel de santé pour une évaluation complète.\n\n${t.medicalDisclaimer}`
      : lang === "fon"
      ? `Un mɔ hwɛjijɔ lɛ : **${symptoms.join(", ")}**.\n\nYì kpɔ́n dokita.\n\n${t.medicalDisclaimer}`
      : `Mo rí àwọn àmì àìsàn: **${symptoms.join(", ")}**.\n\nJọ̀wọ́ gbìmọ̀ dókítà.\n\n${t.medicalDisclaimer}`;
  }

  const top = triageResults[0];

  const responses: Record<Language, string> = {
    fr: `J'ai analysé vos symptômes : **${symptoms.join(", ")}**.\n\nSur la base de ces informations, voici mon évaluation :\n\n🔍 **Condition probable :** ${top.rule.disease}\n⚡ **Niveau d'urgence :** ${top.rule.urgencyLabel}\n\n**Que faire maintenant ?**\n${top.rule.action}\n\n💡 **Conseil :** ${top.rule.recommendation}\n\n${t.medicalDisclaimer}`,
    fon: `Un kplɔ́n hwɛjijɔ towe lɛ : **${symptoms.join(", ")}**.\n\n🔍 **Azɔn e sixu nyí é :** ${top.rule.disease}\n⚡ **Hwenu tɔn :** ${top.rule.urgencyLabel}\n\n**Nǔ e na wà :**\n${top.rule.action}\n\n${t.medicalDisclaimer}`,
    yo: `Mo ṣàyẹ̀wò àwọn àmì àìsàn rẹ : **${symptoms.join(", ")}**.\n\n🔍 **Àìsàn Tó Ṣeéṣe :** ${top.rule.disease}\n⚡ **Ìpele Pàjáwìrì :** ${top.rule.urgencyLabel}\n\n**Ohun tó yẹ kí a ṣe :**\n${top.rule.action}\n\n${t.medicalDisclaimer}`,
  };

  return responses[lang];
}

function generateEmergencyResponse(lang: Language): string {
  const responses: Record<Language, string> = {
    fr: `🚨 **URGENCE MÉDICALE DÉTECTÉE**\n\nSi vous ou quelqu'un est en danger immédiat :\n\n📞 **Appelez immédiatement les secours**\n🏥 **Rendez-vous aux urgences les plus proches**\n\nCentres d'urgence au Bénin :\n- **CNHU Cotonou :** +229 21 30 01 55\n- **Urgences générales :** 113\n- **Croix-Rouge Bénin :** +229 21 30 05 56\n\n⚕️ Ceci n'est pas un diagnostic médical. Veuillez consulter un professionnel de santé.`,
    fon: `🚨 **HWENU VÍVƐ́ TÒN**\n\nYlɔ́ alɔdó sín sínsɛ́n :\n\n📞 **CNHU Cotonou :** +229 21 30 01 55\n📞 **Urgences :** 113\n\n⚕️ Yì kpɔ́n dokita sín sínsɛ́n.`,
    yo: `🚨 **PÀJÁWÌRÌ ÌLERA**\n\nPe Ìrànlọ́wọ́ lẹ́ẹ̀kọ̀ọ̀kan :\n\n📞 **CNHU Cotonou :** +229 21 30 01 55\n📞 **Pàjáwìrì :** 113\n\n⚕️ Jọ̀wọ́ gbìmọ̀ dókítà.`,
  };
  return responses[lang];
}

function generatePreventionResponse(text: string, lang: Language): string {
  const lower = text.toLowerCase();
  let disease = medicalKnowledgeBase.find(
    (d) =>
      lower.includes(d.name.toLowerCase()) ||
      lower.includes(d.id) ||
      (d.nameLocal?.fon && lower.includes(d.nameLocal.fon.toLowerCase())) ||
      (d.nameLocal?.yoruba && lower.includes(d.nameLocal.yoruba.toLowerCase()))
  );

  if (!disease) {
    disease = medicalKnowledgeBase.find((d) => d.id === "malaria");
  }

  if (!disease) {
    return translations[lang].medicalDisclaimer;
  }

  const responses: Record<Language, string> = {
    fr: `🛡️ **Prévention : ${disease.name}**\n\n${disease.prevention.map((p, i) => `${i + 1}. ${p}`).join("\n")}\n\n**Quand consulter :**\n${disease.whenToSeekHelp}\n\n${translations[lang].medicalDisclaimer}`,
    fon: `🛡️ **Gbɔjɛjɛ : ${disease.name}**\n\n${disease.prevention.map((p, i) => `${i + 1}. ${p}`).join("\n")}\n\n${translations[lang].medicalDisclaimer}`,
    yo: `🛡️ **Ìdènà : ${disease.name}**\n\n${disease.prevention.map((p, i) => `${i + 1}. ${p}`).join("\n")}\n\n${translations[lang].medicalDisclaimer}`,
  };

  return responses[lang];
}

function generateDiseaseInfoResponse(text: string, lang: Language): string {
  const lower = text.toLowerCase();
  const disease = medicalKnowledgeBase.find(
    (d) =>
      lower.includes(d.name.toLowerCase()) ||
      lower.includes(d.id) ||
      (d.nameLocal?.fon && lower.includes(d.nameLocal.fon.toLowerCase())) ||
      (d.nameLocal?.yoruba && lower.includes(d.nameLocal.yoruba.toLowerCase()))
  );

  if (!disease) {
    return lang === "fr"
      ? `Je dispose d'informations sur : **Paludisme, VIH/SIDA, Tuberculose, Hypertension, Infections respiratoires, Diarrhée, Fièvre typhoïde**.\n\nSur quelle maladie souhaitez-vous des informations ?\n\n${translations[lang].medicalDisclaimer}`
      : lang === "fon"
      ? `Azɔn e mǐ ɖó nǔ wìwà ɖe : **Aho, VIH, Kpèvi, Huyết áp cao...**\n\n${translations[lang].medicalDisclaimer}`
      : `Àwọn àìsàn tí mo mọ̀ : **Ibà, VIH, Ẹ̀gbẹ́ Ẹ̀dọ̀fóró...**\n\n${translations[lang].medicalDisclaimer}`;
  }

  const localName = lang === "fon" ? disease.nameLocal?.fon : lang === "yo" ? disease.nameLocal?.yoruba : undefined;
  const displayName = localName ? `${disease.name} (${localName})` : disease.name;

  return lang === "fr"
    ? `📋 **${displayName}**\n\n**Description :** ${disease.description}\n\n**Symptômes principaux :**\n${disease.symptoms.slice(0, 6).map((s) => `• ${s}`).join("\n")}\n\n**Conseils :**\n${disease.advice.slice(0, 3).map((a, i) => `${i + 1}. ${a}`).join("\n")}\n\n**Prévention :**\n${disease.prevention.slice(0, 3).map((p, i) => `${i + 1}. ${p}`).join("\n")}\n\n${translations[lang].medicalDisclaimer}`
    : `📋 **${displayName}**\n\n${disease.description}\n\n**Symptômes :** ${disease.symptoms.slice(0, 4).join(", ")}\n\n${translations[lang].medicalDisclaimer}`;
}

function generateHealthCenterResponse(lang: Language): string {
  const centers = healthCenters.slice(0, 3);
  const responses: Record<Language, string> = {
    fr: `🏥 **Centres de santé au Bénin**\n\nVoici quelques centres de santé disponibles :\n\n${centers.map((c) => `**${c.name}**\n📍 ${c.city}\n📞 ${c.phone}\n🏷️ ${c.type}`).join("\n\n")}\n\nActivez la géolocalisation pour trouver le centre le plus proche de vous.\n\n${translations[lang].medicalDisclaimer}`,
    fon: `🏥 **Suklɛ lɛ ɖò Bénin**\n\n${centers.map((c) => `**${c.name}**\n📍 ${c.city}\n📞 ${c.phone}`).join("\n\n")}\n\n${translations[lang].medicalDisclaimer}`,
    yo: `🏥 **Àwọn Ilé Ìwòsàn ní Bénin**\n\n${centers.map((c) => `**${c.name}**\n📍 ${c.city}\n📞 ${c.phone}`).join("\n\n")}\n\n${translations[lang].medicalDisclaimer}`,
  };
  return responses[lang];
}

function generateGreetingResponse(lang: Language): string {
  const responses: Record<Language, string> = {
    fr: `Bonjour ! 👋 Je suis **Medichat**, votre assistant médical IA pour le Bénin.\n\nJe peux vous aider à :\n🤒 **Analyser vos symptômes**\n🛡️ **Conseils de prévention**\n🏥 **Trouver un centre de santé**\n🚨 **Gérer les urgences**\n\nComment puis-je vous aider aujourd'hui ?\n\n${translations[lang].medicalDisclaimer}`,
    fon: `Ɛ̃ ! 👋 Un nyí **Medichat**, dokita AI towe.\n\nNǔ e un sixu d'alɔ we :\n🤒 **Kplɔ́n hwɛjijɔ towe**\n🛡️ **Wěɖexámɛ gbɔjɛjɛ**\n🏥 **Mɔ suklɛ e ɖò kpɔ́**\n\n${translations[lang].medicalDisclaimer}`,
    yo: `Ẹ káàbọ̀! 👋 Èmi ni **Medichat**, olùrànlọ́wọ́ ìlera AI rẹ.\n\nMo lè ràn ọ́ lọ́wọ́ pẹ̀lú:\n🤒 **Àyẹ̀wò Àmì Àìsàn**\n🛡️ **Ìdènà Àìsàn**\n🏥 **Wá Ilé Ìwòsàn**\n\n${translations[lang].medicalDisclaimer}`,
  };
  return responses[lang];
}

function generateAskSymptomsResponse(lang: Language): string {
  return translations[lang].askSymptoms;
}

function generateGeneralHealthResponse(lang: Language): string {
  const responses: Record<Language, string> = {
    fr: `💚 **Conseils Généraux de Santé**\n\n1. **Hydratation :** Buvez 2L d'eau par jour (eau traitée ou bouillie)\n2. **Alimentation :** Mangez des fruits et légumes frais\n3. **Sommeil :** Dormez 7-8h par nuit\n4. **Hygiène :** Lavez-vous les mains régulièrement\n5. **Moustiquaire :** Dormez sous moustiquaire imprégnée\n6. **Activité physique :** 30 minutes de marche par jour\n7. **Contrôles :** Consultez régulièrement même sans symptômes\n\n${translations[lang].medicalDisclaimer}`,
    fon: `💚 **Wěɖexámɛ Nyanya lɛ**\n\n1. Nu sin vɔvɔ (2L gbla ɖókpó)\n2. Ɖu nǔ nyanya\n3. Fɔ alɔ dó\n4. Ɖó ahwan ŋutɔ dó alɔ mɛkún\n\n${translations[lang].medicalDisclaimer}`,
    yo: `💚 **Ìmọ̀ràn Ìlera Gbogbogbò**\n\n1. Mu omi tó mọ́ (2L lójoojúmọ́)\n2. Jẹ ẹfọ àti èso\n3. Fọ ọwọ́ rẹ déédéé\n4. Sùn lórí àwọ̀ ìdán\n\n${translations[lang].medicalDisclaimer}`,
  };
  return responses[lang];
}

function generateDefaultResponse(lang: Language): string {
  const responses: Record<Language, string> = {
    fr: `Je suis Medichat, votre assistant médical IA. Je peux vous aider avec :\n\n• 🤒 L'analyse de vos symptômes\n• 🛡️ Des conseils de prévention\n• 🏥 La localisation de centres de santé\n• ℹ️ Des informations sur les maladies courantes\n\nDécrivez vos symptômes ou posez-moi une question sur votre santé.\n\n${translations[lang].medicalDisclaimer}`,
    fon: `Un nyí Medichat. Ɖɔ hwɛjijɔ e a ɖó tɔn.\n\n${translations[lang].medicalDisclaimer}`,
    yo: `Èmi ni Medichat. Ṣàpèjúwe àwọn àmì àìsàn rẹ.\n\n${translations[lang].medicalDisclaimer}`,
  };
  return responses[lang];
}

function getSuggestedDiseases(triageResults: TriageResult[]): Disease[] {
  const diseaseNames = triageResults
    .map((r) => r.rule.disease.toLowerCase())
    .slice(0, 2);

  return medicalKnowledgeBase.filter((d) =>
    diseaseNames.some(
      (name) =>
        name.includes(d.name.toLowerCase()) ||
        d.name.toLowerCase().includes(name.split(" ")[0])
    )
  );
}

export function getWelcomeMessage(lang: Language): Message {
  const t = translations[lang];
  return {
    id: "welcome",
    role: "assistant",
    content: `${t.welcomeMessage}\n\n${t.welcomeSubtitle}\n\n${t.medicalDisclaimer}`,
    timestamp: new Date(),
    language: lang,
  };
}
