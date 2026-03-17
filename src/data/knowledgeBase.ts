// ============================================================
// MEDICHAT — BASE DE CONNAISSANCES MÉDICALE
// Format structuré : maladies, symptômes, gravité, conseils
// ============================================================

export interface Disease {
  id: string;
  name: string;
  nameLocal?: { fon?: string; yoruba?: string };
  symptoms: string[];
  severity: "low" | "moderate" | "high" | "critical";
  urgency: number; // 1-5
  advice: string[];
  prevention: string[];
  whenToSeekHelp: string;
  description: string;
}

export const medicalKnowledgeBase: Disease[] = [
  {
    id: "malaria",
    name: "Paludisme",
    nameLocal: { fon: "Aho", yoruba: "Ibà" },
    symptoms: [
      "fièvre",
      "frissons",
      "maux de tête",
      "douleurs musculaires",
      "fatigue",
      "nausées",
      "vomissements",
      "transpiration",
      "sueurs nocturnes",
      "pâleur",
      "jaunisse",
      "frisson",
      "chaleur intense",
      "courbatures",
    ],
    severity: "high",
    urgency: 4,
    advice: [
      "Consultez immédiatement un agent de santé pour un test de diagnostic rapide (TDR).",
      "Ne prenez pas d'antipaludéens sans ordonnance médicale.",
      "Restez hydraté(e) et reposez-vous.",
      "Utilisez des compresses froides pour faire baisser la fièvre.",
      "Dormez sous une moustiquaire imprégnée d'insecticide.",
    ],
    prevention: [
      "Utilisez une moustiquaire imprégnée chaque nuit.",
      "Appliquez des répulsifs anti-moustiques.",
      "Portez des vêtements longs au coucher du soleil.",
      "Éliminez les eaux stagnantes autour de votre domicile.",
      "Consultez un médecin pour une chimioprophylaxie si vous voyagez.",
    ],
    whenToSeekHelp:
      "Urgence si fièvre > 38.5°C chez un enfant, convulsions, confusion, vomissements répétés ou incapacité à boire.",
    description:
      "Maladie parasitaire transmise par la piqûre de moustique Anophèles femelle infectée par Plasmodium.",
  },
  {
    id: "hiv",
    name: "VIH/SIDA",
    nameLocal: { fon: "VIH", yoruba: "Arun Egbogi" },
    symptoms: [
      "fatigue chronique",
      "perte de poids",
      "fièvre persistante",
      "sueurs nocturnes",
      "ganglions enflés",
      "infections récurrentes",
      "diarrhées chroniques",
      "toux persistante",
      "plaies buccales",
      "éruptions cutanées",
    ],
    severity: "critical",
    urgency: 5,
    advice: [
      "Consultez immédiatement un centre de santé pour un dépistage confidentiel.",
      "Le traitement antirétroviral (ARV) permet de vivre normalement.",
      "Le dépistage est gratuit et confidentiel au Bénin.",
      "Informez vos partenaires sexuels de la nécessité du dépistage.",
      "Ne partagez pas d'aiguilles ou d'objets tranchants.",
    ],
    prevention: [
      "Utilisez systématiquement des préservatifs.",
      "Réalisez un dépistage régulier.",
      "Évitez le partage d'aiguilles.",
      "Consultez pour une prophylaxie pré-exposition (PrEP) si à risque.",
      "Les femmes enceintes doivent se faire dépister pour protéger leur bébé.",
    ],
    whenToSeekHelp:
      "Consultez dès que possible si vous pensez avoir été exposé(e). Le traitement précoce améliore significativement le pronostic.",
    description:
      "Virus qui affaiblit le système immunitaire. Transmis par les rapports sexuels, le sang et de la mère à l'enfant.",
  },
  {
    id: "tuberculosis",
    name: "Tuberculose",
    nameLocal: { fon: "Kpèvi", yoruba: "Ẹ̀gbẹ́ Ẹ̀dọ̀fóró" },
    symptoms: [
      "toux persistante",
      "toux de plus de 3 semaines",
      "crachats avec sang",
      "hémoptysie",
      "fièvre légère",
      "sueurs nocturnes",
      "perte de poids inexpliquée",
      "fatigue",
      "essoufflement",
      "douleurs thoraciques",
    ],
    severity: "high",
    urgency: 4,
    advice: [
      "Consultez immédiatement un centre de santé — le traitement est gratuit au Bénin.",
      "Couvrez votre bouche quand vous toussez ou éternuez.",
      "Aérez bien les pièces de votre domicile.",
      "Suivez scrupuleusement le traitement jusqu'à la fin (6 mois minimum).",
      "Informez les personnes vivant avec vous de la nécessité d'un dépistage.",
    ],
    prevention: [
      "Vaccination BCG des nourrissons.",
      "Aérez régulièrement les espaces de vie.",
      "Évitez les contacts prolongés avec des personnes infectées non traitées.",
      "Renforcez votre système immunitaire (alimentation, sommeil).",
      "Dépistage des contacts proches d'une personne diagnostiquée.",
    ],
    whenToSeekHelp:
      "Consultez si toux > 3 semaines, surtout avec sang dans les crachats, fièvre ou perte de poids.",
    description:
      "Maladie infectieuse bactérienne qui touche principalement les poumons, transmise par voie aérienne.",
  },
  {
    id: "hypertension",
    name: "Hypertension artérielle",
    nameLocal: { fon: "Huyết áp cao", yoruba: "Ìgbòkègbodò Ẹ̀jẹ̀" },
    symptoms: [
      "maux de tête sévères",
      "vertiges",
      "vision trouble",
      "saignement de nez",
      "essoufflement",
      "douleurs thoraciques",
      "palpitations",
      "bourdonnements d'oreilles",
      "fatigue",
      "confusion",
    ],
    severity: "high",
    urgency: 4,
    advice: [
      "Mesurez régulièrement votre tension artérielle.",
      "Prenez vos médicaments régulièrement sans interruption.",
      "Réduisez votre consommation de sel.",
      "Pratiquez une activité physique régulière (30 min/jour).",
      "Évitez le stress, l'alcool et le tabac.",
    ],
    prevention: [
      "Maintenez un poids santé.",
      "Réduisez la consommation de sel à moins de 5g/jour.",
      "Pratiquez une activité physique régulière.",
      "Limitez l'alcool et évitez le tabac.",
      "Gérez le stress par la relaxation et le sommeil.",
    ],
    whenToSeekHelp:
      "URGENCE si tension > 180/120 mmHg avec maux de tête violents, vision trouble, douleurs thoraciques ou confusion.",
    description:
      "Pression artérielle chroniquement élevée, facteur de risque majeur d'accident vasculaire cérébral et d'infarctus.",
  },
  {
    id: "respiratory",
    name: "Infection respiratoire",
    nameLocal: { fon: "Kpovi gbagba", yoruba: "Àrùn Ẹ̀gbẹ́" },
    symptoms: [
      "toux",
      "rhume",
      "congestion nasale",
      "mal de gorge",
      "fièvre",
      "difficultés respiratoires",
      "respiration sifflante",
      "essoufflement",
      "mucus coloré",
      "douleurs thoraciques",
      "nez qui coule",
    ],
    severity: "moderate",
    urgency: 3,
    advice: [
      "Reposez-vous et hydratez-vous abondamment.",
      "Utilisez du miel et du citron pour apaiser la gorge.",
      "Inhalez de la vapeur d'eau chaude pour décongestionner.",
      "Consultez si la fièvre dépasse 39°C ou dure plus de 3 jours.",
      "Évitez les antibiotiques sans prescription médicale.",
    ],
    prevention: [
      "Lavez-vous les mains régulièrement.",
      "Évitez les contacts avec des personnes malades.",
      "Aérez bien votre logement.",
      "Renforcez votre immunité avec une alimentation équilibrée.",
      "Vaccination contre la grippe recommandée pour les personnes vulnérables.",
    ],
    whenToSeekHelp:
      "Consultez si difficultés respiratoires, fièvre élevée persistante, crachats sanglants ou douleurs thoraciques intenses.",
    description:
      "Infections touchant les voies respiratoires supérieures ou inférieures, souvent virales ou bactériennes.",
  },
  {
    id: "diarrhea",
    name: "Diarrhée / Gastro-entérite",
    nameLocal: { fon: "Alodji", yoruba: "Igbẹ gbuuru" },
    symptoms: [
      "diarrhée",
      "selles liquides",
      "douleurs abdominales",
      "crampes",
      "nausées",
      "vomissements",
      "déshydratation",
      "fièvre légère",
      "sang dans les selles",
      "ventre qui fait mal",
      "mal au ventre",
    ],
    severity: "moderate",
    urgency: 3,
    advice: [
      "Buvez beaucoup d'eau et préparez une solution de réhydratation orale (SRO).",
      "Recette SRO : 1L d'eau + 6 cuillères de sucre + 1/2 cuillère de sel.",
      "Mangez des aliments légers : riz, banane, pain grillé.",
      "Évitez les produits laitiers, les aliments gras et épicés.",
      "Consultez si diarrhée avec sang ou > 3 jours, surtout chez l'enfant.",
    ],
    prevention: [
      "Lavez-vous les mains avant de manger et après les toilettes.",
      "Buvez de l'eau traitée ou bouillie.",
      "Mangez des aliments bien cuits et frais.",
      "Conservez les aliments au frais.",
      "Lavez les fruits et légumes avant consommation.",
    ],
    whenToSeekHelp:
      "URGENCE si enfant < 5 ans avec diarrhée sévère, sang dans selles, signes de déshydratation (yeux creux, bouche sèche, pas d'urine).",
    description:
      "Émission de selles liquides fréquentes pouvant entraîner une déshydratation dangereuse, surtout chez les jeunes enfants.",
  },
  {
    id: "typhoid",
    name: "Fièvre typhoïde",
    nameLocal: { fon: "Aho gbégbé", yoruba: "Ibà Typhoid" },
    symptoms: [
      "fièvre prolongée",
      "fièvre continue",
      "maux de tête",
      "fatigue intense",
      "perte d'appétit",
      "douleurs abdominales",
      "constipation",
      "diarrhée",
      "éruption cutanée",
      "taches rosées",
      "rate enflée",
    ],
    severity: "high",
    urgency: 4,
    advice: [
      "Consultez immédiatement un médecin pour un diagnostic et un traitement approprié.",
      "Prenez les antibiotiques prescrits jusqu'à la fin du traitement.",
      "Reposez-vous et hydratez-vous abondamment.",
      "Mangez des aliments faciles à digérer.",
      "Isolez-vous pour éviter de contaminer votre entourage.",
    ],
    prevention: [
      "Buvez uniquement de l'eau traitée ou bouillie.",
      "Lavez-vous les mains systématiquement.",
      "Évitez les aliments de rue non hygiéniques.",
      "Lavez bien les fruits et légumes.",
      "Vaccination contre la typhoïde recommandée dans les zones à risque.",
    ],
    whenToSeekHelp:
      "Consultez si fièvre persistante > 3 jours avec maux de tête et douleurs abdominales. Risque de complications graves sans traitement.",
    description:
      "Infection bactérienne systémique causée par Salmonella Typhi, transmise par l'eau et les aliments contaminés.",
  },
];

export const healthCenters = [
  {
    id: 1,
    name: "Centre National Hospitalier Universitaire (CNHU)",
    city: "Cotonou",
    address: "Avenue Jean-Paul II, Cotonou",
    phone: "+229 21 30 01 55",
    type: "Hôpital universitaire",
    services: ["Urgences", "Médecine générale", "Pédiatrie", "Maternité"],
    lat: 6.3703,
    lng: 2.3912,
  },
  {
    id: 2,
    name: "Hôpital de Zone de Calavi",
    city: "Abomey-Calavi",
    address: "Abomey-Calavi",
    phone: "+229 21 36 00 12",
    type: "Hôpital de zone",
    services: ["Médecine générale", "Maternité", "Pédiatrie"],
    lat: 6.4484,
    lng: 2.3559,
  },
  {
    id: 3,
    name: "Hôpital de Zone de Porto-Novo",
    city: "Porto-Novo",
    address: "Porto-Novo",
    phone: "+229 20 21 23 45",
    type: "Hôpital de zone",
    services: ["Urgences", "Médecine générale", "Maternité"],
    lat: 6.4969,
    lng: 2.6289,
  },
  {
    id: 4,
    name: "Centre de Santé de Parakou",
    city: "Parakou",
    address: "Parakou",
    phone: "+229 23 61 00 78",
    type: "Centre de santé",
    services: ["Médecine générale", "Pédiatrie", "Vaccination"],
    lat: 9.337,
    lng: 2.6283,
  },
  {
    id: 5,
    name: "Hôpital Saint-Jean de Dieu",
    city: "Tanguiéta",
    address: "Tanguiéta, Atacora",
    phone: "+229 23 82 01 00",
    type: "Hôpital catholique",
    services: ["Urgences", "Chirurgie", "Maternité", "Pédiatrie"],
    lat: 10.6228,
    lng: 1.2665,
  },
  {
    id: 6,
    name: "Centre de Santé Communautaire Djougou",
    city: "Djougou",
    address: "Djougou",
    phone: "+229 23 80 01 23",
    type: "Centre communautaire",
    services: ["Médecine générale", "Vaccination", "Paludisme"],
    lat: 9.7085,
    lng: 1.6659,
  },
];
