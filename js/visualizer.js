/**
 * @file visualizer.js
 * @description Sleek Glassmorphic & Canvas-based Visualizers for Data Structures and Network Graphs
 * Handles dynamic rendering, interactive animations, and Big-O computational telemetry.
 * Fully responsive across mobile, tablet, and desktop viewports.
 */

'use strict';

class Visualizer {
    // ========================================================================
    // 1. BACKGROUND GRAPH MESH CANVAS (Retina & Touch-Optimized)
    // ========================================================================
    static initBackgroundMesh(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let dpr = window.devicePixelRatio || 1;
        let width = window.innerWidth;
        let height = window.innerHeight;

        const setupCanvas = () => {
            dpr = window.devicePixelRatio || 1;
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
        };
        setupCanvas();

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(setupCanvas, 150);
        });

        // Dynamic node count scaled by screen density
        const nodeCount = Math.min(Math.floor((width * height) / 18000), 70);
        const nodes = [];

        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 1.5 + 1.2
            });
        }

        let mouse = { x: -1000, y: -1000, active: false };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.active = true;
        }, { passive: true });

        window.addEventListener('mouseleave', () => {
            mouse.active = false;
            mouse.x = -1000;
            mouse.y = -1000;
        });

        // Mobile touch interaction
        window.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches[0]) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
                mouse.active = true;
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches[0]) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
                mouse.active = true;
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            mouse.active = false;
            mouse.x = -1000;
            mouse.y = -1000;
        }, { passive: true });

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

                    if (dist < 125) {
                        const alpha = (1 - dist / 125) * 0.22;
                        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(n.x, n.y);
                        ctx.lineTo(n2.x, n2.y);
                        ctx.stroke();
                    }
                }

                // Connect to touch / mouse pointer
                if (mouse.active) {
                    const mdx = n.x - mouse.x;
                    const mdy = n.y - mouse.y;
                    const mdist = Math.hypot(mdx, mdy);
                    if (mdist < 150) {
                        const alpha = (1 - mdist / 150) * 0.4;
                        ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(n.x, n.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }

    // ========================================================================
    // 2. BST RENDERER (Fully Responsive SVG)
    // ========================================================================
    static renderBST(bst, containerId, highlightValue = null, secondaryHighlights = []) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (!bst.root) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="mono">Tree is Empty (Root = NULL). Insert numeric keys to populate.</span>
                </div>`;
            return;
        }

        const treeHeight = bst._getHeight(bst.root);
        // Robust virtual coordinate system that prevents mobile node collision
        const virtualWidth = Math.max(680, Math.pow(2, Math.min(treeHeight, 5)) * 45);
        const virtualHeight = Math.max(340, (treeHeight + 1) * 72);

        const nodes = [];
        const edges = [];

        const assignCoords = (node, depth, leftBound, rightBound) => {
            if (!node) return;
            const x = (leftBound + rightBound) / 2;
            const y = depth * 65 + 45;

            const isPrimary = node.value === highlightValue;
            const isSecondary = Array.isArray(secondaryHighlights) && secondaryHighlights.includes(node.value);

            nodes.push({
                value: node.value,
                x,
                y,
                isPrimary,
                isSecondary
            });

            if (node.left) {
                const childX = (leftBound + x) / 2;
                const childY = (depth + 1) * 65 + 45;
                edges.push({ x1: x, y1: y, x2: childX, y2: childY });
                assignCoords(node.left, depth + 1, leftBound, x);
            }
            if (node.right) {
                const childX = (x + rightBound) / 2;
                const childY = (depth + 1) * 65 + 45;
                edges.push({ x1: x, y1: y, x2: childX, y2: childY });
                assignCoords(node.right, depth + 1, x, rightBound);
            }
        };

        assignCoords(bst.root, 0, 30, virtualWidth - 30);

        let svgHtml = `<svg width="100%" height="100%" viewBox="0 0 ${virtualWidth} ${virtualHeight}" preserveAspectRatio="xMidYMid meet" class="bst-svg">`;

        // Render edges
        edges.forEach(e => {
            svgHtml += `<line x1="${e.x1}" y1="${e.y1}" x2="${e.x2}" y2="${e.y2}" class="tree-edge" />`;
        });

        // Render nodes
        nodes.forEach(n => {
            let nodeClass = 'tree-node';
            if (n.isPrimary) nodeClass += ' highlight pulse';
            else if (n.isSecondary) nodeClass += ' active-trace';

            svgHtml += `
                <g class="${nodeClass}" transform="translate(${n.x}, ${n.y})" data-val="${n.value}">
                    <circle r="21" class="node-circle" />
                    <text dy="6" text-anchor="middle" class="node-text">${n.value}</text>
                </g>`;
        });

        svgHtml += `</svg>`;
        container.innerHTML = svgHtml;
    }

    // ========================================================================
    // 3. GRAPH & DIJKSTRA VISUALIZER (Centered, Fully Scalable on Mobile)
    // ========================================================================
    static renderGraph(graph, containerId, activePath = [], currentStep = null, relaxedEdge = null) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Standardized virtual coordinate plane ensuring zero clipping on mobile
        const vWidth = 660;
        const vHeight = 350;

        const nodePositions = {
            'A': { x: 75,  y: 175 },
            'B': { x: 220, y: 75  },
            'C': { x: 220, y: 275 },
            'D': { x: 440, y: 75  },
            'E': { x: 440, y: 275 },
            'F': { x: 585, y: 175 }
        };

        let svg = `<svg width="100%" height="100%" viewBox="0 0 ${vWidth} ${vHeight}" preserveAspectRatio="xMidYMid meet" class="graph-svg">
            <defs>
                <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#34d399" flood-opacity="0.8"/>
                </filter>
                <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#38bdf8" flood-opacity="0.8"/>
                </filter>
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

                const isRelaxed = relaxedEdge && (
                    (relaxedEdge.from === u && relaxedEdge.to === v) || 
                    (relaxedEdge.from === v && relaxedEdge.to === u)
                );

                let lineClass = 'graph-edge';
                if (isPathEdge) lineClass += ' active';
                if (isRelaxed) lineClass += ' relaxing';

                const midX = (posU.x + posV.x) / 2;
                const midY = (posU.y + posV.y) / 2 - 9;

                svg += `
                    <line x1="${posU.x}" y1="${posU.y}" x2="${posV.x}" y2="${posV.y}" class="${lineClass}" />
                    <rect x="${midX - 12}" y="${midY - 10}" width="24" height="16" rx="4" class="weight-bg" />
                    <text x="${midX}" y="${midY + 2}" class="edge-weight">${weight}</text>`;
            }
        }

        // Render vertices
        for (const vertex of graph.adjacencyList.keys()) {
            const pos = nodePositions[vertex] || { x: 150, y: 150 };
            const isPathNode = activePath.includes(vertex);
            const isCurrent = currentStep && currentStep.vertex === vertex;
            
            let nodeClass = 'graph-node';
            if (isCurrent) nodeClass += ' visiting';
            else if (isPathNode) nodeClass += ' in-path';

            svg += `
                <g class="${nodeClass}" transform="translate(${pos.x}, ${pos.y})" data-vertex="${vertex}" style="cursor: pointer;">
                    <circle r="22" class="graph-node-circle" />
                    <text dy="6" text-anchor="middle" class="graph-node-text">${vertex}</text>
                </g>`;
        }

        svg += `</svg>`;
        container.innerHTML = svg;
    }

    // ========================================================================
    // 4. LRU CACHE VISUALIZER (Touch-Friendly Pipeline)
    // ========================================================================
    static renderLRUCache(cache, containerId, activeKey = null) {
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
                const isActive = item.key === activeKey;
                html += `
                    <div class="lru-link">⇄</div>
                    <div class="lru-node-card ${isActive ? 'card-pulse' : ''}" data-key="${item.key}">
                        <span class="lru-rank">#${idx + 1}</span>
                        <div class="lru-key-val">
                            <span class="key mono">${item.key}</span>
                            <span class="val mono">${typeof item.value === 'object' ? JSON.stringify(item.value) : item.value}</span>
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
    // 5. CIRCULAR RING BUFFER VISUALIZER (Adaptive Responsive Grid)
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
                        <span class="slot-idx mono">[${slot.index}]</span>
                        <div class="slot-cursors">${cursorBadges}</div>
                    </div>
                    <div class="slot-payload mono">
                        ${slot.value !== null ? slot.value : '<span class="text-dim">NULL</span>'}
                    </div>
                </div>`;
        });

        html += `</div>`;
        container.innerHTML = html;
    }
}
