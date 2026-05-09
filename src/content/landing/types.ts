export interface EntityCardCopy {
  lockup: string
  heading: string
  description: string
  bullets: string[]
  cta: string
}

export interface PillarCopy {
  icon: string
  title: string
  caption: string
}

export interface PersonaCopy {
  title: string
  tags: string[]
}

export interface StepCopy {
  title: string
  body: string
}

export interface PlanCopy {
  name: string
  price: string
  priceNote: string
  features: string[]
  cta: string
  highlighted: boolean
}

export interface FooterLinkCopy {
  label: string
  href: string
}

/**
 * Full copy contract for the parent landing page.
 * Both parent.en.ts and parent.fr.ts must satisfy this type exactly.
 * TypeScript will refuse to compile if a key is missing in either locale.
 */
export interface ParentLandingCopy {
  hero: {
    headline: string
    subHeadline: string
    ctaToeic: string
    ctaFinance: string
    signInPrompt: string
    signInCta: string
  }
  entityCards: {
    sectionLabel: string
    toeic: EntityCardCopy
    finance: EntityCardCopy
  }
  bridge: {
    heading: string
    body: string
    pillars: PillarCopy[]
  }
  personas: {
    heading: string
    body: string
    items: PersonaCopy[]
  }
  howItWorks: {
    heading: string
    steps: StepCopy[]
    profileVectorLabel: string
    profileVectorTooltip: string
  }
  socialProof: {
    heading: string
    placeholder: string
  }
  pricingTeaser: {
    heading: string
    plans: PlanCopy[]
    viewFullLabel: string
  }
  finalCta: {
    heading: string
    subHeading: string
    ctaTest: string
    ctaSignIn: string
  }
  footer: {
    tagline: string
    product: FooterLinkCopy[]
    company: FooterLinkCopy[]
    legal: FooterLinkCopy[]
    copyright: string
  }
  nav: {
    signIn: string
    getStarted: string
    toeic: string
    finance: string
    pricing: string
    about: string
  }
}
