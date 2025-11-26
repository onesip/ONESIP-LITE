
export type Language = 'zh' | 'en';

export interface LocalizedText {
  zh: string;
  en: string;
}

export interface MenuItem {
  id: number;
  name: LocalizedText;
  eng: string; // Keep as string, usually specific product code/name
  price: string;
  tag: LocalizedText;
  desc: LocalizedText;
  ingredients: string[]; // Simplification: Ingredients often shared or simple enough, but ideally localized too. Let's keep simple for now or assume simple strings.
  image: string;
}

// Model for the calculator comparison
export interface FinancialModelItem {
  id: string; 
  name: LocalizedText;
  pros: LocalizedText[];
  cons: LocalizedText[];
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

export interface Lead {
  id: string;
  name: string;
  contact: string;
  city: string;
  businessType: string;
  message: string;
  timestamp: number;
  status: 'new' | 'contacted' | 'archived';
}

export interface CloudConfig {
  enabled: boolean;
  binId: string;
  apiKey: string;
}

export interface HeroContent {
  tagline: LocalizedText;
  titleLine1: LocalizedText;
  titleLine2: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  buttonText: LocalizedText;
  trustText: LocalizedText;
  image: string;
}

export interface SectionItem {
  title: LocalizedText;
  desc: LocalizedText;
  tag?: LocalizedText;
  image?: string;
}

export interface ShowcaseItem extends SectionItem {
  statValue: LocalizedText;
  statLabel: LocalizedText;
}

export interface FAQItem {
  question: LocalizedText;
  answer: LocalizedText;
}

export interface ProcessPhase {
  title: LocalizedText;
  subtitle: LocalizedText;
  badge: LocalizedText;
  benefitsTitle: LocalizedText;
  benefits: LocalizedText[];
  obligationsTitle: LocalizedText;
  obligations: LocalizedText[];
}

export interface ModelContent {
  isVisible: boolean;
  tagline: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  items: SectionItem[];
}

export interface ShowcaseContent {
  isVisible: boolean;
  tagline: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  items: ShowcaseItem[];
}

export interface FAQContent {
  isVisible: boolean;
  tagline: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  items: FAQItem[];
}

export interface ProcessContent {
  isVisible: boolean;
  tagline: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  phases: ProcessPhase[]; 
}

export interface ComparisonRow {
  name: LocalizedText;
  rental: boolean;
  lite: 'Y' | 'N' | 'S';
  self: boolean;
}

export interface ComparisonCategory {
  title: LocalizedText;
  items: ComparisonRow[];
}

export interface ComparisonContent {
  isVisible: boolean;
  tagline: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  col1Title: LocalizedText;
  col2Title: LocalizedText;
  col3Title: LocalizedText;
  note1: LocalizedText;
  note2: LocalizedText;
  categories: ComparisonCategory[];
}

export interface FinancialsContent {
  isVisible: boolean;
  tagline: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  disclaimer: LocalizedText;
  
  labelSales: LocalizedText;
  labelCups: string;
  labelMin: string;
  labelTarget: string;
  labelMax: string;
  
  alertTitle: LocalizedText;
  alertDesc: LocalizedText;
  
  labelProfit: LocalizedText;
  labelRevenue: LocalizedText;
  labelCost: LocalizedText;
  
  aiButton: LocalizedText;
  aiButtonLoading: LocalizedText;
  aiResultTitle: LocalizedText;
  
  comparisonTitle: LocalizedText;
  
  breakdownRevenue: LocalizedText;
  breakdownMaterials: LocalizedText;
  breakdownLabor: LocalizedText;
  breakdownRent: LocalizedText;
  breakdownEquip: LocalizedText;
  breakdownMisc: LocalizedText;
  breakdownNet: LocalizedText;
  
  chartTitle: LocalizedText;
  models: FinancialModelItem[];
}

export interface MenuSectionContent {
  isVisible: boolean;
  tagline: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  phases?: any; 
}

export interface PartnerContent {
  isVisible: boolean;
  title: LocalizedText;
  buttonText: LocalizedText;
  disclaimer: LocalizedText;
  items: SectionItem[];
}

export interface FooterContent {
  aboutText: LocalizedText;
  contactTitle: LocalizedText;
  email: string;
  address: string;
  resourceTitle: LocalizedText;
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
  library: string[];
  leads: Lead[];
}

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
