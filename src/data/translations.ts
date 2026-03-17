// ============================================================
// MEDICHAT — SYSTÈME MULTILINGUE
// Support : Français, Fon (Bénin), Yoruba
// ============================================================

export type Language = "fr" | "fon" | "yo";

export interface Translations {
  // UI General
  appName: string;
  appTagline: string;
  typePlaceholder: string;
  send: string;
  newChat: string;
  disclaimer: string;
  emergencyTitle: string;
  emergencyCall: string;
  language: string;
  
  // Chat
  welcomeMessage: string;
  welcomeSubtitle: string;
  thinkingMessage: string;
  
  // Triage
  urgencyLabel: string;
  diseaseLabel: string;
  actionLabel: string;
  symptomsDetected: string;
  noSymptomsFound: string;
  triageResult: string;
  
  // Severity labels
  low: string;
  moderate: string;
  high: string;
  urgent: string;
  critical: string;
  
  // Health centers
  nearbyCenter: string;
  findCenter: string;
  phone: string;
  address: string;
  services: string;
  
  // Quick actions
  quickSymptoms: string;
  quickPrevention: string;
  quickCenters: string;
  quickEmergency: string;
  
  // Disclaimer
  medicalDisclaimer: string;
  
  // Common responses
  askSymptoms: string;
  moreInfo: string;
}

export const translations: Record<Language, Translations> = {
  fr: {
    appName: "Medichat",
    appTagline: "Assistant Médical IA — Bénin",
    typePlaceholder: "Décrivez vos symptômes...",
    send: "Envoyer",
    newChat: "Nouvelle conversation",
    disclaimer: "⚕️ Ceci n'est pas un diagnostic médical. Consultez un professionnel.",
    emergencyTitle: "🚨 Urgence",
    emergencyCall: "Appeler les secours",
    language: "Langue",
    welcomeMessage: "Bonjour ! Je suis Medichat 👋",
    welcomeSubtitle:
      "Votre assistant médical IA pour le Bénin. Je peux analyser vos symptômes, vous orienter vers un centre de santé et vous donner des conseils de prévention.",
    thinkingMessage: "Analyse en cours...",
    urgencyLabel: "Niveau d'urgence",
    diseaseLabel: "Condition probable",
    actionLabel: "Action recommandée",
    symptomsDetected: "Symptômes détectés",
    noSymptomsFound: "Aucun symptôme identifié. Pouvez-vous décrire ce que vous ressentez ?",
    triageResult: "Résultat du triage",
    low: "Faible",
    moderate: "Modéré",
    high: "Élevé",
    urgent: "Urgent",
    critical: "Critique",
    nearbyCenter: "Centre de santé proche",
    findCenter: "Trouver un centre",
    phone: "Téléphone",
    address: "Adresse",
    services: "Services",
    quickSymptoms: "🤒 J'ai des symptômes",
    quickPrevention: "🛡️ Prévention",
    quickCenters: "🏥 Centres de santé",
    quickEmergency: "🚨 Urgence",
    medicalDisclaimer:
      "⚕️ AVERTISSEMENT MÉDICAL : Ceci n'est pas un diagnostic médical. Les informations fournies sont à titre indicatif uniquement. Veuillez toujours consulter un professionnel de santé qualifié pour tout problème médical.",
    askSymptoms:
      "Quels symptômes ressentez-vous ? Décrivez-les le plus précisément possible (ex: fièvre depuis 2 jours, maux de tête, frissons...)",
    moreInfo: "Voulez-vous plus d'informations sur la prévention ou les centres de santé proches ?",
  },

  fon: {
    appName: "Medichat",
    appTagline: "Dokita AI — Bénin",
    typePlaceholder: "Ɖɔ nǔ e hwɛ we ɖó...",
    send: "Sɛ́n",
    newChat: "Xóxó yɔyɔ̌",
    disclaimer: "⚕️ Enyi nukúnmɛ ɖokponɔ ɖè wɛ mɛ. Yì kpɔ́n dokita.",
    emergencyTitle: "🚨 Hwenu vívɛ́",
    emergencyCall: "Ylɔ́ alɔdó",
    language: "Gbè",
    welcomeMessage: "Ɛ̃ ! Un nyí Medichat 👋",
    welcomeSubtitle:
      "Dokita AI towe ɖò Bénin. Nú a ɖó azɔ̌wema, ma lɛ́ na wɛn we.",
    thinkingMessage: "Un ɖò xò ɖè...",
    urgencyLabel: "Hwenu tɔn",
    diseaseLabel: "Azɔn e sixu nyí é",
    actionLabel: "Nǔ e na wà",
    symptomsDetected: "Hwɛjijɔ e mǐ mɔ lɛ",
    noSymptomsFound: "Mǐ mɔ hwɛjijɔ ɖe ó. Ɖɔ nǔ e hwɛ we ɖó.",
    triageResult: "Azɔ̌ tɔn",
    low: "Kpɛví",
    moderate: "Tɛnkpɔn",
    high: "Hù",
    urgent: "Hwenu vívɛ́",
    critical: "Nǔvivɛ́ tawun",
    nearbyCenter: "Suklɛ e ɖò kpɔ́",
    findCenter: "Mɔ suklɛ",
    phone: "Fónu",
    address: "Adresse",
    services: "Azɔ̌ lɛ",
    quickSymptoms: "🤒 Un ɖó azɔn",
    quickPrevention: "🛡️ Gbɔjɛjɛ",
    quickCenters: "🏥 Suklɛ lɛ",
    quickEmergency: "🚨 Hwenu vívɛ́",
    medicalDisclaimer:
      "⚕️ AVERTISSEMENT: Enyi nukúnmɛ ɖokponɔ ɖè wɛ mɛ. Yì kpɔ́n dokita.",
    askSymptoms:
      "Hwɛjijɔ tɛ lɛ a mɔ? Ɖɔ ye bǐ.",
    moreInfo: "A jló na mɔ nǔ ɖevo ɖé à?",
  },

  yo: {
    appName: "Medichat",
    appTagline: "Olùrànlọ́wọ́ Ìlera AI — Bénin",
    typePlaceholder: "Ṣàpèjúwe àwọn àmì àìsàn rẹ...",
    send: "Fi ránṣẹ́",
    newChat: "Ìjíròrò Tuntun",
    disclaimer: "⚕️ Èyí kì í ṣe ìdámọ̀ àìsàn. Jọ̀wọ́ gbìmọ̀ dókítà.",
    emergencyTitle: "🚨 Pàjáwìrì",
    emergencyCall: "Pe Ìrànlọ́wọ́",
    language: "Èdè",
    welcomeMessage: "Ẹ káàbọ̀! Èmi ni Medichat 👋",
    welcomeSubtitle:
      "Olùrànlọ́wọ́ ìlera AI rẹ ní Bénin. Mo lè ṣàyẹ̀wò àwọn àmì àìsàn rẹ.",
    thinkingMessage: "Mò ń ṣàyẹ̀wò...",
    urgencyLabel: "Ìpele Pàjáwìrì",
    diseaseLabel: "Àìsàn Tó Ṣeéṣe",
    actionLabel: "Ohun Tó Yẹ Kí A Ṣe",
    symptomsDetected: "Àwọn Àmì Àìsàn Tí A Rí",
    noSymptomsFound: "A kò rí àmì àìsàn. Jọ̀wọ́ ṣàpèjúwe ohun tí o nímọ̀lára.",
    triageResult: "Èsì Ìyẹ̀wò",
    low: "Kékeré",
    moderate: "Àárín",
    high: "Gíga",
    urgent: "Pàjáwìrì",
    critical: "Ewu Jíjinlẹ̀",
    nearbyCenter: "Ilé Ìwòsàn Tó Sún Mọ́",
    findCenter: "Wá Ilé Ìwòsàn",
    phone: "Fóònù",
    address: "Àdírẹ́sì",
    services: "Àwọn Ìṣẹ́",
    quickSymptoms: "🤒 Mo ní àmì àìsàn",
    quickPrevention: "🛡️ Ìdènà Àìsàn",
    quickCenters: "🏥 Ilé Ìwòsàn",
    quickEmergency: "🚨 Pàjáwìrì",
    medicalDisclaimer:
      "⚕️ ÌKÌLỌ̀: Èyí kì í ṣe ìdámọ̀ àìsàn. Jọ̀wọ́ gbìmọ̀ dókítà.",
    askSymptoms:
      "Àwọn àmì àìsàn wo ló wà? Jọ̀wọ́ ṣàpèjúwe rẹ̀ ní ìpéjúpẹ̀lẹ̀.",
    moreInfo: "Ṣé o fẹ́ mọ̀ nípa ìdènà tàbí ilé ìwòsàn tó sún mọ́?",
  },
};
