import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteContent, MenuItem, HeroContent, SectionItem, FinancialModelItem, ProcessPhase, CloudConfig, ShowcaseItem, FAQItem, Lead, Language, LocalizedText } from '../types';
import { fetchCloudContent, saveCloudContent } from '../services/storageService';
import { translateText } from '../services/geminiService';
import { APP_CONFIG } from '../config';

// Helper to create localized text
const t = (zh: string, en: string): LocalizedText => ({ zh, en });

// 默认数据 (Bilingual) - MOVED UP for Migration Reference
const defaultContent: SiteContent = {
  hero: {
    tagline: t("荷兰知名自动化饮品品牌", "Holland's Premium Automated Beverage Brand"),
    titleLine1: t("For Everyone,", "For Everyone,"),
    titleLine2: t("For Every Moment.", "For Every Moment."),
    subtitle: t("0 房租 · 100% 自动化", "0 Rent · 100% Automated"),
    description: t("在原有门店中多出一个具有品牌力的店中店。这不仅仅是增加一款奶茶产品，而是为您引入一个成熟的自动化奶茶品牌体系。", "Add a branded shop-in-shop to your existing store. It's not just adding bubble tea; it's introducing a mature, automated beverage system."),
    buttonText: t("测算我的收益", "Calculate Revenue"),
    trustText: t("欧洲 100+ 合作伙伴信赖", "Trusted by 100+ European Partners"),
    image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=600&q=80"
  },
  model: {
    isVisible: true,
    tagline: t("商业模式", "Business Model"),
    title: t("为什么选择\n店中店模式？", "Why Choose the\nShop-in-Shop Model?"),
    description: t("传统的奶茶店深受高昂房租和人工成本的拖累。我们将整套系统压缩成一个智能模块，将利润直接留给您。", "Traditional bubble tea shops suffer from high rent and labor costs. We compressed the entire system into a smart module, leaving the profits directly to you."),
    items: [
      { title: t("品牌流量互导", "Brand Traffic Synergy"), desc: t("不仅卖饮品，更共享 ONESIP 品牌流量。直接导入 ONESIP TOP8 网红产品，丰富产品结构，显著提升客单价。", "Share ONESIP brand traffic. Import TOP8 best-selling products to enrich your structure and boost average ticket size.") },
      { title: t("高度自动标准化", "Highly Automated & Standardized"), desc: t("告别不稳定的人工手摇。机器自动配比、清洗。新员工培训1小时即可完美上岗。", "Say goodbye to inconsistent manual shaking. Automated mixing and cleaning. New staff trained in 1 hour.") },
      { title: t("空间极致利用", "Ultimate Space Efficiency"), desc: t("利用现有闲置吧台或角落。不增加一分钱房租。将坪效提升至极限。", "Utilize idle counters or corners. Zero additional rent. Maximize revenue per square meter.") }
    ]
  },
  process: {
    isVisible: true,
    tagline: t("合作政策", "Cooperation Policy"),
    title: t("全程扶植，\n进退有据。", "Full Support,\nClear Terms."),
    description: t("我们不只卖设备，而是提供从起步到盈利的全方位保障。清晰的阶段划分，让您的每一分投入都有安全感。", "We don't just sell equipment; we provide security from start to profit. Clear phases give you confidence in every investment."),
    phases: [
        {
            title: t("STEP 1: 成长期 (品牌扶植)", "STEP 1: Growth Phase"),
            subtitle: t("0风险起步，甚至无需租赁费", "Zero Risk Start, No Rental Fee"),
            badge: t("试运行期", "Trial Period"),
            benefitsTitle: t("ONESIP 推广期福利", "ONESIP Promo Benefits"),
            benefits: [
                t("1. 导入 ONESIP 原班 TOP8-10 爆款饮品库", "1. Import ONESIP TOP 8-10 best-sellers"),
                t("2. 免费提供全套社交媒体宣传和店铺可视化物料", "2. Free social media & visual marketing materials"),
                t("3. 全部原料由 ONESIP 提供，无库存压力", "3. All ingredients supplied by ONESIP, no inventory pressure"),
                t("4. 机器由 ONESIP 免费提供，免除租赁费用", "4. Machine provided free by ONESIP, no rental fee"),
                t("5. 每天提供4小时专业奶茶员工支持 (开早/备料)", "5. 4 hours/day professional staff support"),
                t("6. 提供全套标准化 SOP 培训", "6. Full SOP training provided"),
                t("7. 推广期内 免除品牌管理费", "7. No brand management fee during promo")
            ],
            obligationsTitle: t("店家配合义务", "Partner Obligations"),
            obligations: [
                t("1. 只能使用 I'TEA Supply 提供的官方原料", "1. Must use official ingredients from I'TEA Supply"),
                t("2. 严格按照 ONESIP 配方制作", "2. Strictly follow ONESIP recipes"),
                t("3. 签署保密协议 (NDA)", "3. Sign NDA"),
                t("4. 试运行期最少 2 个月", "4. Minimum 2 months trial"),
                t("5. 提供约5平米场地及水电、制冰机等基础设备", "5. Provide ~5m² space, utilities, ice machine"),
                t("6. 保证执行 HACCP 食品安全标准", "6. Ensure HACCP food safety standards")
            ]
        },
        {
            title: t("STEP 2: 正式签约期", "STEP 2: Contract Phase"),
            subtitle: t("深度绑定，共享品牌红利", "Deep Bonding, Share Brand Dividends"),
            badge: t("24个月合约", "24-Month Contract"),
            benefitsTitle: t("签约商户总福利", "Contract Partner Benefits"),
            benefits: [
                t("1. 持续更新 TOP8 及新品热卖款，品牌持续引流", "1. Continuous updates of best-sellers & new arrivals"),
                t("2. 小红书/TikTok 持续营销推广支持", "2. Ongoing RedBook/TikTok marketing support"),
                t("3. 享受荷兰最低原料价格 (承诺同品质全荷最低)", "3. Lowest ingredient prices in Netherlands guaranteed"),
                t("4. 专业团队设备维护，出现问题立刻响应", "4. Professional maintenance team, instant response"),
                t("5. 解锁专业线上点餐系统 & 人机互动客服", "5. Unlock online ordering system & AI customer service"),
                t("6. 数据驱动：跟进饮品销量，及时调整策略", "6. Data-driven: Track sales and adjust strategies"),
                t("7. 享有该地区独立门店优先权，有机会成为地区代理", "7. Priority for standalone stores in the region")
            ],
            obligationsTitle: t("签约商户义务", "Partner Obligations"),
            obligations: [
                t("1. 保持 ONESIP 品牌形象，售价统一", "1. Maintain brand image and unified pricing"),
                t("2. 签署保密协议和竞业协议", "2. Sign NDA and Non-Compete Agreement"),
                t("3. 支付机器系统服务费 (€899/月)", "3. Pay machine system service fee (€899/mo)"),
                t("4. 支付 7% 品牌管理费 (利益绑定)", "4. Pay 7% brand management fee"),
                t("5. 保证员工接受定期培训", "5. Ensure staff receive regular training")
            ]
        },
        {
            title: t("保障机制: 兜底与退出", "Safeguard & Exit"),
            subtitle: t("解决您的后顾之忧", "Solving Your Worries"),
            badge: t("安全网", "Safety Net"),
            benefitsTitle: t("人性化退出与豁免政策", "Humane Exit & Waiver Policy"),
            benefits: [
                t("1. 连续3个月日均 < 40杯：免除当月品牌管理费", "1. Avg <40 cups/day for 3 months: Waive brand fee"),
                t("2. 连续6个月日均 < 40杯：可协商无责退出条件", "2. Avg <40 cups/day for 6 months: Negotiate exit"),
                t("3. 连续6个月日均 < 25杯：ONESIP 考虑主动终止合作止损", "3. Avg <25 cups/day for 6 months: ONESIP may terminate"),
                t("4. 退出机制透明：仅需结算机器折旧费与部分软件费", "4. Transparent exit: Pay only depreciation & software fees"),
                t("5. 严厉打击违规：若发现偷换原料或卫生违规，立即终止", "5. Strict compliance: Immediate termination for violation")
            ],
            obligationsTitle: t("风控核心", "Risk Control Core"),
            obligations: [
                t("我们通过'销量阈值'来保护双方利益。", "We protect both interests via 'Sales Thresholds'."),
                t("如果不赚钱，我们陪您一起止损。", "If not profitable, we help you cut losses."),
                t("但食品安全与品牌声誉是底线，不可触碰。", "Food safety and brand reputation are non-negotiable.")
            ]
        }
    ]
  },
  showcase: {
    isVisible: false,
    tagline: t("成功案例", "Showcase"),
    title: t("他们已经\n赚到了钱。", "They Are Already\nMaking Money."),
    description: t("从寿司店到书店，从超市到食堂。看看不同业态的合作伙伴是如何利用闲置空间创造第二增长曲线的。", "From sushi shops to bookstores. See how partners create a second growth curve using idle space."),
    items: [
        {
            title: t("Shabu Shabu 寿司店", "Shabu Shabu Sushi"),
            desc: t("利用收银台旁0.5米空间，无需额外员工，顾客等待外卖时自助点单。", "Using 0.5m space by cashier. No extra staff. Self-service for waiting customers."),
            tag: t("Rotterdam", "Rotterdam"),
            image: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&w=800&q=80",
            statValue: t("+€3.5", "+€3.5"),
            statLabel: t("客单价提升", "Ticket Lift")
        },
        {
            title: t("InterBook 独立书店", "InterBook Store"),
            desc: t("在阅读区角落引入ONESIP，安静不打扰，为读者提供高品质饮品，延长留店时间。", "ONESIP in the reading corner. Quiet, high-quality drinks extending dwell time."),
            tag: t("Amsterdam", "Amsterdam"),
            image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80",
            statValue: t("€2,500", "€2,500"),
            statLabel: t("月平均增收", "Monthly Revenue")
        },
        {
            title: t("Asian Market 超市", "Asian Market"),
            desc: t("出口处设立自助站，购物结束后的顺手一杯。全自助模式，无需收银员干预。", "Self-service station at exit. Grab-and-go after shopping. No cashier needed."),
            tag: t("Utrecht", "Utrecht"),
            image: "https://images.unsplash.com/photo-1604719312566-b76d4685332e?auto=format&fit=crop&w=800&q=80",
            statValue: t("120杯", "120 Cups"),
            statLabel: t("日均销量", "Daily Sales")
        }
    ]
  },
  comparison: {
    isVisible: true,
    tagline: t("配置清单", "Configuration"),
    title: t("只有清晰的分工，\n才有高效的合作。", "Clear Division,\nEfficient Cooperation."),
    description: t("我们为您准备好了核心赚钱工具，您只需要准备好基础的水电设施。拒绝模糊地带，每一项责任都清晰可见。", "We provide the core tools; you provide utilities. No gray areas, every responsibility is clear."),
    col1Title: t("普通租赁机", "Rental Machine"),
    col2Title: t("ONESIP LITE", "ONESIP LITE"),
    col3Title: t("自己开店 (DIY)", "DIY Shop"),
    note1: t("* 场地必须具备基础的上下水通路和独立电源，无需额外拉工业电。", "* Site must have water supply/drainage and power. No industrial power needed."),
    note2: t("** 机器参数会根据不同原料（茶汤、果浆、黑糖）进行定制化校准。", "** Machine params calibrated for specific ingredients (tea, syrup, sugar)."),
    categories: [
      {
        title: t("核心设备硬件", "Core Hardware"),
        items: [
          { name: t("小型智能奶茶机", "Smart Boba Machine"), rental: true, lite: 'Y', self: true },
          { name: t("制冰机", "Ice Machine"), rental: false, lite: 'S', self: true },
          { name: t("智能泡茶机", "Tea Brewer"), rental: false, lite: 'Y', self: true },
          { name: t("沙冰机", "Blender"), rental: false, lite: 'Y', self: true },
          { name: t("自动封口机", "Sealer Machine"), rental: false, lite: 'Y', self: true },
          { name: t("珍珠锅", "Boba Cooker"), rental: false, lite: 'Y', self: true },
          { name: t("水池/清洗台", "Sink/Cleaning"), rental: false, lite: 'S', self: true },
          { name: t("蒸汽机 (热饮)", "Steam Wand"), rental: false, lite: 'S', self: true },
          { name: t("平板电脑 (中控)", "Tablet (Control)"), rental: false, lite: 'S', self: true },
          { name: t("自助点餐机 (Kiosk)", "Kiosk"), rental: false, lite: 'N', self: true },
        ]
      },
      {
        title: t("运营耗材与工具", "Consumables & Tools"),
        items: [
          { name: t("雪克杯 (x2)", "Shaker (x2)"), rental: false, lite: 'Y', self: true },
          { name: t("搅拌棒 (x2)", "Stirrer (x2)"), rental: false, lite: 'Y', self: true },
          { name: t("冰锤 (x1)", "Ice Hammer (x1)"), rental: false, lite: 'Y', self: true },
          { name: t("专用茶网 (x1套)", "Tea Filter Set"), rental: true, lite: 'Y', self: true },
          { name: t("量桶/料桶 (x7)", "Containers (x7)"), rental: false, lite: 'Y', self: true },
          { name: t("果粉/珍珠勺", "Scoops"), rental: false, lite: 'Y', self: true },
          { name: t("标签打印机", "Label Printer"), rental: false, lite: 'Y', self: true },
          { name: t("冷藏小料盒 (x9)", "Topping Station"), rental: false, lite: 'S', self: true },
          { name: t("电子天平 (5kg+)", "Scale (5kg+)"), rental: false, lite: 'S', self: true },
        ]
      },
      {
        title: t("软性服务与赋能", "Services & Support"),
        items: [
          { name: t("机器安装与调试", "Installation"), rental: true, lite: 'Y', self: true },
          { name: t("机器常规维护", "Maintenance"), rental: true, lite: 'Y', self: true },
          { name: t("首批配方录入", "Recipe Setup"), rental: true, lite: 'Y', self: true },
          { name: t("专属线上下单 App", "Ordering App"), rental: false, lite: 'Y', self: true },
          { name: t("后台数据/配方看板", "Data Dashboard"), rental: false, lite: 'Y', self: false },
          { name: t("人机互动客服系统", "AI Customer Service"), rental: false, lite: 'Y', self: false },
          { name: t("配方持续更新", "Recipe Updates"), rental: false, lite: 'Y', self: false },
          { name: t("全网营销推广", "Marketing Support"), rental: false, lite: 'Y', self: false },
          { name: t("店面宣传物料", "Marketing Materials"), rental: false, lite: 'Y', self: false },
          { name: t("SOP 培训 (礼仪/卫生)", "SOP Training"), rental: false, lite: 'Y', self: true },
        ]
      }
    ]
  },
  financials: {
    isVisible: true,
    tagline: t("利润计算器", "Calculator"),
    title: t("利润看得见", "Visible Profits"),
    description: t("基于 2025 内部运营模型校准。拖动滑块，对比四种模式的生存线。", "Based on 2025 internal operating model. Drag slider to compare survival lines."),
    disclaimer: t("数据透明，无隐形算式。", "Transparent data, no hidden formulas."),
    labelSales: t("预估日均销量", "Est. Daily Sales"),
    labelCups: "cups",
    labelMin: "Min (15)",
    labelTarget: "Target (80)",
    labelMax: "Max (150)",
    alertTitle: t("销量过低", "Volume Too Low"),
    alertDesc: t("不建议引入自动化设备", "Automation not recommended"),
    labelProfit: t("ONESIP 净利", "ONESIP Net Profit"),
    labelRevenue: t("月营业额", "Monthly Revenue"),
    labelCost: t("设备/品牌费 + 房租", "Cost + Rent"),
    aiButton: t("AI 智能商业点评", "AI Business Insight"),
    aiButtonLoading: t("AI 正在分析数据...", "AI Analyzing..."),
    aiResultTitle: t("分析结果", "Analysis Result"),
    comparisonTitle: t("模式对比", "Comparison"),
    breakdownRevenue: t("月营业额", "Revenue"),
    breakdownMaterials: t("- 原料成本", "- Ingredients"),
    breakdownLabor: t("- 人工成本", "- Labor"),
    breakdownRent: t("- 房租成本", "- Rent"),
    breakdownEquip: t("- 设备/品牌费", "- Equip/Brand"),
    breakdownMisc: t("- 杂费", "- Misc"),
    breakdownNet: t("净利润", "Net Profit"),
    chartTitle: t("收益对比图表", "Profit Chart"),
    models: [
      { 
          id: 'A', 
          name: t("传统自制 (DIY)", "Traditional DIY"),
          pros: [t("设备投入极低", "Low equipment cost"), t("利用现有空间", "Use existing space")],
          cons: [t("口味不稳定", "Inconsistent taste"), t("隐性人工成本极高", "High hidden labor cost"), t("无品牌溢价", "No brand premium")]
      },
      { 
          id: 'B', 
          name: t("租赁小机器", "Rental Machine"),
          pros: [t("初期投入少", "Low startup cost"), t("操作相对简单", "Simple operation")],
          cons: [t("产品单一", "Limited products"), t("无品牌支持", "No brand support"), t("设备租金是纯支出", "Rent is pure expense")]
      },
      { 
          id: 'C', 
          name: t("传统自营店", "Franchise Store"),
          pros: [t("品牌独立性", "Brand independence"), t("客单价高 (€6)", "High ticket (€6)")],
          cons: [t("极重资产投入", "Heavy asset investment"), t("高昂房租+全职人工", "High rent + labor"), t("回本周期长", "Slow ROI"), t("抗风险能力差", "Low risk tolerance")]
      },
      { 
          id: 'D', 
          name: t("ONESIP LITE", "ONESIP LITE"),
          pros: [t("0房租 / 0装修", "0 Rent / 0 Reno"), t("高度自动化 / 弹性人工", "Automated / Flexible Labor"), t("品牌+流量赋能", "Brand + Traffic"), t("供应链底价", "Supply Chain Price")],
          cons: [t("需遵守品牌规范", "Brand compliance required"), t("原料强绑定", "Ingredient binding")]
      }
    ]
  },
  menuSection: {
    isVisible: true,
    tagline: t("精选菜单", "Signature Menu"),
    title: t("TOP 6 门店引流爆款", "TOP 6 Traffic Drivers"),
    description: t("每一款都是经过欧洲市场验证的“销量收割机”。颜值高、出品快、复购强。", "Each one is a market-proven sales driver. Good looking, fast serving, high repurchase.")
  },
  menu: [
    { 
      id: 1,
      name: t("泰奶咸法酪", "Thai Tea Salty Cheese"),
      eng: "Thai Tea Salty Cheese",
      price: "€5.0", 
      tag: t("TOP 1", "TOP 1"), 
      desc: t("浓郁泰式红茶撞上咸香芝士奶盖，口感层次丰富。", "Rich Thai tea meets salty cheese foam. Complex layers."),
      ingredients: ["泰奶", "奶盖", "西米"],
      image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=800&q=80", 
    },
    { 
      id: 2,
      name: t("杨枝甘露", "Mango Pomelo Sago"), 
      eng: "Mango Pomelo Sago",
      price: "€6.0", 
      tag: t("Classic", "Classic"), 
      desc: t("港式经典复刻，新鲜芒果肉感十足，解腻首选。", "HK Classic. Fresh mango flesh. Refreshing choice."),
      ingredients: ["鲜奶", "芒果", "西柚"],
      image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80", 
    },
    { 
      id: 3,
      name: t("芝芝葡萄", "Cheezo Grape"), 
      eng: "Cheezo Grape",
      price: "€6.0", 
      tag: t("Popular", "Popular"), 
      desc: t("精选多肉葡萄，搭配顺滑酸奶与清新茶底。", "Selected fleshy grapes with yogurt and fresh tea."),
      ingredients: ["葡萄", "酸奶", "茶冻"],
      image: "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=800&q=80", 
    },
    { 
      id: 4,
      name: t("小吊梨马蹄", "Pear & Water Chestnut"), 
      eng: "Pear & Water Chestnut",
      price: "€5.0", 
      tag: t("Fresh", "Fresh"), 
      desc: t("清润小吊梨汤底，加入马蹄爽脆颗粒，养生又好喝。", "Pear soup base with crunchy water chestnuts. Healthy."),
      ingredients: ["小吊梨", "马蹄", "银耳"],
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80", 
    },
    { 
      id: 5,
      name: t("黑糖啵啵鲜奶", "Brown Sugar Boba Milk"), 
      eng: "Brown Sugar Boba Milk",
      price: "€5.0", 
      tag: t("Rich", "Rich"), 
      desc: t("古法黑糖挂壁，Q弹温热珍珠撞入冰鲜牛奶。", "Brown sugar stripes. Chewy warm boba in cold milk."),
      ingredients: ["黑糖", "珍珠", "鲜奶"],
      image: "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?auto=format&fit=crop&w=800&q=80", 
    },
    { 
      id: 6,
      name: t("茉莉鲜奶茶", "Jasmine Milk Tea"), 
      eng: "Jasmine Milk Tea",
      price: "€3.9", 
      tag: t("Value", "Value"), 
      desc: t("七窨茉莉花茶底，清香扑鼻，性价比之王。", "Seven-scented jasmine tea base. Fragrant and high value."),
      ingredients: ["茉莉绿茶", "鲜奶"],
      image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=800&q=80", 
    },
  ],
  faq: {
    isVisible: true,
    tagline: t("常见问题", "FAQ"),
    title: t("合作前，\n先解决您的疑虑。", "Resolve Your Doubts\nBefore Partnering."),
    description: t("我们整理了合作伙伴最关心的运营、技术与法律问题。", "We've compiled the most common operational, technical, and legal questions."),
    items: [
        {
            question: t("机器出现故障怎么办？谁来维修？", "What if the machine breaks?"),
            answer: t("ONESIP 提供全包式维保服务。软件问题通过远程 OTA 实时修复（约10分钟）；硬件故障我们承诺在 48 小时内上门维修或提供备用机。在质保期内，一切维修费用由我们承担。", "ONESIP provides all-inclusive maintenance. Software issues fixed via OTA (10 mins); Hardware fixed on-site within 48h. All costs covered during warranty.")
        },
        {
            question: t("必须使用 ONESIP 提供的原料吗？", "Must we use ONESIP ingredients?"),
            answer: t("是的。为了确保口味的一致性、食品安全以及机器参数的精准匹配，合作商必须使用 I'TEA Supply 官方提供的原料（茶汤、果浆、珍珠等）。我们承诺给予合作商全荷兰最具竞争力的批发价格。", "Yes. To ensure consistency, safety, and machine calibration, you must use I'TEA Supply ingredients. We guarantee the most competitive wholesale prices in NL.")
        },
        {
            question: t("店员学不会操作怎么办？", "What if staff can't learn it?"),
            answer: t("我们的机器设计理念是“傻瓜式操作”。点击屏幕 -> 扫码 -> 出杯。通常只需 30 分钟即可教会新员工。此外，我们提供开业前的一对一上门培训，以及全套视频 SOP 教程。", "It's designed to be foolproof. Click -> Scan -> Serve. 30 mins to learn. We also provide on-site training and video SOPs.")
        },
        {
            question: t("对店铺的水电有什么特殊要求？", "Any utility requirements?"),
            answer: t("不需要工业用电，普通 220V 插座即可。需要具备基本的上下水（进水和排水）条件，建议距离机器摆放位置不超过 2 米。如果您不确定，我们可以安排技术人员进行视频勘测。", "No industrial power, just 220V. Needs basic water supply and drainage within 2m. We can arrange video survey if unsure.")
        },
        {
            question: t("如果合作不愉快，可以随时退出吗？", "Can I exit anytime?"),
            answer: t("我们设有“冷静期”和“退出机制”。试运行期（前2个月）内，您可以随时无责退出。正式签约后，如果连续 6 个月未达到最低销量指标，您可以申请提前终止合同，仅需支付少量折旧费。", "Yes. You have a cooling-off period (first 2 months) to exit freely. After signing, if sales miss targets for 6 months, you can terminate with small depreciation fee.")
        }
    ]
  },
  partner: {
    isVisible: true,
    title: t("寻找城市合伙人", "Seeking City Partners"),
    buttonText: t("立即申请加盟咨询", "Apply for Consultation"),
    disclaimer: t("名额有限，我们将严格筛选合作伙伴。", "Limited spots, strict selection."),
    items: [
      { title: t("现有门店", "Existing Store"), desc: t("拥有稳定客流 (餐厅/书店/零售)", "Stable traffic (Restaurant/Retail)") },
      { title: t("黄金地段", "Prime Location"), desc: t("市中心、车站或高流量商圈", "City center, Station, High traffic") },
      { title: t("年轻客群", "Young Audience"), desc: t("周边有大学或国际化人群", "Near universities or expats") },
      { title: t("长期主义", "Long-termism"), desc: t("认可数字化模式，追求长期增长", "Value digital model & growth") },
      { title: t("空间要求", "Space Req."), desc: t("需要提供5平左右用于ONESIP LITE独立运营", "Need ~5m² for operation") },
      { title: t("水电基础", "Utilities"), desc: t("具备基本的进排水和电力条件", "Basic water & power") }
    ]
  },
  footer: {
    aboutText: t("ONESIP LITE 是荷兰领先的自动化饮品解决方案提供商。致力于通过科技赋能餐饮行业。", "ONESIP LITE is a leading automated beverage solution provider in the Netherlands. Empowering F&B with technology."),
    contactTitle: t("联系我们", "Contact Us"),
    email: "info@onesip.nl",
    address: "Rotterdam, Netherlands",
    resourceTitle: t("资源下载", "Resources"),
    copyright: "© 2025 ONESIP B.V."
  },
  library: [],
  leads: []
};

// Data Migration Helper
const migrateContent = (data: any): SiteContent => {
    const migrated = { ...defaultContent, ...data };

    const toLoc = (val: any, defZh: string, defEn: string): LocalizedText => {
        // Case 1: Legacy String
        if (typeof val === 'string') {
             // Smart Migration: If matches default Chinese, use default English
             if (val === defZh) return { zh: val, en: defEn };
             // Otherwise use the string for both
             return { zh: val, en: val }; 
        }
        // Case 2: Already Object
        if (val && typeof val === 'object' && 'zh' in val) {
            // Auto-Heal: If English is identical to Chinese (bad previous migration) AND Chinese matches default, restore default English
            if (val.zh === val.en && val.zh === defZh && defZh !== defEn) {
                return { zh: val.zh, en: defEn };
            }
            return val;
        }
        // Case 3: Missing/Null
        return { zh: defZh, en: defEn };
    };

    // Migrate Hero
    if (migrated.hero) {
        migrated.hero.tagline = toLoc(migrated.hero.tagline, defaultContent.hero.tagline.zh, defaultContent.hero.tagline.en);
        migrated.hero.titleLine1 = toLoc(migrated.hero.titleLine1, defaultContent.hero.titleLine1.zh, defaultContent.hero.titleLine1.en);
        migrated.hero.titleLine2 = toLoc(migrated.hero.titleLine2, defaultContent.hero.titleLine2.zh, defaultContent.hero.titleLine2.en);
        migrated.hero.subtitle = toLoc(migrated.hero.subtitle, defaultContent.hero.subtitle.zh, defaultContent.hero.subtitle.en);
        migrated.hero.description = toLoc(migrated.hero.description, defaultContent.hero.description.zh, defaultContent.hero.description.en);
        migrated.hero.buttonText = toLoc(migrated.hero.buttonText, defaultContent.hero.buttonText.zh, defaultContent.hero.buttonText.en);
        migrated.hero.trustText = toLoc(migrated.hero.trustText, defaultContent.hero.trustText.zh, defaultContent.hero.trustText.en);
    }

    // Migrate Menu
    if (migrated.menu) {
        migrated.menu = migrated.menu.map((item: any) => ({
            ...item,
            name: toLoc(item.name, "Name", "Name"),
            tag: toLoc(item.tag, "TAG", "TAG"),
            desc: toLoc(item.desc, "Desc", "Desc"),
            eng: item.eng || "" 
        }));
    }

    // Migrate Model
    if (migrated.model) {
        migrated.model.tagline = toLoc(migrated.model.tagline, defaultContent.model.tagline.zh, defaultContent.model.tagline.en);
        migrated.model.title = toLoc(migrated.model.title, defaultContent.model.title.zh, defaultContent.model.title.en);
        migrated.model.description = toLoc(migrated.model.description, defaultContent.model.description.zh, defaultContent.model.description.en);
        if (migrated.model.items) {
            migrated.model.items = migrated.model.items.map((item: any, i: number) => ({
                ...item,
                title: toLoc(item.title, defaultContent.model.items[i]?.title.zh || "", defaultContent.model.items[i]?.title.en || ""),
                desc: toLoc(item.desc, defaultContent.model.items[i]?.desc.zh || "", defaultContent.model.items[i]?.desc.en || "")
            }));
        }
    }

    // Migrate Process
    if (migrated.process) {
        const p = migrated.process;
        p.tagline = toLoc(p.tagline, defaultContent.process.tagline.zh, defaultContent.process.tagline.en);
        p.title = toLoc(p.title, defaultContent.process.title.zh, defaultContent.process.title.en);
        p.description = toLoc(p.description, defaultContent.process.description.zh, defaultContent.process.description.en);
        if (p.phases) {
            p.phases = p.phases.map((ph: any, i: number) => {
                const defPh = defaultContent.process.phases[i] || defaultContent.process.phases[0];
                return {
                    ...ph,
                    title: toLoc(ph.title, defPh.title.zh, defPh.title.en),
                    subtitle: toLoc(ph.subtitle, defPh.subtitle.zh, defPh.subtitle.en),
                    badge: toLoc(ph.badge, defPh.badge.zh, defPh.badge.en),
                    benefitsTitle: toLoc(ph.benefitsTitle, defPh.benefitsTitle.zh, defPh.benefitsTitle.en),
                    benefits: (ph.benefits || []).map((b: any, bi: number) => toLoc(b, defPh.benefits[bi]?.zh || "", defPh.benefits[bi]?.en || "")),
                    obligationsTitle: toLoc(ph.obligationsTitle, defPh.obligationsTitle.zh, defPh.obligationsTitle.en),
                    obligations: (ph.obligations || []).map((o: any, oi: number) => toLoc(o, defPh.obligations[oi]?.zh || "", defPh.obligations[oi]?.en || ""))
                };
            });
        }
    }

    // Migrate Comparison
    if (migrated.comparison) {
        const c = migrated.comparison;
        c.tagline = toLoc(c.tagline, defaultContent.comparison.tagline.zh, defaultContent.comparison.tagline.en);
        c.title = toLoc(c.title, defaultContent.comparison.title.zh, defaultContent.comparison.title.en);
        c.description = toLoc(c.description, defaultContent.comparison.description.zh, defaultContent.comparison.description.en);
        c.col1Title = toLoc(c.col1Title, defaultContent.comparison.col1Title.zh, defaultContent.comparison.col1Title.en);
        c.col2Title = toLoc(c.col2Title, defaultContent.comparison.col2Title.zh, defaultContent.comparison.col2Title.en);
        c.col3Title = toLoc(c.col3Title, defaultContent.comparison.col3Title.zh, defaultContent.comparison.col3Title.en);
        c.note1 = toLoc(c.note1, defaultContent.comparison.note1.zh, defaultContent.comparison.note1.en);
        c.note2 = toLoc(c.note2, defaultContent.comparison.note2.zh, defaultContent.comparison.note2.en);

        if (c.categories) {
            c.categories = c.categories.map((cat: any, i: number) => {
                const defCat = defaultContent.comparison.categories[i] || defaultContent.comparison.categories[0];
                return {
                    ...cat,
                    title: toLoc(cat.title, defCat.title.zh, defCat.title.en),
                    items: (cat.items || []).map((item: any, ii: number) => {
                        const defItem = defCat.items[ii] || { name: { zh: "Item", en: "Item" } };
                        return {
                            ...item,
                            name: toLoc(item.name, defItem.name.zh, defItem.name.en)
                        }
                    })
                }
            });
        }
    }

    // Migrate Showcase
    if (migrated.showcase) {
        const s = migrated.showcase;
        s.tagline = toLoc(s.tagline, defaultContent.showcase.tagline.zh, defaultContent.showcase.tagline.en);
        s.title = toLoc(s.title, defaultContent.showcase.title.zh, defaultContent.showcase.title.en);
        s.description = toLoc(s.description, defaultContent.showcase.description.zh, defaultContent.showcase.description.en);
        if (s.items) {
             s.items = s.items.map((item: any, i: number) => {
                 const defItem = defaultContent.showcase.items[i] || defaultContent.showcase.items[0];
                 return {
                     ...item,
                     title: toLoc(item.title, defItem.title.zh, defItem.title.en),
                     desc: toLoc(item.desc, defItem.desc.zh, defItem.desc.en),
                     tag: toLoc(item.tag, defItem.tag.zh, defItem.tag.en),
                     statValue: toLoc(item.statValue, defItem.statValue.zh, defItem.statValue.en),
                     statLabel: toLoc(item.statLabel, defItem.statLabel.zh, defItem.statLabel.en)
                 };
             });
        }
    }

    // Migrate FAQ
    if (migrated.faq) {
         const f = migrated.faq;
         f.tagline = toLoc(f.tagline, defaultContent.faq.tagline.zh, defaultContent.faq.tagline.en);
         f.title = toLoc(f.title, defaultContent.faq.title.zh, defaultContent.faq.title.en);
         f.description = toLoc(f.description, defaultContent.faq.description.zh, defaultContent.faq.description.en);
         if (f.items) {
             f.items = f.items.map((item: any, i: number) => {
                 const defItem = defaultContent.faq.items[i] || defaultContent.faq.items[0];
                 return {
                     ...item,
                     question: toLoc(item.question, defItem.question.zh, defItem.question.en),
                     answer: toLoc(item.answer, defItem.answer.zh, defItem.answer.en)
                 }
             });
         }
    }

    // Migrate MenuSection
    if (migrated.menuSection) {
        const m = migrated.menuSection;
        m.tagline = toLoc(m.tagline, defaultContent.menuSection.tagline.zh, defaultContent.menuSection.tagline.en);
        m.title = toLoc(m.title, defaultContent.menuSection.title.zh, defaultContent.menuSection.title.en);
        m.description = toLoc(m.description, defaultContent.menuSection.description.zh, defaultContent.menuSection.description.en);
    }

    // Migrate Partner
    if (migrated.partner) {
         const p = migrated.partner;
         p.title = toLoc(p.title, defaultContent.partner.title.zh, defaultContent.partner.title.en);
         p.buttonText = toLoc(p.buttonText, defaultContent.partner.buttonText.zh, defaultContent.partner.buttonText.en);
         p.disclaimer = toLoc(p.disclaimer, defaultContent.partner.disclaimer.zh, defaultContent.partner.disclaimer.en);
         if (p.items) {
             p.items = p.items.map((item: any, i: number) => {
                 const defItem = defaultContent.partner.items[i] || defaultContent.partner.items[0];
                 return {
                     ...item,
                     title: toLoc(item.title, defItem.title.zh, defItem.title.en),
                     desc: toLoc(item.desc, defItem.desc.zh, defItem.desc.en)
                 }
             });
         }
    }

    // Migrate Footer
    if (migrated.footer) {
         const f = migrated.footer;
         f.aboutText = toLoc(f.aboutText, defaultContent.footer.aboutText.zh, defaultContent.footer.aboutText.en);
         f.contactTitle = toLoc(f.contactTitle, defaultContent.footer.contactTitle.zh, defaultContent.footer.contactTitle.en);
         f.resourceTitle = toLoc(f.resourceTitle, defaultContent.footer.resourceTitle.zh, defaultContent.footer.resourceTitle.en);
    }

    // Migrate Financials
    if (migrated.financials) {
        const f = migrated.financials;
        f.tagline = toLoc(f.tagline, defaultContent.financials.tagline.zh, defaultContent.financials.tagline.en);
        f.title = toLoc(f.title, defaultContent.financials.title.zh, defaultContent.financials.title.en);
        f.description = toLoc(f.description, defaultContent.financials.description.zh, defaultContent.financials.description.en);
        
        f.labelSales = toLoc(f.labelSales, defaultContent.financials.labelSales.zh, defaultContent.financials.labelSales.en);
        f.breakdownRevenue = toLoc(f.breakdownRevenue, defaultContent.financials.breakdownRevenue.zh, defaultContent.financials.breakdownRevenue.en);
        f.breakdownMaterials = toLoc(f.breakdownMaterials, defaultContent.financials.breakdownMaterials.zh, defaultContent.financials.breakdownMaterials.en);
        f.breakdownLabor = toLoc(f.breakdownLabor, defaultContent.financials.breakdownLabor.zh, defaultContent.financials.breakdownLabor.en);
        f.breakdownRent = toLoc(f.breakdownRent, defaultContent.financials.breakdownRent.zh, defaultContent.financials.breakdownRent.en);
        f.breakdownEquip = toLoc(f.breakdownEquip, defaultContent.financials.breakdownEquip.zh, defaultContent.financials.breakdownEquip.en);
        f.breakdownMisc = toLoc(f.breakdownMisc, defaultContent.financials.breakdownMisc.zh, defaultContent.financials.breakdownMisc.en);
        f.breakdownNet = toLoc(f.breakdownNet, defaultContent.financials.breakdownNet.zh, defaultContent.financials.breakdownNet.en);
        f.aiButtonLoading = toLoc(f.aiButtonLoading, "Loading...", "Loading...");

        if (f.models) {
            f.models = f.models.map((m: any, i: number) => {
                const defModel = defaultContent.financials.models[i] || defaultContent.financials.models[0];
                return {
                    ...m,
                    name: toLoc(m.name, defModel.name.zh, defModel.name.en),
                    pros: (m.pros || []).map((p: any, pi: number) => toLoc(p, defModel.pros[pi]?.zh || "", defModel.pros[pi]?.en || "")),
                    cons: (m.cons || []).map((c: any, ci: number) => toLoc(c, defModel.cons[ci]?.zh || "", defModel.cons[ci]?.en || ""))
                }
            });
        }
    }

    return migrated;
};

interface ContentContextType {
  content: SiteContent;
  cloudConfig: CloudConfig;
  isLoading: boolean;
  isSyncing: boolean;
  isAdmin: boolean;
  isDashboardOpen: boolean;
  dataSource: 'cloud' | 'local' | 'default'; 
  isLeadFormOpen: boolean;
  language: Language; // NEW
  
  login: () => void;
  logout: () => void;
  toggleAdmin: () => void;
  openDashboard: () => void;
  closeDashboard: () => void;
  openLeadForm: () => void;
  closeLeadForm: () => void;
  toggleLanguage: () => void; // NEW
  
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
  addToLibrary: (url: string) => void;
  removeFromLibrary: (url: string) => void;
  submitLead: (lead: Omit<Lead, 'id' | 'timestamp' | 'status'>) => Promise<void>;
  
  saveChanges: () => void;
  resetContent: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [cloudConfig, setCloudConfig] = useState<CloudConfig>({ enabled: false, binId: '', apiKey: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dataSource, setDataSource] = useState<'cloud' | 'local' | 'default'>('default');
  const [language, setLanguage] = useState<Language>('zh');

  // --- AUTO TRANSLATE HELPER ---
  const autoSyncEnglish = async (text: string, callback: (translated: string) => void) => {
      // Only translate if currently editing Chinese, and there is text
      if (language === 'zh' && text.trim().length > 1) {
          const translated = await translateText(text);
          callback(translated);
      }
  };

  // Load Cloud Config first, then content
  useEffect(() => {
    // WATCHDOG
    const timeoutId = setTimeout(() => {
        setIsLoading(prev => {
            if (prev) console.warn("Forcing app load due to timeout");
            return false;
        });
    }, 3000);

    const init = async () => {
      setIsLoading(true);
      try {
        let currentConfig: CloudConfig = { enabled: false, binId: '', apiKey: '' };

        if (APP_CONFIG.ENABLE_CLOUD_SYNC && APP_CONFIG.CLOUD_BIN_ID && APP_CONFIG.CLOUD_API_KEY) {
             currentConfig = {
                enabled: true,
                binId: APP_CONFIG.CLOUD_BIN_ID,
                apiKey: APP_CONFIG.CLOUD_API_KEY
             };
        } 
        else {
             const savedCloudConfig = localStorage.getItem('onesip_cloud_config');
             if (savedCloudConfig) {
                 try {
                     const parsed = JSON.parse(savedCloudConfig);
                     if (parsed.enabled) currentConfig = parsed;
                 } catch (e) {}
             }
        }

        setCloudConfig(currentConfig);

        if (currentConfig.enabled && currentConfig.binId && currentConfig.apiKey) {
            try {
                console.log("Fetching from Cloud...", currentConfig.binId);
                const cloudData = await fetchCloudContent(currentConfig.binId, currentConfig.apiKey);
                if (cloudData) {
                    const migratedData = migrateContent(cloudData); // Apply Migration
                    setContent(prev => ({
                        ...defaultContent,
                        ...migratedData,
                    }));
                    setDataSource('cloud');
                    setIsLoading(false);
                    clearTimeout(timeoutId);
                    return; 
                }
            } catch (e) {
                console.error("Cloud fetch failed", e);
            }
        }

        const savedContent = localStorage.getItem('onesip_content');
        if (savedContent) {
            try {
                const parsed = JSON.parse(savedContent);
                const migratedData = migrateContent(parsed); // Apply Migration
                setContent(prev => ({
                    ...defaultContent,
                    ...migratedData,
                }));
                setDataSource('local');
            } catch (e) {}
        } else {
            setDataSource('default');
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
  const openLeadForm = () => setIsLeadFormOpen(true);
  const closeLeadForm = () => setIsLeadFormOpen(false);
  const toggleLanguage = () => setLanguage(prev => prev === 'zh' ? 'en' : 'zh');

  const updateCloudConfig = (config: Partial<CloudConfig>) => {
      setCloudConfig(prev => {
          const newConfig = { ...prev, ...config };
          localStorage.setItem('onesip_cloud_config', JSON.stringify(newConfig));
          return newConfig;
      });
  };

  // --- UPDATED UPDATERS WITH AUTO-SYNC ---

  const updateHero = (field: keyof HeroContent, value: string) => {
    setContent(prev => {
        const currentHero = prev.hero;
        // If field is text based (LocalizedText), update subfield
        if (typeof currentHero[field] === 'object' && 'zh' in (currentHero[field] as any)) {
             return { ...prev, hero: { ...currentHero, [field]: { ...(currentHero[field] as LocalizedText), [language]: value } } };
        }
        // Image or other string
        return { ...prev, hero: { ...currentHero, [field]: value } };
    });

    // Auto Translate
    if (typeof content.hero[field] === 'object') {
        autoSyncEnglish(value, (translated) => {
             setContent(prev => ({ ...prev, hero: { ...prev.hero, [field]: { ...(prev.hero[field] as LocalizedText), en: translated } } }));
        });
    }
  };

  const updateSection = (section: keyof SiteContent, field: string, value: any) => {
    setContent(prev => {
        const currentSec = prev[section] as any;
        if (typeof currentSec[field] === 'object' && 'zh' in currentSec[field]) {
            return { ...prev, [section]: { ...currentSec, [field]: { ...currentSec[field], [language]: value } } };
        }
        return { ...prev, [section]: { ...currentSec, [field]: value } };
    });
    
    // Auto Translate
    const currentSec = content[section] as any;
    if (currentSec && typeof currentSec[field] === 'object' && 'zh' in currentSec[field]) {
        autoSyncEnglish(value, (translated) => {
            setContent(prev => {
                 const sec = prev[section] as any;
                 return { ...prev, [section]: { ...sec, [field]: { ...sec[field], en: translated } } };
            });
        });
    }
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
        const item = newItems[index];
        
        if (typeof item[field] === 'object' && 'zh' in item[field]) {
             newItems[index] = { ...item, [field]: { ...item[field], [language]: value } };
        } else {
             newItems[index] = { ...item, [field]: value };
        }
        return { ...prev, [section]: { ...currentSection, items: newItems } };
    });

    const currentSection = content[section] as any;
    const item = currentSection.items[index];
    if (typeof item[field] === 'object' && 'zh' in item[field]) {
        autoSyncEnglish(value, (translated) => {
             setContent(prev => {
                const sec = prev[section] as any;
                const items = [...sec.items];
                items[index] = { ...items[index], [field]: { ...items[index][field], en: translated } };
                return { ...prev, [section]: { ...sec, items } };
             });
        });
    }
  };

  const updateMenuItem = (id: number, field: keyof MenuItem, value: any) => {
    setContent(prev => ({ 
        ...prev, 
        menu: prev.menu.map(item => {
            if (item.id !== id) return item;
            if (typeof item[field] === 'object' && 'zh' in (item[field] as any)) {
                return { ...item, [field]: { ...(item[field] as any), [language]: value } };
            }
            return { ...item, [field]: value };
        }) 
    }));

    const item = content.menu.find(m => m.id === id);
    if (item && typeof item[field] === 'object' && 'zh' in (item[field] as any)) {
         autoSyncEnglish(value, (translated) => {
             setContent(prev => ({
                 ...prev,
                 menu: prev.menu.map(m => m.id === id ? { ...m, [field]: { ...(m[field] as any), en: translated } } : m)
             }));
         });
    }
  };

  const addMenuItem = () => {
    const newId = Math.max(...content.menu.map(m => m.id), 0) + 1;
    const newItem: MenuItem = {
      id: newId,
      name: t("新产品名称", "New Product"),
      eng: "New Product",
      price: "€5.0",
      tag: t("NEW", "NEW"),
      desc: t("请输入产品描述...", "Description..."),
      ingredients: ["Ingredient1"],
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
          const model = newModels[index];
          if (typeof model[field] === 'object' && 'zh' in (model[field] as any)) {
               newModels[index] = { ...model, [field]: { ...(model[field] as any), [language]: value } };
          } else {
               newModels[index] = { ...model, [field]: value };
          }
          return { ...prev, financials: { ...prev.financials, models: newModels } };
      });

      const model = content.financials.models[index];
      if (typeof model[field] === 'object' && 'zh' in (model[field] as any)) {
          autoSyncEnglish(value, (translated) => {
              setContent(prev => {
                  const mods = [...prev.financials.models];
                  mods[index] = { ...mods[index], [field]: { ...(mods[index][field] as any), en: translated } };
                  return { ...prev, financials: { ...prev.financials, models: mods } };
              });
          });
      }
  };

  const updateFinancialModelDetail = (modelIndex: number, type: 'pros' | 'cons', detailIndex: number, value: string) => {
    setContent(prev => {
        const newModels = [...prev.financials.models];
        const currentModel = newModels[modelIndex];
        const newList = [...currentModel[type]];
        newList[detailIndex] = { ...newList[detailIndex], [language]: value };
        newModels[modelIndex] = { ...currentModel, [type]: newList };
        return { ...prev, financials: { ...prev.financials, models: newModels } };
    });

    autoSyncEnglish(value, (translated) => {
        setContent(prev => {
            const mods = [...prev.financials.models];
            const list = [...mods[modelIndex][type]];
            list[detailIndex] = { ...list[detailIndex], en: translated };
            mods[modelIndex] = { ...mods[modelIndex], [type]: list };
            return { ...prev, financials: { ...prev.financials, models: mods } };
        });
    });
  };
  
  const updateProcessPhase = (index: number, field: keyof ProcessPhase, value: any) => {
      setContent(prev => {
          const newPhases = [...prev.process.phases];
          const phase = newPhases[index];
          if (typeof phase[field] === 'object' && 'zh' in (phase[field] as any)) {
             newPhases[index] = { ...phase, [field]: { ...(phase[field] as any), [language]: value } };
          } else {
             newPhases[index] = { ...phase, [field]: value };
          }
          return { ...prev, process: { ...prev.process, phases: newPhases } };
      });
      
      const phase = content.process.phases[index];
      if (typeof phase[field] === 'object' && 'zh' in (phase[field] as any)) {
          autoSyncEnglish(value, (translated) => {
             setContent(prev => {
                 const phs = [...prev.process.phases];
                 phs[index] = { ...phs[index], [field]: { ...(phs[index][field] as any), en: translated } };
                 return { ...prev, process: { ...prev.process, phases: phs } };
             });
          });
      }
  };

  const updateProcessPhaseDetail = (phaseIndex: number, type: 'benefits' | 'obligations', detailIndex: number, value: string) => {
      setContent(prev => {
          const newPhases = [...prev.process.phases];
          const currentPhase = newPhases[phaseIndex];
          const newList = [...currentPhase[type]];
          newList[detailIndex] = { ...newList[detailIndex], [language]: value };
          newPhases[phaseIndex] = { ...currentPhase, [type]: newList };
          return { ...prev, process: { ...prev.process, phases: newPhases } };
      });
      
      autoSyncEnglish(value, (translated) => {
          setContent(prev => {
             const phs = [...prev.process.phases];
             const list = [...phs[phaseIndex][type]];
             list[detailIndex] = { ...list[detailIndex], en: translated };
             phs[phaseIndex] = { ...phs[phaseIndex], [type]: list };
             return { ...prev, process: { ...prev.process, phases: phs } };
          });
      });
  };
  
  const addToLibrary = (url: string) => {
    setContent(prev => ({ ...prev, library: [url, ...(prev.library || [])] }));
  };
  
  const removeFromLibrary = (url: string) => {
      if (confirm("确定要删除这张图片吗？")) {
         setContent(prev => {
             const newLibrary = (prev.library || []).filter(i => i !== url);
             return { ...prev, library: newLibrary };
         });
      }
  };

  const saveChanges = async () => {
    setIsSyncing(true);
    localStorage.setItem('onesip_content', JSON.stringify(content));
    
    let targetBin = cloudConfig.binId;
    let targetKey = cloudConfig.apiKey;

    if (APP_CONFIG.ENABLE_CLOUD_SYNC && APP_CONFIG.CLOUD_BIN_ID) {
        targetBin = APP_CONFIG.CLOUD_BIN_ID;
        targetKey = APP_CONFIG.CLOUD_API_KEY;
    }

    if (targetBin && targetKey) {
        try {
            await saveCloudContent(targetBin, targetKey, content);
        } catch (e) {
            console.error("Sync failed", e);
        }
    } 
    setIsSyncing(false);
  };

  const submitLead = async (leadData: Omit<Lead, 'id' | 'timestamp' | 'status'>) => {
     const newLead: Lead = {
        ...leadData,
        id: Date.now().toString(),
        timestamp: Date.now(),
        status: 'new'
    };
    
    const newContent = { ...content, leads: [newLead, ...(content.leads || [])] };
    setContent(newContent);
    localStorage.setItem('onesip_content', JSON.stringify(newContent));

    if (cloudConfig.enabled || (APP_CONFIG.ENABLE_CLOUD_SYNC && APP_CONFIG.CLOUD_BIN_ID)) {
         setIsSyncing(true);
         let targetBin = cloudConfig.binId || APP_CONFIG.CLOUD_BIN_ID;
         let targetKey = cloudConfig.apiKey || APP_CONFIG.CLOUD_API_KEY;
         try {
             await saveCloudContent(targetBin, targetKey, newContent);
         } catch(e) { console.error("Cloud sync lead failed", e) }
         setIsSyncing(false);
    }
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
      dataSource,
      isLeadFormOpen,
      language,
      login, 
      logout,
      toggleAdmin,
      openDashboard,
      closeDashboard,
      openLeadForm,
      closeLeadForm,
      toggleLanguage,
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
      addToLibrary,
      removeFromLibrary,
      submitLead,
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