
# @metapages/metapage-react

Useful React components and hooks for building and using Metapages in your own projects.

## Installation

Install the package:
```sh
npm i @metapages/metapage-react
```


## React Components

## React Hooks



### Your website or application is a metaframe

Use hooks to interact with [metaframe](https://docs.metapage.io/) inputs and outputs

#### Usage: [metaframe](https://docs.metapage.io/) inputs + outputs in a react app

Example listening to inputs and setting outputs:

First in your main root render:


```typescript
render(
    <WithMetaframe>
      <App />
    </WithMetaframe>,
  document.getElementById("root")!
);
```

Then anywhere else:


```typescript

import {
  MetaframeObject,
  useMetaframe,
} from "@metapages/metaframe-react";


export const App: FunctionalComponent = () => {

  // a nice hook handles all the metaframe machinery
  const metaframeObj: MetaframeObject = useMetaframe();

  // Respond to new inputs two ways:
  //   1) this listening mode is bound to reacts render hooks. It is convenient, but less efficient
  useEffect(() => {
    console.log(`I got new inputs from some other metaframe! ${inputs}`);
  }, [metaframeObj.inputs]);

  // Respond to new inputs two ways:
  //   2) bind the listener and cleanup
  useEffect(() => {
    if (!metaframeObj.metaframe) {
      return;
    }
    const disposer = metaframeObj.metaframe.onInput("someInputName", (inputValue) => {
      console.log(`I got new inputs from on channel someInputName! ${inputValue}`);
    });

    return () => {
      disposer();
    }

  }, [metaframeObj.metaframe]);

  // somewhere set outputs
  if (metaframeObj.setOutputs) {
      metaframeObj.setOutputs({"some": "outputs"})
  }

  // let the metapage know we are going to modify our own hash params from user interaction
  useEffect(() => {
    if (metaframeObj.metaframe) {
      metaframeObj.metaframe.notifyOnHashUrlChange();
    }
  }, [metaframeObj.metaframe]);

  // Just render the inputs
  return <div> {metaframeObj.inputs} </div>
}

```


