import { init } from "@/util";

const removableQueries = ["[class*=adunit]", "[class*=inlineoffer]"];
const recipeQueries = [".recipe__main-content"];
const appRoot = "body";

init(appRoot, recipeQueries, removableQueries);
