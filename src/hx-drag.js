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
			document.addEventListener("dragleave", DragLeave);
			document.addEventListener("dragend",   DragEnd);
			document.addEventListener("drop",      Drop);
		}
	});

	/**
	 * the most recent element a drag event started on
	 * @type {Element|null}
	 */
	let dragging = null;

	/**
	 * Get the parent element which matches the selector
	 * @param {EventTarget|null} target
	 * @param {string} selector
	 * @returns {Element | null}
	 */
	function GetTarget(target, selector) {
		if (target == null) return null;
		if (!(target instanceof Element)) return null;

		target = target.closest(`[${selector}],[data-${selector}]`);
		if (target == null) return null;
		if (!(target instanceof Element)) return null;

		return target;
	}

	/**
	 * Get the attribute allowing `data-` fallback
	 * @param {Element | null} target
	 * @param {string} name
	 * @returns {string | null}
	 */
	function GetAttribute(target, name) {
		if (target === null) return null;
		return target.getAttribute(name) || target.getAttribute("data-"+name);
	}

	/**
	 * @param {DragEvent} ev
	 */
	function DragStart(ev) {
		if (!ev.dataTransfer) return;

		const target = GetTarget(ev.target, "hx-drag");
		if (!target) return null;

		const data = GetAttribute(target, "hx-drag");
		if (data === null) return;

		target.classList.add("hx-drag");
		dragging = target;
	}

	/**
	 * @param {DragEvent} ev
	 */
	function DragOver(ev) {
		if (!dragging) return;

		const target = GetTarget(ev.target, "hx-drop");
		if (!target) return;
		ev.preventDefault();

		target.classList.add("hx-drag-over");
	}

	/**
	 * @param {DragEvent} ev
	 */
	function DragLeave(ev) {
		if (!dragging) return;

		const target = GetTarget(ev.target, "hx-drop");
		if (!target) return;

		target.classList.remove("hx-drag-over");
	}

	/**
	 * @param {DragEvent} ev
	 */
	function DragEnd() {
		if (!dragging) return;
		dragging.classList.remove("hx-drag");
	}

	/**
	 * @param {DragEvent} ev
	 */
	async function Drop(ev) {
		if (!dragging) return;

		const drag = dragging;
		const drop = GetTarget(ev.target, "hx-drop");
		if (!drop) return;
		drop.classList.add("hx-drop");
		drop.classList.remove("hx-drag-over");

		const dragVals = JSON.parse(GetAttribute(drag, "hx-drag") || "{}");
		const dropVals = JSON.parse(GetAttribute(drop, "hx-drop") || "{}");

		const precedence = GetAttribute(drag, "hx-drag-sync") || GetAttribute(drag, "hx-drop-sync");
		const dragFirst = precedence === "drag";
		const sync = !!precedence;

		drop.classList.add("htmx-request");
		drag.classList.add("htmx-request");
		const queue = dragFirst ? [drag, drop] : [drop, drag];
		for (const elm of queue) {
			const promise = RunDragDrop(elm, elm === drag, dragVals, dropVals);
			if (sync) await promise;
		}

		drag.classList.remove("hx-drag");
		drop.classList.remove("hx-drop");
		dragging = null;
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
			action = GetAttribute(source, "hx-drag-action");
			method = GetAttribute(source, "hx-drag-method") || "PUT";
			values = Object.assign({}, dropVals, dragVals);
		} else {
			action = GetAttribute(source, "hx-drop-action");
			method = GetAttribute(source, "hx-drop-method") || "PUT";
			values = Object.assign({}, dragVals, dropVals);
		}

		if (action === null) return;

		try { // don't let one failure cascade to the other ajax
			await htmx.ajax(method, action, { source, values });
		} catch (e) {
			return;
		}
	}
})()