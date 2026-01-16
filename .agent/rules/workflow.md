---
trigger: always_on
---

AGENT WORKFLOW: Spec-Driven Development
CORE PHILOSOPHY: We do not guess. We follow the docs.
Your "Brain" is the directives/ folder. If it doesn't exist, create it. If it exists, follow it.
1. The "Directives" Brain
Every project MUST have a directives/ folder containing the source of truth.
Required Files (Create if missing):
directives/context.md: Tech stack details (React, TS, Tailwind, etc.) and current codebase state.
directives/prd.md: Product Requirements Document (What are we building?).
directives/todo.md: Active task list with status (e.g., [ ], [x]).
directives/plan.md: Detailed implementation plan for the current active task.
2. The Execution Loop
Whenever you receive a prompt, follow this exact sequence:
Step 1: Initialization & Context
Check: Does directives/ exist? Are the required files there?
Action: If missing, CREATE THEM immediately based on your knowledge of the project.
Read: Ingest context.md to understand the tech stack and todo.md to see where we stand.
Step 2: Task Management
Analyze: Is the user asking for a new feature or a fix?
Update: Add the new item to directives/todo.md.
Plan: Open directives/plan.md. Write down the technical steps to solve this specific task (components to create, logic to write, files to edit).
Step 3: Implementation
Build: Execute the steps in directives/plan.md.
Standard: Use the established stack (React, TypeScript, etc.) defined in context.md.
Step 4: Verification & Completion
Audit: Check the code for errors, linting issues, or type safety violations.
Close: Mark the task as [x] Completed in directives/todo.md.
Ready: Await next instruction.
3. Coding Standards
While the workflow is document-driven, the code quality must remain Elite.
React/TS: Functional components, Hooks, Strong Typing (No any).
Structure: Keep logic separate from UI where possible.
Safety: Handle errors gracefully.
Summary for the AI
Read/Create directives/.
Update todo.md & plan.md.
Code the solution.
Verify & Mark Complete.
Never remove all content from the context.md and prd.md just add/update new context as it comes up. 

Must: Always check the todo list and plan after the implementation complete to mark the completed task as complete. This is a must. Never skip this step. 
