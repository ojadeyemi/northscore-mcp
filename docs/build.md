# Build

This document describes the process of building the Northscore MCP server.

## Set up your server

Your MCP server is the foundation of every Apps SDK integration. It exposes tools that the model can call, enforces authentication, and packages the structured data plus component HTML that the ChatGPT client renders inline. This guide walks through the core building blocks with examples in TypeScript.

### Choose an SDK

Apps SDK supports any server that implements the MCP specification, but the official TypeScript SDK is the fastest way to get started.

- **TypeScript SDK (official)** – ideal if your stack is already Node/React. Use `@modelcontextprotocol/sdk`. Docs: [modelcontextprotocol.io](https://modelcontextprotocol.io/).

Install the SDK and any web framework you prefer (Express is a common choice).

### Describe your tools

Tools are the contract between ChatGPT and your backend. Define a clear machine name, human-friendly title, and JSON schema so the model knows when—and how—to call each tool. This is also where you wire up per-tool metadata, including auth hints, status strings, and component configuration.

### Point to a component template

In addition to returning structured data, each tool on your MCP server should also reference an HTML UI template in its descriptor. This HTML template will be rendered in an iframe by ChatGPT.

1.  **Register the template** – expose a resource whose mimeType is `text/html+skybridge` and whose body loads your compiled JS/CSS bundle. The resource URI (for example `ui://widget/kanban-board.html`) becomes the canonical ID for your component.
2.  **Link the tool to the template** – inside the tool descriptor, set `_meta["openai/outputTemplate"]` to the same URI. Optional `_meta` fields let you declare whether the component can initiate tool calls or display custom status copy.
3.  **Version carefully** – when you ship breaking component changes, register a new resource URI and update the tool metadata in lockstep. ChatGPT caches templates aggressively, so unique URIs (or cache-busted filenames) prevent stale assets from loading.

With the template and metadata in place, ChatGPT hydrates the iframe using the `structuredContent` payload from each tool response.

## Build a custom UX

UI components turn structured tool results into a human-friendly UI. Apps SDK components are typically React components that run inside an iframe, talk to the host via the `window.openai` API, and render inline with the conversation. This guide describes how to structure your component project, bundle it, and wire it up to your MCP server.

### Understand the window.openai API

`window.openai` is the bridge between your frontend and ChatGPT. Use this quick reference to first understand how to wire up data, state, and layout concerns before you dive into component scaffolding.

### Scaffold the component project

As best practice, keep the component code separate from your server logic. A common layout is:

```
app/
  server/            # MCP server (Node)
  web/               # Component bundle source
    package.json
    tsconfig.json
    src/component.tsx
    dist/component.js   # Build output
```

Create the project and install dependencies (Node 18+ recommended):

```
cd app/web
pnpm init
pnpm install react@^18 react-dom@^18
pnpm install -D typescript esbuild
```

### Author the React component

Your entry file should mount a component into a root element and read initial data from `window.openai.toolOutput` or persisted state.

### Bundle for the iframe

Once you are done writing your React component, you can build it into a single JavaScript module that the server can inline:

```json
// package.json
{
  "scripts": {
    "build": "esbuild src/component.tsx --bundle --format=esm --outfile=dist/component.js"
  }
}
```

Run `pnpm build` to produce `dist/component.js`.

## Authentication

Many Apps SDK apps can operate in a read-only, anonymous mode, but anything that exposes customer-specific data or write actions should authenticate users. You can integrate with your own authorization server when you need to connect to an existing backend or share data between users.

### Custom auth with OAuth 2.1

When you need to talk to an external system—CRM records, proprietary APIs, shared datasets—you can integrate a full OAuth 2.1 flow that conforms to the [MCP authorization spec](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization).

## Persist state

Apps SDK handles conversation state automatically, but most real-world apps also need durable storage. You might cache fetched data, keep track of user preferences, or persist artifacts created inside a component. Choosing the right storage model upfront keeps your connector fast, reliable, and compliant.

### Bring your own backend

If you already run an API or need multi-user collaboration, integrate with your existing storage layer.

## Examples

The Pizzaz demo app bundles a handful of UI components so you can see the full tool surface area end-to-end. The following sections walk through the MCP server and the component implementations that power those tools. You can find the “Pizzaz” demo app and other examples in our [examples repository on GitHub](https://github.com/openai/openai-apps-sdk-examples).
