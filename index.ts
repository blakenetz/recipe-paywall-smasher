const noScrollNodeList = ["html", "body"].map((sel) =>
	document.querySelector(sel)
);

const classNames = ["noScroll", "no-scroll"];

const config: MutationObserverInit = {
	attributes: true,
	attributeFilter: ["class"],
};

function removeByQuery(string: keyof HTMLElementTagNameMap | string) {
	Array.from(document.querySelectorAll(string)).forEach((el) => el.remove());
}

function removeElements() {
	removeByQuery('[role="dialog"]');
	removeByQuery('[class*="modal"]');
	removeByQuery("iframe");
}

function removeNoScrollClass(node: Element) {
	Array.from(node.classList)
		.filter((cl) => classNames.some((c) => cl.includes(c)))
		.forEach((cl) => node.classList.remove(cl));
}

function init() {
	window.onload = function () {
		removeElements();
		classNames
			.map((cl) => document.querySelectorAll(`[class*="${cl}"]`))
			.map((nodeList) => Array.from(nodeList))
			.flat()
			.forEach((node) => removeNoScrollClass(node));
	};

	const observer = new MutationObserver((mutationsList) => {
		mutationsList.forEach((mutation) =>
			removeNoScrollClass(mutation.target as HTMLElement)
		);
		removeElements();
	});

	noScrollNodeList.forEach((el) => {
		if (el) observer.observe(el, config);
	});
}

init();
