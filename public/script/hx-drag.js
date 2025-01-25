(function(){
	/**
 * @type {object}
 */
const htmx = window.htmx;


htmx.defineExtension("drag", {
	init: (node) => {
		// ideally it should only start listening to elements with hx-ext="drag"
		// I assume there is a better way I can bind than this?
		document.addEventListener("dragstart", DragStart);
		document.addEventListener("dragover",  DragOver);
		document.addEventListener("drop",      Drop);
	}
});

/**
 * the most recent element a drag event started on
 * @type {Element|null}
 */
let drag = null;

/**
 * Get the parent element which matches the selector
 * @param {EventTarget|null} target
 * @param {string} selector
 * @returns {Element | null}
 */
function GetTarget(target, selector) {
	if (target == null) return null;
	if (!(target instanceof Element)) return null;

	target = target.closest(selector);
	if (target == null) return null;
	if (!(target instanceof Element)) return null;

	return target;
}

/**
 * @param {DragEvent} ev
 */
function DragStart(ev) {
	if (!ev.dataTransfer) return;

	const target = GetTarget(ev.target, "[hx-drag]");
	if (!target) return null;

	const data = target.hasAttribute("hx-drag");
	if (!data) return;

	drag = target;
}

/**
 * @param {DragEvent} ev
 */
function DragOver(ev) {
	if (!drag) drag = false;
	if (!GetTarget(ev.target, "[hx-drop]")) return;
	ev.preventDefault();
}

/**
 * @param {DragEvent} ev
 */
async function Drop(ev) {
	if (!drag) return;

	const drop = GetTarget(ev.target, "[hx-drop]");
	if (!drop) return;

	const dragVals = JSON.parse(drag.getAttribute("hx-drag") || "{}");
	const dropVals = JSON.parse(drop.getAttribute("hx-drop") || "{}");

	const dragFirst = (drag.getAttribute("hx-drag-precedence")
		|| drag.getAttribute("hx-drop-precedence")) === "drag";

	const queue = dragFirst ? [drag, drop] : [drop, drag];
	for (const elm of queue) await RunDragDrop(elm, elm === drag, dragVals, dropVals);

	drag = null;
}

/**
 *
 * @param {Element} source
 * @param {boolean} isDrag
 * @param {object} dragVals
 * @param {object} dropVals
 * @returns
 */
async function RunDragDrop(source, isDrag, dragVals, dropVals) {
	if (!document.body.contains(source)) return;

	let method, action, values, sync;
	if (isDrag) {
		action = source.getAttribute("hx-drag-action");
		method = source.getAttribute("hx-drag-method") || "PUT";
		sync   = source.getAttribute("hx-drag-sync")
		values = Object.assign({}, dropVals, dragVals);
	} else {
		action = source.getAttribute("hx-drop-action");
		method = source.getAttribute("hx-drop-method") || "PUT";
		sync   = source.getAttribute("hx-drop-sync")
		values = Object.assign({}, dragVals, dropVals);
	}

	if (action === null) return;

	const promise = htmx.ajax(method, action, { source, values });
	if (sync) await promise;
}
})()