import { init } from "@/util";

const removableQueries = ["[class*=adunit]", "[class*=inlineoffer]"];

const recipeQueries = [".recipe"];

const appRoot = "body";

init(appRoot, recipeQueries, removableQueries);
