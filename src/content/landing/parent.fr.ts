import type { ParentLandingCopy } from './types'

export const fr: ParentLandingCopy = {
  hero: {
    headline: 'Maîtrise l\'anglais. Maîtrise les marchés. Un seul écosystème.',
    subHeadline:
      'LEXORA est la plateforme d\'apprentissage conçue pour les étudiants en finance — l\'anglais et les marchés réunis dans une expérience connectée.',
    ctaToeic: 'Accéder à LEXORA TOEIC',
    ctaFinance: 'Accéder à LEXORA Finance',
    signInPrompt: 'Déjà un compte ?',
    signInCta: 'Se connecter',
  },

  entityCards: {
    sectionLabel: 'Deux univers, une plateforme',
    toeic: {
      lockup: 'LEXORA / TOEIC',
      heading: 'Pour ton excellence en anglais et au TOEIC',
      description:
        'Construis ton niveau d\'anglais pas à pas avec grammaire, vocabulaire, flashcards, entraînement TOEIC, corrections détaillées et suivi de progression.',
      bullets: [
        'Test de placement adaptatif → parcours personnalisé',
        'Maîtrise TOEIC Partie 5 / Partie 6 / Partie 7',
        'Flashcards, dictionnaire, répétition espacée',
        'Révision des erreurs et suivi de progression',
      ],
      cta: 'Accéder à LEXORA TOEIC',
    },
    finance: {
      lockup: 'LEXORA / Finance',
      heading: 'Pour ta carrière en finance',
      description:
        'Apprends la finance de marché, les dérivés, le fixed income et l\'anglais financier professionnel à travers une académie structurée avec des préparations aux certifications originales.',
      bullets: [
        'Prépa CFA Niveau 1, AMF, ACI Dealing — contenu original',
        'Finance de marché + anglais financier + prep entretiens',
        'Priceurs, simulateurs, études de cas',
        'Conçu pour les candidats S&T, IB, Asset Management',
      ],
      cta: 'Accéder à LEXORA Finance',
    },
  },

  bridge: {
    heading: 'Reliés, pas empilés',
    body: 'Les carrières en finance ne se résument pas à la technique. Elles exigent un anglais fluide, une compréhension des marchés, et la capacité d\'expliquer clairement des idées complexes. LEXORA réunit les deux mondes — et les relie par un graphe de connaissances qui les renforce mutuellement.',
    pillars: [
      {
        icon: '🔗',
        title: 'Un seul compte',
        caption: 'Passe d\'une entité à l\'autre à tout moment, sans deuxième inscription',
      },
      {
        icon: '🧠',
        title: 'Un seul cerveau',
        caption: 'Les concepts se relient automatiquement entre anglais et finance',
      },
      {
        icon: '📈',
        title: 'Maîtrise composée',
        caption: 'Progresser dans l\'un accélère la progression dans l\'autre',
      },
    ],
  },

  personas: {
    heading: 'Conçue pour le chemin que tu prends',
    body: 'LEXORA est faite pour les étudiants en école de commerce, MBA et master finance — ceux qui jonglent entre TOEIC, AMF, CFA Niveau 1, entretiens de stage et partiels. On a construit une plateforme pour que tu arrêtes d\'en jongler cinq.',
    items: [
      {
        title: 'Le candidat au stage S&T',
        tags: ['TOEIC 750+', 'Dérivés', 'Prep entretiens'],
      },
      {
        title: 'Le candidat analyste IB',
        tags: ['Anglais des affaires', 'DCF / LBO', 'Maîtrise comportementale'],
      },
      {
        title: 'Le candidat CFA',
        tags: ['Prépa CFA N1', 'Anglais financier', 'Discipline'],
      },
    ],
  },

  howItWorks: {
    heading: 'Comment ça marche',
    steps: [
      {
        title: 'Passe le test de placement',
        body: 'Adaptatif, multi-parcours, ~10 minutes. On détermine ton niveau sur toutes les dimensions qui comptent pour tes objectifs.',
      },
      {
        title: 'Reçois ton plan personnalisé',
        body: 'Un programme sur 7 jours combinant modules anglais et finance, calibré sur tes examens cibles et tes délais.',
      },
      {
        title: 'Suis tout dans un seul dashboard',
        body: 'Ton vecteur de profil couvre les deux entités. Une seule source de vérité, une seule progression.',
      },
    ],
    profileVectorLabel: 'C\'est quoi un vecteur de profil ?',
    profileVectorTooltip:
      'Un modèle de compétences multidimensionnel qui suit ton niveau sur tous les parcours LEXORA — grammaire TOEIC, vocabulaire, entraînement TOEIC, finance de marché, anglais financier et plus — simultanément.',
  },

  socialProof: {
    heading: 'Ce que disent les étudiants',
    placeholder: 'Les avis d\'étudiants arrivent bientôt. Sois parmi les premiers à partager le tien.',
  },

  pricingTeaser: {
    heading: 'Tarifs simples et honnêtes',
    plans: [
      {
        name: 'Gratuit',
        price: '0 €',
        priceNote: 'à vie',
        features: [
          'Test de placement',
          'Premier cours par parcours',
          'Dictionnaire (50 termes)',
        ],
        cta: 'Commencer gratuitement',
        highlighted: false,
      },
      {
        name: 'Étudiant',
        price: '~5–10 €',
        priceNote: 'par mois · tarif définitif à venir',
        features: [
          'Accès complet LEXORA TOEIC',
          'Accès complet LEXORA Finance',
          'Tous les parcours certifications',
          'Synchronisation multi-appareils',
        ],
        cta: 'Accès complet',
        highlighted: true,
      },
      {
        name: 'École / B2B',
        price: 'Nous contacter',
        priceNote: 'tarif cohorte',
        features: [
          'Gestion des cohortes',
          'Dashboard analytics enseignant',
          'Devoirs en masse',
          'Support dédié',
        ],
        cta: 'Nous contacter',
        highlighted: false,
      },
    ],
    viewFullLabel: 'Voir les détails complets des tarifs',
  },

  finalCta: {
    heading: 'Prêt à commencer ?',
    subHeading:
      '10 minutes pour le test de niveau. Ton plan suit immédiatement.',
    ctaTest: 'Commencer le test de placement',
    ctaSignIn: 'Se connecter',
  },

  footer: {
    tagline: 'La plateforme d\'apprentissage conçue pour les étudiants en finance.',
    product: [
      { label: 'LEXORA TOEIC', href: '/toeic' },
      { label: 'LEXORA Finance', href: '/finance' },
      { label: 'Tarifs', href: '/pricing' },
    ],
    company: [
      { label: 'À propos', href: '/about' },
      { label: 'Pour les écoles', href: '/schools' },
      { label: 'Contact', href: '/contact' },
    ],
    legal: [
      { label: 'CGU', href: '/terms' },
      { label: 'Confidentialité', href: '/privacy' },
      { label: 'Cookies', href: '/cookies' },
      { label: 'Mentions légales', href: '/mentions-legales' },
    ],
    copyright: '© 2026 LEXORA',
  },

  nav: {
    signIn: 'Se connecter',
    getStarted: 'Commencer',
    toeic: 'TOEIC',
    finance: 'Finance',
    pricing: 'Tarifs',
    about: 'À propos',
  },
}
