
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteContent, MenuItem, HeroContent, SectionItem, FinancialModelItem, ProcessPhase, CloudConfig, ShowcaseItem, FAQItem } from '../types';
import { fetchCloudContent, saveCloudContent } from '../services/storageService';

// 默认数据
const defaultContent: SiteContent = {
  hero: {
    tagline: "荷兰知名自动化饮品品牌",
    titleLine1: "For Everyone,",
    titleLine2: "For Every Moment.",
    subtitle: "0 房租 · 100% 自动化",
    description: "在原有门店中多出一个具有品牌力的店中店。这不仅仅是增加一款奶茶产品，而是为您引入一个成熟的自动化奶茶品牌体系。",
    buttonText: "测算我的收益",
    trustText: "欧洲 100+ 合作伙伴信赖"
  },
  model: {
    isVisible: true,
    tagline: "商业模式 / Business Model",
    title: "为什么选择\n店中店模式？",
    description: "传统的奶茶店深受高昂房租和人工成本的拖累。我们将整套系统压缩成一个智能模块，将利润直接留给您。",
    items: [
      { title: "品牌流量互导", desc: "不仅卖饮品，更共享 ONESIP 品牌流量。直接导入 ONESIP TOP8 网红产品，丰富产品结构，显著提升客单价。" },
      { title: "高度自动标准化", desc: "告别不稳定的人工手摇。机器自动配比、清洗。新员工培训1小时即可完美上岗。" },
      { title: "空间极致利用", desc: "利用现有闲置吧台或角落。不增加一分钱房租。将坪效提升至极限。" }
    ]
  },
  process: {
    isVisible: true,
    tagline: "合作政策 / Policy",
    title: "全程扶植，\n进退有据。",
    description: "我们不只卖设备，而是提供从起步到盈利的全方位保障。清晰的阶段划分，让您的每一分投入都有安全感。",
    phases: [
        {
            title: "STEP 1: 成长期 (品牌扶植)",
            subtitle: "0风险起步，甚至无需租赁费",
            badge: "试运行期",
            benefitsTitle: "ONESIP 推广期福利",
            benefits: [
                "1. 导入 ONESIP 原班 TOP8-10 爆款饮品库",
                "2. 免费提供全套社交媒体宣传和店铺可视化物料",
                "3. 全部原料由 ONESIP 提供，无库存压力",
                "4. 机器由 ONESIP 免费提供，免除租赁费用",
                "5. 每天提供4小时专业奶茶员工支持 (开早/备料)",
                "6. 提供全套标准化 SOP 培训",
                "7. 推广期内 免除品牌管理费"
            ],
            obligationsTitle: "店家配合义务",
            obligations: [
                "1. 只能使用 I'TEA Supply 提供的官方原料",
                "2. 严格按照 ONESIP 配方制作",
                "3. 签署保密协议 (NDA)",
                "4. 试运行期最少 2 个月",
                "5. 提供约5平米场地及水电、制冰机等基础设备",
                "6. 保证执行 HACCP 食品安全标准"
            ]
        },
        {
            title: "STEP 2: 正式签约期",
            subtitle: "深度绑定，共享品牌红利",
            badge: "24个月合约",
            benefitsTitle: "签约商户总福利",
            benefits: [
                "1. 持续更新 TOP8 及新品热卖款，品牌持续引流",
                "2. 小红书/TikTok 持续营销推广支持",
                "3. 享受荷兰最低原料价格 (承诺同品质全荷最低)",
                "4. 专业团队设备维护，出现问题立刻响应",
                "5. 解锁专业线上点餐系统 & 人机互动客服",
                "6. 数据驱动：跟进饮品销量，及时调整策略",
                "7. 享有该地区独立门店优先权，有机会成为地区代理"
            ],
            obligationsTitle: "签约商户义务",
            obligations: [
                "1. 保持 ONESIP 品牌形象，售价统一",
                "2. 签署保密协议和竞业协议",
                "3. 支付机器系统服务费 (€899/月)",
                "4. 支付 7% 品牌管理费 (利益绑定)",
                "5. 保证员工接受定期培训"
            ]
        },
        {
            title: "保障机制: 兜底与退出",
            subtitle: "解决您的后顾之忧",
            badge: "安全网",
            benefitsTitle: "人性化退出与豁免政策",
            benefits: [
                "1. 连续3个月日均 < 40杯：免除当月品牌管理费",
                "2. 连续6个月日均 < 40杯：可协商无责退出条件",
                "3. 连续6个月日均 < 25杯：ONESIP 考虑主动终止合作止损",
                "4. 退出机制透明：仅需结算机器折旧费与部分软件费",
                "5. 严厉打击违规：若发现偷换原料或卫生违规，立即终止"
            ],
            obligationsTitle: "风控核心",
            obligations: [
                "我们通过'销量阈值'来保护双方利益。",
                "如果不赚钱，我们陪您一起止损。",
                "但食品安全与品牌声誉是底线，不可触碰。"
            ]
        }
    ]
  },
  showcase: {
    isVisible: false, // Hidden by default
    tagline: "成功案例 / Showcase",
    title: "他们已经\n赚到了钱。",
    description: "从寿司店到书店，从超市到食堂。看看不同业态的合作伙伴是如何利用闲置空间创造第二增长曲线的。",
    items: [
        {
            title: "Shabu Shabu 寿司店",
            desc: "利用收银台旁0.5米空间，无需额外员工，顾客等待外卖时自助点单。",
            tag: "Rotterdam",
            image: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&w=800&q=80",
            statValue: "+€3.5",
            statLabel: "客单价提升"
        },
        {
            title: "InterBook 独立书店",
            desc: "在阅读区角落引入ONESIP，安静不打扰，为读者提供高品质饮品，延长留店时间。",
            tag: "Amsterdam",
            image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80",
            statValue: "€2,500",
            statLabel: "月平均增收"
        },
        {
            title: "Asian Market 超市",
            desc: "出口处设立自助站，购物结束后的顺手一杯。全自助模式，无需收银员干预。",
            tag: "Utrecht",
            image: "https://images.unsplash.com/photo-1604719312566-b76d4685332e?auto=format&fit=crop&w=800&q=80",
            statValue: "120杯",
            statLabel: "日均销量"
        }
    ]
  },
  comparison: {
    isVisible: true,
    tagline: "配置清单 / Configuration",
    title: "只有清晰的分工，\n才有高效的合作。",
    description: "我们为您准备好了核心赚钱工具，您只需要准备好基础的水电设施。拒绝模糊地带，每一项责任都清晰可见。",
    col1Title: "普通租赁机",
    col2Title: "ONESIP LITE",
    col3Title: "自己开店 (DIY)",
    note1: "* 场地必须具备基础的上下水通路和独立电源，无需额外拉工业电。",
    note2: "** 机器参数会根据不同原料（茶汤、果浆、黑糖）进行定制化校准。",
    categories: [
      {
        title: "核心设备硬件",
        items: [
          { name: "小型智能奶茶机", rental: true, lite: 'Y', self: true },
          { name: "制冰机", rental: false, lite: 'S', self: true },
          { name: "智能泡茶机", rental: false, lite: 'Y', self: true },
          { name: "沙冰机", rental: false, lite: 'Y', self: true },
          { name: "自动封口机", rental: false, lite: 'Y', self: true },
          { name: "珍珠锅", rental: false, lite: 'Y', self: true },
          { name: "水池/清洗台", rental: false, lite: 'S', self: true },
          { name: "蒸汽机 (热饮)", rental: false, lite: 'S', self: true },
          { name: "平板电脑 (中控)", rental: false, lite: 'S', self: true },
          { name: "自助点餐机 (Kiosk)", rental: false, lite: 'N', self: true },
        ]
      },
      {
        title: "运营耗材与工具",
        items: [
          { name: "雪克杯 (x2)", rental: false, lite: 'Y', self: true },
          { name: "搅拌棒 (x2)", rental: false, lite: 'Y', self: true },
          { name: "冰锤 (x1)", rental: false, lite: 'Y', self: true },
          { name: "专用茶网 (x1套)", rental: true, lite: 'Y', self: true },
          { name: "量桶/料桶 (x7)", rental: false, lite: 'Y', self: true },
          { name: "果粉/珍珠勺", rental: false, lite: 'Y', self: true },
          { name: "标签打印机", rental: false, lite: 'Y', self: true },
          { name: "冷藏小料盒 (x9)", rental: false, lite: 'S', self: true },
          { name: "电子天平 (5kg+)", rental: false, lite: 'S', self: true },
        ]
      },
      {
        title: "软性服务与赋能",
        items: [
          { name: "机器安装与调试", rental: true, lite: 'Y', self: true },
          { name: "机器常规维护", rental: true, lite: 'Y', self: true },
          { name: "首批配方录入", rental: true, lite: 'Y', self: true },
          { name: "专属线上下单 App", rental: false, lite: 'Y', self: true },
          { name: "后台数据/配方看板", rental: false, lite: 'Y', self: false },
          { name: "人机互动客服系统", rental: false, lite: 'Y', self: false },
          { name: "配方持续更新", rental: false, lite: 'Y', self: false },
          { name: "全网营销推广", rental: false, lite: 'Y', self: false },
          { name: "店面宣传物料", rental: false, lite: 'Y', self: false },
          { name: "SOP 培训 (礼仪/卫生)", rental: false, lite: 'Y', self: true },
        ]
      }
    ]
  },
  financials: {
    isVisible: true,
    tagline: "利润计算器 / Calculator",
    title: "利润看得见",
    description: "基于 2025 内部运营模型校准。拖动滑块，对比四种模式的生存线。",
    disclaimer: "数据透明，无隐形算式。",
    labelSales: "预估日均销量",
    labelCups: "cups",
    labelMin: "Min (15)",
    labelTarget: "Target (80)",
    labelMax: "Max (150)",
    alertTitle: "销量过低",
    alertDesc: "不建议引入自动化设备",
    labelProfit: "ONESIP 净利",
    labelRevenue: "月营业额",
    labelCost: "设备/品牌费 + 房租",
    aiButton: "AI 智能商业点评",
    aiButtonLoading: "AI 正在分析数据...",
    aiResultTitle: "分析结果",
    comparisonTitle: "模式对比",
    breakdownRevenue: "月营业额",
    breakdownMaterials: "- 原料成本",
    breakdownLabor: "- 人工成本",
    breakdownRent: "- 房租成本",
    breakdownEquip: "- 设备/品牌费",
    breakdownMisc: "- 杂费",
    breakdownNet: "净利润",
    chartTitle: "收益对比图表",
    models: [
      { 
          id: 'A', 
          name: "传统自制 (DIY)",
          pros: ["设备投入极低", "利用现有空间"],
          cons: ["口味不稳定", "隐性人工成本极高", "无品牌溢价"]
      },
      { 
          id: 'B', 
          name: "租赁小机器",
          pros: ["初期投入少", "操作相对简单"],
          cons: ["产品单一", "无品牌支持", "设备租金是纯支出"]
      },
      { 
          id: 'C', 
          name: "传统自营店",
          pros: ["品牌独立性", "客单价高 (€6)"],
          cons: ["极重资产投入", "高昂房租+全职人工", "回本周期长", "抗风险能力差"]
      },
      { 
          id: 'D', 
          name: "ONESIP LITE",
          pros: ["0房租 / 0装修", "高度自动化 / 弹性人工", "品牌+流量赋能", "供应链底价"],
          cons: ["需遵守品牌规范", "原料强绑定"]
      }
    ]
  },
  menuSection: {
    isVisible: true,
    tagline: "精选菜单 / Signature Menu",
    title: "TOP 6 门店引流爆款",
    description: "每一款都是经过欧洲市场验证的“销量收割机”。颜值高、出品快、复购强。"
  },
  menu: [
    { 
      id: 1,
      name: "泰奶咸法酪",
      eng: "Thai Tea Salty Cheese",
      price: "€5.0", 
      tag: "TOP 1", 
      desc: "浓郁泰式红茶撞上咸香芝士奶盖，口感层次丰富。",
      ingredients: ["泰奶", "奶盖", "西米"],
      image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=800&q=80", 
    },
    { 
      id: 2,
      name: "杨枝甘露", 
      eng: "Mango Pomelo Sago",
      price: "€6.0", 
      tag: "Classic", 
      desc: "港式经典复刻，新鲜芒果肉感十足，解腻首选。",
      ingredients: ["鲜奶", "芒果", "西柚"],
      image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80", 
    },
    { 
      id: 3,
      name: "芝芝葡萄", 
      eng: "Cheezo Grape",
      price: "€6.0", 
      tag: "Popular", 
      desc: "精选多肉葡萄，搭配顺滑酸奶与清新茶底。",
      ingredients: ["葡萄", "酸奶", "茶冻"],
      image: "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=800&q=80", 
    },
    { 
      id: 4,
      name: "小吊梨马蹄", 
      eng: "Pear & Water Chestnut",
      price: "€5.0", 
      tag: "Fresh", 
      desc: "清润小吊梨汤底，加入马蹄爽脆颗粒，养生又好喝。",
      ingredients: ["小吊梨", "马蹄", "银耳"],
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80", 
    },
    { 
      id: 5,
      name: "黑糖啵啵鲜奶", 
      eng: "Brown Sugar Boba Milk",
      price: "€5.0", 
      tag: "Rich", 
      desc: "古法黑糖挂壁，Q弹温热珍珠撞入冰鲜牛奶。",
      ingredients: ["黑糖", "珍珠", "鲜奶"],
      image: "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?auto=format&fit=crop&w=800&q=80", 
    },
    { 
      id: 6,
      name: "茉莉鲜奶茶", 
      eng: "Jasmine Milk Tea",
      price: "€3.9", 
      tag: "Value", 
      desc: "七窨茉莉花茶底，清香扑鼻，性价比之王。",
      ingredients: ["茉莉绿茶", "鲜奶"],
      image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=800&q=80", 
    },
  ],
  faq: {
    isVisible: true,
    tagline: "常见问题 / FAQ",
    title: "合作前，\n先解决您的疑虑。",
    description: "我们整理了合作伙伴最关心的运营、技术与法律问题。",
    items: [
        {
            question: "机器出现故障怎么办？谁来维修？",
            answer: "ONESIP 提供全包式维保服务。软件问题通过远程 OTA 实时修复（约10分钟）；硬件故障我们承诺在 48 小时内上门维修或提供备用机。在质保期内，一切维修费用由我们承担。"
        },
        {
            question: "必须使用 ONESIP 提供的原料吗？",
            answer: "是的。为了确保口味的一致性、食品安全以及机器参数的精准匹配，合作商必须使用 I'TEA Supply 官方提供的原料（茶汤、果浆、珍珠等）。我们承诺给予合作商全荷兰最具竞争力的批发价格。"
        },
        {
            question: "店员学不会操作怎么办？",
            answer: "我们的机器设计理念是“傻瓜式操作”。点击屏幕 -> 扫码 -> 出杯。通常只需 30 分钟即可教会新员工。此外，我们提供开业前的一对一上门培训，以及全套视频 SOP 教程。"
        },
        {
            question: "对店铺的水电有什么特殊要求？",
            answer: "不需要工业用电，普通 220V 插座即可。需要具备基本的上下水（进水和排水）条件，建议距离机器摆放位置不超过 2 米。如果您不确定，我们可以安排技术人员进行视频勘测。"
        },
        {
            question: "如果合作不愉快，可以随时退出吗？",
            answer: "我们设有“冷静期”和“退出机制”。试运行期（前2个月）内，您可以随时无责退出。正式签约后，如果连续 6 个月未达到最低销量指标，您可以申请提前终止合同，仅需支付少量折旧费。"
        }
    ]
  },
  partner: {
    isVisible: true,
    title: "寻找城市合伙人",
    buttonText: "立即申请加盟咨询",
    disclaimer: "名额有限，我们将严格筛选合作伙伴。",
    items: [
      { title: "现有门店", desc: "拥有稳定客流 (餐厅/书店/零售)" },
      { title: "黄金地段", desc: "市中心、车站或高流量商圈" },
      { title: "年轻客群", desc: "周边有大学或国际化人群" },
      { title: "长期主义", desc: "认可数字化模式，追求长期增长" },
      { title: "空间要求", desc: "需要提供5平左右用于ONESIP LITE独立运营" },
      { title: "水电基础", desc: "具备基本的进排水和电力条件" }
    ]
  },
  footer: {
    aboutText: "ONESIP LITE 是荷兰领先的自动化饮品解决方案提供商。致力于通过科技赋能餐饮行业。",
    contactTitle: "联系我们",
    email: "info@onesip.nl",
    address: "Rotterdam, Netherlands",
    resourceTitle: "资源下载",
    copyright: "© 2025 ONESIP B.V."
  }
};

interface ContentContextType {
  content: SiteContent;
  cloudConfig: CloudConfig;
  isLoading: boolean;
  isSyncing: boolean;
  isAdmin: boolean;
  isDashboardOpen: boolean;
  login: () => void;
  logout: () => void;
  toggleAdmin: () => void;
  openDashboard: () => void;
  closeDashboard: () => void;
  updateCloudConfig: (config: Partial<CloudConfig>) => void;
  updateHero: (field: keyof HeroContent, value: string) => void;
  updateSection: (section: keyof SiteContent, field: string, value: any) => void;
  toggleSectionVisibility: (section: keyof SiteContent) => void;
  updateSectionItem: (section: keyof SiteContent, index: number, field: keyof SectionItem | keyof ShowcaseItem | keyof FAQItem, value: string) => void;
  updateMenuItem: (id: number, field: keyof MenuItem, value: any) => void;
  addMenuItem: () => void;
  deleteMenuItem: (id: number) => void;
  updateFinancialModel: (index: number, field: keyof FinancialModelItem, value: any) => void;
  updateFinancialModelDetail: (modelIndex: number, type: 'pros' | 'cons', detailIndex: number, value: string) => void;
  updateProcessPhase: (index: number, field: keyof ProcessPhase, value: any) => void;
  updateProcessPhaseDetail: (phaseIndex: number, type: 'benefits' | 'obligations', detailIndex: number, value: string) => void;
  saveChanges: () => void;
  resetContent: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Helper to safely access env vars to prevent crashes
// Updated to check both REACT_APP_ (Classic CRA) and VITE_ (Modern Vite) prefixes
const getEnv = (key: string) => {
  try {
    if (typeof process !== 'undefined' && process.env) {
       // Check exact key
       if (process.env[key]) return process.env[key];
       
       // Try VITE_ prefix if the key starts with REACT_APP_
       if (key.startsWith('REACT_APP_')) {
          const viteKey = key.replace('REACT_APP_', 'VITE_');
          if (process.env[viteKey]) return process.env[viteKey];
       }
    }
    return "";
  } catch (e) {
    return "";
  }
};

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [cloudConfig, setCloudConfig] = useState<CloudConfig>({ enabled: false, binId: '', apiKey: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load Cloud Config first, then content
  useEffect(() => {
    // WATCHDOG: Force app to load after 3 seconds if it hangs
    const timeoutId = setTimeout(() => {
        setIsLoading(prev => {
            if (prev) console.warn("Forcing app load due to timeout");
            return false;
        });
    }, 3000);

    const init = async () => {
      setIsLoading(true);
      
      try {
        // 1. Load Cloud Config from LocalStorage
        const savedCloudConfig = localStorage.getItem('onesip_cloud_config');
        let currentConfig: CloudConfig = { enabled: false, binId: '', apiKey: '' };
        
        if (savedCloudConfig) {
            try {
            currentConfig = JSON.parse(savedCloudConfig);
            } catch (e) {
            console.error("Failed to parse cloud config", e);
            }
        } 
        
        // CRITICAL: Safe Env Access
        const envBinId = getEnv('REACT_APP_CLOUD_BIN_ID');
        const envApiKey = getEnv('REACT_APP_CLOUD_API_KEY');
        
        if (!currentConfig.apiKey && envBinId && envApiKey) {
            currentConfig = {
                enabled: true,
                binId: envBinId,
                apiKey: envApiKey
            };
            console.log("Using Environment Variables for Cloud Config");
        }

        setCloudConfig(currentConfig);

        // 2. Fetch Content (Cloud priority, then Local)
        if (currentConfig.enabled && currentConfig.binId && currentConfig.apiKey) {
            try {
            const cloudData = await fetchCloudContent(currentConfig.binId, currentConfig.apiKey);
            if (cloudData) {
                // Merge with default to ensure structure integrity
                setContent(prev => ({
                    ...defaultContent,
                    ...cloudData,
                        process: {
                            ...defaultContent.process,
                            ...cloudData.process,
                            phases: cloudData.process?.phases || defaultContent.process.phases
                        },
                        financials: {
                            ...defaultContent.financials,
                            ...cloudData.financials,
                            models: cloudData.financials?.models || defaultContent.financials.models 
                        },
                        comparison: cloudData.comparison || defaultContent.comparison,
                        showcase: cloudData.showcase || defaultContent.showcase,
                        faq: cloudData.faq || defaultContent.faq
                }));
                setIsLoading(false);
                clearTimeout(timeoutId);
                return; // Exit if cloud fetch successful
            }
            } catch (e) {
                console.error("Cloud fetch failed, falling back to local", e);
                // Fallthrough to local
            }
        }

        // 3. Fallback to LocalStorage Content (Only for Admin who might have edited offline)
        const savedContent = localStorage.getItem('onesip_content');
        if (savedContent) {
            try {
            const parsed = JSON.parse(savedContent);
            setContent(prev => ({
                ...defaultContent,
                ...parsed,
                // Deep merge safety
                process: { ...defaultContent.process, ...parsed.process, phases: parsed.process?.phases || defaultContent.process.phases },
                financials: { ...defaultContent.financials, ...parsed.financials, models: parsed.financials?.models || defaultContent.financials.models },
                comparison: parsed.comparison || defaultContent.comparison,
                showcase: parsed.showcase || defaultContent.showcase,
                faq: parsed.faq || defaultContent.faq
            }));
            } catch (e) {
            console.error("Failed to parse local content", e);
            }
        }
      } catch (e) {
          console.error("Catastrophic error in initialization", e);
      } finally {
          setIsLoading(false);
          clearTimeout(timeoutId);
      }
    };

    init();
    
    return () => clearTimeout(timeoutId);
  }, []);

  const login = () => { setIsAdmin(true); setIsDashboardOpen(true); };
  const logout = () => { setIsAdmin(false); setIsDashboardOpen(false); };
  const toggleAdmin = () => setIsAdmin(prev => !prev);
  const openDashboard = () => setIsDashboardOpen(true);
  const closeDashboard = () => setIsDashboardOpen(false);

  // --- Update Functions ---
  const updateCloudConfig = (config: Partial<CloudConfig>) => {
      setCloudConfig(prev => {
          const newConfig = { ...prev, ...config };
          localStorage.setItem('onesip_cloud_config', JSON.stringify(newConfig));
          return newConfig;
      });
  };

  const updateHero = (field: keyof HeroContent, value: string) => {
    setContent(prev => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
  };

  const updateSection = (section: keyof SiteContent, field: string, value: any) => {
    setContent(prev => ({ ...prev, [section]: { ...(prev[section] as any), [field]: value } }));
  };
  
  const toggleSectionVisibility = (section: keyof SiteContent) => {
    setContent(prev => {
        const currentSection = prev[section] as any;
        if (currentSection && typeof currentSection.isVisible !== 'undefined') {
            return { ...prev, [section]: { ...currentSection, isVisible: !currentSection.isVisible } };
        }
        return prev;
    });
  };

  const updateSectionItem = (section: keyof SiteContent, index: number, field: string, value: string) => {
    setContent(prev => {
        const currentSection = prev[section] as any;
        const newItems = [...currentSection.items];
        newItems[index] = { ...newItems[index], [field]: value };
        return { ...prev, [section]: { ...currentSection, items: newItems } };
    });
  };

  const updateMenuItem = (id: number, field: keyof MenuItem, value: any) => {
    setContent(prev => ({ ...prev, menu: prev.menu.map(item => item.id === id ? { ...item, [field]: value } : item) }));
  };

  const addMenuItem = () => {
    const newId = Math.max(...content.menu.map(m => m.id), 0) + 1;
    const newItem: MenuItem = {
      id: newId,
      name: "新产品名称",
      eng: "New Product",
      price: "€5.0",
      tag: "NEW",
      desc: "请输入产品描述...",
      ingredients: ["原料1", "原料2"],
      image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=800&q=80"
    };
    setContent(prev => ({ ...prev, menu: [...prev.menu, newItem] }));
  };

  const deleteMenuItem = (id: number) => {
    if (confirm('确定要删除这个产品吗？')) {
      setContent(prev => ({ ...prev, menu: prev.menu.filter(item => item.id !== id) }));
    }
  };

  const updateFinancialModel = (index: number, field: keyof FinancialModelItem, value: any) => {
      setContent(prev => {
          const newModels = [...prev.financials.models];
          newModels[index] = { ...newModels[index], [field]: value };
          return { ...prev, financials: { ...prev.financials, models: newModels } };
      });
  };

  const updateFinancialModelDetail = (modelIndex: number, type: 'pros' | 'cons', detailIndex: number, value: string) => {
    setContent(prev => {
        const newModels = [...prev.financials.models];
        const currentModel = newModels[modelIndex];
        const newList = [...currentModel[type]];
        newList[detailIndex] = value;
        newModels[modelIndex] = { ...currentModel, [type]: newList };
        return { ...prev, financials: { ...prev.financials, models: newModels } };
    });
  };
  
  const updateProcessPhase = (index: number, field: keyof ProcessPhase, value: any) => {
      setContent(prev => {
          const newPhases = [...prev.process.phases];
          newPhases[index] = { ...newPhases[index], [field]: value };
          return { ...prev, process: { ...prev.process, phases: newPhases } };
      });
  };

  const updateProcessPhaseDetail = (phaseIndex: number, type: 'benefits' | 'obligations', detailIndex: number, value: string) => {
      setContent(prev => {
          const newPhases = [...prev.process.phases];
          const currentPhase = newPhases[phaseIndex];
          const newList = [...currentPhase[type]];
          newList[detailIndex] = value;
          newPhases[phaseIndex] = { ...currentPhase, [type]: newList };
          return { ...prev, process: { ...prev.process, phases: newPhases } };
      });
  };

  // --- Save Logic ---
  const saveChanges = async () => {
    setIsSyncing(true);
    
    // 1. Always save to LocalStorage (Cache)
    localStorage.setItem('onesip_content', JSON.stringify(content));
    
    // 2. Try Cloud Save
    if (cloudConfig.enabled && cloudConfig.binId && cloudConfig.apiKey) {
        try {
            await saveCloudContent(cloudConfig.binId, cloudConfig.apiKey, content);
            alert("同步成功！更改已保存到云端，所有用户将即时看到更新。");
        } catch (e) {
            alert("本地保存成功，但云端同步失败。请检查您的网络或 API Key 设置。");
        }
    } else {
        alert("已保存到本地浏览器缓存。\n提示：配置云端同步后可实现多端实时更新。");
    }
    
    setIsSyncing(false);
  };

  const resetContent = () => {
    if (confirm("确定要重置所有内容到初始状态吗？此操作无法撤销。")) {
      setContent(defaultContent);
      localStorage.removeItem('onesip_content');
    }
  }

  return (
    <ContentContext.Provider value={{ 
      content, 
      cloudConfig,
      isLoading,
      isSyncing,
      isAdmin, 
      isDashboardOpen, 
      login, 
      logout,
      toggleAdmin,
      openDashboard,
      closeDashboard,
      updateCloudConfig,
      updateHero, 
      updateSection,
      toggleSectionVisibility,
      updateSectionItem,
      updateMenuItem, 
      addMenuItem,
      deleteMenuItem,
      updateFinancialModel,
      updateFinancialModelDetail,
      updateProcessPhase,
      updateProcessPhaseDetail,
      saveChanges, 
      resetContent 
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
