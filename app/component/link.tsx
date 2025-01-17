export function Link(props: { preload?: string, newWindow?: boolean } & JSX.IntrinsicElements["a"]) {
	const { style, preload, newWindow, ...restProps } = props;
	const preloadValue = preload || "mouseover";

	/* eslint-disable @typescript-eslint/ban-ts-comment */
	// @ts-ignore
	return <a {...restProps} style={style} preload={preloadValue} data-new-window={newWindow || undefined}></a>;
}