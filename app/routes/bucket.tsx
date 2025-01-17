import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { RouteContext } from "htmx-router";
import { MakeStatus } from "htmx-router/status";

import { Breadcrumb } from "~/component/breadcrumbs";
import { shell } from "~/routes/$";

export async function loader() { // GET
	return await shell(<div className="wrapper">
		<Breadcrumb path={[
			{ url: "/", name: "Examples" },
			{ url: "", name: "Organise Buckets" },
		]} style={{ marginTop: "15px" }} />

		<p>Simple drag drop example for organising items</p>

		<p>The animal list has no hx-drag endpoint, so the elements being dragged aren't affected allowing them to be copied</p>

		<p>Meanwhile items added to the buckets have a drag event meaning they will automatically be removed once the drop has happened</p>

		<p>Similarly the trash bin has no drop event, meant it's unaffected by things being dropped on it, however the items dragged to it are removed</p>

		<div hx-ext="hx-drag" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
			<div
				className="card"
				style={{ padding: "1em"}}
			>
				<h2 style={{ marginTop: 0, textTransform: "capitalize" }}>Animals</h2>
				<div className="list" style={{ display: "flex", gap: "10px" }}>
					<Animal name="cow" />
					<Animal name="chicken" />
					<Animal name="sheep" />
					<Animal name="horse" />
					<Animal name="dog" />
					<Animal name="cat" />
					<Animal name="pig" />
					<Animal name="duck" />
					<Animal name="fish" />
					<Animal name="whale" />
					<Animal name="eagle" />
					<Animal name="sparrow" />
				</div>
			</div>

			<Bucket name="bird" />

			<div hx-target="this" hx-swap="beforebegin" style={{ display: "flex", justifyContent: "space-between" }}>
				<FontAwesomeIcon
					style={{ height: "2em", color: "hsl(var(--muted-foreground))", padding: "1em", cursor: "pointer" }}
					icon={faPlus}
					hx-patch=""
					hx-prompt="bucket name"
				/>
				<FontAwesomeIcon
					style={{ height: "2em", color: "hsl(var(--muted-foreground))", padding: "1em" }}
					icon={faTrash}
					hx-drop="true"
				/>
			</div>
		</div>
	</div>, { title: "Test" });
}

function Animal(props: { name: string }) {
	return <div
		className="card"
		style={{ padding: ".5em", cursor: "grab" }}
		hx-vals={JSON.stringify(props)}
		hx-drag="true"
		draggable
	>{props.name}</div>
}

function Bucket(props: { name: string, children?: JSX.Element[] }) {
	return <div
		className="card"
		style={{ padding: "1em", cursor: "grab" }}
		hx-vals={JSON.stringify({ bucket: props.name})}
		hx-drop=""
		hx-target="find .list"
		hx-swap="beforeend"
	>
		<h2 style={{ marginTop: 0, textTransform: "capitalize" }}>{props.name}</h2>
		<div className="list" style={{ display: "flex", gap: "10px" }}>{props.children}</div>
	</div>;
}

function Item(props: { name: string }) {
	return <div
		className="card"
		style={{ padding: ".5em", cursor: "grab" }}
		hx-vals={JSON.stringify(props)}
		hx-drag-method="GET"
		hx-drag="/empty"
		hx-target="this"
		hx-swap="outerHTML"
		draggable
	>{props.name}</div>
}


export async function action({ request }: RouteContext) { // PUT / PATCH

	if (request.method === "PUT") {
		const body = await request.formData();
		const bucket = body.get("bucket")?.toString() || "err";
		const name   = body.get("name")?.toString() || "err";

		console.log("moved", name, "to bucket", bucket);

		return <Item name={name}/>;
	}

	if (request.method === "PATCH") {
		const name = request.headers.get("hx-prompt") || "err";
		return <Bucket name={name} />
	}


	throw new Response("Method Not Allowed", MakeStatus("Method Not Allowed"));
}