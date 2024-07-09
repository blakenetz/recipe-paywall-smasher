import OpenAI from "openai";
import qna from "@tensorflow-models/qna";

export type AILibrary = "openai" | "tensorflow";
type AIType<T = AILibrary> = T extends "openai"
  ? OpenAI
  : T extends "tensorflow"
  ? qna.QuestionAndAnswer
  : never;

const url =
  "https://cooking.nytimes.com/recipes/1025611-spicy-tuna-and-avocado-tostadas";
export class AI {
  #ai: AIType | undefined;
  #lib: AILibrary;

  constructor(lib: AILibrary) {
    this.#lib = lib;
    this.#ai;
    this.initialize();
  }

  private async initialize() {
    switch (this.#lib) {
      case "openai":
        this.#ai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          organization: process.env.OPENAI_ORG_ID,
          project: process.env.OPENAI_PROJ_ID,
        });
        break;

      case "tensorflow":
        this.#ai = await qna.load();
        break;
    }
  }

  async ask(html: string) {
    const completion = await this.#ai?.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an expert at parsing HTML" },
        { role: "user", content: html },
      ],
      n: 1,
      tools: [
        {
          type: "function",
          function: {
            name: "parseHtml",
            description: "Parse HTML and return recipe details",
            parameters: {
              type: "object",
              properties: {
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      ingredients: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            name: "string",
                            amount: "number",
                            unit: "string",
                            description: "string",
                          },
                        },
                      },
                      instructions: {
                        type: "array",
                        items: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    });

    return completion.choices[0].message;
  }
}
