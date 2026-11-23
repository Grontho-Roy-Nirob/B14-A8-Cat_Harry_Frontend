import * as React from "react"
import { createHighlighterCoreSync } from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"

import bash from "shiki/langs/shellscript.mjs"
import css from "shiki/langs/css.mjs"
import diff from "shiki/langs/diff.mjs"
import html from "shiki/langs/html.mjs"
import javascript from "shiki/langs/javascript.mjs"
import json from "shiki/langs/json.mjs"
import jsx from "shiki/langs/jsx.mjs"
import markdown from "shiki/langs/markdown.mjs"
import python from "shiki/langs/python.mjs"
import sql from "shiki/langs/sql.mjs"
import tsx from "shiki/langs/tsx.mjs"
import typescript from "shiki/langs/typescript.mjs"
import yaml from "shiki/langs/yaml.mjs"
import githubLight from "shiki/themes/github-light.mjs"
import githubDark from "shiki/themes/github-dark.mjs"

// One highlighter, created synchronously when this module loads.
const highlighter = createHighlighterCoreSync({
  themes: [githubLight, githubDark],
  langs: [
    bash,
    css,
    diff,
    html,
    javascript,
    json,
    jsx,
    markdown,
    python,
    sql,
    tsx,
    typescript,
    yaml,
  ],
  engine: createJavaScriptRegexEngine({ forgiving: true }),
})

const aliases: Record<string, string> = {
  js: "javascript",
  md: "markdown",
  py: "python",
  sh: "bash",
  shell: "bash",
  shellscript: "bash",
  ts: "typescript",
  yml: "yaml",
  zsh: "bash",
}

const supported = new Set([
  "bash",
  "css",
  "diff",
  "html",
  "javascript",
  "json",
  "jsx",
  "markdown",
  "python",
  "sql",
  "tsx",
  "typescript",
  "yaml",
])

function getLanguage(language: string) {
  const name = language.toLowerCase()
  return aliases[name] ?? (supported.has(name) ? name : null)
}

// Highlights code and returns one React node per line.
// Falls back to plain text when the language is unknown or highlighting fails.
export function highlightCode(code: string, language: string): React.ReactNode[] {
  // A trailing newline would render as an extra empty line.
  const text = code.endsWith("\n") ? code.slice(0, -1) : code
  const lang = getLanguage(language)

  if (!lang) return text.split("\n")

  try {
    // One call highlights the whole block, so multiline code keeps its colors.
    const { tokens } = highlighter.codeToTokens(text, {
      lang,
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    })

    return tokens.map((line) =>
      line.map((token, index) => (
        <span
          key={index}
          style={token.htmlStyle as React.CSSProperties}
          className="text-(--shiki-light) dark:text-(--shiki-dark)"
        >
          {token.content}
        </span>
      ))
    )
  } catch {
    return text.split("\n")
  }
}
