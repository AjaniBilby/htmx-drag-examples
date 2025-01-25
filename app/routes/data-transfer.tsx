import { RouteContext } from "htmx-router";
import { MakeStatus } from "htmx-router/status";

import { Breadcrumb } from "~/component/breadcrumbs";
import { shell } from "~/routes/$";

export async function loader() { // GET
	return await shell(<div className="wrapper">
		<Breadcrumb path={[
			{ url: "/", name: "Examples" },
			{ url: "", name: "Data Transfer" },
		]} style={{ marginTop: "15px" }} />

		<p>This is a simple example to show how hx-drag hx-drop and hx-vals all interact when dragging elements onto one another</p>

		<h2 style={{ marginTop: 0, textTransform: "capitalize" }}>Items</h2>

		<div className="list" style={{ display: "flex", gap: "10px" }} hx-ext="drag">
			<Item
				drag={{ dragged: "red" }}
				drop={{ dropped: "red" }}
				vals={{ name:    "red" }}
			/>
			<Item
				drag={{ dragged: "green" }}
				drop={{ dropped: "green" }}
				vals={{ name:    "green" }}
			/>
			<Item
				drag={{ dragged: "blue" }}
				drop={{ dropped: "blue" }}
				vals={{ name:    "blue" }}
			/>
		</div>

		<h2 style={{ textTransform: "capitalize" }}>Results</h2>

		<div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "10px"}}>
			<div className="card" style={{ padding: "1em"}} >
				<h2 style={{ marginTop: 0, textTransform: "capitalize" }}>Dragged Data</h2>
				<pre id="drag-result"></pre>
			</div>
			<div className="card" style={{ padding: "1em"}} >
				<h2 style={{ marginTop: 0, textTransform: "capitalize" }}>Dropped Data</h2>
				<pre id="drop-result"></pre>
			</div>
		</div>
	</div>, { title: "Data Transfer" });
}

function Item(props: { drag: Record<string, string>, drop: Record<string, string>, vals: Record<string, string> }) {
	const drag = JSON.stringify(props.drag);
	const drop = JSON.stringify(props.drop);
	const vals = JSON.stringify(props.vals);

	return <div
		className="card"
		style={{ padding: ".5em", cursor: "grab", display: "grid", gridTemplateColumns: "auto 1fr", gap: "0 5px" }}
		hx-vals={vals}
		hx-drop={drop}
		hx-drop-action="?drop"
		hx-drag={drag}
		hx-drag-action="?drag"
		hx-target="#drag-result"
		hx-swap="innerHTML"
		draggable
	>
		<b>hx-drag</b><div className="mono-text">{drag}</div>
		<b>hx-drop</b><div className="mono-text">{drop}</div>
		<b>hx-vals</b><div className="mono-text">{vals}</div>
	</div>
}


export async function action({ request, url, headers }: RouteContext) { // PUT / PATCH
	if (request.method !== "PUT") throw new Response("Method Not Allowed", MakeStatus("Method Not Allowed"));

	if (url.searchParams.has("drop")) headers.set("HX-Retarget", "#drop-result");

	const formData = await request.formData();
	let out = [];

	for (const [name, value] of formData) {
		out.push(<>
			<b>{name}</b><div className="mono-text">{String(value)}</div>
		</>)
	}

	return <>{out}</>;
}