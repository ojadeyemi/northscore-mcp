# Northscore MCP Tools

This document provides details about the Northscore MCP tools.

## `get_games`

Build the logic to fetch a single team’s upcoming and recent games.

**Behavior / UI:** Shows 3–5 games inline as compact cards (date, opponent, score/status), each card may include an optional venue location or broadcast/watch link. A “Show more” option expands to fullscreen for the full schedule.

**Example Prompt:** “Show me upcoming games for Carleton Ravens MBB this month.”

## `get_standings` / `get_record`

First, finalize the tool name. Then, implement the compact league standings or single-team record logic. There is a GenericStanding response from each league, but each league has a different structure (i.e some have nested dictionaries compared to others). Perhaps we can find a way to flatten the standings response and add an optional conference/division field. That way its just a list of standings objects where each item in the list represents a row on the standings table. Handle case of single team info vs a league (single item vs a list will have different UI implications) so that the UI would typically render inline scrollable tables for quick viewing and handle single-team queries gracefully.

**Behavior / UI:** Displays a compact scrollable table (Team | Wins | Losses) inline. If a user asks for one team, only that team’s row is shown.

**Example Prompt:** “What's the current CFL standings ?” / “What’s McGill’s record in RSEQ women’s soccer?”

## `get_leaderboard`

Develop the leaderboard tool to return the top 5 performers for a specific stat. Figure out a way to handle the stat of the leaderboard to pass since each league has a different type of stat. (Maybe normalize by sport (i.e all basketball leagues will have total_points, points_per_game, total_rebounds.. and all soccer leagues will have goals, assists and so on).

**Behavior / UI:** Inline list of 5 players (Rank | Player | Team | StatValue), no expansion.

**Example Prompt:** “Top 5 scorers in U SPORTS men’s basketball.”

## `get_teamstats`

Here we want a simple response of a team stat to be able to generate a team card (so like team name, primary and secondary colours, url to team page on Northscore app, and then 4-5 stats related to the team). Let's finalize a generic schema that will work for every league in every sport for simplicity and consistency.

**Behavior / UI:** Inline card with logo, record, and stats like average points, and recent form (e.g., W-L-W). No player stats.

**Example Prompt:** “Show team stats for UBC Thunderbirds WBB.”, "How many touchdowns does the Argos have so far"
