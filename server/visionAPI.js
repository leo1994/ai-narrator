const OpenAI = require("openai");

module.exports = class OpenAIVision {
  constructor() {
    if (
      !process.env.OPENAI_API_KEY ||
      !process.env.OPENAI_SYSTEM_PROMPT ||
      !process.env.OPENAI_USER_PROMPT
    ) {
      throw new Error(
        'Missing environment variables for OpenAI, please check ".env.example" file'
      );
    }
    this.chatHistory = [];
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.systemPrompt = process.env.OPENAI_SYSTEM_PROMPT;
    this.userPrompt = process.env.OPENAI_USER_PROMPT;
  }

  async analyzeImage(base64Image) {
    const data = {
      model: "gpt-4-vision-preview",
      frequency_penalty: 0.7,
      presence_penalty: 0.3,
      messages: [
        {
          role: "system",
          content: this.systemPrompt,
        },
        ...this.chatHistory,
        ...this.generateNewLine(base64Image),
      ],
      max_tokens: 500,
    };

    const response = await this.openai.chat.completions.create(data);
    const responseText = response.choices[0].message.content;

    this.chatHistory.push({
      role: "user",
      content: [
        {
          type: "text",
          text: `${this.userPrompt} (user uploaded image)`,
        },
      ],
    });
    this.chatHistory.push({
      role: "assistant",
      content: responseText,
    });

    return responseText;
  }

  generateNewLine(base64Image) {
    return [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: this.userPrompt,
          },
          {
            type: "image_url",
            image_url: `${base64Image}`,
          },
        ],
      },
    ];
  }
};
