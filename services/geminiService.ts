import { GoogleGenAI } from "@google/genai";

// Ideally, this comes from a secure backend proxy, but for this demo environment:
const apiKey = process.env.API_KEY || ""; 

export const analyzeProfitability = async (dailyCups: number, locationType: string): Promise<string> => {
  if (!apiKey) {
    // Fallback simulation if no API key is present
    await new Promise(resolve => setTimeout(resolve, 1500));
    return "【演示模式】请配置 API Key 以获取真实结果。\n\n模拟回复：\n根据您的店铺位置（市中心商业区），建议主推“泰奶咸法酪”和“芝芝葡萄”，这两款产品在年轻人群体中转化率最高，且适合拍照打卡。";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      作为一个资深餐饮商业分析师，请根据以下数据简短点评 ONESIP LITE 店中店模式的盈利潜力：
      - 预估日销量：${dailyCups} 杯
      - 场景类型：${locationType}
      - 模式特点：0房租，高度自动化，仅7%品牌费
      
      请用专业但亲切的口吻，给出一段约 80 字的分析建议，重点突出利润留存优势。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "AI 分析暂时不可用，请稍后重试。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 连接繁忙，请参考下方图表数据。";
  }
};

export const getChatResponse = async (history: {role: string, parts: {text: string}[]}[], userMessage: string): Promise<string> => {
   if (!apiKey) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simple keyword matching for demo
      if (userMessage.includes("加盟")) return "您好！很高兴您对 ONESIP LITE 感兴趣。我们的加盟模式非常灵活，0房租0装修，仅需引入设备即可。请问您目前的店铺类型是什么？（例如：餐厅、零售店、书店等）";
      if (userMessage.includes("费用") || userMessage.includes("多少钱")) return "我们的启动非常轻量化！主要是设备租赁押金和首批原料费。品牌管理费仅收营业额的 7%。具体收益您可以参考网页上方的【收益测算】板块。";
      if (userMessage.includes("人工")) return "ONESIP LITE 是高度自动化的！机器自动制作、自动清洗。通常现有店员兼职即可，无需专门聘请全职奶茶师。";
      return "收到您的消息！我们的招商经理稍后会人工接入为您解答。您也可以先看看页面上的【合作优势】介绍。";
   }

   try {
    const ai = new GoogleGenAI({ apiKey });
    const systemPrompt = `
      你现在是 ONESIP LITE 品牌的招商经理 AI 助手。
      品牌特点：
      1. 欧洲领先的“店中店”自动化奶茶解决方案。
      2. 0房租、0装修、高度自动化、仅7%品牌费。
      3. 适合餐厅、书店、超市等现有业态引入，增加额外收入。
      
      请用专业、热情、简洁的口吻回答用户关于加盟、费用、产品、设备等方面的问题。
      如果用户问的问题非常复杂，请引导他们留下联系方式。
    `;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemPrompt,
      },
      history: history
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text;

   } catch (error) {
     return "抱歉，我现在有点忙，请稍后再试或直接联系我们的人工客服。";
   }
}
