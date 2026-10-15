/**
 * @file terminal.js
 * @description Interactive Staff Systems Command-Line Interface (CLI Emulator)
 * Provides direct terminal-driven interaction with all portfolio systems and algorithmic modules.
 */

'use strict';

class SystemsTerminal {
    constructor(terminalElementId, inputElementId, outputElementId, appState) {
        this.container = document.getElementById(terminalElementId);
        this.input = document.getElementById(inputElementId);
        this.output = document.getElementById(outputElementId);
        this.appState = appState;

        this.history = [];
        this.historyIndex = -1;

        if (this.input) {
            this.input.addEventListener('keydown', (e) => this._handleInputKey(e));
        }

        // Auto focus when clicking inside terminal body
        if (this.container) {
            this.container.addEventListener('click', () => {
                if (this.input) this.input.focus();
            });
        }
    }

    printLine(text, cssClass = '') {
        const line = document.createElement('div');
        line.className = `term-line ${cssClass}`;
        line.innerHTML = text;
        this.output.appendChild(line);
        this.container.scrollTop = this.container.scrollHeight;
    }

    clear() {
        this.output.innerHTML = '';
    }

    run(cmd) {
        const clean = cmd.trim();
        if (!clean) return;
        this.history.push(clean);
        this.historyIndex = this.history.length;
        this.printLine(`<span class="term-prompt">sys-arch@kernel:~$</span> <span class="term-cmd">${this._escape(clean)}</span>`);
        this.execute(clean);
        if (this.input) this.input.value = '';
    }

    _handleInputKey(e) {
        if (e.key === 'Enter') {
            const cmd = this.input.value.trim();
            if (cmd) {
                this.run(cmd);
            }
        } else if (e.key === 'ArrowUp') {
            if (this.history.length > 0 && this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.history[this.historyIndex];
            }
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                this.input.value = this.history[this.historyIndex];
            } else {
                this.historyIndex = this.history.length;
                this.input.value = '';
            }
            e.preventDefault();
        }
    }

    execute(cmdString) {
        const parts = cmdString.split(/\s+/);
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        switch (command) {
            case 'help':
                this.printLine(`
<div class="term-help-grid">
  <div><span class="cmd-cyan">whoami</span></div><div>Staff Engineer identity & research manifesto</div>
  <div><span class="cmd-cyan">skills</span></div><div>Inspect core competencies & O(n) proficiencies</div>
  <div><span class="cmd-cyan">tree &lt;op&gt; [args]</span></div><div>Tree ops: insert &lt;n&gt;, search &lt;n&gt;, delete &lt;n&gt;, inorder</div>
  <div><span class="cmd-cyan">dijkstra &lt;A&gt; &lt;F&gt;</span></div><div>Compute shortest path in O((V+E) log V)</div>
  <div><span class="cmd-cyan">math &lt;op&gt; [args]</span></div><div>Math ops: comb &lt;n&gt; &lt;r&gt;, perm &lt;n&gt; &lt;r&gt;, logic &lt;expr&gt;</div>
  <div><span class="cmd-cyan">cache &lt;op&gt; [args]</span></div><div>Cache ops: put &lt;k&gt; &lt;v&gt;, get &lt;k&gt;, status</div>
  <div><span class="cmd-cyan">ring &lt;push|pop&gt;</span></div><div>Ring buffer operations: push &lt;val&gt;, pop</div>
  <div><span class="cmd-cyan">projects</span></div><div>List flagship distributed systems architectures</div>
  <div><span class="cmd-cyan">lang &lt;en|am|om&gt;</span></div><div>Switch dialect: English, Amharic, Afaan Oromoo</div>
  <div><span class="cmd-cyan">clear</span></div><div>Flush terminal output buffer</div>
</div>`);
                break;

            case 'whoami':
                this.printLine(`
<div class="term-box">
  <div class="font-bold text-accent">ROLE: Staff Software Engineer & Applied Computer Scientist</div>
  <div>Core: Algorithms, Graph Theory, Discrete Math, Distributed Systems.</div>
  <div>Philosophy: Zero fluff, formal Big-O proofs, memory safety, lock-free concurrency.</div>
  <div>Location: Addis Ababa, Ethiopia / Global Remote Systems Architecture</div>
</div>`);
                break;

            case 'skills':
                this.printLine(`
<div class="term-skills">
  <div>• <span class="text-accent">Algorithms & DS:</span> Balanced Trees, Graph Invariants, Heaps, Hash Tables, Flow Networks</div>
  <div>• <span class="text-accent">Applied Math:</span> Combinatorics, Polyhedral Euler Characteristic, Propositional Calculus</div>
  <div>• <span class="text-accent">Distributed Systems:</span> Raft Consensus, LSM-Tree Storage, Gossip Protocols, Zero-Copy I/O</div>
  <div>• <span class="text-accent">Frontend/UX:</span> Reactive Glassmorphic Interfaces, Custom Visualizers, Accessible Web</div>
</div>`);
                break;

            case 'tree':
                this._handleTreeCommand(args);
                break;

            case 'dijkstra':
                this._handleDijkstraCommand(args);
                break;

            case 'math':
                this._handleMathCommand(args);
                break;

            case 'cache':
                this._handleCacheCommand(args);
                break;

            case 'ring':
                this._handleRingCommand(args);
                break;

            case 'projects':
                this.printLine(`
<div>[1] <strong>AetherKV:</strong> Partitioned Raft Key-Value Store (LSM-tree engine, sub-ms tail latency)</div>
<div>[2] <strong>ChronosEngine:</strong> SIMD-accelerated HNSW High-Dimensional Vector Search</div>
<div>[3] <strong>GraphQ:</strong> Automated Graph Invariant & Planarity Theorem Verification Engine</div>`);
                break;

            case 'lang':
                if (args.length === 0 || !['en', 'am', 'om'].includes(args[0].toLowerCase())) {
                    this.printLine(`Usage: lang &lt;en | am | om&gt;`, 'text-amber');
                } else {
                    const target = args[0].toLowerCase();
                    window.i18n.setLanguage(target);
                    this.printLine(`Locale successfully updated to: <strong>${target.toUpperCase()}</strong>`, 'text-emerald');
                }
                break;

            case 'clear':
                this.clear();
                break;

            default:
                this.printLine(`Unknown command: '${this._escape(command)}'. Type <span class="cmd-cyan">help</span> for valid routines.`, 'text-rose');
        }
    }

    _handleTreeCommand(args) {
        if (!args.length) {
            this.printLine('Usage: tree &lt;insert | search | delete | inorder&gt; [value]', 'text-amber');
            return;
        }
        const sub = args[0].toLowerCase();
        const bst = this.appState.bst;

        if (sub === 'insert') {
            const val = parseInt(args[1], 10);
            if (isNaN(val)) return this.printLine('Error: Value must be an integer.', 'text-rose');
            const ok = bst.insert(val);
            Visualizer.renderBST(bst, 'bst-container', val);
            this.printLine(ok ? `Inserted key ${val}. [O(log N) runtime]` : `Duplicate key ${val} rejected.`, ok ? 'text-emerald' : 'text-amber');
        } else if (sub === 'search') {
            const val = parseInt(args[1], 10);
            if (isNaN(val)) return this.printLine('Error: Value must be an integer.', 'text-rose');
            const { found, steps } = bst.search(val);
            Visualizer.renderBST(bst, 'bst-container', found ? val : null, steps);
            this.printLine(found ? `Key ${val} found! Search path: [${steps.join(' -> ')}]` : `Key ${val} not found in tree. Path: [${steps.join(' -> ')}]`, found ? 'text-emerald' : 'text-amber');
        } else if (sub === 'delete') {
            const val = parseInt(args[1], 10);
            if (isNaN(val)) return this.printLine('Error: Value must be an integer.', 'text-rose');
            const ok = bst.delete(val);
            Visualizer.renderBST(bst, 'bst-container');
            this.printLine(ok ? `Deleted key ${val}. [O(log N) runtime]` : `Key ${val} does not exist.`, ok ? 'text-emerald' : 'text-amber');
        } else if (sub === 'inorder') {
            const order = bst.inOrder();
            this.printLine(`BST In-Order (Sorted): [${order.join(', ')}]`);
        }
    }

    _handleDijkstraCommand(args) {
        const u = (args[0] || 'A').toUpperCase();
        const v = (args[1] || 'F').toUpperCase();
        const g = this.appState.graph;
        try {
            const res = g.dijkstra(u, v);
            Visualizer.renderGraph(g, 'graph-container', res.path);
            this.printLine(`Dijkstra Shortest Path (${u} ➔ ${v}): <strong>${res.path.join(' ➔ ')}</strong> (Total Cost: ${res.distances[v]})`, 'text-emerald');
        } catch (err) {
            this.printLine(`Dijkstra Error: ${err.message}`, 'text-rose');
        }
    }

    _handleMathCommand(args) {
        if (!args.length) {
            this.printLine('Usage: math &lt;comb n r | perm n r | logic expr&gt;', 'text-amber');
            return;
        }
        const sub = args[0].toLowerCase();
        if (sub === 'comb') {
            const n = parseInt(args[1], 10);
            const r = parseInt(args[2], 10);
            const res = DiscreteMathEngine.combinations(n, r);
            this.printLine(`Combinations C(${n}, ${r}) = <strong>${res.toString()}</strong>`, 'text-emerald');
        } else if (sub === 'perm') {
            const n = parseInt(args[1], 10);
            const r = parseInt(args[2], 10);
            const res = DiscreteMathEngine.permutations(n, r);
            this.printLine(`Permutations P(${n}, ${r}) = <strong>${res.toString()}</strong>`, 'text-emerald');
        } else if (sub === 'logic') {
            const expr = args.slice(1).join(' ');
            try {
                const tt = DiscreteMathEngine.generateTruthTable(expr);
                this.printLine(`Expression: <code>${expr}</code> | Classification: <strong>${tt.classification}</strong>`, 'text-emerald');
            } catch (err) {
                this.printLine(`Logic parsing failed: ${err.message}`, 'text-rose');
            }
        }
    }

    _handleCacheCommand(args) {
        if (!args.length) {
            this.printLine('Usage: cache &lt;put k v | get k | status&gt;', 'text-amber');
            return;
        }
        const sub = args[0].toLowerCase();
        const cache = this.appState.lruCache;
        if (sub === 'put') {
            const k = args[1];
            const v = args[2] || 'payload';
            const evicted = cache.put(k, v);
            Visualizer.renderLRUCache(cache, 'lru-container', k);
            this.printLine(`Inserted (${k}: "${v}"). ${evicted ? `[Evicted LRU key: ${evicted}]` : ''}`, 'text-emerald');
        } else if (sub === 'get') {
            const k = args[1];
            const val = cache.get(k);
            Visualizer.renderLRUCache(cache, 'lru-container', k);
            this.printLine(val !== undefined ? `Cache HIT: key "${k}" => "${val}"` : `Cache MISS: key "${k}" not found.`, val !== undefined ? 'text-emerald' : 'text-amber');
        } else if (sub === 'status') {
            this.printLine(`LRU Cache: Size=${cache.map.size}/${cache.capacity}, Hits=${cache.metrics.hits}, Misses=${cache.metrics.misses}, Hit Ratio=${cache.getHitRatio()}`);
        }
    }

    _handleRingCommand(args) {
        const sub = (args[0] || '').toLowerCase();
        const ring = this.appState.ringBuffer;
        if (sub === 'push') {
            const val = args[1] || `pkt_${Math.floor(Math.random() * 900 + 100)}`;
            const res = ring.enqueue(val);
            Visualizer.renderRingBuffer(ring, 'ring-container');
            this.printLine(`Enqueued "${val}". ${res.overwritten ? '[OVERFLOW: Head advanced]' : '[Normal]'}`);
        } else if (sub === 'pop') {
            const popped = ring.dequeue();
            Visualizer.renderRingBuffer(ring, 'ring-container');
            this.printLine(popped !== null ? `Dequeued: "${popped}"` : 'Buffer is empty (Underflow).', popped !== null ? 'text-emerald' : 'text-amber');
        } else {
            this.printLine('Usage: ring push &lt;value&gt; | ring pop', 'text-amber');
        }
    }

    _escape(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
}
