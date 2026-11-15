import LegalPageView, { type LegalSectionItem } from './LegalPageView';

const termsSections: LegalSectionItem[] = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    subtitle: 'Legal binding and mutual agreement',
    paragraphs: [
      'By creating an account, browsing, or utilizing the Briosolve marketplace platform (the "Platform", "we", "us", or "our"), you confirm that you have read, understood, and unconditionally agree to be bound by these Terms and Conditions and our Privacy Policy.',
      'If you are entering into this agreement on behalf of a company, partnership, or other legal entity, you represent that you possess the necessary authority to bind such entity to these Terms. If you do not agree to all provisions, do not access or use Briosolve.'
    ]
  },
  {
    id: 'marketplace',
    title: 'Marketplace Mechanism',
    subtitle: 'How reverse bidding and service discovery function',
    paragraphs: [
      'Briosolve operates as a specialized reverse-service marketplace. Customers initiate service requests with specific project requirements, timelines, and budgets. Independent, verified service professionals ("Providers") review these requests and submit competitive bids and quotations.'
    ],
    callout: {
      label: 'Platform Role',
      text: 'Briosolve provides the technical infrastructure, communication hub, discovery algorithms, and verification vetting tools. Briosolve is not an employer, contractor, or partner of independent service providers.'
    }
  },
  {
    id: 'accounts',
    title: 'User Accounts & Eligibility',
    subtitle: 'Account creation, identity, and security responsibilities',
    paragraphs: [
      'To access core features of the platform, you must register for an account as either a Customer or a Service Provider. You agree to:'
    ],
    listItems: [
      'Provide accurate, current, and complete personal and business details during the registration process.',
      'Maintain the strict security and confidentiality of your credentials and multi-factor authentication passcodes.',
      'Promptly notify Briosolve of any unauthorized access, breach, or compromise of your account.',
      'Refrain from operating multiple accounts for deceptive, fraudulent, or evasive purposes.'
    ]
  },
  {
    id: 'quotations',
    title: 'Quotations, Bidding & Escrow',
    subtitle: 'Binding quotes and milestone payment security',
    paragraphs: [
      'When a Provider issues a quote for an open service request, it constitutes a binding offer to perform the described scope of work under the quoted timeline and financial parameters.',
      'Customers are under no obligation to accept any submitted quotation. Once a Customer accepts a quote, a binding service contract is formed between Customer and Provider. Advance payments or milestone commitments are held securely through our regulated payment partner until fulfillment criteria are verified.'
    ]
  },
  {
    id: 'verification',
    title: 'Provider Verification & Quality Standards',
    subtitle: 'Vetting requirements and credential maintenance',
    paragraphs: [
      'Providers seeking Verified badges must complete comprehensive identity, trade license, and business credential review by our platform administration team. While Briosolve executes stringent review procedures:'
    ],
    listItems: [
      'Customers remain encouraged to review provider portfolios, public reviews, and direct communication history before quotation acceptance.',
      'Any falsification of certifications, insurance coverage, or trade accreditations constitutes an immediate ground for permanent account termination.'
    ]
  },
  {
    id: 'prohibited',
    title: 'Prohibited Conduct',
    subtitle: 'Unacceptable behaviors and community safety rules',
    paragraphs: [
      'Users of Briosolve agree never to engage in any of the following activities:'
    ],
    listItems: [
      'Attempting to bypass platform escrow or solicit off-platform financial transactions to avoid marketplace commission fees.',
      'Harassing, threatening, impersonating, or discriminating against other marketplace participants.',
      'Submitting fraudulent reviews, artificial quote manipulation, or spam requests.',
      'Deploying automated scraping bots, unauthorized APIs, or network vulnerability exploitation tools.'
    ]
  },
  {
    id: 'termination',
    title: 'Suspension & Termination',
    subtitle: 'Platform enforcement and appeal channels',
    paragraphs: [
      'Briosolve reserves the right to temporarily suspend, investigate, or terminate any account found in material violation of these Terms, safety standards, or applicable consumer protection laws. Suspended parties may submit formal appeals through our account reactivation appeals workflow.'
    ]
  },
  {
    id: 'contact',
    title: 'Contact & Dispute Resolution',
    subtitle: 'Dispute escalation and legal notices',
    paragraphs: [
      'For legal notices, terms inquiries, or formal dispute escalation, please contact our compliance and operations department at:'
    ]
  }
];

export default function Terms() {
  return (
    <LegalPageView
      title={<>Terms and<br />conditions</>}
      subtitle="Our rules, service agreements, and marketplace governance for using Briosolve."
      subtext="Please review our verified provider standards, milestone escrow protections, and member code of conduct."
      illustrationSrc="https://res.cloudinary.com/zjhxcdmi/image/upload/v1794730554/terms-condition-laptop.png"
      illustrationAlt="Terms and conditions illustration"
      effectiveDate="January 1, 2026"
      lastUpdated="November 2026"
      readTime="~7 min read"
      sections={termsSections}
      contactTitle="Briosolve Platform Compliance"
      contactEmail="legal@briosolve.com • support@briosolve.com"
      switchLink={{
        to: '/privacy',
        label: 'Privacy Policy',
        icon: 'fas fa-shield-alt'
      }}
    />
  );
}
