import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RouteContext } from "htmx-router";
import { MakeStatus } from "htmx-router/status";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { Breadcrumb } from "~/component/breadcrumbs";
import { shell } from "~/routes/$";

let list = [
	{ id: 1, value: "item 1" },
	{ id: 2, value: "item 2" },
	{ id: 3, value: "item 3" },
	{ id: 4, value: "item 4" },
	{ id: 5, value: "item 5" },
];
let nextID = 6;
let hash = "";

function UpdateHash() {
	let t = 0;
	for (const item of list) {
		t = (t * 31 + item.id) >>> 0;
		for (let i = 0; i < item.value.length; i++) {
			t = (t * 31 + item.value.charCodeAt(i)) >>> 0;
		}
	}

	hash = t.toString(36).slice(0, 5);
}
UpdateHash();


export async function loader() { // GET
	return await shell(<div className="wrapper">
		<Breadcrumb path={[
			{ url: "/", name: "Examples" },
			{ url: "", name: "Order List" },
		]} style={{ marginTop: "15px" }} />

		<p>In this example each item is a drop zone within a drag zone</p>
		<p>That way when something is dragged it will be removed on drop, and the item will be placed before the drop target</p>
		<p>There is also the added addition of a hx-include on a hash value which is updated via an oob</p>
		<p>That way if you have two tabs open it can detect if it's gotten out of sync and trigger a full refresh</p>

		<input id="hash" name="hash" value={hash} readOnly hidden></input>

		<div hx-ext="hx-drag" style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start" }}>
			{list.map((x, i) => <Item key={i} item={x} />)}

			<FontAwesomeIcon
				hx-target="this" hx-swap="beforebegin"
				style={{ height: "1.5em", color: "hsl(var(--muted-foreground))", cursor: "pointer" }}
				icon={faPlus}
				hx-prompt="new item"
				hx-put=""
			/>
		</div>
	</div>, { title: "Order List" });
}

function Item(props: { item: { id: number, value: string } }) {
	return <div
		className="card"
		hx-drop-action="?"
		hx-drop-method="PATCH"
		hx-drop-sync="true"
		hx-drop={JSON.stringify({ drop: props.item.id })}
		hx-target="this"
		hx-swap="beforebegin"
		hx-include="[name='hash']"
	>
		<div
			id={`item-${props.item.id}`}
			style={{ padding: ".5em", cursor: "grab" }}
			hx-drag={JSON.stringify({ pickup: props.item.id })}
			hx-drag-method="GET"
			hx-drag-action="/empty"
			hx-target="closest .card"
			hx-swap="outerHTML"
			draggable
		>{props.item.value}</div>
	</div>
}


export async function action({ request, cookie, headers }: RouteContext) { // PUT / PATCH
	const formData = await request.formData();
	const ctx = formData.get("hash");

	if (ctx != hash) headers.set("hx-location", ""); // revalidate

	if (request.method === "PUT") {
		const value = request.headers.get("hx-prompt") || "err";

		const item = { id: nextID++, value };
		list.push(item);
		UpdateHash();

		cookie.set("hash", hash);

		return <>
			<input id="hash" name="hash" value={hash} hx-swap-oob="outerHTML:#hash" readOnly hidden></input>
			<Item item={item}/>
		</>;
	}

	if (request.method === "PATCH") {
		const pickupID = Number(formData.get("pickup"));
		const dropID   = Number(formData.get("drop"));

		const pickupIdx = list.findIndex(x => x.id === pickupID);

		if (pickupIdx === -1) throw new Error("Item not in list");

		const [pickup] = list.splice(pickupIdx, 1);
		const dropIdx  = list.findIndex(x => x.id === dropID);
		list.splice(dropIdx, 0, pickup);
		UpdateHash();

		return <>
			<input id="hash" name="hash" value={hash} hx-swap-oob="outerHTML:#hash" readOnly hidden></input>
			<Item item={pickup}/>
		</>
	}

	throw new Response("Method Not Allowed", MakeStatus("Method Not Allowed"));
}