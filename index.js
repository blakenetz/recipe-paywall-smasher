var noScrollNodeList = ["html", "body"].map(function (sel) {
    return document.querySelector(sel);
});
var classNames = ["noScroll", "no-scroll"];
var config = {
    attributes: true,
    attributeFilter: ["class"]
};
function removeByQuery(string) {
    Array.from(document.querySelectorAll(string)).forEach(function (el) { return el.remove(); });
}
function removeElements() {
    removeByQuery('[role="dialog"]');
    removeByQuery('[class*="modal"]');
    removeByQuery("iframe");
}
function removeNoScrollClass(node) {
    Array.from(node.classList)
        .filter(function (cl) { return classNames.some(function (c) { return cl.includes(c); }); })
        .forEach(function (cl) { return node.classList.remove(cl); });
}
function init() {
    window.onload = function () {
        removeElements();
        classNames
            .map(function (cl) { return document.querySelectorAll("[class*=\"".concat(cl, "\"]")); })
            .map(function (nodeList) { return Array.from(nodeList); })
            .flat()
            .forEach(function (node) { return removeNoScrollClass(node); });
    };
    var observer = new MutationObserver(function (mutationsList) {
        mutationsList.forEach(function (mutation) {
            return removeNoScrollClass(mutation.target);
        });
        removeElements();
    });
    noScrollNodeList.forEach(function (el) {
        if (el)
            observer.observe(el, config);
    });
}
init();
