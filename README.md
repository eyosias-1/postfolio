# Senior Full-Stack & Systems Architect Portfolio

A production-grade, zero-fluff web application embodying the technical standards, algorithmic guarantees, discrete mathematics foundations, and multilingual capabilities specified in `portfolio.md`.

---

## 1. Architectural Highlights

- **Aesthetics & UI/UX:** Sleek, high-contrast dark theme (OLED carbon `#07090e`), glassmorphic panels with backdrop filters, fluid animations, responsive layouts (mobile, tablet, desktop 4K), and dynamic particle graph mesh background.
- **Multilingual Support (Native Dialects):**
  - **English (EN)**
  - **Amharic (አማርኛ - AM)**
  - **Afaan Oromoo (ORO)**
  - Live stateful language switching across all sections, telemetry, controls, and terminal prompts.
- **Zero External Runtime Dependencies:** Pure HTML5, Modern CSS3, and ES6+ JavaScript modules. Can be opened immediately by double-clicking `index.html` in any modern web browser.

---

## 2. Core Modules & Algorithmic Complexities

### A. Data Structures & Algorithms Lab (`js/algorithms.js`)
| Structure / Routine | Time Complexity | Space Complexity | Description |
| :--- | :--- | :--- | :--- |
| **Binary Search Tree (BST)** | $\mathcal{O}(\log n)$ avg, $\mathcal{O}(n)$ worst | $\mathcal{O}(n)$ | Insert, Search with path trace, In-order successor Deletion, In-order traversal. |
| **Dijkstra's Shortest Path** | $\mathcal{O}((V + E) \log V)$ | $\mathcal{O}(V)$ | Min-Heap priority queue implementation with step trace and edge relaxation. |
| **Kahn's Topological Sort** | $\mathcal{O}(V + E)$ | $\mathcal{O}(V)$ | Cycle detection and linear ordering for Directed Acyclic Graphs (DAG). |
| **LRU Cache** | $\mathcal{O}(1)$ get & put | $\mathcal{O}(\text{capacity})$ | Doubly Linked List + Hash Map with sentinel head/tail nodes and telemetry. |
| **Circular Ring Buffer** | $\mathcal{O}(1)$ push & pop | $\mathcal{O}(\text{capacity})$ | Fixed-size bounded ring buffer with atomic pointer wrapping and overflow detection. |

### B. Applied Mathematics & Discrete Logic (`js/math.js`)
- **Arbitrary Precision Combinatorics:**
  - Factorials $n!$ with `BigInt` safeguards against 64-bit IEEE-754 float overflow.
  - Permutations $P(n, r) = \frac{n!}{(n - r)!}$.
  - Combinations $\binom{n}{r} = \frac{n!}{r!(n - r)!}$.
  - Binomial Distributions $P(X = k) = \binom{n}{k} p^k (1-p)^{n-k}$.
- **Graph Invariants & Polyhedral Topology:**
  - Euler's Planar Characteristic: $V - E + F = 2$.
  - Handshaking Lemma: $\sum_{v \in V} \deg(v) = 2|E|$.
- **Propositional Logic Truth Table Synthesizer:**
  - Evaluates formulas with operators $\land, \lor, \neg, \rightarrow, \leftrightarrow, \oplus$.
  - Generates full $2^k$ truth table models and classifies formulas into **Tautology**, **Contradiction**, or **Contingency**.

### C. Interactive Staff Systems Terminal (`js/terminal.js`)
Terminal emulator responding to commands:
- `help`: List available commands.
- `whoami`: Display Staff Engineer identity, background, and research manifesto.
- `skills`: Display asymptotic proficiencies and technical core competencies.
- `tree <insert|search|delete|inorder> [value]`: Interactively manipulate the BST.
- `dijkstra <source> <target>`: Compute shortest path and update visual graph.
- `math <comb|perm|logic> [args]`: Execute mathematical computations in the terminal.
- `cache <put|get|status> [args]`: Query and mutate the live LRU cache.
- `ring <push|pop> [val]`: Enqueue and dequeue from the circular ring buffer.
- `projects`: List distributed systems and architecture portfolio.
- `lang <en|am|om>`: Switch application dialect via CLI.
- `clear`: Clear console output.

---

## 3. Project Directory Structure

```
PORTFOLLIO/
├── index.html          # Semantic HTML5 architecture and accessible layout
├── portfolio.md        # Master specification & engineer persona prompt
├── README.md           # Technical documentation and complexity proofs
├── css/
│   └── style.css       # Glassmorphic dark styling, typography, responsive rules
├── js/
│   ├── algorithms.js   # Pure, decoupled algorithmic & data structure engine
│   ├── math.js         # Discrete mathematics & propositional logic engine
│   ├── visualizer.js   # Dynamic SVG/Canvas renderers & particle mesh background
│   ├── terminal.js     # Interactive CLI terminal emulator
│   ├── i18n.js         # English, Amharic (አማርኛ), and Afaan Oromoo localization
│   └── app.js          # Master coordinator & event binding
└── assets/             # Media and static assets directory
```

---

## 4. How to Run

1. Open `index.html` directly in any web browser (Chrome, Edge, Firefox, Safari, Brave):
   ```powershell
   Start-Process "index.html"
   ```
2. No Node.js, Python, or package manager installation required. All routines execute client-side with zero runtime dependencies.
"# postfolio" 
