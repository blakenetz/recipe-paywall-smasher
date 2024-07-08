import OpenAI from "openai";

export type AILibrary = "openai";

export class AI {
  ai: OpenAI;

  constructor(lib: AILibrary) {
    this.ai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORG_ID,
      project: process.env.OPENAI_PROJ_ID,
    });
  }

  async ask(html: string) {
    const completion = await this.ai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Say this is a test!" }],
      n: 1,
      //   response_format: { type: "json_object" },
    });

    return completion.choices[0].message.content;
  }
}
