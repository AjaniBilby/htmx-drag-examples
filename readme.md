Currently in htmx there are methods for enabling drag and drop behaviour for sorting elements using client side arrangement ([sorting example](https://htmx.org/examples/sortable/)). However this relies on client side execution, plus does not allow for more rich interactions like dragging an item from one group to another triggering a server side update.

This extension uses two top-level `hx-` attributes, `hx-drag` and `hx-drop` to allow different information to be added to the request if the element was the one dragged or the one dropped. These two values are parsed identically to [`hx-vals`](https://htmx.org/attributes/hx-vals/) (without support for `js:` dynamic calculation), and are included with the requests issued by the drag and dropped elements.

![banner](/public/example/repair-assignment.gif)

The requests created by the `hx-[drag|drop]` are only sent once both the `dragstart`, and `drop` events have been completed.
The `hx-drag` requests will then be sent based on the `hx-[drag|drop]-action` on each element if present via a `PUT` request by default (this can be overridden with `hx-[drag|drop]-method`).
By default these two requests are sent in parallel, but they can be made in series using `hx-[drag|drop]-sync=[drag|drop]`. Within this sync property you must specify which request you want to occur first.

These two requests will include a merger of the `hx-drag` + `hx-drop` + `hx-vals` values. In the event of a conflict the current element's `hx-[drag|drop]` will override the secondary (so the `hx-drag` will override `hx-drop` values on the `hx-drag-action`).

`hx-drag` intentionally does not rely on the `hx-[get|post|put|delete|patch]` attributes, to allow distinguishing between regular `hx-trigger` events, and the more detailed `hx-drag` requests.

## Install

### CDN

```html
<script src="https://unpkg.com/hx-drag@2.0.0"></script>
```

### Bundle

To bundle in an npm-style build system with ES modules, you will have to add `htmx` to the `document` like so:

```
npm i hx-drag
```

```javascript
// index.js
import "./htmx";
import "hx-drag";
```

```javascript
// htmx.js
import htmx from "htmx.org";
window.htmx = htmx; // to support hx-drag
export default htmx;
```

## Enable

```html
<body hx-ext="drag">...</body>
```

## Styling

When a `hx-drag` starts the class `hx-drag` will be added to the element, with `hx-drag-over` being added when you are hovering over a `hx-drop`, and then a `hx-drop` class is added when you finally drop the item. This can allow you to add styling to your preference for these drag events without any JS.

Also as soon as either the `hx-drag` or `hx-drop` actions have started both elements will get the `htmx-request` class, even though both request may have not yet started due to `hx-[drag|drop]-sync`.


## Examples

[This repo](https://github.com/AjaniBilby/hx-drag) is a set of examples of using the `hx-drag` extension proposal.

To run the examples, simply
  1. Install `npm i`
  2. Start the server with `npm run dev`
  3. Open [localhost:5173](http://localhost:5173)


### Example: Data-Transfer

This example simply has three different divs all of which have `hx-drag` and `hx-drop` bindings to show how the value collisions hare handled.

![data-transfer example](/public/example/data-transfer.gif)
[source](https://github.com/AjaniBilby/hx-drag/blob/main/app/routes/data-transfer.tsx)

### Example: Organise Buckets

There is a list of immutable animals at the top of the page, and user addable buckets below which animals can be dragged into, and out of, and deleted by dragging into the trash. In this example there is no server state, and all state is managed by the DOM.

![data-transfer example](/public/example/bucket.gif?raw)
[source](https://github.com/AjaniBilby/hx-drag/blob/main/app/routes/bucket.tsx)

### Example: Organise List

This is the most extravagant example with server and client state, with sync detection. When you drag any item onto another, the dragged item will moved to before the dropped item. This example utilizes a `hx-include` and `hx-swap-oob` to use a hidden `<input name="hash">` value to detect when the client has gotten out of sync, in which case the server response with a `hx-location: ` header, forcing the client to reload the current page using `hx-boost` allowing it to resync with the server state.

![data-transfer example](/public/example/list.gif?raw)
[source](https://github.com/AjaniBilby/hx-drag/blob/main/app/routes/list.tsx)
