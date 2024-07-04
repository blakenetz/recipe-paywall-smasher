import { appendRecipe, instantiateMutation, removeElements } from "./util";

function init() {
	// instantiate observers
	const observer = instantiateMutation();

	window.onload = function () {
		// remove troublesome nodes
		removeElements();
		// append recipe to top of doom
		appendRecipe();
	};

	// clean up
	addEventListener("beforeunload", () => {
		console.debug("🍳 disconnecting");
		observer.disconnect();
	});
}

try {
	init();
} catch (error) {
	console.debug(`🍳 failed 😢: `, error);
}
