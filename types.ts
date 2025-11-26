
export interface MenuItem {
  id: number;
  name: string;
  eng: string;
  price: string;
  tag: string;
  desc: string;
  ingredients: string[];
  image: string;
}

// Model for the calculator comparison
export interface FinancialModelItem {
  id: string; // 'A', 'B', 'C', 'D' - needed for calculation logic mapping
  name: string;
  pros: string[];
  cons: string[];
}

export interface CalculatedData {
  revenue: number;
  materials: number;
  labor: number;
  rent: number;
  equip: number;
  misc: number;
  profit: number;
  isCapped: boolean;
}

// --- CMS Content Types ---

export interface CloudConfig {
  enabled: boolean;
  binId: string;
  apiKey: string;
}

export interface HeroContent {
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  description: string;
  buttonText: string;
  trustText: string;
  image: string; // Added image field
}

// Generic Item for lists (Model cards, Process steps, etc.)
export interface SectionItem {
  title: string;
  desc: string;
  tag?: string; // Optional for Process or Showcase
  image?: string; // Optional for Showcase
}

export interface ShowcaseItem extends SectionItem {
  statValue: string;
  statLabel: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProcessPhase {
  title: string;
  subtitle: string;
  badge: string;
  benefitsTitle: string;
  benefits: string[];
  obligationsTitle: string;
  obligations: string[];
}

export interface ModelContent {
  isVisible: boolean;
  tagline: string;
  title: string;
  description: string;
  items: SectionItem[];
}

export interface ShowcaseContent {
  isVisible: boolean;
  tagline: string;
  title: string;
  description: string;
  items: ShowcaseItem[];
}

export interface FAQContent {
  isVisible: boolean;
  tagline: string;
  title: string;
  description: string;
  items: FAQItem[];
}

export interface ProcessContent {
  isVisible: boolean;
  tagline: string;
  title: string;
  description: string;
  phases: ProcessPhase[]; 
}

// New Type for the Comparison Matrix
export interface ComparisonRow {
  name: string;
  rental: boolean; // Is it in rental package?
  lite: 'Y' | 'N' | 'S'; // Y=Included, N=No, S=Store/Self Provide
  self: boolean; // Do you need to buy it yourself in DIY?
}

export interface ComparisonCategory {
  title: string;
  items: ComparisonRow[];
}

export interface ComparisonContent {
  isVisible: boolean;
  tagline: string;
  title: string;
  description: string;
  col1Title: string;
  col2Title: string;
  col3Title: string;
  note1: string;
  note2: string;
  categories: ComparisonCategory[];
}

export interface FinancialsContent {
  isVisible: boolean;
  tagline: string;
  title: string;
  description: string;
  disclaimer: string;
  
  // Interactive element labels
  labelSales: string;
  labelCups: string;
  labelMin: string;
  labelTarget: string;
  labelMax: string;
  
  // Alert labels
  alertTitle: string;
  alertDesc: string;
  
  // Result card labels
  labelProfit: string;
  labelRevenue: string;
  labelCost: string;
  
  // AI section
  aiButton: string;
  aiButtonLoading: string;
  aiResultTitle: string;
  
  // Comparison list
  comparisonTitle: string;
  
  // Breakdown Details
  breakdownRevenue: string;
  breakdownMaterials: string;
  breakdownLabor: string;
  breakdownRent: string;
  breakdownEquip: string;
  breakdownMisc: string;
  breakdownNet: string;
  
  // Chart
  chartTitle: string;

  // The comparison models
  models: FinancialModelItem[];
}

export interface MenuSectionContent {
  isVisible: boolean;
  tagline: string;
  title: string;
  description: string;
  phases?: any; 
}

export interface PartnerContent {
  isVisible: boolean;
  title: string;
  buttonText: string;
  disclaimer: string;
  items: SectionItem[];
}

export interface FooterContent {
  aboutText: string;
  contactTitle: string;
  email: string;
  address: string;
  resourceTitle: string;
  copyright: string;
}

export interface SiteContent {
  hero: HeroContent;
  model: ModelContent;
  process: ProcessContent;
  showcase: ShowcaseContent; 
  comparison: ComparisonContent;
  financials: FinancialsContent;
  menuSection: MenuSectionContent;
  faq: FAQContent; 
  menu: MenuItem[];
  partner: PartnerContent;
  footer: FooterContent;
  library: string[]; // NEW: For storing uploaded images
}

// --- Chat System Types ---

export type ChatSender = 'user' | 'ai' | 'admin';

export interface ChatMessage {
  id: string;
  text: string;
  sender: ChatSender;
  timestamp: number;
  isRead?: boolean;
}

export interface ChatContact {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: number;
  unread: number;
  online: boolean;
}
