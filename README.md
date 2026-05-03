
# @metapages/metapage-react

React components and hooks for building and using [metaframes](https://docs.metapage.io/) in your own projects.

There are two main use cases:

1. **Your React app _is_ a metaframe** — your app runs is embedded inside a webpage, or a metapage and communicates via inputs/outputs
2. **Your React app _renders_ a metaframe** — your app embeds an external metaframe URL in an iframe and exchanges data with it

## Installation

```sh
npm i @metapages/metapage-react
```

---

## 1. Your React app _is_ a metaframe

Use the provider components and hooks when your app itself is a [metaframe](https://docs.metapage.io/) — i.e. it will be loaded inside a metapage and needs to receive inputs and send outputs.

### Providers

#### `WithMetaframe`

Context provider that initializes a `Metaframe` instance. Use with the `useMetaframe` hook.

#### `WithMetaframeAndInputs`

Context provider that initializes a `Metaframe` instance **and** tracks input updates as React state. Use with the `useMetaframeAndInput` hook. This is convenient but less efficient than managing listeners manually — if performance is critical, use `WithMetaframe` instead.

### Hooks

| Hook | Provider | Returns |
|------|----------|---------|
| `useMetaframe` | `WithMetaframe` | `{ metaframe }` |
| `useMetaframeAndInput` | `WithMetaframeAndInputs` | `{ metaframe, inputs, setOutputs }` |

### Example

Wrap your app in a provider:

```tsx
import { WithMetaframe } from "@metapages/metapage-react";

render(
  <WithMetaframe>
    <App />
  </WithMetaframe>,
  document.getElementById("root")!
);
```

Then use the hook anywhere inside:

```tsx
import { useMetaframe } from "@metapages/metapage-react";

export const App = () => {
  const metaframeObj = useMetaframe();

  // Option 1: respond to inputs via React state (convenient, less efficient)
  useEffect(() => {
    console.log("New inputs:", metaframeObj.inputs);
  }, [metaframeObj.inputs]);

  // Option 2: bind a listener directly (more efficient)
  useEffect(() => {
    if (!metaframeObj.metaframe) return;
    const disposer = metaframeObj.metaframe.onInput("someInputName", (value) => {
      console.log("Got input on someInputName:", value);
    });
    return () => disposer();
  }, [metaframeObj.metaframe]);

  // Set outputs
  if (metaframeObj.setOutputs) {
    metaframeObj.setOutputs({ some: "outputs" });
  }

  // Notify the metapage if your app modifies its own hash params
  useEffect(() => {
    if (metaframeObj.metaframe) {
      metaframeObj.metaframe.notifyOnHashUrlChange();
    }
  }, [metaframeObj.metaframe]);

  return <div>{JSON.stringify(metaframeObj.inputs)}</div>;
};
```

---

## 2. Your React app _renders_ a metaframe

Use `MetaframeStandaloneComponent` when your app wants to **embed and interact with an external metaframe**. Your app is not itself a metaframe — it just renders one in an iframe and optionally sends it inputs or listens to its outputs.

### `MetaframeStandaloneComponent`

| Prop | Type | Description |
|------|------|-------------|
| `url` | `string` | **(required)** URL of the metaframe to embed |
| `inputs` | `any` | Data to send as inputs to the metaframe |
| `onOutputs` | `(outputs: MetaframeInputMap) => void` | Callback fired when the metaframe produces outputs |
| `onUrlChange` | `(url: string) => void` | Callback fired when the metaframe changes its own URL (e.g. hash params) |
| `onMetapageCreation` | `(metapage: Metapage) => void` | Callback for accessing the underlying Metapage instance (debugging) |
| `debug` | `boolean` | Enable debug logging |
| `style` | `React.CSSProperties` | Style for the iframe container |
| `className` | `string` | CSS class for the iframe element |
| `classNameWrapper` | `string` | CSS class for the wrapper div |

### Example: render a metaframe and exchange data

```tsx
import { MetaframeStandaloneComponent } from "@metapages/metapage-react";

export const App = () => {
  const [outputs, setOutputs] = useState<any>(null);

  return (
    <div>
      <h1>Embedded metaframe</h1>

      <MetaframeStandaloneComponent
        url="https://metapages.github.io/metaframe-js/"
        inputs={{ code: 'console.log("hello")' }}
        onOutputs={(o) => setOutputs(o)}
        style={{ width: "100%", height: "500px" }}
      />

      {outputs && <pre>{JSON.stringify(outputs, null, 2)}</pre>}
    </div>
  );
};
```

### Example: listen to URL changes

If the embedded metaframe modifies its own hash params (e.g. user interaction changes state encoded in the URL), you can track that:

```tsx
<MetaframeStandaloneComponent
  url={metaframeUrl}
  onUrlChange={(newUrl) => {
    console.log("Metaframe URL changed to:", newUrl);
    // persist or react to the new URL
  }}
/>
```

---

## Components reference

| Export | Type | Use case |
|--------|------|----------|
| `MetaframeStandaloneComponent` | Component | Embed and render an external metaframe by URL |
| `MetaframeIframe` | Component | Low-level: render an iframe from a `MetapageIFrameRpcClient` instance |
| `WithMetaframe` | Provider | Your app _is_ a metaframe (basic) |
| `WithMetaframeAndInputs` | Provider | Your app _is_ a metaframe (with inputs as state) |
| `useMetaframe` | Hook | Access metaframe from `WithMetaframe` |
| `useMetaframeAndInput` | Hook | Access metaframe + inputs from `WithMetaframeAndInputs` |
