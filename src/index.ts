import { AI } from "./util";

async function run() {
  const ai = new AI();
  const resp = await ai.ask("");
  console.log(resp);
}

run();
