import { init } from "@/util";

const nodesToHide = ["[class*=adunit]", "[class*=inlineoffer]"];
const appRoot = "#app-root";
const recipeNodes = ["[class^='recipe']"];

init(appRoot, recipeNodes, nodesToHide);
