/* ============================================
   app.js — Interactive Behaviors
   ============================================ */

// ------------------------------------------------
// SECTION 1: Token Drift Simulator
// ------------------------------------------------

const turns = [
  {
    label: 'Turn 1',
    prompt: '"Write a python function to scrape a site"',
    tokens: 625,
    maxTokens: 6225,
    cost: '$0.0016',
    status: '⚠️ Vague / Incomplete',
    statusClass: 'text-rose-400',
    barColor: 'bg-rose-500',
    barPct: 10,
    savings: '83.1% Less Tokens'
  },
  {
    label: 'Turn 2',
    prompt: '[Turn 1] + "No, use Playwright, not Selenium."',
    tokens: 1250,
    maxTokens: 6225,
    cost: '$0.0031',
    status: '⚠️ Missing Edge Cases',
    statusClass: 'text-rose-400',
    barColor: 'bg-rose-500',
    barPct: 20,
    savings: '79.3% Less Tokens'
  },
  {
    label: 'Turn 3',
    prompt: '[Turns 1–2] + "Add exponential backoff for 429 errors."',
    tokens: 2850,
    maxTokens: 6225,
    cost: '$0.0071',
    status: '⚠️ No Type Hints Yet',
    statusClass: 'text-amber-400',
    barColor: 'bg-amber-500',
    barPct: 46,
    savings: '63.2% Less Tokens'
  },
  {
    label: 'Turn 4',
    prompt: '[Turns 1–3] + "Only output typed code, no explanations."',
    tokens: 6225,
    maxTokens: 6225,
    cost: '$0.0156',
    status: '✅ Finally Complete',
    statusClass: 'text-emerald-400',
    barColor: 'bg-rose-600',
    barPct: 100,
    savings: '83.1% Less Tokens (PromptForge wins)'
  }
];

function initSimulator() {
  const buttons = document.querySelectorAll('.turn-btn');
  if (!buttons.length) return;

  function activateTurn(turnIndex) {
    const t = turns[turnIndex];
    buttons.forEach((btn, i) => btn.classList.toggle('active', i === turnIndex));

    const naivePrompt = document.getElementById('naive-prompt-text');
    const naiveTokens = document.getElementById('naive-tokens');
    const naiveCost = document.getElementById('naive-cost');
    const naiveStatus = document.getElementById('naive-status');
    const naiveBar = document.getElementById('naive-bar');
    const naiveTurnLabel = document.getElementById('naive-turn-label');
    const savingsBadge = document.getElementById('savings-badge');

    if (naivePrompt) naivePrompt.textContent = t.prompt;
    if (naiveTokens) naiveTokens.textContent = `${t.tokens.toLocaleString()} tokens`;
    if (naiveCost) naiveCost.textContent = t.cost;
    if (naiveStatus) {
      naiveStatus.textContent = t.status;
      naiveStatus.className = `font-medium ${t.statusClass}`;
    }
    if (naiveBar) {
      naiveBar.className = `h-full rounded-full transition-all duration-500`;
      naiveBar.style.background = turnIndex < 3 ? '#f43f5e' : '#dc2626';
      naiveBar.style.width = `${t.barPct}%`;
    }
    if (naiveTurnLabel) naiveTurnLabel.textContent = t.label;
    if (savingsBadge) savingsBadge.textContent = t.savings;
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener('click', () => activateTurn(i));
  });

  activateTurn(0);
}

// ------------------------------------------------
// SECTION 2: AI Agent Workflow Stepper
// ------------------------------------------------

const workflowSteps = [
  {
    badge: 'STAGE 1 / 5',
    title: 'Goal Ingestion & Decomposition',
    desc: 'The user passes a multi-step objective. In naive setups, casual prompts trigger repetitive loops. PromptForge restructures the objective into explicit constraints before execution begins, eliminating conversational drift from the start.',
    tool: 'PromptForge (Prompt Optimizer)',
    toolColor: 'text-indigo-400',
    code: `// Normalized Task Payload sent to Agent
{
  "intent": "Implement async rate-limited scraper",
  "framework": "CREATE",
  "constraints": [
    "Runtime: Playwright",
    "Error Handling: Exponential backoff (429)",
    "Output: Fully typed, no explanations"
  ],
  "targetPlatform": "Claude Sonnet"
}`
  },
  {
    badge: 'STAGE 2 / 5',
    title: 'AST Context Slimming',
    desc: 'Before injecting source files into the agent context window, ContextSlim parses the codebase into an Abstract Syntax Tree and strips function bodies, leaving only imports, type signatures, docstrings, and class interfaces. This cuts token bloat by 80%+ and prevents "lost in the middle" attention failures.',
    tool: 'ContextSlim (AST Minifier)',
    toolColor: 'text-cyan-400',
    code: `// Before ContextSlim → 1,475 tokens consumed
// After ContextSlim  →   191 tokens consumed

export async function dispatchPromptRefinement(
  rawThought: string,
  settings: UserSettings
): Promise<RefinedPrompt> { /* condensed */ }

export async function callGeminiAPI(
  rawThought: string,
  systemPrompt: string,
  apiKey: string
): Promise<string> { /* condensed */ }

// -87.1% token reduction achieved`
  },
  {
    badge: 'STAGE 3 / 5',
    title: 'Tool Schema Linting (MCP)',
    desc: 'Before the agent executes any tool calls, ToolGuard scans all registered MCP and function calling schemas for vague parameter descriptions, missing type definitions, unbound arrays, and embedded prompt injection directives. Errors block deployment. This prevents hallucinated arguments and security risks.',
    tool: 'ToolGuard (MCP Linter)',
    toolColor: 'text-amber-400',
    code: `// ToolGuard pre-flight scan report
{
  "toolCount": 4,
  "errorCount": 0,
  "warningCount": 1,
  "isValid": true,
  "issues": [
    {
      "rule": "no-vague-parameter-description",
      "severity": "warn",
      "tool": "fetch_user",
      "param": "options",
      "message": "Parameter description is too generic.",
      "suggestion": "Specify field names and types expected."
    }
  ]
}`
  },
  {
    badge: 'STAGE 4 / 5',
    title: 'Tool Execution & Observation',
    desc: 'The agent invokes tools (file read/write, bash commands, API calls) and receives structured JSON observations. Each observation is fed back into the reasoning loop. PromptSpec validates that JSON outputs match declared contracts before they propagate downstream in a pipeline.',
    tool: 'PromptSpec (Output Contract Verifier)',
    toolColor: 'text-emerald-400',
    code: `// PromptSpec assertion result
{
  "name": "Scraper Output Contract",
  "output": "{ ... }",
  "latencyMs": 820,
  "estimatedTokens": 310,
  "report": {
    "isPassed": true,
    "passedCount": 5,
    "failedCount": 0,
    "results": [
      { "assertion": "json_valid",   "passed": true },
      { "assertion": "has_keys",     "passed": true },
      { "assertion": "max_tokens",   "passed": true },
      { "assertion": "max_latency_ms", "passed": true }
    ]
  }
}`
  },
  {
    badge: 'STAGE 5 / 5',
    title: 'PR Synthesis & Architectural Summary',
    desc: 'After all changes are written, git-narrate scans the staged diff, categorizes files by architectural layer (API, Frontend, Database, Logic), and generates a Markdown PR description with a visual Mermaid flow diagram and a reviewer checklist—ready to paste into GitHub.',
    tool: 'git-narrate (PR Synthesizer)',
    toolColor: 'text-purple-400',
    code: `## Architectural Overview
3 modified files | +147 additions | -12 deletions

\`\`\`mermaid
flowchart TD
    CoreLogic["Core Logic"]
    APIBackend["API / Backend"]
    Testing["Testing"]
    CoreLogic --> APIBackend
    APIBackend --> Testing
\`\`\`

## Reviewer Checklist
- [ ] Core behavior verified against specs
- [ ] No regressions in dependent layers
- [ ] Tests added for modified code paths`
  }
];

function initWorkflow() {
  const stepCards = document.querySelectorAll('.step-card');
  if (!stepCards.length) return;

  const wfBadge = document.getElementById('wf-badge');
  const wfTitle = document.getElementById('wf-title');
  const wfDesc = document.getElementById('wf-desc');
  const wfTool = document.getElementById('wf-tool');
  const wfCode = document.getElementById('wf-code');

  function activateStep(stepIndex) {
    const s = workflowSteps[stepIndex];
    stepCards.forEach((c, i) => c.classList.toggle('active', i === stepIndex));
    if (wfBadge) wfBadge.textContent = s.badge;
    if (wfTitle) wfTitle.textContent = s.title;
    if (wfDesc) wfDesc.textContent = s.desc;
    if (wfTool) {
      wfTool.textContent = s.tool;
      wfTool.className = `font-medium ${s.toolColor}`;
    }
    if (wfCode) {
      wfCode.innerHTML = `<pre><code class="text-cyan-300">${escapeHtml(s.code)}</code></pre>`;
    }
  }

  stepCards.forEach((card, i) => {
    card.addEventListener('click', () => activateStep(i));
  });

  activateStep(0);
}

// ------------------------------------------------
// SECTION 3: AST Playground Toggle
// ------------------------------------------------

const slimmedCode =
`/**
 * PromptForge Multi-Model AI Dispatcher
 */
import { getSystemPrompt, offlineTransform } from './prompts.js';

export async function dispatchPromptRefinement(rawThought, settings) { /* implementation truncated */ }

/**
 * Google Gemini API Endpoint
 */
export async function callGeminiAPI(rawThought, systemPrompt, apiKey) { /* implementation truncated */ }

/**
 * Anthropic Claude Messages API Endpoint
 */
export async function callAnthropicAPI(rawThought, systemPrompt, apiKey) { /* implementation truncated */ }

/**
 * OpenAI-Compatible endpoint (OpenAI, Groq, DeepSeek)
 */
export async function callOpenAICompatibleAPI({ endpoint, apiKey, model, rawThought, systemPrompt }) { /* implementation truncated */ }

/**
 * Localhost Ollama API
 */
export async function callOllama(rawThought, systemPrompt, endpoint, model) { /* implementation truncated */ }

// --- Token Reduction: 1,475 → 191 tokens (87.1% reduction) ---`;

const rawCode =
`/**
 * PromptForge Multi-Model AI Dispatcher
 */
import { getSystemPrompt, offlineTransform } from './prompts.js';

export async function dispatchPromptRefinement(rawThought, settings) {
  if (!rawThought || typeof rawThought !== 'string') {
    throw new Error('rawThought must be a non-empty string');
  }

  const systemPrompt = getSystemPrompt(settings.activeFramework || 'balanced');

  if (settings.provider === 'offline') {
    return offlineTransform(rawThought, systemPrompt);
  }

  if (settings.provider === 'gemini') {
    if (!settings.geminiApiKey) {
      throw new Error('Gemini API key missing. Add it in Options.');
    }
    return await callGeminiAPI(rawThought, systemPrompt, settings.geminiApiKey);
  }

  if (settings.provider === 'anthropic') {
    if (!settings.anthropicApiKey) {
      throw new Error('Anthropic API key missing. Add it in Options.');
    }
    return await callAnthropicAPI(rawThought, systemPrompt, settings.anthropicApiKey);
  }

  throw new Error('Unsupported provider: ' + settings.provider);
}

export async function callGeminiAPI(rawThought, systemPrompt, apiKey) {
  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: rawThought }] }]
      })
    }
  );
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export async function callAnthropicAPI(rawThought, systemPrompt, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: rawThought }]
    })
  });
  const data = await response.json();
  return data.content?.[0]?.text || '';
}

export async function callOllama(rawThought, systemPrompt, endpoint, model) {
  const response = await fetch(endpoint || 'http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: model || 'llama3', prompt: systemPrompt + '\\n\\n' + rawThought, stream: false })
  });
  const data = await response.json();
  return data.response || '';
}

// Raw file: 1,475 tokens`;

function initPlayground() {
  const btnSlim = document.getElementById('btn-show-slim');
  const btnRaw = document.getElementById('btn-show-raw');
  const codeEl = document.getElementById('playground-code');

  if (!btnSlim || !btnRaw || !codeEl) return;

  btnSlim.addEventListener('click', () => {
    codeEl.textContent = slimmedCode;
    btnSlim.style.background = '#4f46e5';
    btnSlim.style.color = '#fff';
    btnRaw.style.background = 'transparent';
    btnRaw.style.color = '#94a3b8';
  });

  btnRaw.addEventListener('click', () => {
    codeEl.textContent = rawCode;
    btnRaw.style.background = '#4f46e5';
    btnRaw.style.color = '#fff';
    btnSlim.style.background = 'transparent';
    btnSlim.style.color = '#94a3b8';
  });
}

// ------------------------------------------------
// UTILITY
// ------------------------------------------------

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ------------------------------------------------
// INIT
// ------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  initSimulator();
  initWorkflow();
  initPlayground();
});
