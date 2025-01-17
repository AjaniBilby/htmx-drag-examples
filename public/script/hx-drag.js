(function(){
	/**
	 * @type {Htmx}
	 */
	const htmx = window.htmx;

	/**
	 * @type {Element|null}
	 */
	let drag = null;

	/**
	 *
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

		const data = target.getAttribute("hx-drag");
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

		const dragVals = JSON.parse(drag.getAttribute("hx-vals") || "{}");
		const dropVals = JSON.parse(drop.getAttribute("hx-vals") || "{}");

		const dragFirst = (drag.getAttribute("hx-drag-precedence")
			|| drag.getAttribute("hx-drop-precedence")) === "drag";

		const queue = dragFirst ? [drag, drop] : [drop, drag];
		for (const elm of queue) {
			await RunDragDrop(elm, elm === drag, dragVals, dropVals);
		}

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

		let method, action, values;
		if (isDrag) {
			method = source.getAttribute("hx-drag-method") || "PUT";
			action = source.getAttribute("hx-drag");
			values = Object.assign({}, dropVals, dragVals);
		} else {
			method = source.getAttribute("hx-drop-method") || "PUT";
			action = source.getAttribute("hx-drop");
			values = Object.assign({}, dragVals, dropVals);
		}

		if (action === "true") return;

		const promise = htmx.ajax(method, action, { source, values });
		if (source.getAttribute(isDrag ? "hx-drag-sync" : "hx-drop-sync") === "true") await promise;
	}

	htmx.defineExtension("hx-drag", {
		init: () => {
			// ideally it should only start listening to elements with hx-ext="hx-drag"
			// I assume there is a better way I can bind than this?
			document.addEventListener("dragstart", DragStart);
			document.addEventListener("dragover",  DragOver);
			document.addEventListener("drop",      Drop);
		}
	});

})()