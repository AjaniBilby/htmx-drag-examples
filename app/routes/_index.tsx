import { Link } from "~/component/link";
import { shell } from "~/routes/$";

export const parameters = {};

export async function loader() {
	return shell(<div className="wrapper">
		<h1>HTMX Drag Examples</h1>
		<ul>
			<li><Link href="/data-transfer">Data Transfer</Link></li>
			<li><Link href="/bucket">Organise Buckets</Link></li>
			<li><Link href="/list">Order List</Link></li>
		</ul>
	</div>, {});
}