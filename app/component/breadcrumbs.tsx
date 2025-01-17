import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { CSSProperties } from "react";

import { Link } from "~/component/link";

export type BreadcrumbPath = Array<{url: string, name: string} | null>;
export function Breadcrumb(props: {
	path: BreadcrumbPath
	style?: CSSProperties
}) {
	return <nav aria-label="breadcrumb" className="breadcrumb" style={{
		display: "flex",
		marginBottom: "1em",
		alignItems: "center",
		fontSize: ".875rem",
		color: "hsl(var(--muted-foreground))",
		gap: ".625rem",
		...props.style
	}}>
		{props.path.filter(x => x !== null).map((x, i) => <Path key={i} item={x}/>)}
	</nav>
}

function Path(props: {
	item: { url?: string, name: string }
}) {
	return <>
		{ props.item.url
			? <Link href={props.item.url} style={{ fontWeight: "normal", textDecoration: "none" }}>{props.item.name}</Link>
			: <div style={{ color: "hsl(var(--foreground))" }}>{props.item.name}</div>
		}
		{props.item.url && <FontAwesomeIcon icon={faChevronRight} style={{
			marginBottom: "1px",

			height: "12px",
			width: "12px",
		}} />}
	</>
}