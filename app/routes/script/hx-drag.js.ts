import { RouteContext } from "htmx-router";
import { readFile } from "fs/promises";


export async function loader({ headers }: RouteContext) {
	headers.set("Content-Type", "text/javascript");

	const file = await readFile("./src/hx-drag.js");
	return new Response(file, { headers });
}