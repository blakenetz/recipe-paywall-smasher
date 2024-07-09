import { AI } from "./util";

async function run() {
  const ai = new AI("openai");
  const resp = await ai.ask();
}

run();
