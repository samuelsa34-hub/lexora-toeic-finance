import type { ParentLandingCopy } from './types'

export const en: ParentLandingCopy = {
  hero: {
    headline: 'Master English. Master Markets. One ecosystem.',
    subHeadline:
      'LEXORA is the learning platform built for finance students — combining English mastery and market expertise in one connected experience.',
    ctaToeic: 'Enter LEXORA TOEIC',
    ctaFinance: 'Enter LEXORA Finance',
    signInPrompt: 'Already have an account?',
    signInCta: 'Sign in',
  },

  entityCards: {
    sectionLabel: 'Two universes, one platform',
    toeic: {
      lockup: 'LEXORA / TOEIC',
      heading: 'For English mastery and TOEIC success',
      description:
        'Build your English level step by step with grammar, vocabulary, flashcards, TOEIC practice, detailed corrections, and progress tracking.',
      bullets: [
        'Adaptive placement test → personalized path',
        'TOEIC Part 5 / Part 6 / Part 7 mastery',
        'Flashcards, dictionary, spaced repetition',
        'Mistake review and progress tracking',
      ],
      cta: 'Enter LEXORA TOEIC',
    },
    finance: {
      lockup: 'LEXORA / Finance',
      heading: 'For your finance career',
      description:
        'Learn market finance, derivatives, fixed income, and professional financial English through a structured premium academy with original certification prep.',
      bullets: [
        'CFA Level 1, AMF, ACI Dealing prep — original content',
        'Market finance + financial English + interview prep',
        'Pricers, simulators, case studies',
        'Built for S&T, IB, Asset Management candidates',
      ],
      cta: 'Enter LEXORA Finance',
    },
  },

  bridge: {
    heading: 'Connected, not bundled',
    body: 'Finance careers require more than technical knowledge. They require fluent English, market understanding, and the ability to explain complex ideas clearly. LEXORA brings both worlds together — and connects them through one knowledge graph that makes each side stronger.',
    pillars: [
      {
        icon: '🔗',
        title: 'One account',
        caption: 'Switch between entities anytime, no second sign-up',
      },
      {
        icon: '🧠',
        title: 'One brain',
        caption: 'Concepts cross-link between English and Finance automatically',
      },
      {
        icon: '📈',
        title: 'Compounding mastery',
        caption: 'Progress in one accelerates progress in the other',
      },
    ],
  },

  personas: {
    heading: 'Built for the path you\'re on',
    body: 'LEXORA is made for students at business schools, MBAs, and finance master\'s programs — the students juggling TOEIC, AMF, CFA Level 1, internship interviews, and school finals all at once. We built one platform so you stop juggling five.',
    items: [
      {
        title: 'The S&T intern candidate',
        tags: ['TOEIC 750+', 'Derivatives', 'Interview prep'],
      },
      {
        title: 'The IB analyst candidate',
        tags: ['Business English', 'DCF / LBO', 'Behavioral mastery'],
      },
      {
        title: 'The CFA candidate',
        tags: ['CFA L1 prep', 'Financial English', 'Discipline'],
      },
    ],
  },

  howItWorks: {
    heading: 'How it works',
    steps: [
      {
        title: 'Take the placement test',
        body: 'Adaptive, multi-track, ~10 minutes. We figure out where you stand on every dimension that matters for your goals.',
      },
      {
        title: 'Get your personalized plan',
        body: 'A 7-day schedule combining English and Finance modules calibrated to your target exams and deadlines.',
      },
      {
        title: 'Track everything in one dashboard',
        body: 'Your profile vector spans both entities. One source of truth, one progression.',
      },
    ],
    profileVectorLabel: 'What\'s a profile vector?',
    profileVectorTooltip:
      'A multi-dimensional skill model that tracks your level across all LEXORA tracks — TOEIC grammar, vocabulary, TOEIC practice, market finance, financial English, and more — simultaneously.',
  },

  socialProof: {
    heading: 'What students say',
    placeholder: 'Student reviews coming soon. Be one of the first to share yours.',
  },

  pricingTeaser: {
    heading: 'Simple, honest pricing',
    plans: [
      {
        name: 'Free',
        price: '€0',
        priceNote: 'forever',
        features: [
          'Placement test',
          'First lesson per track',
          'Dictionary (50 terms)',
        ],
        cta: 'Start free',
        highlighted: false,
      },
      {
        name: 'Student',
        price: '~€5–10',
        priceNote: 'per month · final price TBD',
        features: [
          'Full LEXORA TOEIC access',
          'Full LEXORA Finance access',
          'All certifications tracks',
          'Progress sync across devices',
        ],
        cta: 'Get full access',
        highlighted: true,
      },
      {
        name: 'School / B2B',
        price: 'Contact us',
        priceNote: 'cohort pricing',
        features: [
          'Cohort management',
          'Teacher analytics dashboard',
          'Bulk assignments',
          'Dedicated support',
        ],
        cta: 'Contact us',
        highlighted: false,
      },
    ],
    viewFullLabel: 'See full pricing details',
  },

  finalCta: {
    heading: 'Ready to start?',
    subHeading:
      '10 minutes for the placement test. Your plan comes right after.',
    ctaTest: 'Start the placement test',
    ctaSignIn: 'Sign in',
  },

  footer: {
    tagline: 'The learning platform built for finance students.',
    product: [
      { label: 'LEXORA TOEIC', href: '/toeic' },
      { label: 'LEXORA Finance', href: '/finance' },
      { label: 'Pricing', href: '/pricing' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'For Schools', href: '/schools' },
      { label: 'Contact', href: '/contact' },
    ],
    legal: [
      { label: 'Terms', href: '/terms' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Cookies', href: '/cookies' },
      { label: 'Mentions légales', href: '/mentions-legales' },
    ],
    copyright: '© 2026 LEXORA',
  },

  nav: {
    signIn: 'Sign in',
    getStarted: 'Get started',
    toeic: 'TOEIC',
    finance: 'Finance',
    pricing: 'Pricing',
    about: 'About',
  },
}
