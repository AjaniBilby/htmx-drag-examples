/* eslint-disable @typescript-eslint/no-explicit-any */
import { HtmxAttributes } from "typed-htmx";
import { ReactNode } from 'react';

declare global {
	namespace JSX {
		type Element = ReactNode;
		interface HTMLAttributes extends HtmxAttributes {}
	}

	interface htmx {
		defineExtension: (name: string, init: {
			init: (api: any) => void;
			onEvent: (name: string, event: Event | CustomEvent) => boolean;
			transformResponse: (text: string, xhr: XMLHttpRequest, elt: Element) => string;
			isInlineSwap: (swapStyle: HtmxSwapStyle) => boolean;
			handleSwap: (swapStyle: HtmxSwapStyle, target: Node, fragment: Node, settleInfo: HtmxSettleInfo) => boolean | Node[];
			encodeParameters: (xhr: XMLHttpRequest, parameters: FormData, elt: Node) => any | string | null;
			getSelectors: () => string[] | null;
	}) => void
	}
}