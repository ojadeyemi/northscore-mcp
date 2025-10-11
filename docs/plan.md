# Plan

This document outlines the plan for building the NorthScore MCP server.

## Research use cases

Every successful Apps SDK app starts with a crisp understanding of what the user is trying to accomplish. Discovery in ChatGPT is model-driven: the assistant chooses your app when your tool metadata, descriptions, and past usage align with the user’s prompt and memories. That only works if you have already mapped the tasks the model should recognize and the outcomes you can deliver.

### Gather inputs

Begin with qualitative and quantitative research:

*   **User interviews and support requests** – capture the jobs-to-be-done, terminology, and data sources users rely on today.
*   **Prompt sampling** – list direct asks (e.g., “show my Jira board”) and indirect intents (“what am I blocked on for the launch?”) that should route to your app.
*   **System constraints** – note any compliance requirements, offline data, or rate limits that will influence tool design later.

Document the user persona, the context they are in when they reach for ChatGPT, and what success looks like in a single sentence for each scenario.

### Define evaluation prompts

Decision boundary tuning is easier when you have a golden set to iterate against. For each use case:

1.  Author at least five direct prompts that explicitly reference your data, product name, or verbs you expect the user to say.
2.  Draft five indirect prompts where the user states a goal but not the tool (“I need to keep our launch tasks organized”).
3.  Add negative prompts that should not trigger your app so you can measure precision.

Use these prompts later in [Optimize metadata](https://developers.openai.com/apps-sdk/guides/optimize-metadata) to hill-climb on recall and precision withoutoverfitting to a single request.

### Scope the minimum lovable feature

For each use case decide:

*   What information must be visible inline to answer the question or let the user act.
*   Which actions require write access and whether they should be gated behind confirmation in developer mode.
*   What state needs to persist between turns—for example, filters, selected rows, or draft content.

Rank the use cases based on user impact and implementation effort. A common pattern is to ship one P0 scenario with a high-confidence component, then expand to P1 scenarios once discovery data confirms engagement.

### Translate use cases into tooling

Once a scenario is in scope, draft the tool contract:

*   **Inputs**: the parameters the model can safely provide. Keep them explicit, use enums when the set is constrained, and document defaults.
*   **Outputs**: the structured content you will return. Add fields the model can reason about (IDs, timestamps, status) in addition to what your UI renders.
*   **Component intent**: whether you need a read-only viewer, an editor, or a multiturn workspace. This influences the [component planning](https://developers.openai.com/apps-sdk/plan/components) and storage model later.

Review these drafts with stakeholders—especially legal or compliance teams—before you invest in implementation. Many integrations require PII reviews or data processing agreements before they can ship to production.

### Prepare for iteration

Even with solid planning, expect to revise prompts and metadata after your first dogfood. Build time into your schedule for:

*   Rotating through the golden prompt set weekly and logging tool selection accuracy.
*   Collecting qualitative feedback from early testers in ChatGPT developer mode.
*   Capturing analytics (tool calls, component interactions) so you can measure adoption.

These research artifacts become the backbone for your roadmap, changelog, and success metrics once the app is live.

## Define tools

In Apps SDK, tools are the contract between your MCP server and the model. They describe what the connector can do, how to call it, and what data comes back. Good tool design makes discovery accurate, invocation reliable, and downstream UX predictable.

### Draft the tool surface area

Start from the user journey defined in your [use case research](https://developers.openai.com/apps-sdk/plan/use-case):

*   **One job per tool** – keep each tool focused on a single read or write action (“fetch_board”, “create_ticket”), rather than a kitchen-sink endpoint. This helps the model decide between alternatives.
*   **Explicit inputs** – define the shape of inputSchema now, including parameter names, data types, and enums. Document defaults and nullable fields so the model knows what is optional.
*   **Predictable outputs** – enumerate the structured fields you will return, including machine-readable identifiers that the model can reuse in follow-up calls.

If you need both read and write behavior, create separate tools so ChatGPT can respect confirmation flows for write actions.

### Capture metadata for discovery

Discovery is driven almost entirely by metadata. For each tool, draft:

*   **Name** – action oriented and unique inside your connector (kanban.move_task).
*   **Description** – one or two sentences that start with “Use this when…” so the model knows exactly when to pick the tool.
*   **Parameter annotations** – describe each argument and call out safe ranges or enumerations. This context prevents malformed calls when the user prompt is ambiguous.
*   **Global metadata** – confirm you have app-level name, icon, and descriptions ready for the directory and launcher.

Later, plug these into your MCP server and iterate using the [Optimize metadata](https://developers.openai.com/apps-sdk/guides/optimize-metadata) workflow.

## Design components

UI components are the human-visible half of your connector. They let users view or edit data inline, switch to fullscreen when needed, and keep context synchronized between typed prompts and UI actions. Planning them early ensures your MCP server returns the right structured data and component metadata from day one.

### Clarify the user interaction

For each use case, decide what the user needs to see and manipulate:

*   **Viewer vs. editor** – is the component read-only (a chart, a dashboard) or should it support editing and writebacks (forms, kanban boards)?
*   **Single-shot vs. multiturn** – will the user accomplish the task in one invocation, or should state persist across turns as they iterate?
*   **Inline vs. fullscreen** – some tasks are comfortable in the default inline card, while others benefit from fullscreen or picture-in-picture modes. Sketch these states before you implement.

Write down the fields, affordances, and empty states you need so you can validate them with design partners and reviewers.
