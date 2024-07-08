import { init } from "@/util";

const appRoot = "#app-root";

const recipeQueries = [
  '[data-testid="RecipePageLedBackground"]',
  "[class^='recipe']",
  '[data-testid="RecipePagContentBackground"]',
];

init(appRoot, recipeQueries);
