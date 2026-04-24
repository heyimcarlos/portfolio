# Development Rules

## Conversational Style
- Keep answers short and concise
- No emojis in commits, issues, PR comments, or code
- No fluff or cheerful filler text
- Technical prose only, be kind but direct (e.g., "Thanks @user" not "Thanks so much @user!")

## Specifications
**IMPORTANT:** Before implementing any feature, consult the specification in `specs/README.md`

- **Assume NOT implemented:** Many specs describe planned features that may not be implemented yet.
- **Check the codebase first:** Before concluding something is or isn't implemented, search for actual code. Specs describe intent; code describes reality.
- **Use Specs as guideline:** When implementing a feature, follow the design patterns, types, and architecture defined in the relevant spec.
- **Keep index updated:** When creating new specs or implementation plans, add an entry to `specs/README.md`.

## Building with Bun
- **Build:** `bun build`
- **Install dependencies:** `bun install`
- **Start dev server:** `bun dev`
- **Preview build:** `bun preview`
- **Run Astro CLI commands:** `bun astro ...` (e.g., `bun astro add`, `bun astro check`)
- **Get help with Astro CLI:** `bun astro -- --help`

## Code Style
- No `any` types unless absolutely necessary
- Check node_modules for external API type definitions instead of guessing
- NEVER remove or downgrade code to fix type errors from outdated dependencies; upgrade the dependency instead

