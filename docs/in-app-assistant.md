# Building a Standalone In-App Assistant

This document outlines how to build a standalone chat assistant within the Northscore application, leveraging the same MCP tools used for the ChatGPT integration. This is made possible by using OpenAI's AgentKit, which includes Agent Builder for the backend and ChatKit for the frontend.

## Overview

By using AgentKit, you can create a chat assistant that is embedded directly into the Northscore application. This assistant will have its own UI and will be powered by the same MCP tools that are used for the ChatGPT integration. This allows you to have a consistent set of tools and backend logic for both your ChatGPT integration and your in-app assistant.

The process involves two main components:

1.  **Backend:** Using **Agent Builder**, a visual canvas for creating multi-step agent workflows. You will create a workflow that calls your existing Northscore MCP tools.
2.  **Frontend:** Using **ChatKit**, a toolkit for embedding a customizable chat UI into your application. You will configure ChatKit to connect to the workflow you created in Agent Builder.

## Backend: Agent Builder

Agent Builder is where you will define the logic for your in-app assistant. You will create a workflow that consists of nodes, which can be agents, tools, or logic.

1.  **Create a new workflow:** In Agent Builder, create a new workflow for your Northscore assistant.
2.  **Add tool nodes:** For each of your Northscore MCP tools (`get_games`, `get_standings`, etc.), add a tool node to your workflow.
3.  **Configure tool nodes:** Configure each tool node to call the corresponding MCP tool on your Northscore MCP server.
4.  **Publish your workflow:** Once your workflow is complete, publish it to get a "workflow ID."

## Frontend: ChatKit

ChatKit is how you will embed the chat UI for your assistant into the Northscore application.

1.  **Add ChatKit to your frontend:** Follow the ChatKit documentation to add the ChatKit embed script to your Northscore application.
2.  **Configure ChatKit:** Configure ChatKit with the "workflow ID" you obtained from Agent Builder. This will connect your ChatKit frontend to your Agent Builder backend.
3.  **Customize the UI:** ChatKit provides options for customizing the appearance and behavior of the chat UI to match the look and feel of the Northscore app.

By following this process, you can create a powerful and flexible in-app chat assistant that is seamlessly integrated into your Northscore application and leverages your existing MCP tools.

## Resources

- [ChatKit JS Documentation](https://openai.github.io/chatkit-js/)
- [ChatKit Studio Playground](https://chatkit.studio/playground)
- [ChatKit Widgets](https://widgets.chatkit.studio/)
