# Deploy

This document explains how to deploy the NorthScore MCP server.

## Deploy your app

Once you have a working MCP server and component bundle, host them behind a stable HTTPS endpoint.

### Deployment options

Deployment platforms that work well with Apps SDK include:

*   **Managed containers** – Fly.io, Render, or Railway for quick spin-up and automatic TLS.
*   **Cloud serverless** – Google Cloud Run or Azure Container Apps if you need scale-to-zero, keeping in mind that long cold starts can interrupt streaming HTTP.
*   **Kubernetes** – for teams that already run clusters. Front your pods with an ingress controller that supports server-sent events.

Regardless of platform, make sure `/mcp` stays responsive, supports streaming responses, and returns appropriate HTTP status codes for errors.

### Local development

During development you can expose your local server to ChatGPT using a tunnel such as ngrok:

```
ngrok http 2091
# https://<subdomain>.ngrok.app/mcp → http://127.0.0.1:2091/mcp
```

Keep the tunnel running while you iterate on your connector. When you change code:

1.  Rebuild the component bundle (`npm run build`).
2.  Restart your MCP server.
3.  Refresh the connector in ChatGPT settings to pull the latest metadata.

## Connect from ChatGPT

### Before you begin

Connecting your MCP server to ChatGPT requires developer mode access:

1.  Ask your OpenAI partner contact to add you to the connectors developer experiment.
2.  If you are on ChatGPT Enterprise, have your workspace admin enable connector creation for your account.
3.  Toggle Settings → Connectors → Advanced → Developer mode in the ChatGPT client.

Once developer mode is active you will see a Create button under Settings → Connectors.

### Create a connector

1.  Ensure your MCP server is reachable over HTTPS (for local development, expose it via ngrok).
2.  In ChatGPT, navigate to Settings → Connectors → Create.
3.  Provide the metadata for your connector:
    *   **Connector name** – a user-facing title such as Kanban board.
    *   **Description** – explain what the connector does and when to use it. The model uses this text during discovery.
    *   **Connector URL** – the public /mcp endpoint of your server (for example https://abc123.ngrok.app/mcp).
4.  Click Create. If the connection succeeds you will see a list of the tools your server advertises. If it fails, use the [Testing](https://developers.openai.com/apps-sdk/deploy/testing) guide to debug with MCP Inspector or the API Playground.

## Test your integration

Testing validates that your connector behaves predictably before you expose it to users. Focus on three areas: tool correctness, component UX, and discovery precision.

### Unit test your tool handlers

*   Exercise each tool function directly with representative inputs. Verify schema validation, error handling, and edge cases (empty results, missing IDs).
*   Include automated tests for authentication flows if you issue tokens or require linking.
*   Keep test fixtures close to your MCP code so they stay up to date as schemas evolve.

### Use MCP Inspector during development

The [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector) is the fastest way to debug your server locally.
