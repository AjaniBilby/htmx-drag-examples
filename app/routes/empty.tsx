import { RouteContext } from "htmx-router";

export function loader({ headers }: RouteContext) {
	headers.set("Cache-Control", "public");

	return <></>
}