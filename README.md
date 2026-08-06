# Decision OS Studio

You are building the UI for DecisionOS, an AI operating system for founder-led small businesses. I'm giving you a complete, detailed UI specification below. Build the frontend faithfully to it — this is a test of how precisely you can execute a defined design system, so follow the spec's design language exactly rather than reaching for your own defaults.

Read the full spec first, then build. These rules are non-negotiable and are the most common things that get lost — get them right:

Color is semantic, not decorative. Indigo (#373ACD) is the brand/accent and the single primary action per screen. Every other state — caution, success, and the other status and category types — should use its own appropriate, consistent color as defined in the spec, applied by meaning rather than for decoration.

No uppercase text anywhere. Title Case for everything, including buttons. Labels and metadata are distinguished from body text by weight, size, and color — NOT by capitalization or letter-spacing.

One consistent curved corner-radius scale (values in the spec) — no sharp corners, no inconsistency.

One primary action per screen — the most visually dominant element. Everything else is secondary or tertiary.

Calm, not overwhelming. Default to showing what matters now; keep the rest one tap behind; and always show the count of what's hidden. Subtraction must never become silent concealment.

Status badges are pale-tint background + dark text (never solid slabs).

How to use the spec:

Part 1 is the product and philosophy — the why.

Part 2 is the full design system (colors, type, radius, spacing, components) — lock this in before building any screen.

Part 3 is navigation and routing.

Part 4 is all 20 screens — each with its purpose, contents, actions, and special behavior. The Decision Desk (home) is the most important; build it as a calm morning brief, not a control panel.

Part 5 is the key end-to-end flows.

Parts 6–8 are cross-cutting patterns, sample data, and a build checklist.

Use the sample data provided in Part 7 so screens render under realistic load — especially the Decision Desk, which needs real content to show its prioritization working.

Build it screen by screen, starting with the design system foundation and the Decision Desk. Prioritize faithfulness to the spec's design language over speed.

Full specification is attached as a .md file

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://decision-os-studio.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c4e80248-2d37-4200-a300-adbddd66e12a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
