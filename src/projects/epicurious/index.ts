import { init } from "@/util";

const nodesToHide = ["[class*=adunit]", "[class*=inlineoffer]"];
const appRoot = "#app-root";
const recipeNodes = [
  '[data-testid="SplitScreenContentHeaderWrapper"]',
  ".recipe-body",
  '[data-testid="InfoSliceList"]',
  '[data-testid="IngredientList"]',
  '[data-testid="InstructionsWrapper"]',
];

init(appRoot, recipeNodes, nodesToHide);
