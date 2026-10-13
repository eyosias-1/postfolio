/**
 * @file app.js
 * @description Master Application Coordinator & Reactive UI Controller
 * Binds data structures, mathematical engines, visualizers, and user events.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // ========================================================================
    // 1. STATE INITIALIZATION
    // ========================================================================
    const appState = {
        bst: new BinarySearchTree(),
        graph: new Graph(),
        lruCache: new LRUCache(4),
        ringBuffer: new CircularRingBuffer(8)
    };

    // Populate Initial BST
    [50, 30, 70, 20, 40, 60, 80].forEach(val => appState.bst.insert(val));

    // Populate Initial Network Graph
    appState.graph.addEdge('A', 'B', 4);
    appState.graph.addEdge('A', 'C', 2);
    appState.graph.addEdge('B', 'C', 1);
    appState.graph.addEdge('B', 'D', 5);
    appState.graph.addEdge('C', 'D', 8);
    appState.graph.addEdge('C', 'E', 10);
    appState.graph.addEdge('D', 'E', 2);
    appState.graph.addEdge('D', 'F', 6);
    appState.graph.addEdge('E', 'F', 3);

    // Populate Initial LRU Cache
    appState.lruCache.put('sys.arch', 'ARM64');
    appState.lruCache.put('node.alpha', '10.0.0.1');
    appState.lruCache.put('raft.term', 42);

    // Populate Initial Ring Buffer
    appState.ringBuffer.enqueue('SYN_ACK');
    appState.ringBuffer.enqueue('REQ_001');
    appState.ringBuffer.enqueue('PAYLOAD');

    // ========================================================================
    // 2. RENDER INITIAL VISUALS
    // ========================================================================
    Visualizer.initBackgroundMesh('mesh-canvas');
    Visualizer.renderBST(appState.bst, 'bst-container');
    Visualizer.renderGraph(appState.graph, 'graph-container');
    Visualizer.renderLRUCache(appState.lruCache, 'lru-container');
    Visualizer.renderRingBuffer(appState.ringBuffer, 'ring-container');

    // ========================================================================
    // 3. I18N INITIALIZATION & EVENTS
    // ========================================================================
    i18n.applyLanguage();

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = e.currentTarget.getAttribute('data-lang');
            i18n.setLanguage(lang);
        });
    });

    // ========================================================================
    // 4. INTERACTIVE TAB SWITCHING
    // ========================================================================
    const tabButtons = document.querySelectorAll('.lab-tab-btn');
    const tabPanes = document.querySelectorAll('.lab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetPane = document.getElementById(targetId);
            if (targetPane) targetPane.classList.add('active');

            // Trigger re-render of canvas/svg elements on tab change
            setTimeout(() => {
                Visualizer.renderBST(appState.bst, 'bst-container');
                Visualizer.renderGraph(appState.graph, 'graph-container');
                Visualizer.renderLRUCache(appState.lruCache, 'lru-container');
                Visualizer.renderRingBuffer(appState.ringBuffer, 'ring-container');
            }, 50);
        });
    });

    // ========================================================================
    // 5. BST CONTROLS
    // ========================================================================
    const bstInput = document.getElementById('bst-val-input');
    const bstInsertBtn = document.getElementById('bst-insert-btn');
    const bstSearchBtn = document.getElementById('bst-search-btn');
    const bstDeleteBtn = document.getElementById('bst-delete-btn');
    const bstClearBtn = document.getElementById('bst-clear-btn');
    const bstTelemetry = document.getElementById('bst-telemetry');

    const updateBSTTelemetry = (msg, status = 'info') => {
        if (!bstTelemetry) return;
        const colorClass = status === 'success' ? 'text-emerald' : status === 'warn' ? 'text-amber' : status === 'error' ? 'text-rose' : 'text-cyan';
        bstTelemetry.innerHTML = `<span class="${colorClass}">${msg}</span> | <span class="mono">In-Order: [${appState.bst.inOrder().join(', ')}]</span>`;
    };

    updateBSTTelemetry('BST Initialized with 7 nodes.');

    if (bstInsertBtn) {
        bstInsertBtn.addEventListener('click', () => {
            const val = parseInt(bstInput.value, 10);
            if (isNaN(val)) return updateBSTTelemetry('Please input a valid integer.', 'warn');
            const ok = appState.bst.insert(val);
            Visualizer.renderBST(appState.bst, 'bst-container', val);
            bstInput.value = '';
            updateBSTTelemetry(ok ? `Inserted key ${val} in O(log N) time.` : `Key ${val} already exists.`, ok ? 'success' : 'warn');
        });
    }

    if (bstSearchBtn) {
        bstSearchBtn.addEventListener('click', () => {
            const val = parseInt(bstInput.value, 10);
            if (isNaN(val)) return updateBSTTelemetry('Please input a valid integer to search.', 'warn');
            const { found, steps } = appState.bst.search(val);
            Visualizer.renderBST(appState.bst, 'bst-container', found ? val : null);
            updateBSTTelemetry(found ? `Found key ${val}! Path: ${steps.join(' ➔ ')}` : `Key ${val} NOT in tree. Checked: ${steps.join(' ➔ ')}`, found ? 'success' : 'warn');
        });
    }

    if (bstDeleteBtn) {
        bstDeleteBtn.addEventListener('click', () => {
            const val = parseInt(bstInput.value, 10);
            if (isNaN(val)) return updateBSTTelemetry('Please input an integer to delete.', 'warn');
            const ok = appState.bst.delete(val);
            Visualizer.renderBST(appState.bst, 'bst-container');
            bstInput.value = '';
            updateBSTTelemetry(ok ? `Deleted key ${val} in O(log N) time.` : `Key ${val} not found.`, ok ? 'success' : 'warn');
        });
    }

    if (bstClearBtn) {
        bstClearBtn.addEventListener('click', () => {
            appState.bst.clear();
            Visualizer.renderBST(appState.bst, 'bst-container');
            updateBSTTelemetry('Tree cleared. Size = 0.', 'warn');
        });
    }

    // ========================================================================
    // 6. GRAPH & DIJKSTRA CONTROLS
    // ========================================================================
    const graphStartSel = document.getElementById('graph-start');
    const graphEndSel = document.getElementById('graph-end');
    const graphRunBtn = document.getElementById('graph-run-btn');
    const graphTopoBtn = document.getElementById('graph-topo-btn');
    const graphTelemetry = document.getElementById('graph-telemetry');

    if (graphRunBtn) {
        graphRunBtn.addEventListener('click', () => {
            const start = graphStartSel.value;
            const end = graphEndSel.value;
            try {
                const res = appState.graph.dijkstra(start, end);
                Visualizer.renderGraph(appState.graph, 'graph-container', res.path);
                if (graphTelemetry) {
                    graphTelemetry.innerHTML = `
                        <div class="telemetry-block text-emerald">
                            <strong>Shortest Path (${start} ➔ ${end}):</strong> [${res.path.join(' ➔ ')}]
                            <span class="ml-4">Cumulative Weight: <strong>${res.distances[end]}</strong></span>
                            <span class="ml-4 text-dim">Time Complexity: O((V + E) log V)</span>
                        </div>`;
                }
            } catch (err) {
                if (graphTelemetry) graphTelemetry.innerHTML = `<span class="text-rose">Error: ${err.message}</span>`;
            }
        });
    }

    if (graphTopoBtn) {
        graphTopoBtn.addEventListener('click', () => {
            const res = appState.graph.topologicalSort();
            if (graphTelemetry) {
                graphTelemetry.innerHTML = `
                    <div class="telemetry-block ${res.hasCycle ? 'text-amber' : 'text-emerald'}">
                        <strong>Topological Order (Kahn's O(V+E)):</strong> 
                        ${res.hasCycle ? 'Contains Cycle (Not a DAG)' : `[${res.sortedOrder.join(' ➔ ')}]`}
                    </div>`;
            }
        });
    }

    // ========================================================================
    // 7. LRU CACHE CONTROLS
    // ========================================================================
    const lruKeyInput = document.getElementById('lru-key-input');
    const lruValInput = document.getElementById('lru-val-input');
    const lruPutBtn = document.getElementById('lru-put-btn');
    const lruGetBtn = document.getElementById('lru-get-btn');
    const lruMetrics = document.getElementById('lru-metrics');

    const updateLRUMetrics = () => {
        if (!lruMetrics) return;
        const cache = appState.lruCache;
        lruMetrics.innerHTML = `
            <span>Capacity: <strong>${cache.capacity}</strong></span>
            <span>Size: <strong>${cache.map.size}</strong></span>
            <span>Hits: <strong class="text-emerald">${cache.metrics.hits}</strong></span>
            <span>Misses: <strong class="text-rose">${cache.metrics.misses}</strong></span>
            <span>Hit Ratio: <strong>${(cache.getHitRatio() * 100).toFixed(1)}%</strong></span>`;
    };

    updateLRUMetrics();

    if (lruPutBtn) {
        lruPutBtn.addEventListener('click', () => {
            const k = lruKeyInput.value.trim();
            const v = lruValInput.value.trim() || 'payload';
            if (!k) return;
            const evicted = appState.lruCache.put(k, v);
            Visualizer.renderLRUCache(appState.lruCache, 'lru-container');
            updateLRUMetrics();
            lruKeyInput.value = '';
            lruValInput.value = '';
        });
    }

    if (lruGetBtn) {
        lruGetBtn.addEventListener('click', () => {
            const k = lruKeyInput.value.trim();
            if (!k) return;
            const val = appState.lruCache.get(k);
            Visualizer.renderLRUCache(appState.lruCache, 'lru-container');
            updateLRUMetrics();
        });
    }

    // ========================================================================
    // 8. RING BUFFER CONTROLS
    // ========================================================================
    const ringPushBtn = document.getElementById('ring-push-btn');
    const ringPopBtn = document.getElementById('ring-pop-btn');
    const ringTelemetry = document.getElementById('ring-telemetry');

    if (ringPushBtn) {
        ringPushBtn.addEventListener('click', () => {
            const packet = `PKT_${Math.floor(Math.random() * 899 + 100)}`;
            const res = appState.ringBuffer.enqueue(packet);
            Visualizer.renderRingBuffer(appState.ringBuffer, 'ring-container');
            if (ringTelemetry) {
                ringTelemetry.innerHTML = res.overwritten
                    ? `<span class="text-amber">Enqueued ${packet} (Buffer Full: Head pointer overwritten in O(1))</span>`
                    : `<span class="text-emerald">Enqueued ${packet} at write cursor [O(1)]</span>`;
            }
        });
    }

    if (ringPopBtn) {
        ringPopBtn.addEventListener('click', () => {
            const popped = appState.ringBuffer.dequeue();
            Visualizer.renderRingBuffer(appState.ringBuffer, 'ring-container');
            if (ringTelemetry) {
                ringTelemetry.innerHTML = popped !== null
                    ? `<span class="text-cyan">Dequeued ${popped} from read cursor [O(1)]</span>`
                    : `<span class="text-rose">Underflow: Buffer is empty.</span>`;
            }
        });
    }

    // ========================================================================
    // 9. DISCRETE MATHEMATICS CONTROLS
    // ========================================================================
    const nInput = document.getElementById('math-n');
    const rInput = document.getElementById('math-r');
    const calcMathBtn = document.getElementById('math-calc-btn');
    const mathResults = document.getElementById('math-results');

    if (calcMathBtn) {
        calcMathBtn.addEventListener('click', () => {
            const n = parseInt(nInput.value, 10);
            const r = parseInt(rInput.value, 10);

            try {
                const factN = DiscreteMathEngine.factorial(n);
                const perm = DiscreteMathEngine.permutations(n, r);
                const comb = DiscreteMathEngine.combinations(n, r);
                const binom = DiscreteMathEngine.binomialProbability(n, r, 0.5);

                mathResults.innerHTML = `
                    <div class="math-result-card">
                        <div class="math-result-item">
                            <span class="label mono">Factorial n! = ${n}!</span>
                            <span class="value text-accent mono">${factN.toString().length > 30 ? factN.toString().slice(0, 27) + '...' : factN.toString()}</span>
                        </div>
                        <div class="math-result-item">
                            <span class="label mono">Permutations P(${n}, ${r})</span>
                            <span class="value text-emerald mono">${perm.toString()}</span>
                        </div>
                        <div class="math-result-item">
                            <span class="label mono">Combinations C(${n}, ${r})</span>
                            <span class="value text-purple mono">${comb.toString()}</span>
                        </div>
                        <div class="math-result-item">
                            <span class="label mono">Binomial P(X=${r} | p=0.5)</span>
                            <span class="value text-cyan mono">${binom.toFixed(6)}</span>
                        </div>
                    </div>`;
            } catch (err) {
                mathResults.innerHTML = `<span class="text-rose">Math Error: ${err.message}</span>`;
            }
        });
    }

    // Propositional Logic Truth Table Synthesizer
    const logicInput = document.getElementById('logic-expr-input');
    const logicBtn = document.getElementById('logic-eval-btn');
    const logicTableContainer = document.getElementById('logic-table-container');

    if (logicBtn) {
        logicBtn.addEventListener('click', () => {
            const expr = logicInput.value.trim();
            try {
                const tt = DiscreteMathEngine.generateTruthTable(expr);
                let tableHtml = `
                    <div class="truth-table-wrapper">
                        <div class="classification-badge ${tt.classification.includes('Tautology') ? 'tautology' : tt.classification.includes('Contradiction') ? 'contradiction' : 'contingency'}">
                            Classification: <strong>${tt.classification}</strong> (Valid Models: ${tt.validModelsCount}/${tt.totalRows})
                        </div>
                        <table class="truth-table">
                            <thead>
                                <tr>
                                    ${tt.variables.map(v => `<th>${v}</th>`).join('')}
                                    <th class="result-header">Result (φ)</th>
                                </tr>
                            </thead>
                            <tbody>`;

                tt.rows.forEach(row => {
                    tableHtml += `<tr>`;
                    tt.variables.forEach(v => {
                        const bit = row.inputs[v] ? 'T' : 'F';
                        tableHtml += `<td class="${row.inputs[v] ? 'val-true' : 'val-false'}">${bit}</td>`;
                    });
                    tableHtml += `<td class="result-cell ${row.result ? 'res-true' : 'res-false'}">${row.result ? 'TRUE (1)' : 'FALSE (0)'}</td></tr>`;
                });

                tableHtml += `</tbody></table></div>`;
                logicTableContainer.innerHTML = tableHtml;
            } catch (err) {
                logicTableContainer.innerHTML = `<span class="text-rose">Logic Error: ${err.message}</span>`;
            }
        });
    }

    // ========================================================================
    // 10. CLI TERMINAL INITIALIZATION
    // ========================================================================
    const terminal = new SystemsTerminal('terminal-container', 'term-input', 'term-output', appState);
    terminal.printLine(`=== <span class="cmd-cyan">STAFF SYSTEMS ARCHITECT KERNEL INITIALIZED</span> ===`);
    terminal.printLine(`System version: 4.19.0-sysarch | Architecture: ARM64 / x86_64`);
    terminal.printLine(`Formal constraints: Lock-free, O(n) algorithmic boundaries active.`);
    terminal.printLine(`Type '<span class="cmd-cyan">help</span>' for routines or '<span class="cmd-cyan">lang [en|am|om]</span>' to adapt language.`);

    // Quick contact copy
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = 'architect@systems.dev';
            navigator.clipboard.writeText(email).then(() => {
                copyEmailBtn.textContent = 'Copied to Clipboard!';
                setTimeout(() => {
                    copyEmailBtn.textContent = i18n.t('btn_copy_email');
                }, 2000);
            }).catch(() => {
                alert(`Direct address: ${email}`);
            });
        });
    }
});
