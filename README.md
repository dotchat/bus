<a id="readme-top"></a>
<br />
<!-- Project header -->
<div align="center">
    <h3 align="center">Dotchat bus</h3>
    <br />
    <p align="center">You can subscribe to subjects or call subjects to bus event system in Dotchat</p>
</div>
<!-- Table of content -->
<details>
    <summary>Table of contents</summary>
    <ol>
        <li>
            <a href="#about-the-project">About The Project</a>
        </li>
        <li>
            <a href="#getting-started">Getting Started</a>
        </li>
        <li>
            <a href="#usage">Usage</a>
            <ul>
                <li>
                    <a href="#subscribe">Subscribe</a>
                </li>
                <li>
                    <a href="#call">Call</a>
                </li>
                <li>
                    <a href="#callback">Callback</a>
                </li>
                <li>
                    <a href="#usebus">useBus</a>
                </li>
            </ul>
        </li>
        <li>
            <a href="#definations">Definations</a>
            <ul>
                <li>
                    <a href="#subject">Subject</a>
                </li>
                <li>
                    <a href="#types">Types</a>
                    <ul>
                        <li>
                            <a href="#start">Start</a>
                        </li>
                        <li>
                            <a href="#next">Next</a>
                        </li>
                        <li>
                            <a href="#error">Error</a>
                        </li>
                        <li>
                            <a href="#complete">Complete</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </li>
    </ol>
</details>

## About The Project

Bus is an event system to handle subjects. You can [subscribe](#subscribe) and [call](#call) [subjects](#subject).

## Getting Started

This is how you can getting started and install Dotchat bus. You can install this package from `npm` or `yarn`.

```
npm i @dotchat/bus
```

or

```
yarn add @dotchat/bus
```

## Usage

After you installed the package you can use some available functions but first let import the package.

```js
const { bus } = require("@dotchat/bus");
```

or in typescript or ecmascript

```ts
import { bus } from "@dotchat/bus":
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Subscribe

You can subscribe to a subject.

```js
bus.subscribe({
  subject: "#/parrent/child",
  callback: {
    start: () => {
      //
    },
    next: (sub) => {
      //
    },
    error: (sub) => {
      //
    },
    complete: () => {
      //
    },
  },
});
```

And maybe you need to unsubscribe it.

```js
const sub = bus.subscribe({
  // ....
});

sub.unsubscribe();
```

### Call

You can call a subject with any params and types (optional).

```js
bus.call({
  subject: "#/parrent/child",
  param: "ANY THINGS WITH ANY TYPES",
});
```

You can call subject with [three types](#types) but default is `next`.

```js
bus.call({
  subject: "#/parrent/child",
  param: "ANY THINGS WITH ANY TYPES",
  type: "complete",
});
```

### Callback

You can call a subject and get back data from subscribers.

```js
bus.subscribe({
  subject: "message",
  callback: {
    next: (sub) => {
      console.log(sub.data); // log: hello
      sub.next("hi");
    },
  },
});
```

```js
bus
  .call({
    subject: "message",
    param: "hello",
  })
  .subscribe({
    next: (sub) => {
      console.log(sub.data); // log: hi
    },
  });
```

### useBus

You can subscribe to many subjects.

```js
useBus({
  "#/country/city": (sub) => {
    //
  },
});
```
<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Definations

Maybe the understanding and concept and words are complicated. Let's explain some.

### Subject

Subjects are like function name. And you can call them with this name.

### Types

There is 4 types of subscription but you can access with three of theme.

#### start

When subscribe called for first time with no data.

#### next

When subscribe called with data.

#### error

When subscribe called with data when an error happend.

#### complete

When subscribe called for last time and wants to removed.

<p align="right">(<a href="#readme-top">back to top</a>)</p>