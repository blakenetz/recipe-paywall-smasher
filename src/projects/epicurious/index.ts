import { init } from "@/util";

const nodesToHide = ["[class*=adunit]", "[class*=inlineoffer]"];
const recipeNodes = [".recipe"];
const appRoot = "body";

init(appRoot, recipeNodes, nodesToHide);
