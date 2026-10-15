/**
 * @file app.js
 * @description Master Application Coordinator & Reactive UI Controller
 * Binds data structures, mathematical engines, visualizers, and user events.
 * Implements mobile-responsive navigation, interactive traversal animations, and step-by-step Dijkstra.
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

    // Populate Initial Network Graph (Standard 6-vertex network)
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
    // 4. MOBILE NAVIGATION DRAWER & ACCESSIBILITY
    // ========================================================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');

    const toggleNav = (open) => {
        const isOpen = open !== undefined ? open : !navMenu.classList.contains('active');
        navToggle.classList.toggle('active', isOpen);
        navMenu.classList.toggle('active', isOpen);
        navOverlay.classList.toggle('active', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    if (navToggle) {
        navToggle.addEventListener('click', () => toggleNav());
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', () => toggleNav(false));
    }

    // Close mobile nav when clicking any nav item
    document.querySelectorAll('.nav-links .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 960) {
                toggleNav(false);
            }
        });
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            toggleNav(false);
        }
    });

    // ========================================================================
    // 5. WINDOW RESIZE HANDLER (Debounced)
    // ========================================================================
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            Visualizer.renderBST(appState.bst, 'bst-container');
            Visualizer.renderGraph(appState.graph, 'graph-container');
            Visualizer.renderLRUCache(appState.lruCache, 'lru-container');
            Visualizer.renderRingBuffer(appState.ringBuffer, 'ring-container');
        }, 120);
    });

    // ========================================================================
    // 6. INTERACTIVE TAB SWITCHING
    // ========================================================================
    const tabButtons = document.querySelectorAll('.lab-tab-btn');
    const tabPanes = document.querySelectorAll('.lab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');
            tabButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            const targetPane = document.getElementById(targetId);
            if (targetPane) targetPane.classList.add('active');

            // Trigger re-render of canvas/svg elements on tab change
            setTimeout(() => {
                Visualizer.renderBST(appState.bst, 'bst-container');
                Visualizer.renderGraph(appState.graph, 'graph-container');
                Visualizer.renderLRUCache(appState.lruCache, 'lru-container');
                Visualizer.renderRingBuffer(appState.ringBuffer, 'ring-container');
            }, 60);
        });
    });

    // ========================================================================
    // 7. BST CONTROLS & ANIMATED TRAVERSALS
    // ========================================================================
    const bstInput = document.getElementById('bst-val-input');
    const bstInsertBtn = document.getElementById('bst-insert-btn');
    const bstSearchBtn = document.getElementById('bst-search-btn');
    const bstRandomBtn = document.getElementById('bst-random-btn');
    const bstInorderBtn = document.getElementById('bst-inorder-btn');
    const bstPreorderBtn = document.getElementById('bst-preorder-btn');
    const bstPostorderBtn = document.getElementById('bst-postorder-btn');
    const bstDeleteBtn = document.getElementById('bst-delete-btn');
    const bstClearBtn = document.getElementById('bst-clear-btn');
    const bstTelemetry = document.getElementById('bst-telemetry');

    let isTraversing = false;

    const updateBSTTelemetry = (msg, status = 'info') => {
        if (!bstTelemetry) return;
        const colorClass = status === 'success' ? 'text-emerald' : status === 'warn' ? 'text-amber' : status === 'error' ? 'text-rose' : 'text-cyan';
        const height = appState.bst._getHeight(appState.bst.root);
        bstTelemetry.innerHTML = `
            <div class="telemetry-row">
                <span class="${colorClass}">${msg}</span>
                <span class="telemetry-badge mono">Size: <strong>${appState.bst.size}</strong></span>
                <span class="telemetry-badge mono">Height: <strong>${height}</strong></span>
                <span class="telemetry-badge mono">Sorted: [${appState.bst.inOrder().join(', ')}]</span>
            </div>`;
    };

    updateBSTTelemetry('BST Initialized with 7 balanced nodes.');

    const insertValue = () => {
        const val = parseInt(bstInput.value, 10);
        if (isNaN(val)) return updateBSTTelemetry('Please input a valid integer key.', 'warn');
        const ok = appState.bst.insert(val);
        Visualizer.renderBST(appState.bst, 'bst-container', val);
        bstInput.value = '';
        updateBSTTelemetry(ok ? `Inserted key ${val} in O(log N) average time.` : `Key ${val} already exists (BST uniqueness enforced).`, ok ? 'success' : 'warn');
    };

    if (bstInsertBtn) bstInsertBtn.addEventListener('click', insertValue);
    if (bstInput) {
        bstInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') insertValue();
        });
    }

    if (bstSearchBtn) {
        bstSearchBtn.addEventListener('click', () => {
            const val = parseInt(bstInput.value, 10);
            if (isNaN(val)) return updateBSTTelemetry('Please input a valid integer to search.', 'warn');
            const { found, steps } = appState.bst.search(val);
            Visualizer.renderBST(appState.bst, 'bst-container', found ? val : null, steps);
            updateBSTTelemetry(found ? `Found key ${val}! Search path: ${steps.join(' ➔ ')}` : `Key ${val} not in tree. Explored path: ${steps.join(' ➔ ')}`, found ? 'success' : 'warn');
        });
    }

    if (bstRandomBtn) {
        bstRandomBtn.addEventListener('click', () => {
            const randomVal = Math.floor(Math.random() * 89 + 10);
            const ok = appState.bst.insert(randomVal);
            Visualizer.renderBST(appState.bst, 'bst-container', randomVal);
            updateBSTTelemetry(ok ? `Random key ${randomVal} inserted in O(log N).` : `Random key ${randomVal} collided, preserved uniqueness.`, ok ? 'success' : 'warn');
        });
    }

    // Traversal Animation Helper
    const animateTraversal = (sequence, label) => {
        if (isTraversing || sequence.length === 0) return;
        isTraversing = true;
        let step = 0;
        updateBSTTelemetry(`Running ${label} traversal...`, 'info');

        const interval = setInterval(() => {
            if (step >= sequence.length) {
                clearInterval(interval);
                isTraversing = false;
                Visualizer.renderBST(appState.bst, 'bst-container', null, sequence);
                updateBSTTelemetry(`${label} complete: [${sequence.join(' ➔ ')}]`, 'success');
                return;
            }
            const currentVal = sequence[step];
            const visitedSoFar = sequence.slice(0, step);
            Visualizer.renderBST(appState.bst, 'bst-container', currentVal, visitedSoFar);
            step++;
        }, 380);
    };

    if (bstInorderBtn) {
        bstInorderBtn.addEventListener('click', () => {
            animateTraversal(appState.bst.inOrder(), 'In-Order (L ➔ Root ➔ R)');
        });
    }

    if (bstPreorderBtn) {
        bstPreorderBtn.addEventListener('click', () => {
            animateTraversal(appState.bst.preOrder(), 'Pre-Order (Root ➔ L ➔ R)');
        });
    }

    if (bstPostorderBtn) {
        bstPostorderBtn.addEventListener('click', () => {
            animateTraversal(appState.bst.postOrder(), 'Post-Order (L ➔ R ➔ Root)');
        });
    }

    if (bstDeleteBtn) {
        bstDeleteBtn.addEventListener('click', () => {
            const val = parseInt(bstInput.value, 10);
            if (isNaN(val)) return updateBSTTelemetry('Please input an integer to delete.', 'warn');
            const ok = appState.bst.delete(val);
            Visualizer.renderBST(appState.bst, 'bst-container');
            bstInput.value = '';
            updateBSTTelemetry(ok ? `Deleted key ${val} in O(log N) time.` : `Key ${val} does not exist in tree.`, ok ? 'success' : 'warn');
        });
    }

    if (bstClearBtn) {
        bstClearBtn.addEventListener('click', () => {
            appState.bst.clear();
            Visualizer.renderBST(appState.bst, 'bst-container');
            updateBSTTelemetry('Tree cleared. Size = 0 (Empty tree).', 'warn');
        });
    }

    // ========================================================================
    // 8. GRAPH & DIJKSTRA CONTROLS & STEP-BY-STEP ANIMATION
    // ========================================================================
    const graphStartSel = document.getElementById('graph-start');
    const graphEndSel = document.getElementById('graph-end');
    const graphRunBtn = document.getElementById('graph-run-btn');
    const graphAnimateBtn = document.getElementById('graph-animate-btn');
    const graphTopoBtn = document.getElementById('graph-topo-btn');
    const graphTelemetry = document.getElementById('graph-telemetry');
    const graphContainer = document.getElementById('graph-container');

    let dijkstraAnimationTimer = null;

    const runDijkstraInstant = () => {
        if (dijkstraAnimationTimer) clearInterval(dijkstraAnimationTimer);
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
                        <span class="ml-4 text-dim">Time: O((V + E) log V)</span>
                    </div>`;
            }
        } catch (err) {
            if (graphTelemetry) graphTelemetry.innerHTML = `<span class="text-rose">Error: ${err.message}</span>`;
        }
    };

    if (graphRunBtn) graphRunBtn.addEventListener('click', runDijkstraInstant);

    if (graphAnimateBtn) {
        graphAnimateBtn.addEventListener('click', () => {
            if (dijkstraAnimationTimer) clearInterval(dijkstraAnimationTimer);
            const start = graphStartSel.value;
            const end = graphEndSel.value;
            try {
                const res = appState.graph.dijkstra(start, end);
                const trace = res.trace;
                let stepIdx = 0;

                if (graphTelemetry) {
                    graphTelemetry.innerHTML = `<span class="text-cyan">Animating Dijkstra trace from ${start} to ${end}...</span>`;
                }

                dijkstraAnimationTimer = setInterval(() => {
                    if (stepIdx >= trace.length) {
                        clearInterval(dijkstraAnimationTimer);
                        Visualizer.renderGraph(appState.graph, 'graph-container', res.path);
                        if (graphTelemetry) {
                            graphTelemetry.innerHTML = `
                                <div class="telemetry-block text-emerald">
                                    <strong>Final Shortest Path (${start} ➔ ${end}):</strong> [${res.path.join(' ➔ ')}]
                                    <span class="ml-4">Weight: <strong>${res.distances[end]}</strong></span>
                                </div>`;
                        }
                        return;
                    }

                    const step = trace[stepIdx];
                    if (step.type === 'visit') {
                        Visualizer.renderGraph(appState.graph, 'graph-container', [], step);
                        if (graphTelemetry) {
                            graphTelemetry.innerHTML = `<span class="text-purple mono">${step.message}</span>`;
                        }
                    } else if (step.type === 'relax') {
                        Visualizer.renderGraph(appState.graph, 'graph-container', [], null, { from: step.from, to: step.to });
                        if (graphTelemetry) {
                            graphTelemetry.innerHTML = `<span class="text-emerald mono">${step.message}</span>`;
                        }
                    }
                    stepIdx++;
                }, 450);

            } catch (err) {
                if (graphTelemetry) graphTelemetry.innerHTML = `<span class="text-rose">Error: ${err.message}</span>`;
            }
        });
    }

    if (graphTopoBtn) {
        graphTopoBtn.addEventListener('click', () => {
            if (dijkstraAnimationTimer) clearInterval(dijkstraAnimationTimer);
            const res = appState.graph.topologicalSort();
            if (graphTelemetry) {
                graphTelemetry.innerHTML = `
                    <div class="telemetry-block ${res.hasCycle ? 'text-amber' : 'text-emerald'}">
                        <strong>Topological Order (Kahn's O(V+E)):</strong> 
                        ${res.hasCycle ? 'Contains Cycle (Undirected graph representation)' : `[${res.sortedOrder.join(' ➔ ')}]`}
                    </div>`;
            }
        });
    }

    // Vertex click on SVG to set source/target
    if (graphContainer) {
        graphContainer.addEventListener('click', (e) => {
            const nodeGroup = e.target.closest('.graph-node');
            if (nodeGroup) {
                const vertex = nodeGroup.getAttribute('data-vertex');
                if (vertex) {
                    if (graphStartSel.value !== vertex) {
                        graphEndSel.value = vertex;
                    } else {
                        graphStartSel.value = vertex;
                    }
                    runDijkstraInstant();
                }
            }
        });
    }

    // ========================================================================
    // 9. LRU CACHE CONTROLS
    // ========================================================================
    const lruKeyInput = document.getElementById('lru-key-input');
    const lruValInput = document.getElementById('lru-val-input');
    const lruPutBtn = document.getElementById('lru-put-btn');
    const lruGetBtn = document.getElementById('lru-get-btn');
    const lruSampleBtn = document.getElementById('lru-sample-btn');
    const lruMetrics = document.getElementById('lru-metrics');

    const updateLRUMetrics = () => {
        if (!lruMetrics) return;
        const cache = appState.lruCache;
        const ratio = (cache.getHitRatio() * 100).toFixed(1);
        lruMetrics.innerHTML = `
            <div class="metrics-chip">Capacity: <strong>${cache.capacity}</strong></div>
            <div class="metrics-chip">Size: <strong>${cache.map.size}</strong></div>
            <div class="metrics-chip">Hits: <strong class="text-emerald">${cache.metrics.hits}</strong></div>
            <div class="metrics-chip">Misses: <strong class="text-rose">${cache.metrics.misses}</strong></div>
            <div class="metrics-chip">Hit Ratio: <strong class="text-cyan">${ratio}%</strong></div>`;
    };

    updateLRUMetrics();

    if (lruPutBtn) {
        lruPutBtn.addEventListener('click', () => {
            const k = lruKeyInput.value.trim();
            const v = lruValInput.value.trim() || 'payload';
            if (!k) return;
            appState.lruCache.put(k, v);
            Visualizer.renderLRUCache(appState.lruCache, 'lru-container', k);
            updateLRUMetrics();
            lruKeyInput.value = '';
            lruValInput.value = '';
        });
    }

    if (lruGetBtn) {
        lruGetBtn.addEventListener('click', () => {
            const k = lruKeyInput.value.trim();
            if (!k) return;
            appState.lruCache.get(k);
            Visualizer.renderLRUCache(appState.lruCache, 'lru-container', k);
            updateLRUMetrics();
        });
    }

    const samplePool = [
        { k: 'jwt.token', v: '0x99A' },
        { k: 'session.id', v: 'sess_404' },
        { k: 'db.shard_03', v: 'cluster_eu' },
        { k: 'metrics.p99', v: '42ms' },
        { k: 'auth.hash', v: 'sha256_ok' }
    ];
    let sampleIdx = 0;

    if (lruSampleBtn) {
        lruSampleBtn.addEventListener('click', () => {
            const sample = samplePool[sampleIdx % samplePool.length];
            sampleIdx++;
            appState.lruCache.put(sample.k, sample.v);
            Visualizer.renderLRUCache(appState.lruCache, 'lru-container', sample.k);
            updateLRUMetrics();
        });
    }

    // ========================================================================
    // 10. RING BUFFER CONTROLS
    // ========================================================================
    const ringPushBtn = document.getElementById('ring-push-btn');
    const ringPopBtn = document.getElementById('ring-pop-btn');
    const ringFillBtn = document.getElementById('ring-fill-btn');
    const ringClearBtn = document.getElementById('ring-clear-btn');
    const ringTelemetry = document.getElementById('ring-telemetry');

    if (ringPushBtn) {
        ringPushBtn.addEventListener('click', () => {
            const packet = `PKT_${Math.floor(Math.random() * 899 + 100)}`;
            const res = appState.ringBuffer.enqueue(packet);
            Visualizer.renderRingBuffer(appState.ringBuffer, 'ring-container');
            if (ringTelemetry) {
                ringTelemetry.innerHTML = res.overwritten
                    ? `<span class="text-amber">Enqueued ${packet} (Buffer Full: Head cursor overwritten in O(1))</span>`
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

    if (ringFillBtn) {
        ringFillBtn.addEventListener('click', () => {
            for (let i = 0; i < 8; i++) {
                appState.ringBuffer.enqueue(`MSG_${i + 1}`);
            }
            Visualizer.renderRingBuffer(appState.ringBuffer, 'ring-container');
            if (ringTelemetry) {
                ringTelemetry.innerHTML = `<span class="text-emerald">Ring Buffer filled with 8 slots [O(1) amortized]</span>`;
            }
        });
    }

    if (ringClearBtn) {
        ringClearBtn.addEventListener('click', () => {
            while (!appState.ringBuffer.isEmpty()) {
                appState.ringBuffer.dequeue();
            }
            Visualizer.renderRingBuffer(appState.ringBuffer, 'ring-container');
            if (ringTelemetry) {
                ringTelemetry.innerHTML = `<span class="text-dim">Buffer flushed. Count: 0 / 8.</span>`;
            }
        });
    }

    // ========================================================================
    // 11. DISCRETE MATHEMATICS & LOGIC
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
                            <span class="value text-accent mono">${factN.toString().length > 25 ? factN.toString().slice(0, 22) + '...' : factN.toString()}</span>
                        </div>
                        <div class="math-result-item">
                            <span class="label mono">Permutations P(${n}, ${r})</span>
                            <span class="value text-emerald mono">${perm.toString().length > 25 ? perm.toString().slice(0, 22) + '...' : perm.toString()}</span>
                        </div>
                        <div class="math-result-item">
                            <span class="label mono">Combinations C(${n}, ${r})</span>
                            <span class="value text-purple mono">${comb.toString().length > 25 ? comb.toString().slice(0, 22) + '...' : comb.toString()}</span>
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

    const generateTable = (expr) => {
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
    };

    if (logicBtn) {
        logicBtn.addEventListener('click', () => {
            const expr = logicInput.value.trim();
            generateTable(expr);
        });
    }

    // Preset pills for propositional formulas
    document.querySelectorAll('.preset-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const expr = pill.getAttribute('data-expr');
            if (expr && logicInput) {
                logicInput.value = expr;
                generateTable(expr);
            }
        });
    });

    // Topological Invariants & Euler Planarity Verification
    const eulerV = document.getElementById('euler-v');
    const eulerE = document.getElementById('euler-e');
    const eulerF = document.getElementById('euler-f');
    const eulerBtn = document.getElementById('euler-verify-btn');
    const eulerResults = document.getElementById('euler-results');

    if (eulerBtn) {
        eulerBtn.addEventListener('click', () => {
            const V = parseInt(eulerV.value, 10);
            const E = parseInt(eulerE.value, 10);
            const F = parseInt(eulerF.value, 10);

            try {
                const res = DiscreteMathEngine.verifyPlanarInvariants(V, E, F);
                eulerResults.innerHTML = `
                    <div class="math-result-card">
                        <div class="math-result-item">
                            <span class="label mono">Euler Formula: V - E + F</span>
                            <span class="value ${res.satisfiesEuler ? 'text-emerald' : 'text-rose'} mono">
                                ${V} - ${E} + ${F} = ${res.chi} (${res.satisfiesEuler ? 'Valid Planar S²' : 'Invalid Planar'})
                            </span>
                        </div>
                        <div class="math-result-item">
                            <span class="label mono">Planar Bound E ≤ 3V - 6</span>
                            <span class="value ${res.isSimplePlanarCandidate ? 'text-cyan' : 'text-amber'} mono">
                                ${E} ≤ ${res.maxEdgesPlanar} (${res.isSimplePlanarCandidate ? 'Bound Satisfied' : 'Exceeds Planar Capacity'})
                            </span>
                        </div>
                        <div class="math-result-item">
                            <span class="label mono">Euler Characteristic χ</span>
                            <span class="value text-purple mono">χ = ${res.chi}</span>
                        </div>
                    </div>`;
            } catch (err) {
                eulerResults.innerHTML = `<span class="text-rose">Topology Error: ${err.message}</span>`;
            }
        });
    }

    // ========================================================================
    // 12. CLI TERMINAL INITIALIZATION & SHORTCUT CHIPS
    // ========================================================================
    const terminal = new SystemsTerminal('terminal-container', 'term-input', 'term-output', appState);
    terminal.printLine(`=== <span class="cmd-cyan">STAFF SYSTEMS ARCHITECT KERNEL INITIALIZED</span> ===`);
    terminal.printLine(`System version: 4.19.0-sysarch | Architecture: ARM64 / x86_64`);
    terminal.printLine(`Formal constraints: Lock-free, O(n) algorithmic boundaries active.`);
    terminal.printLine(`Type '<span class="cmd-cyan">help</span>' for routines or '<span class="cmd-cyan">lang [en|am|om]</span>' to adapt language.`);

    // Quick Command Chips
    document.querySelectorAll('.term-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const cmd = chip.getAttribute('data-cmd');
            if (cmd) {
                terminal.run(cmd);
            }
        });
    });

    // Mobile Run Button for Terminal
    const termRunBtn = document.getElementById('term-run-btn');
    const termInput = document.getElementById('term-input');
    if (termRunBtn && termInput) {
        termRunBtn.addEventListener('click', () => {
            const cmd = termInput.value.trim();
            if (cmd) {
                terminal.run(cmd);
            }
        });
    }

    // Copy Email Address Button
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = 'architect@systems.dev';
            navigator.clipboard.writeText(email).then(() => {
                copyEmailBtn.textContent = 'Copied to Clipboard!';
                copyEmailBtn.classList.add('btn-copied');
                setTimeout(() => {
                    copyEmailBtn.textContent = i18n.t('btn_copy_email');
                    copyEmailBtn.classList.remove('btn-copied');
                }, 2200);
            }).catch(() => {
                alert(`Direct address: ${email}`);
            });
        });
    }

    // ========================================================================
    // 13. FLOATING BACK TO TOP BUTTON
    // ========================================================================
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 350) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
