import type { Passage } from '../types'

export const passages: Passage[] = [
  {
    id: 1,
    title: 'Business Travel Expense Policy Update',
    type: 'memo',
    difficulty: 'easy',
    estimatedTime: 4,
    wordCount: 198,
    text: `MEMORANDUM

TO: All Staff
FROM: Helen Park, Director of Finance
DATE: March 15
RE: Revised Business Travel Expense Policy

Effective April 1, the company will implement a revised business travel expense policy. The following changes apply to all employees who travel on company business.

Meal Allowances: Daily meal allowances will increase to $75 per day for domestic travel and $110 per day for international travel. Receipts are required for all individual meal expenses exceeding $25.

Accommodation: Employees should book accommodations through the company's preferred hotel program whenever possible. Bookings made outside the preferred program must receive prior written approval from a department head.

Transportation: Economy class airfare is standard for all domestic flights. Business class may be approved for international flights exceeding eight hours. All ground transportation must be booked through approved vendors listed on the company intranet.

Reimbursement Process: Expense claims must be submitted within 30 days of the trip's conclusion. Claims submitted after this deadline will require a written explanation and approval from the VP of Finance.

Employees with questions about the new policy should contact the Finance Department directly. A full copy of the revised policy is available on the company intranet.`,
    questions: [
      {
        q: 'What is the main purpose of this memo?',
        opts: ['To announce upcoming travel opportunities', 'To inform employees of changes to the expense policy', 'To request budget approval for travel costs', 'To remind staff to submit overdue expense claims'],
        correct: 1,
        type: 'main_idea',
        exp: "The memo is explicitly about implementing a 'revised business travel expense policy.' It informs staff of the new rules.",
        trap: "Option D is related to reimbursement but is only a minor detail, not the main purpose.",
      },
      {
        q: 'What must employees do if they stay at a hotel outside the preferred program?',
        opts: ['Pay the difference themselves', 'Submit additional receipts', 'Obtain prior written approval from a department head', 'Contact the Finance Department immediately'],
        correct: 2,
        type: 'detail',
        exp: "The memo states 'Bookings made outside the preferred program must receive prior written approval from a department head.'",
        trap: "Option D sounds reasonable but is for policy questions, not unapproved bookings.",
      },
      {
        q: 'According to the memo, when can business class be approved for air travel?',
        opts: ['For all international travel', 'For flights longer than eight hours internationally', 'For senior managers only', 'For travel during peak holiday periods'],
        correct: 1,
        type: 'detail',
        exp: "The memo specifies 'Business class may be approved for international flights exceeding eight hours.'",
        trap: "Option A is too broad — the memo does NOT approve business class for ALL international travel.",
      },
      {
        q: 'What happens if an employee submits an expense claim after 30 days?',
        opts: ['The claim is automatically rejected', 'The employee must repay any advances', 'A written explanation and VP approval are required', 'The deadline is extended by 15 days automatically'],
        correct: 2,
        type: 'detail',
        exp: "'Claims submitted after this deadline will require a written explanation and approval from the VP of Finance.'",
        trap: "Option A says 'automatically rejected' — the memo does NOT say claims will be rejected, only that extra approval is needed.",
      },
    ],
  },
  {
    id: 2,
    title: 'Job Advertisement: Marketing Manager',
    type: 'advertisement',
    difficulty: 'medium',
    estimatedTime: 5,
    wordCount: 221,
    text: `POSITION AVAILABLE: Marketing Manager — Asia Pacific

GreenPath Solutions is a rapidly growing environmental consulting firm headquartered in Singapore. We are seeking an experienced Marketing Manager to lead our Asia Pacific marketing team and drive brand awareness across the region.

RESPONSIBILITIES:
• Develop and implement comprehensive regional marketing strategies
• Manage a team of six marketing professionals across three offices
• Oversee digital marketing campaigns, including SEO, social media, and content creation
• Coordinate with regional sales teams to align marketing efforts with revenue goals
• Analyze market trends and competitor activity to identify new opportunities
• Prepare quarterly performance reports for senior management

REQUIREMENTS:
• Bachelor's degree in Marketing, Business, or a related field; MBA preferred
• Minimum seven years of marketing experience, with at least three years in a management role
• Proven track record of successful regional or international marketing campaigns
• Fluency in English required; proficiency in Mandarin or Japanese is a strong advantage
• Excellent analytical and presentation skills
• Willingness to travel up to 30% of the time within the region

COMPENSATION:
We offer a competitive salary, performance bonus, medical and dental benefits, and professional development opportunities. Relocation assistance is available for qualified candidates based outside Singapore.

To apply, send your resume and a cover letter to careers@greenpathsolutions.com by April 30.`,
    questions: [
      {
        q: 'What type of company is GreenPath Solutions?',
        opts: ['A marketing agency', 'An environmental consulting firm', 'A technology startup', 'A financial services company'],
        correct: 1,
        type: 'detail',
        exp: "The advertisement states 'GreenPath Solutions is a rapidly growing environmental consulting firm.'",
        trap: "The position is in marketing but the company itself is an environmental consulting firm — don't confuse the role with the industry.",
      },
      {
        q: 'How many years of management experience are required for this position?',
        opts: ['At least two years', 'At least three years', 'At least five years', 'At least seven years'],
        correct: 1,
        type: 'detail',
        exp: "'At least three years in a management role' — note that seven years is total marketing experience, not management experience.",
        trap: "Seven years is total experience required; three years is the management-specific requirement. Read carefully!",
      },
      {
        q: 'What is indicated about language requirements?',
        opts: ['Mandarin is required', 'English and Mandarin are both required', 'English is required; Mandarin or Japanese is preferred', 'Three languages are required'],
        correct: 2,
        type: 'detail',
        exp: "'Fluency in English required; proficiency in Mandarin or Japanese is a strong advantage' — advantage, not required.",
        trap: "Option B says both are required. The ad says only English is required; the others are an advantage.",
      },
      {
        q: 'What can be inferred about candidates who live outside Singapore?',
        opts: ['They are not eligible for the position', 'They must pay their own relocation costs', 'They may receive financial help to relocate', 'They need special work authorization'],
        correct: 2,
        type: 'inference',
        exp: "'Relocation assistance is available for qualified candidates based outside Singapore.' This means help may be provided.",
        trap: "Option B says they must pay themselves — opposite of what is stated.",
      },
    ],
  },
  {
    id: 3,
    title: 'Customer Complaint and Response',
    type: 'email',
    difficulty: 'medium',
    estimatedTime: 5,
    wordCount: 237,
    text: `FROM: David Kwan <d.kwan@primetech.com>
TO: customercare@luxoffice.com
SUBJECT: Damaged furniture delivery — Order #LO-48291
DATE: Tuesday, September 10

Dear Customer Care Team,

I am writing to report a problem with a recent order. On September 7, we received delivery of twelve office chairs (Model: ErgoFlex Pro) as part of Order #LO-48291. Upon inspection, we discovered that four of the chairs arrived with visible damage to the backrest frame, making them unusable.

I have attached photographs documenting the damage. Our office manager attempted to contact your delivery hotline on the day of delivery but was unable to reach anyone after waiting on hold for 45 minutes.

We would appreciate prompt action to resolve this matter. As a long-standing client with over five years of purchasing history with LuxOffice, we expected better both in product quality and customer support responsiveness.

We request either a replacement of the four damaged chairs or a partial refund equivalent to the cost of those items. We require resolution by September 20, as the chairs are needed for a new department opening on September 23.

Please confirm receipt of this email and advise on next steps.

Sincerely,
David Kwan
Facilities Manager, PrimeTech Solutions

---
FROM: customercare@luxoffice.com
TO: d.kwan@primetech.com
SUBJECT: RE: Damaged furniture delivery — Order #LO-48291
DATE: Wednesday, September 11

Dear Mr. Kwan,

Thank you for bringing this matter to our attention. We sincerely apologize for the inconvenience caused by the damaged items and for the difficulty you experienced reaching our customer support team.

We have reviewed your order and confirmed the damage via the photographs you provided. Replacement chairs will be dispatched by September 15 with guaranteed delivery before September 20. No further action is required on your part.

As a gesture of goodwill for the inconvenience, we will also apply a 10% discount to your next order. We value your continued partnership with LuxOffice and are committed to ensuring this does not happen again.

Best regards,
Rachel Yeo
Senior Customer Care Representative, LuxOffice`,
    questions: [
      {
        q: 'Why did Mr. Kwan contact LuxOffice?',
        opts: ['To cancel a furniture order', 'To report delivery damage and request a resolution', 'To inquire about new chair models', 'To complain about an incorrect invoice'],
        correct: 1,
        type: 'main_idea',
        exp: "Mr. Kwan writes 'I am writing to report a problem with a recent order' regarding damaged chairs.",
        trap: "Option A (cancel) is not what happened — he wants replacement or refund, not cancellation.",
      },
      {
        q: 'What does Mr. Kwan say about calling the delivery hotline?',
        opts: ['He was disconnected after speaking to a representative', 'He received an immediate response', 'He was unable to reach anyone after a long wait', 'He left a voicemail message'],
        correct: 2,
        type: 'detail',
        exp: "'Our office manager...was unable to reach anyone after waiting on hold for 45 minutes.'",
        trap: "Option D (voicemail) is not mentioned. He waited 45 minutes and got no one.",
      },
      {
        q: 'What does LuxOffice offer in addition to the replacement chairs?',
        opts: ['A full refund for the damaged items', 'Free delivery on the next order', 'A 10% discount on the next order', 'An extended warranty on the replacement chairs'],
        correct: 2,
        type: 'detail',
        exp: "'We will also apply a 10% discount to your next order' as a gesture of goodwill.",
        trap: "A full refund (option A) was NOT offered — only replacements and a discount.",
      },
      {
        q: 'What can be inferred about Mr. Kwan\'s relationship with LuxOffice?',
        opts: ['This is his first purchase from LuxOffice', 'He is a new client who signed up recently', 'He has been a client for at least five years', 'He rarely purchases furniture from the company'],
        correct: 2,
        type: 'inference',
        exp: "Mr. Kwan refers to 'over five years of purchasing history with LuxOffice.'",
        trap: "He explicitly states 'over five years,' so options A and B are incorrect.",
      },
    ],
  },
  {
    id: 4,
    title: 'Office Building Maintenance Notice',
    type: 'notice',
    difficulty: 'easy',
    estimatedTime: 3,
    wordCount: 178,
    text: `BUILDING MAINTENANCE NOTICE

Property: Meridian Business Tower, Floors 12–28
Issued by: Meridian Property Management
Date Posted: April 5
Effective: April 19–21 (Saturday through Monday)

Please be advised that Meridian Business Tower will undergo scheduled elevator maintenance during the above dates. During this period, the following conditions will apply:

• Elevators 1, 2, and 3 (main lobby bank) will be completely out of service.
• Elevator 4 (service elevator, east wing) will remain operational for emergency use and for tenants who require accessibility accommodation. Access to this elevator must be arranged in advance by contacting building management.
• Stairwells A and B will remain open and fully accessible throughout the maintenance period.
• Staff requiring accommodation due to mobility needs should contact our office by April 15 to make special arrangements.

We regret any inconvenience this may cause and appreciate your patience. The maintenance is necessary to ensure elevator safety compliance and extend the operational lifespan of all units.

For inquiries, please contact the building management office at ext. 200 or email management@meridianbizpark.com.

Thank you for your cooperation.
Meridian Property Management`,
    questions: [
      {
        q: 'How many elevators will be completely out of service during maintenance?',
        opts: ['One', 'Two', 'Three', 'Four'],
        correct: 2,
        type: 'detail',
        exp: "'Elevators 1, 2, and 3 (main lobby bank) will be completely out of service.' That is three elevators.",
        trap: "Elevator 4 remains operational — don't count it as out of service.",
      },
      {
        q: 'What is true about Elevator 4 during the maintenance period?',
        opts: ['It will be out of service like the others', 'It is available to everyone without restriction', 'It can be used but must be arranged in advance', 'It will only carry maintenance equipment'],
        correct: 2,
        type: 'detail',
        exp: "'Access to this elevator must be arranged in advance by contacting building management.'",
        trap: "Option B says no restriction — incorrect. Advance arrangement IS required.",
      },
      {
        q: 'By what date should staff with mobility needs contact the management office?',
        opts: ['April 5', 'April 15', 'April 19', 'April 21'],
        correct: 1,
        type: 'detail',
        exp: "'Staff requiring accommodation due to mobility needs should contact our office by April 15.'",
        trap: "April 19-21 is the maintenance period. April 15 is the contact deadline.",
      },
      {
        q: 'Why is the maintenance being carried out?',
        opts: ['To install new elevators in the building', 'To reduce operating costs for tenants', 'To meet safety compliance and extend elevator lifespan', 'Because elevators broke down unexpectedly'],
        correct: 2,
        type: 'detail',
        exp: "'The maintenance is necessary to ensure elevator safety compliance and extend the operational lifespan of all units.'",
        trap: "Option D suggests a breakdown — the notice says 'scheduled maintenance,' meaning it is planned, not reactive.",
      },
    ],
  },
  {
    id: 5,
    title: 'Remote Work Policy Trends in Corporate Asia',
    type: 'article',
    difficulty: 'hard',
    estimatedTime: 7,
    wordCount: 256,
    text: `BUSINESS TODAY ASIA

Remote Work Policy Shifts Redefine Corporate Culture Across the Region

By Linda Chou | April 2024

Major corporations across Asia Pacific are adopting hybrid work models at an accelerating pace, according to a recent study by the Regional Business Institute. The report, which surveyed 1,200 companies across twelve countries, found that 68 percent now offer some form of flexible working arrangement, up from just 31 percent in 2020.

The shift has been driven by several factors. First, intense competition for skilled talent has forced employers to offer greater flexibility. Second, advances in cloud computing and collaboration software have made remote work operationally feasible even for large organizations. Third, and perhaps most significantly, employees across all sectors now expect flexibility as a standard benefit rather than a perk.

However, the transition has not been without challenges. More than half of the surveyed firms reported difficulties in maintaining team cohesion and organizational culture in distributed work environments. Additionally, 44 percent cited increased cybersecurity risks as a significant concern when employees access company systems from home or public networks.

In response, companies are investing heavily in new approaches. Many have redesigned office spaces to facilitate collaboration on designated in-office days, while simultaneously upgrading digital infrastructure to support remote workers. Training programs focused on virtual leadership and cross-cultural communication are also becoming increasingly common.

Industry experts suggest that companies that fail to adapt their policies risk losing top talent to competitors who offer greater flexibility. Those that succeed in striking the right balance between flexibility and productivity stand to gain a sustainable competitive advantage in the talent market.`,
    questions: [
      {
        q: 'What does the study mentioned in the article primarily show?',
        opts: ['Most companies have abandoned remote work policies', 'The adoption of flexible work arrangements has significantly increased', 'Cybersecurity risks have decreased due to better software', 'Companies are reducing office space investments'],
        correct: 1,
        type: 'main_idea',
        exp: "The study shows 68% now offer flexible arrangements, up from 31% in 2020 — a significant increase.",
        trap: "Option D about reducing office space is not the main finding — companies are REDESIGNING offices, not eliminating them.",
      },
      {
        q: 'According to the article, what do employees now consider flexibility to be?',
        opts: ['An optional bonus for high performers', 'A standard expected benefit', 'A temporary arrangement only', 'A privilege available to senior staff'],
        correct: 1,
        type: 'detail',
        exp: "'Employees...now expect flexibility as a standard benefit rather than a perk.'",
        trap: "Option A (bonus for high performers) and D (senior staff only) are not stated — flexibility is expected by ALL employees.",
      },
      {
        q: 'What percentage of companies reported difficulty maintaining team cohesion?',
        opts: ['31 percent', '44 percent', 'More than 50 percent', '68 percent'],
        correct: 2,
        type: 'detail',
        exp: "'More than half of the surveyed firms reported difficulties in maintaining team cohesion.'",
        trap: "44 percent relates to cybersecurity concerns, not team cohesion. Read carefully.",
      },
      {
        q: 'What can be inferred about companies that do not adapt their work policies?',
        opts: ['They will face government penalties', 'They may struggle to retain talented employees', 'They will be forced to reduce salaries', 'Their productivity will improve without distractions'],
        correct: 1,
        type: 'inference',
        exp: "'Companies that fail to adapt...risk losing top talent to competitors who offer greater flexibility.'",
        trap: "Option A (government penalties) is not mentioned anywhere in the article.",
      },
    ],
  },
]
