// ============================================================
// MEDICHAT — MOTEUR DE TRIAGE MÉDICAL
// Système basé sur règles : SI symptômes → ALORS action
// 100+ règles médicales structurées
// ============================================================

export interface TriageRule {
  id: string;
  symptoms: string[];
  disease: string;
  urgencyLevel: 1 | 2 | 3 | 4 | 5;
  urgencyLabel: "Faible" | "Modéré" | "Élevé" | "Urgent" | "Critique";
  action: string;
  recommendation: string;
  color: "green" | "yellow" | "orange" | "red" | "purple";
}

export interface TriageResult {
  rule: TriageRule;
  matchScore: number;
  matchedSymptoms: string[];
}

export const triageRules: TriageRule[] = [
  // ==================== PALUDISME ====================
  {
    id: "MAL-001",
    symptoms: ["fièvre", "frissons", "maux de tête", "courbatures"],
    disease: "Paludisme probable",
    urgencyLevel: 4,
    urgencyLabel: "Urgent",
    action: "Consultez un centre de santé dans les 24h pour un test TDR.",
    recommendation: "Test de diagnostic rapide paludisme requis.",
    color: "red",
  },
  {
    id: "MAL-002",
    symptoms: ["fièvre", "vomissements", "frissons", "fatigue"],
    disease: "Paludisme probable",
    urgencyLevel: 4,
    urgencyLabel: "Urgent",
    action: "Consultez immédiatement un agent de santé.",
    recommendation: "Ne pas attendre : risque de paludisme sévère.",
    color: "red",
  },
  {
    id: "MAL-003",
    symptoms: ["fièvre", "convulsions"],
    disease: "Paludisme cérébral possible",
    urgencyLevel: 5,
    urgencyLabel: "Critique",
    action: "URGENCE ABSOLUE — Rendez-vous aux urgences immédiatement.",
    recommendation: "Risque de paludisme cérébral. Danger de mort.",
    color: "purple",
  },
  {
    id: "MAL-004",
    symptoms: ["fièvre", "confusion", "perte de conscience"],
    disease: "Paludisme cérébral possible",
    urgencyLevel: 5,
    urgencyLabel: "Critique",
    action: "URGENCE — Appelez le SAMU ou allez aux urgences.",
    recommendation: "Complication grave possible du paludisme.",
    color: "purple",
  },
  {
    id: "MAL-005",
    symptoms: ["fièvre", "jaunisse", "urine foncée"],
    disease: "Paludisme sévère possible",
    urgencyLevel: 5,
    urgencyLabel: "Critique",
    action: "Urgence hospitalière immédiate.",
    recommendation: "Signes de paludisme grave avec atteinte hépatique.",
    color: "purple",
  },
  {
    id: "MAL-006",
    symptoms: ["fièvre", "transpiration", "fatigue"],
    disease: "Paludisme possible",
    urgencyLevel: 3,
    urgencyLabel: "Élevé",
    action: "Consultez dans les 48h pour un test de dépistage.",
    recommendation: "Symptômes évocateurs de paludisme simple.",
    color: "orange",
  },
  {
    id: "MAL-007",
    symptoms: ["fièvre", "frissons", "sueurs nocturnes"],
    disease: "Paludisme probable",
    urgencyLevel: 4,
    urgencyLabel: "Urgent",
    action: "Test TDR urgent recommandé.",
    recommendation: "Triade classique du paludisme.",
    color: "red",
  },
  {
    id: "MAL-008",
    symptoms: ["fièvre", "pâleur", "fatigue sévère"],
    disease: "Paludisme avec anémie possible",
    urgencyLevel: 4,
    urgencyLabel: "Urgent",
    action: "Consultation médicale urgente.",
    recommendation: "Risque d'anémie palustre.",
    color: "red",
  },
  {
    id: "MAL-009",
    symptoms: ["fièvre enfant", "refus de manger", "pleurs excessifs"],
    disease: "Paludisme pédiatrique possible",
    urgencyLevel: 5,
    urgencyLabel: "Critique",
    action: "URGENCE enfant — Consultez immédiatement.",
    recommendation: "Le paludisme est très dangereux chez les enfants.",
    color: "purple",
  },
  {
    id: "MAL-010",
    symptoms: ["mal de tête", "fièvre", "douleurs articulaires"],
    disease: "Paludisme possible",
    urgencyLevel: 3,
    urgencyLabel: "Élevé",
    action: "Consultez un centre de santé pour dépistage.",
    recommendation: "Symptômes compatibles avec le paludisme.",
    color: "orange",
  },

  // ==================== TUBERCULOSE ====================
  {
    id: "TB-001",
    symptoms: ["toux persistante", "sueurs nocturnes", "perte de poids"],
    disease: "Tuberculose probable",
    urgencyLevel: 4,
    urgencyLabel: "Urgent",
    action: "Consultez un centre anti-tuberculeux (CAT) immédiatement.",
    recommendation: "Triade classique de la tuberculose. Test recommandé.",
    color: "red",
  },
  {
    id: "TB-002",
    symptoms: ["toux avec sang", "hémoptysie"],
    disease: "Tuberculose / complication pulmonaire",
    urgencyLevel: 5,
    urgencyLabel: "Critique",
    action: "URGENCE — Consultez immédiatement.",
    recommendation: "Crachat sanguin = signe d'alarme grave.",
    color: "purple",
  },
  {
    id: "TB-003",
    symptoms: ["toux", "fièvre légère", "fatigue", "perte d'appétit"],
    disease: "Tuberculose possible",
    urgencyLevel: 3,
    urgencyLabel: "Élevé",
    action: "Dépistage tuberculose recommandé au centre de santé.",
    recommendation: "Consultez si toux > 3 semaines.",
    color: "orange",
  },
  {
    id: "TB-004",
    symptoms: ["toux persistante", "douleurs thoraciques", "essoufflement"],
    disease: "Tuberculose / affection pulmonaire",
    urgencyLevel: 4,
    urgencyLabel: "Urgent",
    action: "Radiographie pulmonaire et examen des crachats requis.",
    recommendation: "Signes d'atteinte pulmonaire sévère.",
    color: "red",
  },
  {
    id: "TB-005",
    symptoms: ["ganglions enflés", "fièvre", "sueurs nocturnes"],
    disease: "Tuberculose ganglionnaire possible",
    urgencyLevel: 3,
    urgencyLabel: "Élevé",
    action: "Consultez pour dépistage tuberculose extrapulmonaire.",
    recommendation: "Tuberculose peut toucher d'autres organes.",
    color: "orange",
  },

  // ==================== VIH ====================
  {
    id: "HIV-001",
    symptoms: [
      "fatigue chronique",
      "perte de poids",
      "infections récurrentes",
    ],
    disease: "Infection VIH possible",
    urgencyLevel: 4,
    urgencyLabel: "Urgent",
    action: "Dépistage VIH confidentiel et gratuit au centre de santé.",
    recommendation: "Test rapide VIH disponible partout au Bénin.",
    color: "red",
  },
  {
    id: "HIV-002",
    symptoms: ["fièvre persistante", "sueurs nocturnes", "ganglions enflés"],
    disease: "Primo-infection VIH possible",
    urgencyLevel: 4,
    urgencyLabel: "Urgent",
    action: "Dépistage VIH urgent recommandé.",
    recommendation: "Symptômes de primo-infection VIH.",
    color: "red",
  },
  {
    id: "HIV-003",
    symptoms: ["diarrhée chronique", "perte de poids", "fatigue"],
    disease: "Infection VIH avancée possible",
    urgencyLevel: 4,
    urgencyLabel: "Urgent",
    action: "Consultez pour dépistage VIH et bilan complet.",
    recommendation: "Trithérapie efficace si diagnostiqué tôt.",
    color: "red",
  },
  {
    id: "HIV-004",
    symptoms: ["plaies buccales", "candidose", "infections fongiques"],
    disease: "Immunodépression / VIH possible",
    urgencyLevel: 4,
    urgencyLabel: "Urgent",
    action: "Dépistage VIH et consultation spécialisée.",
    recommendation: "Signes d'immunodépression.",
    color: "red",
  },

  // ==================== HYPERTENSION ====================
  {
    id: "HTA-001",
    symptoms: ["maux de tête sévères", "vertiges", "vision trouble"],
    disease: "Crise hypertensive possible",
    urgencyLevel: 5,
    urgencyLabel: "Critique",
    action: "URGENCE — Mesurez la tension. Si > 180/120, allez aux urgences.",
    recommendation: "Risque d'AVC. Ne pas ignorer ces symptômes.",
    color: "purple",
  },
  {
    id: "HTA-002",
    symptoms: ["saignement de nez", "maux de tête", "palpitations"],
    disease: "Hypertension artérielle probable",
    urgencyLevel: 4,
    urgencyLabel: "Urgent",
    action: "Mesurez votre tension artérielle immédiatement.",
    recommendation: "Epistaxis peut être signe d'HTA sévère.",
    color: "red",
  },
  {
    id: "HTA-003",
    symptoms: ["douleurs thoraciques", "essoufflement", "palpitations"],
    disease: "Complication cardiovasculaire possible",
    urgencyLevel: 5,
    urgencyLabel: "Critique",
    action: "URGENCE ABSOLUE — Appelez du secours.",
    recommendation: "Risque d'infarctus ou de crise cardiaque.",
    color: "purple",
  },
  {
    id: "HTA-004",
    symptoms: ["vertiges", "maux de tête", "bourdonnements d'oreilles"],
    disease: "Hypertension artérielle probable",
    urgencyLevel: 3,
    urgencyLabel: "Élevé",
    action: "Consultez pour mesure de la tension artérielle.",
    recommendation: "Contrôle tensionnel régulier recommandé.",
    color: "orange",
  },
  {
    id: "HTA-005",
    symptoms: ["confusion", "faiblesse d'un côté du corps", "trouble de la parole"],
    disease: "AVC possible — URGENCE ABSOLUE",
    urgencyLevel: 5,
    urgencyLabel: "Critique",
    action: "URGENCES IMMÉDIATES — Chaque minute compte.",
    recommendation: "Signes classiques d'AVC. Agissez dans les 3h.",
    color: "purple",
  },

  // ==================== INFECTIONS RESPIRATOIRES ====================
  {
    id: "RESP-001",
    symptoms: ["toux", "fièvre", "difficultés respiratoires"],
    disease: "Infection respiratoire / Pneumonie possible",
    urgencyLevel: 4,
    urgencyLabel: "Urgent",
    action: "Consultez rapidement — risque de pneumonie.",
    recommendation: "Détresse respiratoire = urgence médicale.",
    color: "red",
  },
  {
    id: "RESP-002",
    symptoms: ["rhume", "congestion nasale", "mal de gorge", "toux légère"],
    disease: "Infection respiratoire haute bénigne",
    urgencyLevel: 1,
    urgencyLabel: "Faible",
    action: "Repos, hydratation et traitements symptomatiques.",
    recommendation: "Consultez si ça dure plus de 7 jours.",
    color: "green",
  },
  {
    id: "RESP-003",
    symptoms: ["essoufflement sévère", "cyanose", "respiration difficile"],
    disease: "Détresse respiratoire aiguë",
    urgencyLevel: 5,
    urgencyLabel: "Critique",
    action: "URGENCE ABSOLUE — Oxygène et soins immédiats nécessaires.",
    recommendation: "Appelez du secours immédiatement.",
    color: "purple",
  },
  {
    id: "RESP-004",
    symptoms: ["fièvre", "toux", "douleurs thoraciques", "mucus coloré"],
    disease: "Pneumonie bactérienne probable",
    urgencyLevel: 4,
    urgencyLabel: "Urgent",
    action: "Consultez pour antibiotiques et bilan.",
    recommendation: "Pneumonie nécessite traitement antibiotique.",
    color: "red",
  },
  {
    id: "RESP-005",
    symptoms: ["respiration sifflante", "toux", "essoufflement"],
    disease: "Asthme / Bronchospasme",
    urgencyLevel: 3,
    urgencyLabel: "Élevé",
    action: "Consultez pour diagnostic et traitement de fond.",
    recommendation: "Bronchodilatateurs peuvent être nécessaires.",
    color: "orange",
  },

  // ==================== DIARRHÉE ====================
  {
    id: "DIA-001",
    symptoms: ["diarrhée", "vomissements", "déshydratation", "yeux creux"],
    disease: "Gastro-entérite sévère avec déshydratation",
    urgencyLevel: 5,
    urgencyLabel: "Critique",
    action: "URGENCE — Réhydratation IV en milieu médical.",
    recommendation: "Déshydratation sévère surtout dangereuse chez l'enfant.",
    color: "purple",
  },
  {
    id: "DIA-002",
    symptoms: ["diarrhée", "sang dans les selles", "fièvre"],
    disease: "Dysenterie / Infection intestinale grave",
    urgencyLevel: 4,
    urgencyLabel: "Urgent",
    action: "Consultez immédiatement pour traitement antibiotique.",
    recommendation: "Sang dans selles = signe d'alarme.",
    color: "red",
  },
  {
    id: "DIA-003",
    symptoms: ["diarrhée légère", "nausées", "douleurs abdominales"],
    disease: "Gastro-entérite bénigne",
    urgencyLevel: 1,
    urgencyLabel: "Faible",
    action: "SRO, repos et alimentation légère.",
    recommendation: "Surveillez les signes de déshydratation.",
    color: "green",
  },
  {
    id: "DIA-004",
    symptoms: ["diarrhée enfant", "fièvre", "vomissements"],
    disease: "Gastro-entérite pédiatrique",
    urgencyLevel: 4,
    urgencyLabel: "Urgent",
    action: "Consultez rapidement — enfants se déshydratent vite.",
    recommendation: "SRO immédiat + surveillance médicale.",
    color: "red",
  },
  {
    id: "DIA-005",
    symptoms: ["diarrhée chronique", "perte de poids", "fatigue"],
    disease: "Parasitose / Maladie chronique possible",
    urgencyLevel: 3,
    urgencyLabel: "Élevé",
    action: "Consultez pour coproculture et bilan complet.",
    recommendation: "Peut indiquer parasitose ou maladie inflammatoire.",
    color: "orange",
  },

  // ==================== FIÈVRE TYPHOÏDE ====================
  {
    id: "TYP-001",
    symptoms: ["fièvre prolongée", "maux de tête", "douleurs abdominales"],
    disease: "Fièvre typhoïde probable",
    urgencyLevel: 4,
    urgencyLabel: "Urgent",
    action: "Consultez pour Widal test et hémoculture.",
    recommendation: "Traitement antibiotique nécessaire.",
    color: "red",
  },
  {
    id: "TYP-002",
    symptoms: ["fièvre continue", "constipation", "taches rosées"],
    disease: "Fièvre typhoïde probable",
    urgencyLevel: 4,
    urgencyLabel: "Urgent",
    action: "Test sérologique (Widal) au centre de santé.",
    recommendation: "Triade typhoïde classique.",
    color: "red",
  },
  {
    id: "TYP-003",
    symptoms: ["fièvre", "diarrhée", "rate enflée", "perte d'appétit"],
    disease: "Typhoïde / Infection systémique",
    urgencyLevel: 4,
    urgencyLabel: "Urgent",
    action: "Bilan biologique urgent requis.",
    recommendation: "Splénomégalie possible — consultation spécialisée.",
    color: "red",
  },

  // ==================== DIABÈTE ====================
  {
    id: "DIA-D-001",
    symptoms: ["soif excessive", "urines fréquentes", "fatigue", "vision trouble"],
    disease: "Diabète possible",
    urgencyLevel: 3,
    urgencyLabel: "Élevé",
    action: "Consultez pour glycémie à jeun et bilan.",
    recommendation: "Dépistage diabète recommandé.",
    color: "orange",
  },
  {
    id: "DIA-D-002",
    symptoms: ["confusion", "sueurs froides", "tremblements"],
    disease: "Hypoglycémie possible",
    urgencyLevel: 4,
    urgencyLabel: "Urgent",
    action: "Sucre immédiatement, puis consultation médicale.",
    recommendation: "Hypoglycémie peut être dangereuse.",
    color: "red",
  },

  // ==================== MÉNINGITE ====================
  {
    id: "MEN-001",
    symptoms: ["raideur de la nuque", "fièvre sévère", "maux de tête intenses"],
    disease: "Méningite possible — URGENCE",
    urgencyLevel: 5,
    urgencyLabel: "Critique",
    action: "URGENCE ABSOLUE — Hospitalisez immédiatement.",
    recommendation: "La méningite est une urgence médicale absolue.",
    color: "purple",
  },
  {
    id: "MEN-002",
    symptoms: ["fièvre", "raideur nuque", "vomissements", "photophobie"],
    disease: "Méningite bactérienne possible",
    urgencyLevel: 5,
    urgencyLabel: "Critique",
    action: "URGENCE — Chaque heure compte.",
    recommendation: "Signes méningés = urgence absolue.",
    color: "purple",
  },

  // ==================== CHOLERA ====================
  {
    id: "CHOL-001",
    symptoms: ["diarrhée aqueuse abondante", "vomissements", "déshydratation rapide"],
    disease: "Choléra possible",
    urgencyLevel: 5,
    urgencyLabel: "Critique",
    action: "URGENCE — Réhydratation IV immédiate.",
    recommendation: "Choléra = urgence de santé publique.",
    color: "purple",
  },

  // ==================== SYNDROME GRIPPAL ====================
  {
    id: "GRIP-001",
    symptoms: ["fièvre", "courbatures", "fatigue", "maux de tête", "toux sèche"],
    disease: "Syndrome grippal",
    urgencyLevel: 2,
    urgencyLabel: "Modéré",
    action: "Repos, hydratation, paracétamol. Consultez si aggravation.",
    recommendation: "La grippe dure 5-7 jours. Surveillance recommandée.",
    color: "yellow",
  },
  {
    id: "GRIP-002",
    symptoms: ["fièvre", "toux", "essoufflement", "douleurs musculaires"],
    disease: "Grippe avec complications possibles",
    urgencyLevel: 3,
    urgencyLabel: "Élevé",
    action: "Consultez si l'essoufflement s'aggrave.",
    recommendation: "Risque de pneumonie grippale.",
    color: "orange",
  },

  // ==================== DERMATOLOGIE ====================
  {
    id: "DERM-001",
    symptoms: ["éruptions cutanées", "fièvre", "démangeaisons généralisées"],
    disease: "Réaction allergique / Maladie éruptive",
    urgencyLevel: 3,
    urgencyLabel: "Élevé",
    action: "Consultez pour identifier la cause et traiter.",
    recommendation: "Évitez de gratter. Antihistaminiques si disponibles.",
    color: "orange",
  },
  {
    id: "DERM-002",
    symptoms: ["gonflement du visage", "difficultés respiratoires", "éruptions"],
    disease: "Choc anaphylactique possible",
    urgencyLevel: 5,
    urgencyLabel: "Critique",
    action: "URGENCE ABSOLUE — Réaction allergique sévère.",
    recommendation: "Adrénaline peut être nécessaire.",
    color: "purple",
  },

  // ==================== MATERNITÉ ====================
  {
    id: "MAT-001",
    symptoms: ["saignements pendant la grossesse", "douleurs abdominales"],
    disease: "Complication obstétricale possible",
    urgencyLevel: 5,
    urgencyLabel: "Critique",
    action: "URGENCE MATERNITÉ — Consultez immédiatement.",
    recommendation: "Risque de fausse couche ou complication grave.",
    color: "purple",
  },
  {
    id: "MAT-002",
    symptoms: ["fièvre pendant la grossesse", "maux de tête sévères"],
    disease: "Pré-éclampsie / Infection pendant grossesse",
    urgencyLevel: 5,
    urgencyLabel: "Critique",
    action: "URGENCE — Maternité immédiatement.",
    recommendation: "Pré-éclampsie = danger pour mère et enfant.",
    color: "purple",
  },

  // ==================== DOULEURS ====================
  {
    id: "DOUL-001",
    symptoms: ["douleurs thoraciques", "irradiation bras gauche", "sueurs froides"],
    disease: "Infarctus du myocarde possible",
    urgencyLevel: 5,
    urgencyLabel: "Critique",
    action: "URGENCE ABSOLUE — Appelez les secours immédiatement.",
    recommendation: "Chaque minute compte lors d'un infarctus.",
    color: "purple",
  },
  {
    id: "DOUL-002",
    symptoms: ["douleurs abdominales sévères", "ventre dur", "fièvre"],
    disease: "Urgence abdominale / Appendicite possible",
    urgencyLevel: 5,
    urgencyLabel: "Critique",
    action: "URGENCE CHIRURGICALE — Consultez immédiatement.",
    recommendation: "Appendicite ou péritonite = urgence chirurgicale.",
    color: "purple",
  },
  {
    id: "DOUL-003",
    symptoms: ["douleurs lombaires", "fièvre", "brûlures urinaires"],
    disease: "Infection urinaire haute / Pyélonéphrite",
    urgencyLevel: 4,
    urgencyLabel: "Urgent",
    action: "Consultez rapidement pour antibiotiques.",
    recommendation: "Infection rénale nécessite traitement antibiotique.",
    color: "red",
  },

  // ==================== OPHTALMOLOGIE ====================
  {
    id: "OPH-001",
    symptoms: ["perte soudaine de vision", "douleurs oculaires"],
    disease: "Urgence ophtalmologique",
    urgencyLevel: 5,
    urgencyLabel: "Critique",
    action: "URGENCE — Consultez un ophtalmologue immédiatement.",
    recommendation: "Risque de cécité permanente sans traitement.",
    color: "purple",
  },

  // ==================== PEDIATRIE ====================
  {
    id: "PED-001",
    symptoms: ["fièvre enfant", "convulsions fébriles"],
    disease: "Convulsions fébriles / Méningite possible",
    urgencyLevel: 5,
    urgencyLabel: "Critique",
    action: "URGENCE — Enfant aux urgences immédiatement.",
    recommendation: "Convulsions chez l'enfant = urgence absolue.",
    color: "purple",
  },
  {
    id: "PED-002",
    symptoms: ["enfant qui ne mange pas", "perte de poids sévère", "œdèmes"],
    disease: "Malnutrition sévère",
    urgencyLevel: 4,
    urgencyLabel: "Urgent",
    action: "Centre nutritionnel thérapeutique urgent.",
    recommendation: "Malnutrition sévère est une urgence pédiatrique.",
    color: "red",
  },
  {
    id: "PED-003",
    symptoms: ["éruptions", "fièvre", "taches blanches dans la bouche"],
    disease: "Rougeole possible",
    urgencyLevel: 3,
    urgencyLabel: "Élevé",
    action: "Isolez l'enfant et consultez rapidement.",
    recommendation: "La rougeole est très contagieuse.",
    color: "orange",
  },

  // ==================== SANTÉ MENTALE ====================
  {
    id: "PSY-001",
    symptoms: ["pensées suicidaires", "désespoir", "idées de mort"],
    disease: "Crise suicidaire — URGENCE PSYCHOLOGIQUE",
    urgencyLevel: 5,
    urgencyLabel: "Critique",
    action: "URGENCE — Contactez un professionnel de santé mentale.",
    recommendation: "Ne laissez pas la personne seule. Appelez du secours.",
    color: "purple",
  },
  {
    id: "PSY-002",
    symptoms: ["tristesse prolongée", "manque d'énergie", "perte d'intérêt"],
    disease: "Dépression possible",
    urgencyLevel: 2,
    urgencyLabel: "Modéré",
    action: "Consultez un professionnel de santé mentale.",
    recommendation: "La dépression se traite. Demandez de l'aide.",
    color: "yellow",
  },

  // ==================== GÉNÉRAL ====================
  {
    id: "GEN-001",
    symptoms: ["fatigue", "perte d'appétit", "amaigrissement"],
    disease: "Bilan général requis",
    urgencyLevel: 2,
    urgencyLabel: "Modéré",
    action: "Bilan sanguin complet recommandé.",
    recommendation: "Symptômes non spécifiques nécessitant bilan.",
    color: "yellow",
  },
  {
    id: "GEN-002",
    symptoms: ["fatigue chronique", "maux de tête fréquents"],
    disease: "Causes multiples possibles",
    urgencyLevel: 2,
    urgencyLabel: "Modéré",
    action: "Consultez un médecin généraliste pour bilan.",
    recommendation: "Anémie, HTA ou autre cause à identifier.",
    color: "yellow",
  },
  {
    id: "GEN-003",
    symptoms: ["fièvre légère", "fatigue"],
    disease: "Infection légère probable",
    urgencyLevel: 1,
    urgencyLabel: "Faible",
    action: "Repos et surveillance. Consultez si aggravation.",
    recommendation: "Surveillez l'évolution des symptômes.",
    color: "green",
  },
];

// ============================================================
// FONCTION DE TRIAGE : analyse les symptômes et retourne les résultats
// ============================================================
export function performTriage(userSymptoms: string[]): TriageResult[] {
  const normalizedInput = userSymptoms.map((s) => s.toLowerCase().trim());
  const results: TriageResult[] = [];

  for (const rule of triageRules) {
    const normalizedRuleSymptoms = rule.symptoms.map((s) => s.toLowerCase());
    const matchedSymptoms: string[] = [];

    for (const ruleSymptom of normalizedRuleSymptoms) {
      for (const userSymptom of normalizedInput) {
        if (
          userSymptom.includes(ruleSymptom) ||
          ruleSymptom.includes(userSymptom) ||
          levenshteinDistance(userSymptom, ruleSymptom) <= 2
        ) {
          if (!matchedSymptoms.includes(ruleSymptom)) {
            matchedSymptoms.push(ruleSymptom);
          }
          break;
        }
      }
    }

    const matchScore = matchedSymptoms.length / rule.symptoms.length;
    if (matchScore >= 0.5 && matchedSymptoms.length >= 1) {
      results.push({ rule, matchScore, matchedSymptoms });
    }
  }

  return results
    .sort((a, b) => {
      if (b.rule.urgencyLevel !== a.rule.urgencyLevel) {
        return b.rule.urgencyLevel - a.rule.urgencyLevel;
      }
      return b.matchScore - a.matchScore;
    })
    .slice(0, 3);
}

function levenshteinDistance(a: string, b: string): number {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) =>
    Array.from({ length: a.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] =
        b[i - 1] === a[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[b.length][a.length];
}

export function extractSymptomsFromText(text: string): string[] {
  const symptomKeywords = [
    "fièvre", "frissons", "toux", "maux de tête", "mal de tête", "fatigue",
    "nausées", "vomissements", "diarrhée", "douleurs", "essoufflement",
    "perte de poids", "sueurs", "frisson", "courbatures", "vertiges",
    "pâleur", "jaunisse", "constipation", "sang", "saignement",
    "convulsions", "confusion", "palpitations", "gonflement", "éruption",
    "démangeaisons", "taches", "raideur", "paralysie", "vision trouble",
    "mal de gorge", "congestion", "mucus", "rhume", "ganglions",
    "perte d'appétit", "soif", "brûlures", "douleur", "difficultés respiratoires",
    "respiration sifflante", "transpiration", "tremblements", "déshydratation",
    "ventre qui fait mal", "mal au ventre", "nez qui coule", "perte de conscience",
  ];

  const lowerText = text.toLowerCase();
  return symptomKeywords.filter(
    (keyword) =>
      lowerText.includes(keyword) ||
      lowerText.includes(keyword.replace("è", "e").replace("é", "e").replace("ê", "e"))
  );
}
