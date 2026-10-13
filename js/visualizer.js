/**
 * @file visualizer.js
 * @description Sleek Glassmorphic & Canvas-based Visualizers for Data Structures and Network Graphs
 * Handles dynamic rendering, interactive animations, and Big-O computational telemetry.
 */

'use strict';

class Visualizer {
    // ========================================================================
    // 1. BACKGROUND GRAPH MESH CANVAS
    // ========================================================================
    static initBackgroundMesh(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);

        const nodeCount = Math.min(Math.floor((width * height) / 20000), 75);
        const nodes = [];

        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.45,
                vy: (Math.random() - 0.5) * 0.45,
                radius: Math.random() * 1.5 + 1
            });
        }

        let mouse = { x: -1000, y: -1000 };
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Update & Draw nodes
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                n.x += n.vx;
                n.y += n.vy;

                if (n.x < 0 || n.x > width) n.vx *= -1;
                if (n.y < 0 || n.y > height) n.vy *= -1;

                ctx.beginPath();
                ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
                ctx.fill();

                // Connect nearby nodes
                for (let j = i + 1; j < nodes.length; j++) {
                    const n2 = nodes[j];
                    const dx = n.x - n2.x;
                    const dy = n.y - n2.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < 130) {
                        const alpha = (1 - dist / 130) * 0.22;
                        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(n.x, n.y);
                        ctx.lineTo(n2.x, n2.y);
                        ctx.stroke();
                    }
                }

                // Connect to mouse pointer
                const mdx = n.x - mouse.x;
                const mdy = n.y - mouse.y;
                const mdist = Math.hypot(mdx, mdy);
                if (mdist < 160) {
                    const alpha = (1 - mdist / 160) * 0.45;
                    ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(n.x, n.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }

            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }

    // ========================================================================
    // 2. BST RENDERER (SVG/CANVAS)
    // ========================================================================
    static renderBST(bst, containerId, highlightValue = null) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (!bst.root) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="mono">Tree is Empty (Root = NULL). Insert numeric keys to populate.</span>
                </div>`;
            return;
        }

        const width = container.clientWidth || 700;
        const height = Math.max(340, (bst._getHeight(bst.root) + 1) * 75);

        // Calculate node coordinates recursively
        const nodes = [];
        const edges = [];

        const assignCoords = (node, depth, leftBound, rightBound) => {
            if (!node) return;
            const x = (leftBound + rightBound) / 2;
            const y = depth * 65 + 40;

            nodes.push({ value: node.value, x, y, isHighlight: node.value === highlightValue });

            if (node.left) {
                const childX = (leftBound + x) / 2;
                const childY = (depth + 1) * 65 + 40;
                edges.push({ x1: x, y1: y, x2: childX, y2: childY });
                assignCoords(node.left, depth + 1, leftBound, x);
            }
            if (node.right) {
                const childX = (x + rightBound) / 2;
                const childY = (depth + 1) * 65 + 40;
                edges.push({ x1: x, y1: y, x2: childX, y2: childY });
                assignCoords(node.right, depth + 1, x, rightBound);
            }
        };

        assignCoords(bst.root, 0, 20, width - 20);

        let svgHtml = `<svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" class="bst-svg">`;

        // Render edges
        edges.forEach(e => {
            svgHtml += `<line x1="${e.x1}" y1="${e.y1}" x2="${e.x2}" y2="${e.y2}" class="tree-edge" />`;
        });

        // Render nodes
        nodes.forEach(n => {
            const nodeClass = n.isHighlight ? 'tree-node highlight' : 'tree-node';
            svgHtml += `
                <g class="${nodeClass}" transform="translate(${n.x}, ${n.y})">
                    <circle r="20" class="node-circle" />
                    <text dy="6" text-anchor="middle" class="node-text">${n.value}</text>
                </g>`;
        });

        svgHtml += `</svg>`;
        container.innerHTML = svgHtml;
    }

    // ========================================================================
    // 3. GRAPH & DIJKSTRA VISUALIZER
    // ========================================================================
    static renderGraph(graph, containerId, activePath = [], currentStep = null) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const width = container.clientWidth || 700;
        const height = 360;

        // Predetermined elegant coordinates for standard 6-vertex network
        const nodePositions = {
            'A': { x: 80, y: 180 },
            'B': { x: 230, y: 70 },
            'C': { x: 230, y: 290 },
            'D': { x: 420, y: 70 },
            'E': { x: 420, y: 290 },
            'F': { x: 580, y: 180 }
        };

        let svg = `<svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" class="graph-svg">
            <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                </marker>
                <marker id="arrow-active" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
                </marker>
            </defs>`;

        const renderedEdges = new Set();

        // Render edges
        for (const [u, edges] of graph.adjacencyList) {
            const posU = nodePositions[u] || { x: 100, y: 100 };
            for (const { to: v, weight } of edges) {
                const edgeKey = `${u}->${v}`;
                const reverseKey = `${v}->${u}`;
                if (renderedEdges.has(reverseKey) && !graph.directed) continue;
                renderedEdges.add(edgeKey);

                const posV = nodePositions[v] || { x: 200, y: 200 };
                const isPathEdge = activePath.length > 1 && 
                    activePath.some((node, idx) => idx < activePath.length - 1 && 
                        ((node === u && activePath[idx+1] === v) || (node === v && activePath[idx+1] === u)));

                const lineClass = isPathEdge ? 'graph-edge active' : 'graph-edge';
                const midX = (posU.x + posV.x) / 2;
                const midY = (posU.y + posV.y) / 2 - 8;

                svg += `
                    <line x1="${posU.x}" y1="${posU.y}" x2="${posV.x}" y2="${posV.y}" class="${lineClass}" />
                    <text x="${midX}" y="${midY}" class="edge-weight">${weight}</text>`;
            }
        }

        // Render vertices
        for (const vertex of graph.adjacencyList.keys()) {
            const pos = nodePositions[vertex] || { x: 150, y: 150 };
            const isPathNode = activePath.includes(vertex);
            const isCurrent = currentStep && currentStep.vertex === vertex;
            const nodeClass = isCurrent ? 'graph-node visiting' : isPathNode ? 'graph-node in-path' : 'graph-node';

            svg += `
                <g class="${nodeClass}" transform="translate(${pos.x}, ${pos.y})">
                    <circle r="22" class="graph-node-circle" />
                    <text dy="6" text-anchor="middle" class="graph-node-text">${vertex}</text>
                </g>`;
        }

        svg += `</svg>`;
        container.innerHTML = svg;
    }

    // ========================================================================
    // 4. LRU CACHE VISUALIZER
    // ========================================================================
    static renderLRUCache(cache, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const entries = cache.dumpEntries();
        let html = `
            <div class="lru-pipeline">
                <div class="lru-sentinel head">
                    <span class="badge-tag">MRU</span>
                    <strong>HEAD</strong>
                </div>`;

        if (entries.length === 0) {
            html += `<div class="lru-empty mono">Cache Empty (Size: 0 / ${cache.capacity})</div>`;
        } else {
            entries.forEach((item, idx) => {
                html += `
                    <div class="lru-link">⇄</div>
                    <div class="lru-node-card">
                        <span class="lru-rank">#${idx + 1}</span>
                        <div class="lru-key-val">
                            <span class="key mono">${item.key}</span>
                            <span class="val mono">${JSON.stringify(item.value)}</span>
                        </div>
                    </div>`;
            });
        }

        html += `
                <div class="lru-link">⇄</div>
                <div class="lru-sentinel tail">
                    <span class="badge-tag">LRU</span>
                    <strong>TAIL</strong>
                </div>
            </div>`;

        container.innerHTML = html;
    }

    // ========================================================================
    // 5. CIRCULAR RING BUFFER VISUALIZER
    // ========================================================================
    static renderRingBuffer(buffer, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const slots = buffer.getSlots();
        let html = `<div class="ring-grid">`;

        slots.forEach(slot => {
            let cursorBadges = '';
            if (slot.isHead) cursorBadges += `<span class="cursor-head">READ (H)</span>`;
            if (slot.isTail) cursorBadges += `<span class="cursor-tail">WRITE (T)</span>`;

            const filledClass = slot.value !== null ? 'slot-filled' : 'slot-empty';

            html += `
                <div class="buffer-slot ${filledClass}">
                    <div class="slot-header">
                        <span class="slot-idx">Slot [${slot.index}]</span>
                        <div class="slot-cursors">${cursorBadges}</div>
                    </div>
                    <div class="slot-payload mono">
                        ${slot.value !== null ? slot.value : '— NULL —'}
                    </div>
                </div>`;
        });

        html += `</div>`;
        container.innerHTML = html;
    }
}
