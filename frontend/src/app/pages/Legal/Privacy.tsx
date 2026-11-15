import LegalPageView, { type LegalSectionItem } from './LegalPageView';

const privacySections: LegalSectionItem[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    subtitle: 'Commitment to personal privacy and transparency',
    paragraphs: [
      'Briosolve is comprised of marketplace technology services that help customers discover verified local tradespeople, post service requests, and accept competitive quotes. We act as the data controller for personal data processed in respect of our Platform.',
      'Please ensure that your interactions and submitted service requests remain accurate and respectful to members of the marketplace. We believe privacy is a fundamental human right, and we design our systems to minimize data collection to only what is necessary.'
    ]
  },
  {
    id: 'collection',
    title: 'Information We Collect',
    subtitle: 'Categories of personal and business information gathered',
    paragraphs: [
      'We collect personal information necessary to deliver transparent, verified marketplace connections between Customers and Providers:'
    ],
    listItems: [
      'Identity & Account Details: Name, verified email address, phone number, and hashed authentication credentials.',
      'Provider Verification Credentials: Trade licenses, government IDs, municipal registration certificates, and background verification records.',
      'Service Request Information: Task descriptions, project addresses, photos, budget specifications, and quotation logs.',
      'Communications: In-app chat dialogues, status change notifications, and support request interactions.'
    ]
  },
  {
    id: 'usage',
    title: 'How We Use Your Information',
    subtitle: 'Operational purposes, discovery matching, and security',
    paragraphs: [
      'Briosolve processes user information to uphold marketplace security, enable transaction fulfillment, and optimize localized service discovery:'
    ],
    listItems: [
      'Matching customer service requests with qualified, nearby service providers.',
      'Verifying provider identities and professional licenses before awarding Verified Badges.',
      'Processing quotes, deposits, and payments through secure PCI-DSS compliant financial partners.',
      'Preventing malicious behavior, platform bypassing, spam, and fraud through automated anomaly detection.'
    ]
  },
  {
    id: 'sharing',
    title: 'Information Sharing & Disclosure',
    subtitle: 'Data visibility and third-party restrictions',
    paragraphs: [
      'We never sell your personal data. Information is shared solely in connection with marketplace operations and service fulfillment.'
    ],
    callout: {
      label: 'Customer & Provider Visibility',
      text: 'When a request is posted or bid submitted, relevant project details and provider profiles become visible to counterparties. Precise personal contact details (such as direct phone numbers) are only shared once a mutual quote has been agreed upon.'
    }
  },
  {
    id: 'location',
    title: 'Location & Geodata',
    subtitle: 'Service radius calculations and regional matching',
    paragraphs: [
      'Our reverse-service marketplace relies on mutual service radius calculations. With your explicit permission, we collect geolocation data to show you nearby verified tradespeople and calculate accurate travel and dispatch capabilities. You can manage or revoke location permissions at any time through your device or browser settings.'
    ]
  },
  {
    id: 'security',
    title: 'Data Security & Storage',
    subtitle: 'Technical safeguards and encryption standards',
    paragraphs: [
      'We employ modern technical and organizational safeguards, including TLS 1.3 encryption in transit, AES-256 encryption for stored sensitive credentials, role-based access controls, and regular database audit procedures.'
    ]
  },
  {
    id: 'rights',
    title: 'Your Privacy Rights & Controls',
    subtitle: 'Access, portability, and deletion requests',
    paragraphs: [
      'Regardless of your jurisdiction, Briosolve provides comprehensive controls directly in your Customer or Provider Settings:'
    ],
    listItems: [
      'Access & Correction: Review and update your profile, contact details, and business portfolio.',
      'Active Sessions: Monitor and invalidate active browser sessions and login tokens across all devices.',
      'Data Portability & Erasure: Request an export or permanent deletion of your account and personal data.'
    ]
  },
  {
    id: 'cookies',
    title: 'Cookies & Essential Storage',
    subtitle: 'Authentication cookies and browser preferences',
    paragraphs: [
      'We use strictly essential local storage and secure HTTP-only cookies to preserve your login session, active theme preference (Light/Dark mode), and CSRF security validation. We do not use third-party behavioral advertising trackers.'
    ]
  },
  {
    id: 'contact',
    title: 'Data Protection Officer & Inquiries',
    subtitle: 'Reaching our compliance and privacy governance team',
    paragraphs: [
      'If you have questions, data access requests, or privacy concerns, please contact our Data Protection Office:'
    ]
  }
];

export default function Privacy() {
  return (
    <LegalPageView
      title="Privacy Policy"
      subtitle="Our code of conduct and your pledge to be an upstanding member of Briosolve."
      subtext="Please review how we gather, protect, and respect your personal information across Briosolve."
      illustrationSrc="https://res.cloudinary.com/zjhxcdmi/image/upload/v1794732157/privacy-policy-logo.png"
      illustrationAlt="Privacy policy illustration"
      effectiveDate="January 1, 2026"
      lastUpdated="November 2026"
      readTime="~6 min read"
      sections={privacySections}
      contactTitle="Briosolve Privacy & Data Protection Office"
      contactEmail="privacy@briosolve.com • support@briosolve.com"
      switchLink={{
        to: '/terms',
        label: 'Terms & Conditions',
        icon: 'fas fa-file-contract'
      }}
    />
  );
}
