import { ApplyMetaDefaults, ShellOptions } from "htmx-router/shell";
import { RouteContext } from "htmx-router";

import { Scripts } from "~/component/scripts";
import { Head } from "~/component/head";

import mainsheetUrl from "~/styles/main.css?url";

const headers = <>
	<meta char-set="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="robots" content="noindex" />
	<script src="https://unpkg.com/htmx.org@2.0.4"></script>
	<script src="/script/hx-drag.js"></script>
	<link rel="preconnect" href="https://fonts.googleapis.com"></link>
	<link rel="preconnect" href="https://fonts.gstatic.com"></link>
	<link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=swap" rel="stylesheet"></link>
	<link href={mainsheetUrl} rel="stylesheet"></link>
</>


export function loader (){
	return new Response("No Route Found", { status: 404, statusText: "Not Found" });
}


export async function shell(inner: JSX.Element, options: ShellOptions) {
	ApplyMetaDefaults(options, { title: "HTMX Drag Examples" });

	return <html lang="en">
		<Head options={options}>
			{ headers }
			<Scripts />
		</Head>
		<body hx-boost="true" hx-ext="preload">{inner}</body>
	</html>
}


export async function error(ctx: RouteContext, e: unknown) {
	const message = await ErrorBody(e, ctx.url.pathname);
	const body = <div className="card" style={{
		whiteSpace: "pre-wrap",
		padding: "1rem 1.5rem",
		marginBlock: "3rem"
	}}>{message}</div>;

	if (ctx.request.headers.get("Hx-Request") === "true" && ctx.request.headers.get("Hx-Boosted") !== "true") {
		return body;
	}

	return <html lang="en" >
		<Head options={{ title: "Error" }}>
			{ headers }
			<Scripts />
		</Head>
		<body>
			<div className="wrapper">{body}</div>
		</body>
	</html>;
}

async function ErrorBody(error: unknown, path: string) {
	if (error instanceof Response) {
		return <>
			<h1 style={{ marginTop: 0 }}>{error.status} {error.statusText}</h1>
			<p>{await error.text()}</p>
		</>
	}

	if (error instanceof Error) {
		console.error(path, error);
		return <>
			<h1 style={{ marginTop: 0 }}>Error</h1>
			<p>{error.message}</p>
			<p>Stack trace</p>
			<pre>{error.stack}</pre>
		</>
	}

	return <>
		<h1 style={{ marginTop: 0 }}>Error</h1>
	</>
}