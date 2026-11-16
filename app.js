/* =========================================================
   AMIT GUPTA PORTFOLIO — app.js
   Interactive AI Learning Concepts + Neural Canvas + UI
   ========================================================= */

// ─── Neural Canvas Background ───────────────────────────────
(function initCanvas() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], rafId;
  const NODE_COUNT = 55;
  const MAX_DIST = 160;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createNodes() {
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1.2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99,102,241,${0.4 * (1 - dist / MAX_DIST)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
    // nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(99,102,241,0.7)';
      ctx.fill();
    });
    // move
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });
    rafId = requestAnimationFrame(draw);
  }

  resize(); createNodes(); draw();
  window.addEventListener('resize', () => { resize(); createNodes(); });
})();

// ─── Nav scroll state ───────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', scrollY > 40);
});

// ─── Mobile Menu ────────────────────────────────────────────
document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('navMobile').classList.toggle('open');
});
document.querySelectorAll('.nav-mobile a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('navMobile').classList.remove('open'));
});

// ─── Counter Animation ──────────────────────────────────────
function animateCounters() {
  document.querySelectorAll('.hstat-num').forEach(el => {
    const target = +el.dataset.target;
    let current = 0;
    const step = target / 50;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 25);
  });
}
const heroObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) { animateCounters(); heroObs.disconnect(); }
}, { threshold: 0.3 });
const heroEl = document.querySelector('.hero');
if (heroEl) heroObs.observe(heroEl);

// ─── Fade-in on scroll ──────────────────────────────────────
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.project-card, .stack-col, .domain-card, .lead-card, .principle-card, .note-card, .contact-card').forEach(el => {
  el.classList.add('fade-in');
  fadeObs.observe(el);
});

// ─── Card mouse glow ────────────────────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

// ─── GitHub Star Counts (best-effort, no CORS issues via API) ──
async function fetchStars() {
  const badges = document.querySelectorAll('.stars-badge[data-repo]');
  for (const badge of badges) {
    try {
      const r = await fetch(`https://api.github.com/repos/${badge.dataset.repo}`, {
        headers: { Accept: 'application/vnd.github+json' }
      });
      if (r.ok) {
        const d = await r.json();
        badge.textContent = `★ ${d.stargazers_count}`;
      }
    } catch (_) { /* silent fail */ }
  }
}
fetchStars();

// ═══════════════════════════════════════════════════════════
// AI LEARNING SECTION
// ═══════════════════════════════════════════════════════════

const TOPICS = {
  transformer: renderTransformer,
  rag: renderRAG,
  prompt: renderPromptEng,
  agent: renderAgent,
  context: renderContext,
  quality: renderQuality,
  mentor: renderMentor,
};

// Tab switching
document.querySelectorAll('.ltab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.ltab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const topic = btn.dataset.topic;
    renderTopic(topic);
  });
});

function renderTopic(topic) {
  const stage = document.getElementById('learnStage');
  stage.innerHTML = '';
  stage.style.opacity = '0';
  TOPICS[topic]?.(stage);
  setTimeout(() => { stage.style.transition = 'opacity 0.4s'; stage.style.opacity = '1'; }, 10);
}

// Render on load
renderTopic('transformer');

// ─── TRANSFORMER ────────────────────────────────────────────
function renderTransformer(stage) {
  const steps = [
    {
      title: 'Step 1 — Tokenization',
      desc: 'Raw text is split into tokens (words or sub-words). Each token maps to an integer ID in the model\'s vocabulary.',
      html: `
        <div class="concept-insight">
          Input: <code style="color:#06b6d4">"The cat sat on mat"</code><br/>
          Tokens: <code style="color:#8b5cf6">["The", "cat", "sat", "on", "mat"]</code><br/>
          IDs: <code style="color:#10b981">[464, 3797, 3332, 319, 2603]</code><br/>
          <br/>
          <strong>Why it matters:</strong> GPT-4 uses ~100K token vocabulary. Claude uses ~50K.
          Longer words may split into 2-3 sub-tokens, raising your token bill.
        </div>`
    },
    {
      title: 'Step 2 — Embeddings',
      desc: 'Each token ID maps to a high-dimensional vector (e.g. 768-dim). Position encodings are added so the model understands word order.',
      html: `
        <div class="concept-insight">
          "cat" → <code style="color:#06b6d4">[0.23, -0.71, 0.88, … 768 dims]</code><br/>
          "feline" → <code style="color:#8b5cf6">[0.24, -0.69, 0.91, … ]</code> ← very close!<br/>
          "car" → <code style="color:#f59e0b">[0.91, 0.15, -0.44, … ]</code> ← far away<br/>
          <br/>
          <strong>Why it matters:</strong> Embedding distance captures semantic similarity.
          This is how the model "understands" meaning without hard-coded rules.
        </div>`
    },
    {
      title: 'Step 3 — Self-Attention (the magic)',
      desc: 'Each token asks: "which other tokens should I pay attention to?" Attention scores determine how much each token influences the others.',
      html: `
        <div style="margin-bottom:14px">
          <div style="font-size:0.8rem;color:var(--text3);margin-bottom:8px">
            Attention weights for the word <code style="color:#8b5cf6">"sat"</code>:
          </div>
          ${buildAttnBars([
            { token: 'The',  pct: 5,  color: '#6366f1' },
            { token: 'cat',  pct: 72, color: '#8b5cf6' },
            { token: 'sat',  pct: 10, color: '#06b6d4' },
            { token: 'on',   pct: 7,  color: '#6366f1' },
            { token: 'mat',  pct: 6,  color: '#6366f1' },
          ])}
        </div>
        <div class="concept-insight">
          <strong>"sat"</strong> attends heavily to <strong>"cat"</strong> (the subject) — this
          lets the model resolve "who sat?". Each of 12-96 attention heads captures different
          grammatical or semantic relationships simultaneously.
        </div>`
    },
    {
      title: 'Step 4 — Feed-Forward + Stack',
      desc: 'After attention, each token passes through a feed-forward network. This whole block is stacked 12–96 times in a Transformer.',
      html: `
        <div class="concept-insight">
          <strong>GPT-4:</strong> ~96 layers, 12,288-dim hidden, 96 heads<br/>
          <strong>Llama 3 8B:</strong> 32 layers, 4,096-dim hidden, 32 heads<br/>
          <strong>Gemini 1.5 Pro:</strong> MoE architecture, 1M token context<br/>
          <br/>
          Each layer refines the representation. Early layers = syntax.
          Late layers = semantics, reasoning, world knowledge.
        </div>`
    },
    {
      title: 'Step 5 — Output (Softmax)',
      desc: 'The final layer projects to vocabulary size, then softmax gives a probability distribution. The model samples the next token.',
      html: `
        <div class="concept-insight">
          Logits → Softmax → Token probabilities:<br/>
          <code style="color:#10b981">"on"</code> → 42.3% &nbsp;
          <code style="color:#06b6d4">"at"</code> → 31.1% &nbsp;
          <code style="color:#8b5cf6">"under"</code> → 18.4% &nbsp;
          <code style="color:#f59e0b">other</code> → 8.2%<br/>
          <br/>
          <strong>Temperature</strong> scales these logits before softmax.
          Low temp (0.1) = deterministic. High temp (1.5) = creative/random.
        </div>`
    },
  ];

  let step = 0;
  function render() {
    stage.innerHTML = `
      <div class="concept-transformer">
        <div>
          <div class="concept-title">${steps[step].title}</div>
          <div class="concept-sub" style="margin-top:8px">${steps[step].desc}</div>
        </div>
        <div class="tf-pipeline">
          ${makePipeline(step)}
        </div>
        ${steps[step].html}
        <div class="step-controls">
          <button class="step-btn" id="prevBtn" ${step === 0 ? 'disabled' : ''}>← Prev</button>
          <button class="step-btn" id="nextBtn" ${step === steps.length - 1 ? 'disabled' : ''}>Next →</button>
          <span class="step-indicator">${step + 1} / ${steps.length}</span>
        </div>
      </div>`;
    stage.querySelector('#prevBtn')?.addEventListener('click', () => { step--; render(); });
    stage.querySelector('#nextBtn')?.addEventListener('click', () => { step++; render(); });
  }
  render();
}

function makePipeline(activeStep) {
  const blocks = [
    { cls: 'b-input', icon: '📝', label: 'Input Tokens', desc: 'Raw text' },
    { cls: 'b-embed', icon: '🔢', label: 'Embeddings', desc: '768-dim vectors' },
    { cls: 'b-attn',  icon: '👁️', label: 'Self-Attention', desc: 'Multi-head' },
    { cls: 'b-ffn',   icon: '⚡', label: 'Feed-Forward', desc: 'MLP layers' },
    { cls: 'b-output',icon: '✨', label: 'Output Token', desc: 'Softmax' },
  ];
  return blocks.map((b, i) => `
    ${i > 0 ? '<div class="tf-arrow">→</div>' : ''}
    <div class="tf-block ${b.cls}" style="opacity:${i <= activeStep ? 1 : 0.3};transform:scale(${i === activeStep ? 1.08 : 1});">
      <div class="tf-block-inner">${b.icon}</div>
      <div class="tf-block-label">${b.label}</div>
      <div class="tf-block-desc">${b.desc}</div>
    </div>`).join('');
}

function buildAttnBars(tokens) {
  return `<div class="attn-visual">${tokens.map(t => `
    <div class="attn-row">
      <div class="attn-token">${t.token}</div>
      <div class="attn-bars">
        <div class="attn-bar" style="width:${t.pct * 2}px;max-width:280px;background:${t.color}22;border:1px solid ${t.color}44;color:${t.color}">
          ${t.pct}%
        </div>
      </div>
    </div>`).join('')}</div>`;
}

// ─── RAG ────────────────────────────────────────────────────
function renderRAG(stage) {
  const steps = [
    {
      active: 0,
      insight: `<strong>The Problem RAG solves:</strong> LLMs have a knowledge cutoff and can't
        access your private data. RAG (Retrieval-Augmented Generation) bridges this gap
        by fetching relevant documents at query time and injecting them into the prompt context.`,
    },
    {
      active: 1,
      insight: `<strong>Retrieval Step:</strong> Your query is embedded into a vector. A vector
        database (Pinecone, Weaviate, pgvector) finds the top-k most semantically similar
        document chunks using cosine similarity. Typical k=3–10.`,
    },
    {
      active: 2,
      insight: `<strong>Augmentation + Generation:</strong> Retrieved chunks are prepended to the
        prompt: <em>"Given these documents: [chunk1] [chunk2], answer: [user question]"</em>.
        The LLM generates a grounded answer, dramatically reducing hallucinations.`,
    },
  ];
  let step = 0;
  const rag = [
    { icon: '💬', title: 'User Query', desc: '"What is our refund policy?"', hl: false },
    { icon: '🔍', title: 'Retrieve', desc: 'Semantic vector search over knowledge base', hl: false },
    { icon: '🤖', title: 'LLM + Context', desc: 'Generate grounded response', hl: false },
  ];
  function render() {
    rag.forEach((r, i) => r.hl = i <= steps[step].active);
    stage.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:24px">
        <div>
          <div class="concept-title">Retrieval-Augmented Generation (RAG)</div>
          <div class="concept-sub" style="margin-top:8px">
            How LLMs access real-time, private, or domain-specific knowledge.
          </div>
        </div>
        <div class="rag-flow">
          ${rag.map((r, i) => `
            ${i > 0 ? '<div class="rag-arrow">→</div>' : ''}
            <div class="rag-step ${r.hl ? 'rag-highlight' : ''}" style="transition:all 0.4s">
              <div class="rag-step-icon">${r.icon}</div>
              <div class="rag-step-title">${r.title}</div>
              <div class="rag-step-desc">${r.desc}</div>
            </div>`).join('')}
        </div>
        <div class="concept-insight">${steps[step].insight}</div>
        <div class="step-controls">
          <button class="step-btn" id="prevBtn" ${step === 0 ? 'disabled' : ''}>← Prev</button>
          <button class="step-btn" id="nextBtn" ${step === steps.length - 1 ? 'disabled' : ''}>Next →</button>
          <span class="step-indicator">${step + 1} / ${steps.length}</span>
        </div>
      </div>`;
    stage.querySelector('#prevBtn')?.addEventListener('click', () => { step--; render(); });
    stage.querySelector('#nextBtn')?.addEventListener('click', () => { step++; render(); });
  }
  render();
}

// ─── PROMPT ENGINEERING ─────────────────────────────────────
function renderPromptEng(stage) {
  const techniques = [
    { icon: '🎭', label: 'Role Prompting', desc: 'You are a senior security engineer...' },
    { icon: '📝', label: 'Chain-of-Thought', desc: 'Think step-by-step...' },
    { icon: '🎯', label: 'Few-Shot', desc: 'Here are 3 examples: ...' },
    { icon: '🔒', label: 'Constraint Setting', desc: 'Respond ONLY in JSON...' },
    { icon: '🔁', label: 'Self-Reflection', desc: 'Review your answer for errors...' },
    { icon: '📐', label: 'Output Format', desc: 'Use this exact structure: ...' },
  ];
  stage.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:24px">
      <div>
        <div class="concept-title">Prompt Engineering</div>
        <div class="concept-sub" style="margin-top:8px">
          The craft of structuring inputs to maximize LLM output quality, consistency, and predictability.
        </div>
      </div>
      <div class="prompt-compare">
        <div class="prompt-box prompt-bad">
          <div class="prompt-box-header">❌ Vague Prompt</div>
          <div class="prompt-body">Write code to handle errors</div>
        </div>
        <div class="prompt-box prompt-good">
          <div class="prompt-box-header">✅ Engineered Prompt</div>
          <div class="prompt-body">You are a senior Node.js engineer.
Write an async error handler middleware
for Express that:
- Catches all thrown errors
- Returns JSON {error, code, trace}
- Logs to stderr with timestamp
- Never exposes stack traces in prod

Constraints: TypeScript, no deps beyond
express types. Max 40 lines.</div>
        </div>
      </div>
      <div>
        <div style="font-size:0.82rem;color:var(--text3);margin-bottom:10px;font-weight:600">
          KEY TECHNIQUES — click to explore:
        </div>
        <div class="prompt-techniques">
          ${techniques.map(t => `
            <div class="pt-pill" title="${t.desc}">
              <span>${t.icon}</span>
              <span>${t.label}</span>
            </div>`).join('')}
        </div>
      </div>
      <div class="concept-insight">
        <strong>PromptForge</strong> automates all 6 techniques above. It analyzes your casual
        input, adds role context, CoT triggers, constraint headers, and output format specs — 
        turning a 5-word prompt into a 200-token precision instrument that cuts response drift by 83%.
      </div>
    </div>`;

  stage.querySelectorAll('.pt-pill').forEach((pill, i) => {
    pill.addEventListener('click', () => {
      const insight = stage.querySelector('.concept-insight');
      insight.innerHTML = `<strong>${techniques[i].icon} ${techniques[i].label}:</strong> "${techniques[i].desc}"<br/><br/>
        This technique is automatically applied by <strong>PromptForge</strong> based on your input intent.`;
      stage.querySelectorAll('.pt-pill').forEach(p => p.style.borderColor = '');
      pill.style.borderColor = 'var(--accent)';
      pill.style.color = 'var(--accent)';
    });
  });
}

// ─── AI AGENTS ──────────────────────────────────────────────
function renderAgent(stage) {
  const steps = [
    {
      active: 'perceive',
      insight: `<strong>Perceive:</strong> The agent receives observations from its environment —
        user messages, tool call results, file contents, API responses. This is the agent's
        "sensory input". Modern agents use multimodal perception (text, images, structured data).`,
    },
    {
      active: 'reason',
      insight: `<strong>Reason (LLM Core):</strong> The LLM processes observations, maintains a
        mental model of the goal, selects the next action, and generates a plan. This is where
        chain-of-thought, ReAct, and tree-of-thought prompting techniques live.`,
    },
    {
      active: 'act',
      insight: `<strong>Act (Tool Use):</strong> The agent executes: calling APIs, writing files,
        running code, searching the web, or spawning sub-agents. Tool schemas must be precise —
        this is exactly what <strong>ToolGuard</strong> enforces.`,
    },
    {
      active: 'mem',
      insight: `<strong>Memory:</strong> Agents maintain 4 memory types: (1) In-context (prompt),
        (2) External (vector DB), (3) Episodic (conversation history), (4) Procedural (learned skills).
        Context limits drive innovation in context compression — see <strong>ContextSlim</strong>.`,
    },
  ];
  let step = 0;
  const nodes = [
    { id: 'perceive', cls: 'an-perceive', icon: '👁️', label: 'Perceive', desc: 'Env. observations' },
    { id: 'reason',   cls: 'an-reason',   icon: '🧠', label: 'Reason',   desc: 'LLM plan + decide' },
    { id: 'act',      cls: 'an-act',      icon: '⚡', label: 'Act',      desc: 'Tool calls' },
    { id: 'mem',      cls: 'an-mem',      icon: '💾', label: 'Memory',   desc: 'State + history' },
  ];

  function render() {
    const active = steps[step].active;
    stage.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:24px">
        <div>
          <div class="concept-title">AI Agents — The Perceive-Reason-Act Loop</div>
          <div class="concept-sub" style="margin-top:8px">
            Autonomous agents combine LLM reasoning with tool use to complete multi-step tasks.
          </div>
        </div>
        <div class="agent-loop">
          <div class="agent-loop-row">
            ${nodes.map((n, i) => `
              ${i > 0 ? `<div class="agent-edge"><span class="agent-edge-label">${['→ passes observations', '→ selects action', '→ result stored'][i-1]}</span></div>` : ''}
              <div class="agent-node ${n.cls}" style="opacity:${n.id === active ? 1 : 0.4};transform:scale(${n.id === active ? 1.1 : 1});transition:all 0.4s">
                <div class="agent-node-icon">${n.icon}</div>
                <div class="agent-node-label">${n.label}</div>
                <div class="agent-node-desc">${n.desc}</div>
              </div>`).join('')}
          </div>
          <div class="agent-vert"></div>
          <div style="text-align:center;font-size:0.7rem;color:var(--text3)">↩ Feedback loop repeats until goal is achieved</div>
        </div>
        <div class="concept-insight">${steps[step].insight}</div>
        <div class="step-controls">
          <button class="step-btn" id="prevBtn" ${step === 0 ? 'disabled' : ''}>← Prev</button>
          <button class="step-btn" id="nextBtn" ${step === steps.length - 1 ? 'disabled' : ''}>Next →</button>
          <span class="step-indicator">${step + 1} / ${steps.length}</span>
        </div>
      </div>`;
    stage.querySelector('#prevBtn')?.addEventListener('click', () => { step--; render(); });
    stage.querySelector('#nextBtn')?.addEventListener('click', () => { step++; render(); });
  }
  render();
}

// ─── CONTEXT WINDOW ─────────────────────────────────────────
function renderContext(stage) {
  const models = [
    { name: 'GPT-3.5 Turbo',    tokens: 16000,   maxK: 16,    color: '#10b981', pct: 4  },
    { name: 'GPT-4o',           tokens: 128000,  maxK: 128,   color: '#6366f1', pct: 30 },
    { name: 'Claude 3.5 Sonnet',tokens: 200000,  maxK: 200,   color: '#8b5cf6', pct: 47 },
    { name: 'Gemini 1.5 Pro',   tokens: 1000000, maxK: 1000,  color: '#06b6d4', pct: 100},
    { name: 'Llama 3.1 405B',   tokens: 128000,  maxK: 128,   color: '#f59e0b', pct: 30 },
  ];
  const breakdown = [
    { label: 'System Prompt',      color: '#6366f1', pct: 15 },
    { label: 'Chat History',       color: '#8b5cf6', pct: 40 },
    { label: 'Retrieved Docs',     color: '#06b6d4', pct: 25 },
    { label: 'Your Message',       color: '#10b981', pct: 10 },
    { label: 'Reserved Output',    color: '#f59e0b', pct: 10 },
  ];
  stage.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:24px">
      <div>
        <div class="concept-title">Context Windows — The LLM's Working Memory</div>
        <div class="concept-sub" style="margin-top:8px">
          The context window is how many tokens the model can "see" at once — your inputs + its outputs all count.
        </div>
      </div>
      <div class="ctx-visual">
        ${models.map(m => `
          <div>
            <div class="ctx-bar-label">
              <span class="model-name">${m.name}</span>
              <span class="token-count">${m.maxK}K tokens</span>
            </div>
            <div class="ctx-bar-track">
              <div class="ctx-bar-fill" style="width:${m.pct}%;background:${m.color}44;border:1px solid ${m.color}66;color:${m.color}">
                ${m.pct > 8 ? m.name.split(' ')[0] : ''}
              </div>
            </div>
          </div>`).join('')}
      </div>
      <div class="concept-insight">
        <strong>How your 128K tokens are typically spent:</strong>
        <div class="ctx-breakdown" style="margin-top:10px">
          ${breakdown.map(b => `
            <div class="ctx-breakdown-item">
              <div class="ctx-dot" style="background:${b.color}"></div>
              <span>${b.label} (~${b.pct}%)</span>
            </div>`).join('')}
        </div>
        <br/>
        <strong>ContextSlim</strong> compresses your codebase context from ~50K tokens → ~5K tokens
        using AST extraction, freeing 90% of the window for actual reasoning.
      </div>
    </div>`;
}

// ─── QUALITY GATES ──────────────────────────────────────────
function renderQuality(stage) {
  const steps = [
    {
      title: 'A quality gate is a decision, not a dashboard',
      desc: 'Green checks are worthless if nobody knows what they protect. Start from the risk, then pick the check.',
      html: `<div class="concept-insight">Ask: <strong>what would hurt a customer if this shipped broken?</strong> That answer becomes the gate. Everything else is noise you can run later.</div>`
    },
    {
      title: 'Three speeds of proof',
      desc: 'One pipeline cannot do everything. Split signal by how fast it must be.',
      html: `<div class="rag-flow">
        <div class="rag-step rag-highlight"><div class="rag-step-icon">⚡</div><div class="rag-step-title">PR (minutes)</div><div class="rag-step-desc">Lint, unit, API contracts</div></div>
        <div class="rag-arrow">→</div>
        <div class="rag-step rag-highlight"><div class="rag-step-icon">🎯</div><div class="rag-step-title">Merge</div><div class="rag-step-desc">Critical journeys + smoke</div></div>
        <div class="rag-arrow">→</div>
        <div class="rag-step rag-highlight"><div class="rag-step-icon">🔬</div><div class="rag-step-title">Cadence</div><div class="rag-step-desc">Perf, security, data jobs</div></div>
      </div>
      <div class="concept-insight" style="margin-top:16px"><strong>Rule:</strong> if a check is slow and flaky, it does not belong on every commit. Promote it when it is honest.</div>`
    },
    {
      title: 'Flakes are a leadership problem',
      desc: 'A 5% flake rate trains the team to ignore red builds. That is culture, not just CI.',
      html: `<div class="concept-insight">Quarantine loudly. Assign an owner. Celebrate deletes. I treat a deleted flake as a bigger win than a new 200-line UI script nobody trusts.</div>`
    },
  ];
  let step = 0;
  function render() {
    stage.innerHTML = `
      <div class="concept-transformer">
        <div>
          <div class="concept-title">${steps[step].title}</div>
          <div class="concept-sub" style="margin-top:8px">${steps[step].desc}</div>
        </div>
        ${steps[step].html}
        <div class="step-controls">
          <button class="step-btn" id="prevBtn" ${step === 0 ? 'disabled' : ''}>← Prev</button>
          <button class="step-btn" id="nextBtn" ${step === steps.length - 1 ? 'disabled' : ''}>Next →</button>
          <span class="step-indicator">${step + 1} / ${steps.length}</span>
        </div>
      </div>`;
    stage.querySelector('#prevBtn')?.addEventListener('click', () => { step--; render(); });
    stage.querySelector('#nextBtn')?.addEventListener('click', () => { step++; render(); });
  }
  render();
}

// ─── MENTORING ──────────────────────────────────────────────
function renderMentor(stage) {
  const steps = [
    {
      title: 'Boss vs mentor',
      desc: 'A boss needs the task done. A mentor needs the person able to do the next task without them.',
      html: `<div class="prompt-compare">
        <div class="prompt-box prompt-bad">
          <div class="prompt-box-header">Boss move</div>
          <div class="prompt-body">"Just follow my framework.
I'll review everything.
Don't merge until I say so."</div>
        </div>
        <div class="prompt-box prompt-good">
          <div class="prompt-box-header">Mentor move</div>
          <div class="prompt-body">"Here is the invariant this
test must protect. You design
the check. We'll review the
oracle together, then you own it."</div>
        </div>
      </div>`
    },
    {
      title: 'The 10-minute question ladder',
      desc: 'When someone is stuck, questions transfer skill. Answers transfer dependence.',
      html: `<div class="concept-insight">
        1. What did you expect?<br/>
        2. What did you observe?<br/>
        3. Where is the first disagreement?<br/>
        4. What would you try if I left the room?<br/><br/>
        <strong>Only then</strong> offer a hint. If you grab the keyboard first, you stole the learning.
      </div>`
    },
    {
      title: 'Make growth visible',
      desc: 'People do not grow from annual reviews. They grow from scoped trust.',
      html: `<div class="concept-insight">
        Keep a one-page map: <strong>Now</strong> (evidence) → <strong>Next</strong> (90-day skill) → <strong>Practice</strong> (a real project they own).<br/><br/>
        Then actually give them that project. Mentorship without delegated risk is just a pep talk.
      </div>`
    },
  ];
  let step = 0;
  function render() {
    stage.innerHTML = `
      <div class="concept-transformer">
        <div>
          <div class="concept-title">${steps[step].title}</div>
          <div class="concept-sub" style="margin-top:8px">${steps[step].desc}</div>
        </div>
        ${steps[step].html}
        <div class="step-controls">
          <button class="step-btn" id="prevBtn" ${step === 0 ? 'disabled' : ''}>← Prev</button>
          <button class="step-btn" id="nextBtn" ${step === steps.length - 1 ? 'disabled' : ''}>Next →</button>
          <span class="step-indicator">${step + 1} / ${steps.length}</span>
        </div>
      </div>`;
    stage.querySelector('#prevBtn')?.addEventListener('click', () => { step--; render(); });
    stage.querySelector('#nextBtn')?.addEventListener('click', () => { step++; render(); });
  }
  render();
}

// ─── Field notes accordion ──────────────────────────────────
document.querySelectorAll('.note-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.note-card');
    const open = card.classList.contains('open');
    document.querySelectorAll('.note-card').forEach(c => {
      c.classList.remove('open');
      c.querySelector('.note-toggle')?.setAttribute('aria-expanded', 'false');
      const chev = c.querySelector('.note-chevron');
      if (chev) chev.textContent = '+';
    });
    if (!open) {
      card.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      const chev = btn.querySelector('.note-chevron');
      if (chev) chev.textContent = '−';
    }
  });
});
