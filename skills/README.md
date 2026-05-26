# Fin & Stem — Local skills

Project-local Claude skill definitions. To make a skill available in Claude Code, copy or symlink the folder into your installed Claude Code skills location.

## Available skills

### `content-research-writer/`

A writing-partner skill for producing long-form articles, build journals, and pillar expansions. Tuned to Fin & Stem's house style: TL;DR-first, citation-rich, internal-link-aggressive, first-hand-voice-preserving.

**Source**: adapted from [ComposioHQ/awesome-claude-skills/content-research-writer](https://github.com/ComposioHQ/awesome-claude-skills/blob/master/content-research-writer/SKILL.md).

**Trigger phrases**:
- "Help me write an article about …"
- "Outline a guide for …"
- "Research and draft …"
- "Improve this article's hook"
- "Give me feedback on this section"

## How to install a skill into Claude Code

Claude Code skills are loaded from a configured skills directory. The exact location depends on your install. To make these skills discoverable:

### Option A — Symlink into your global Claude Code skills folder

```bash
# macOS / Linux — find your Claude Code skills directory and symlink:
# Example for the Cowork plugin path on macOS:
ln -s "/Users/mikeelmira/Desktop/Fin & Stem/skills/content-research-writer" \
      "$HOME/.claude/skills/content-research-writer"
```

If the global skills directory isn't writable from chat, do the symlink in a terminal.

### Option B — Copy into a project-level `.claude/skills/` folder

Some Claude Code installs scan `.claude/skills/` inside the current project root. If yours does:

```bash
mkdir -p .claude/skills
cp -r skills/content-research-writer .claude/skills/
```

(You may need to do this from a terminal — Cowork mode may guard the `.claude/` path.)

### Option C — Reference the skill manually in a Claude Code prompt

The skill is well-defined; you don't strictly need it installed for Claude Code to follow it. At the start of a writing session, run:

```
Read skills/content-research-writer/SKILL.md and act as a content research writer for Fin & Stem.
Topic: [your article topic]
Target query: [your target search query]
Length: [800–1500 words]
```

Claude will follow the workflow inside the SKILL.md verbatim.

## Adding more skills

Drop new skill folders into this directory. The convention is:

```
skills/
└── <skill-name>/
    └── SKILL.md
```

The `SKILL.md` file should start with YAML frontmatter:

```markdown
---
name: skill-name
description: One-paragraph description of when to use this skill.
---

# Skill title

## When to Use This Skill
...

## Workflow
...
```
