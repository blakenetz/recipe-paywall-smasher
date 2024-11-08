import { init } from "@/util";

const nodesToHide = ["div.fl-row-bg-gradient"];
const appRoot = ".site-container";
const recipeNodes = ['[data-type="part"]'];

init(appRoot, recipeNodes, nodesToHide);
