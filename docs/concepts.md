# Concepts

This document outlines the core concepts of building an MCP server for ChatGPT Apps.

## What is MCP?

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) is an open specification for connecting large language model clients to external tools and resources. An MCP server exposes tools that a model can call during a conversation, and return results given specified parameters. Other resources (metadata) can be returned along with tool results, including the inline html that we can use in the Apps SDK to render an interface.

With Apps SDK, MCP is the backbone that keeps server, model, and UI in sync. By standardising the wire format, authentication, and metadata, it lets ChatGPT reason about your app the same way it reasons about built-in tools.

## Protocol building blocks

A minimal MCP server for Apps SDK implements three capabilities:

1.  **List tools** – your server advertises the tools it supports, including their JSON Schema input and output contracts and optional annotations.
2.  **Call tools** – when a model selects a tool to use, it sends a `call_tool` request with the arguments corresponding to the user intent. Your server executes the action and returns structured content the model can parse.
3.  **Return components** – in addition to structured content returned by the tool, each tool (in its metadata) can optionally point to an [embedded resource](https://modelcontextprotocol.io/specification/2025-06-18/server/tools#embedded-resources) that represents the interface to render in the ChatGPT client.

The protocol is transport agnostic, you can host the server over Server-Sent Events or Streamable HTTP. Apps SDK supports both options, but we recommend Streamable HTTP.

## Why Apps SDK standardises on MCP

Working through MCP gives you several benefits out of the box:

*   **Discovery integration** – the model consumes your tool metadata and surface descriptions the same way it does for first-party connectors, enabling natural-language discovery and launcher ranking. See [Discovery](https://developers.openai.com/apps-sdk/concepts/user-interaction) for details.
*   **Conversation awareness** – structured content and component state flow through the conversation. The model can inspect the JSON result, refer to IDs in follow-up turns, or render the component again later.
*   **Multiclient support** – MCP is self-describing, so your connector works across ChatGPT web and mobile without custom client code.
*   **Extensible auth** – the specification includes protected resource metadata, OAuth 2.1 flows, and dynamic client registration so you can control access without inventing a proprietary handshake.

## Next steps

If you’re new to MCP, we recommend starting with the following resources:

*   [Model Context Protocol specification](https://modelcontextprotocol.io/specification)
*   [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
*   [MCP Inspector for local debugging](https://modelcontextprotocol.io/docs/tools/inspector)

Once you are comfortable with the MCP primitives, you can move on to the [Set up your server](https://developers.openai.com/apps-sdk/build/mcp-server) guide for implementation details.

## User Interaction

How users find, engage with, activate and manage apps that are available in ChatGPT.

### Discovery

Discovery refers to the different ways a user or the model can find out about your app and the tools it provides: natural-language prompts, directory browsing, and proactive [entry points](https://developers.openai.com/apps-sdk/concepts/user-interaction#entry-points). Apps SDK leans on your tool metadata and past usage to make intelligent choices. Good discovery hygiene means your app appears when it should and stays quiet when it should not.

#### Named mention

When a user mentions the name of your app at the beginning of a prompt, your app will be surfaced automatically in the response. The user must specify your app name at the beginning of their prompt. If they do not, your app can also appear as a suggestion through in-conversation discovery.

#### In-conversation discovery

When a user sends a prompt, the model evaluates:

*   **Conversation context** – the chat history, including previous tool results, memories, and explicit tool preferences
*   **Conversation brand mentions and citations** - whether your brand is explicitly requested in the query or is surfaced as a source/citation in search results.
*   **Tool metadata** – the names, descriptions, and parameter documentation you provide in your MCP server.
*   **User linking state** – whether the user already granted access to your app, or needs to connect it before the tool can run.

You influence in-conversation discovery by:

1.  Writing action-oriented [tool descriptions](https://modelcontextprotocol.io/specification/2025-06-18/server/tools#tool) (“Use this when the user wants to view their kanban board”) rather than generic copy.
2.  Writing clear [component descriptions](https://developers.openai.com/apps-sdk/reference#add-component-descriptions) on the resource UI template metadata.
3.  Regularly testing your golden prompt set in ChatGPT developer mode and logging precision/recall.

If the assistant selects your tool, it handles arguments, displays confirmation if needed, and renders the component inline. If no linked tool is an obvious match, the model will default to built-in capabilities, so keep evaluating and improving your metadata.

### Directory

The directory will give users a browsable surface to find apps outside of a conversation. Your listing in this directory will include:

*   App name and icon
*   Short and long descriptions
*   Tags or categories (where supported)
*   Optional onboarding instructions or screenshots

### Entry points

Once a user links your app, ChatGPT can surface it through several entry points. Understanding each surface helps you design flows that feel native and discoverable.

#### In-conversation entry

Linked tools are always on in the model’s context. When the user writes a prompt, the assistant decides whether to call your tool based on the conversation state and metadata you supplied. Best practices:

*   Keep tool descriptions action oriented so the model can disambiguate similar apps.
*   Return structured content that references stable IDs so follow-up prompts can mutate or summarise prior results.
*   Provide _meta [hints](https://developers.openai.com/apps-sdk/reference#tool-descriptor-parameters) so the client can streamline confirmation and rendering.

When a call succeeds, the component renders inline and inherits the current theme, composer, and confirmation settings.

#### Launcher

The launcher (available from the `+` button in the composer) is a high-intent entry point where users can explicitly choose an app. Your listing should include a succinct label and icon. Consider:

*   **Deep linking** – include starter prompts or entry arguments so the user lands on the most useful tool immediately.
*   **Context awareness** – the launcher ranks apps using the current conversation as a signal, so keep metadata aligned with the scenarios you support.

## App design guidelines

### Overview

Apps are developer-built experiences that live inside ChatGPT. They extend what users can do without breaking the flow of conversation, appearing through lightweight cards, carousels, fullscreen views, and other display modes that integrate seamlessly into ChatGPT’s interface while maintaining its clarity, trust, and voice.

### Best practices

Apps are most valuable when they help people accomplish meaningful tasks directly within ChatGPT, without breaking the conversational flow. The goal is to design experiences that feel consistent, useful, and trustworthy while extending ChatGPT in ways that add real value. Good use cases include booking a ride, ordering food, checking availability, or tracking a delivery. These are tasks that are conversational, time bound, and easy to summarize visually with a clear call to action.

Poor use cases include pasting in long form content from a website, requiring complex multi step workflows, or using the space for ads or irrelevant messaging.

### Principles

*   **Conversational**: Experiences should feel like a natural extension of ChatGPT, fitting seamlessly into the conversational flow and UI.
*   **Intelligent**: Tools should be aware of conversation context, supporting and anticipating user intent. Responses and UI should feel individually relevant.
*   **Simple**: Each interaction should focus on a single clear action or outcome. Information and UI should be reduced to the absolute minimum to support the context.
*   **Responsive**: Tools should feel fast and lightweight, enhancing conversation rather than overwhelming it.
*   **Accessible**: Designs must support a wide range of users, including those who rely on assistive technologies.

### Boundaries

ChatGPT controls system-level elements such as voice, chrome, styles, navigation, and composer. Developers provide value by customizing content, brand presence, and actions inside the system framework. This balance ensures that all apps feel native to ChatGPT while still expressing unique brand value.

### Display modes

Display modes are the surfaces developers use to create experiences inside ChatGPT. They allow partners to show content and actions that feel native to conversation. Each mode is designed for a specific type of interaction, from quick confirmations to immersive workflows.

#### Inline

The inline display mode appears directly in the flow of the conversation. Inline surfaces currently always appear before the generated model response. Every app initially appears inline.

#### Fullscreen

Immersive experiences that expand beyond the inline card, giving users space for multi-step workflows or deeper exploration. The ChatGPT composer remains overlaid, allowing users to continue “talking to the app” through natural conversation in the context of the fullscreen view.

#### Picture-in-picture (PiP)

A persistent floating window inside ChatGPT optimized for ongoing or live sessions like games or videos. PiP remains visible while the conversation continues, and it can update dynamically in response to user prompts.
