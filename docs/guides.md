# Guides

This document provides guides for using and maintaining the NorthScore MCP server.

## Optimize Metadata

Improve discovery and behavior with rich metadata.

### Why metadata matters

ChatGPT decides when to call your connector based on the metadata you provide. Well-crafted names, descriptions, and parameter docs increase recall on relevant prompts and reduce accidental activations. Treat metadata like product copy—it needs iteration, testing, and analytics.

### Gather a golden prompt set

Before you tune metadata, assemble a labelled dataset:

*   **Direct prompts** – users explicitly name your product or data source.
*   **Indirect prompts** – users describe the outcome they want without naming your tool.
*   **Negative prompts** – cases where built-in tools or other connectors should handle the request.

Document the expected behaviour for each prompt (call your tool, do nothing, or use an alternative). You will reuse this set during regression testing.

## Security & Privacy

### Principles

Apps SDK gives your code access to user data, third-party APIs, and write actions. Treat every connector as production software:

*   **Least privilege** – only request the scopes, storage access, and network permissions you need.
*   **Explicit user consent** – make sure users understand when they are linking accounts or granting write access. Lean on ChatGPT’s confirmation prompts for potentially destructive actions.
*   **Defense in depth** – assume prompt injection and malicious inputs will reach your server. Validate everything and keep audit logs.

## Troubleshooting

When something goes wrong—components failing to render, discovery missing prompts, auth loops—start by isolating which layer is responsible: server, component, or ChatGPT client.
