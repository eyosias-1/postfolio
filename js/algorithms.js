/**
 * @file algorithms.js
 * @description Production-grade Data Structures & Algorithmic Engines
 * Adheres to Staff Systems Architect standards: complete implementations, 
 * asymptotic complexity annotations, defensive bounds checking, and decoupled logic.
 */

'use strict';

// ============================================================================
// 1. BINARY SEARCH TREE (BST)
// ============================================================================

/**
 * Node representation for Binary Search Tree.
 */
class BSTNode {
    /**
     * @param {number} value - Numeric key stored in node
     */
    constructor(value) {
        if (typeof value !== 'number' || Number.isNaN(value)) {
            throw new TypeError('BSTNode value must be a valid number.');
        }
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1; // Used for balance invariant calculations
    }
}

/**
 * Binary Search Tree with search, insert, delete, and traversal methods.
 * Space Complexity: O(N) where N is number of stored nodes.
 */
class BinarySearchTree {
    constructor() {
        this.root = null;
        this.size = 0;
    }

    /**
     * Inserts a value into the BST.
     * Time Complexity: Average O(log N), Worst O(N)
     * Space Complexity: O(log N) recursion stack
     * @param {number} value
     * @returns {boolean} True if inserted, False if duplicate
     */
    insert(value) {
        if (typeof value !== 'number' || Number.isNaN(value)) {
            throw new TypeError('Inserted value must be a valid number.');
        }

        let inserted = false;
        const insertRec = (node, val) => {
            if (!node) {
                this.size++;
                inserted = true;
                return new BSTNode(val);
            }
            if (val < node.value) {
                node.left = insertRec(node.left, val);
            } else if (val > node.value) {
                node.right = insertRec(node.right, val);
            } else {
                // Duplicate rejected to preserve strict BST invariant
                inserted = false;
                return node;
            }
            node.height = 1 + Math.max(this._getHeight(node.left), this._getHeight(node.right));
            return node;
        };

        this.root = insertRec(this.root, value);
        return inserted;
    }

    /**
     * Searches for a target value in the BST.
     * Time Complexity: Average O(log N), Worst O(N)
     * Space Complexity: O(1) iterative
     * @param {number} value
     * @returns {{ found: boolean, steps: number[] }}
     */
    search(value) {
        let curr = this.root;
        const steps = [];

        while (curr !== null) {
            steps.push(curr.value);
            if (curr.value === value) {
                return { found: true, steps };
            }
            curr = value < curr.value ? curr.left : curr.right;
        }

        return { found: false, steps };
    }

    /**
     * Deletes a value from the BST.
     * Time Complexity: Average O(log N), Worst O(N)
     * Space Complexity: O(log N) recursion stack
     * @param {number} value
     * @returns {boolean} True if deleted, False if not found
     */
    delete(value) {
        let found = false;

        const deleteRec = (node, val) => {
            if (!node) return null;

            if (val < node.value) {
                node.left = deleteRec(node.left, val);
            } else if (val > node.value) {
                node.right = deleteRec(node.right, val);
            } else {
                found = true;
                this.size--;

                // Case 1: Leaf or single child
                if (!node.left) return node.right;
                if (!node.right) return node.left;

                // Case 2: Two children - find in-order successor (min in right subtree)
                const successor = this._findMin(node.right);
                node.value = successor.value;
                node.right = deleteRec(node.right, successor.value);
                this.size++; // Counter balance decrement in nested recursive call
            }

            node.height = 1 + Math.max(this._getHeight(node.left), this._getHeight(node.right));
            return node;
        };

        this.root = deleteRec(this.root, value);
        return found;
    }

    _findMin(node) {
        let curr = node;
        while (curr.left !== null) curr = curr.left;
        return curr;
    }

    _getHeight(node) {
        return node ? node.height : 0;
    }

    /**
     * In-Order Traversal (Sorted order for BST).
     * Time Complexity: O(N)
     * Space Complexity: O(N)
     * @returns {number[]}
     */
    inOrder() {
        const result = [];
        const traverse = (node) => {
            if (!node) return;
            traverse(node.left);
            result.push(node.value);
            traverse(node.right);
        };
        traverse(this.root);
        return result;
    }

    /**
     * Clears all nodes from tree.
     * Time Complexity: O(1)
     */
    clear() {
        this.root = null;
        this.size = 0;
    }
}

// ============================================================================
// 2. GRAPH THEORY: DIJKSTRA & TOPOLOGICAL SORT
// ============================================================================

/**
 * Min Priority Queue for Dijkstra's Shortest Path Algorithm.
 * Binary min-heap backing.
 * Time Complexity: Insert O(log V), Extract-Min O(log V)
 * Space Complexity: O(V)
 */
class MinHeap {
    constructor() {
        this.heap = [];
    }

    insert(node, priority) {
        this.heap.push({ node, priority });
        this._siftUp(this.heap.length - 1);
    }

    extractMin() {
        if (this.heap.length === 0) return null;
        const min = this.heap[0];
        const end = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this._siftDown(0);
        }
        return min;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    _siftUp(idx) {
        while (idx > 0) {
            const parentIdx = Math.floor((idx - 1) / 2);
            if (this.heap[idx].priority < this.heap[parentIdx].priority) {
                [this.heap[idx], this.heap[parentIdx]] = [this.heap[parentIdx], this.heap[idx]];
                idx = parentIdx;
            } else {
                break;
            }
        }
    }

    _siftDown(idx) {
        const length = this.heap.length;
        while (true) {
            let leftIdx = 2 * idx + 1;
            let rightIdx = 2 * idx + 2;
            let smallest = idx;

            if (leftIdx < length && this.heap[leftIdx].priority < this.heap[smallest].priority) {
                smallest = leftIdx;
            }
            if (rightIdx < length && this.heap[rightIdx].priority < this.heap[smallest].priority) {
                smallest = rightIdx;
            }
            if (smallest !== idx) {
                [this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];
                idx = smallest;
            } else {
                break;
            }
        }
    }
}

/**
 * Graph data structure supporting weighted directed/undirected edges.
 * Space Complexity: O(V + E) adjacency list.
 */
class Graph {
    constructor() {
        this.adjacencyList = new Map();
    }

    /**
     * Adds vertex to graph.
     * Time Complexity: O(1)
     * @param {string} vertex
     */
    addVertex(vertex) {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, []);
        }
    }

    /**
     * Adds edge between vertices.
     * Time Complexity: O(1)
     * @param {string} u
     * @param {string} v
     * @param {number} weight
     * @param {boolean} directed
     */
    addEdge(u, v, weight = 1, directed = false) {
        this.addVertex(u);
        this.addVertex(v);
        this.adjacencyList.get(u).push({ to: v, weight });
        if (!directed) {
            this.adjacencyList.get(v).push({ to: u, weight });
        }
    }

    /**
     * Dijkstra's Shortest Path Algorithm with step logging for visual tracing.
     * Time Complexity: O((V + E) log V)
     * Space Complexity: O(V)
     * @param {string} startVertex
     * @param {string} targetVertex
     * @returns {{ distances: Object, path: string[], trace: Array }}
     */
    dijkstra(startVertex, targetVertex) {
        if (!this.adjacencyList.has(startVertex)) {
            throw new Error(`Start vertex "${startVertex}" does not exist in graph.`);
        }

        const distances = {};
        const previous = {};
        const minHeap = new MinHeap();
        const trace = []; // Visual execution steps
        const visited = new Set();

        for (const vertex of this.adjacencyList.keys()) {
            distances[vertex] = vertex === startVertex ? 0 : Infinity;
            previous[vertex] = null;
        }

        minHeap.insert(startVertex, 0);

        while (!minHeap.isEmpty()) {
            const { node: curr, priority: currDist } = minHeap.extractMin();

            if (visited.has(curr)) continue;
            visited.add(curr);

            trace.push({
                type: 'visit',
                vertex: curr,
                distance: currDist,
                message: `Exploring vertex ${curr} at distance ${currDist}`
            });

            if (curr === targetVertex) break;

            const neighbors = this.adjacencyList.get(curr) || [];
            for (const { to: neighbor, weight } of neighbors) {
                if (visited.has(neighbor)) continue;

                const candidateDist = currDist + weight;
                if (candidateDist < distances[neighbor]) {
                    distances[neighbor] = candidateDist;
                    previous[neighbor] = curr;
                    minHeap.insert(neighbor, candidateDist);

                    trace.push({
                        type: 'relax',
                        from: curr,
                        to: neighbor,
                        weight,
                        newDist: candidateDist,
                        message: `Relaxed edge (${curr} -> ${neighbor}): new distance = ${candidateDist}`
                    });
                }
            }
        }

        // Reconstruct path
        const path = [];
        let curr = targetVertex;
        while (curr !== null) {
            path.unshift(curr);
            curr = previous[curr];
        }

        return {
            distances,
            path: path[0] === startVertex ? path : [],
            trace
        };
    }

    /**
     * Kahn's Algorithm for Topological Sort on Directed Acyclic Graph (DAG).
     * Time Complexity: O(V + E)
     * Space Complexity: O(V)
     * @returns {{ sortedOrder: string[], hasCycle: boolean }}
     */
    topologicalSort() {
        const inDegree = new Map();
        for (const v of this.adjacencyList.keys()) {
            inDegree.set(v, 0);
        }

        // Compute in-degrees
        for (const [, edges] of this.adjacencyList) {
            for (const edge of edges) {
                inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
            }
        }

        // Queue vertices with 0 in-degree
        const queue = [];
        for (const [v, deg] of inDegree) {
            if (deg === 0) queue.push(v);
        }

        const sortedOrder = [];
        while (queue.length > 0) {
            const curr = queue.shift();
            sortedOrder.push(curr);

            const neighbors = this.adjacencyList.get(curr) || [];
            for (const edge of neighbors) {
                const updated = inDegree.get(edge.to) - 1;
                inDegree.set(edge.to, updated);
                if (updated === 0) {
                    queue.push(edge.to);
                }
            }
        }

        const hasCycle = sortedOrder.length !== this.adjacencyList.size;
        return { sortedOrder, hasCycle };
    }

    /**
     * Returns total vertex count |V| and edge count |E|.
     * Time Complexity: O(V)
     */
    getGraphMetrics() {
        let totalEdges = 0;
        for (const edges of this.adjacencyList.values()) {
            totalEdges += edges.length;
        }
        return {
            vertexCount: this.adjacencyList.size,
            edgeCount: Math.floor(totalEdges / 2) // For undirected representation
        };
    }
}

// ============================================================================
// 3. SYSTEMS & ARCHITECTURE: LEAST RECENTLY USED (LRU) CACHE
// ============================================================================

/**
 * Doubly Linked List Node for O(1) Cache Eviction.
 */
class LRUNode {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

/**
 * LRU Cache implemented with Doubly Linked List + Hash Map.
 * Guarantees strict O(1) time complexity for get and put operations.
 * Space Complexity: O(Capacity)
 */
class LRUCache {
    /**
     * @param {number} capacity - Maximum entries before eviction
     */
    constructor(capacity) {
        if (!Number.isInteger(capacity) || capacity <= 0) {
            throw new RangeError('LRUCache capacity must be a positive integer.');
        }
        this.capacity = capacity;
        this.map = new Map();

        // Sentinel pseudo head & tail nodes eliminate edge-case null checks
        this.head = new LRUNode(null, null);
        this.tail = new LRUNode(null, null);
        this.head.next = this.tail;
        this.tail.prev = this.head;

        // Telemetry metrics
        this.metrics = {
            hits: 0,
            misses: 0,
            evictions: 0
        };
    }

    /**
     * Retrieves an item by key and marks it as most recently used.
     * Time Complexity: O(1)
     * @param {string|number} key
     * @returns {*} Stored value or undefined
     */
    get(key) {
        if (!this.map.has(key)) {
            this.metrics.misses++;
            return undefined;
        }
        const node = this.map.get(key);
        this._removeNode(node);
        this._addToHead(node);
        this.metrics.hits++;
        return node.value;
    }

    /**
     * Inserts or updates an entry. Evicts LRU tail if capacity is exceeded.
     * Time Complexity: O(1)
     * @param {string|number} key
     * @param {*} value
     * @returns {string|null} Evicted key or null
     */
    put(key, value) {
        let evictedKey = null;

        if (this.map.has(key)) {
            const existingNode = this.map.get(key);
            existingNode.value = value;
            this._removeNode(existingNode);
            this._addToHead(existingNode);
            return null;
        }

        const newNode = new LRUNode(key, value);
        this.map.set(key, newNode);
        this._addToHead(newNode);

        if (this.map.size > this.capacity) {
            // Evict the least recently used node (immediately before tail sentinel)
            const lru = this.tail.prev;
            this._removeNode(lru);
            this.map.delete(lru.key);
            this.metrics.evictions++;
            evictedKey = lru.key;
        }

        return evictedKey;
    }

    /**
     * Returns an array of current entries from MRU to LRU order.
     * Time Complexity: O(Capacity)
     * @returns {Array<{key: *, value: *}>}
     */
    dumpEntries() {
        const entries = [];
        let curr = this.head.next;
        while (curr !== this.tail) {
            entries.push({ key: curr.key, value: curr.value });
            curr = curr.next;
        }
        return entries;
    }

    _removeNode(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    _addToHead(node) {
        node.next = this.head.next;
        node.prev = this.head;
        this.head.next.prev = node;
        this.head.next = node;
    }

    getHitRatio() {
        const total = this.metrics.hits + this.metrics.misses;
        return total === 0 ? 0 : Number((this.metrics.hits / total).toFixed(3));
    }
}

// ============================================================================
// 4. LOW-LEVEL SYSTEMS: CIRCULAR RING BUFFER
// ============================================================================

/**
 * Fixed-size Circular Ring Buffer with atomic-style pointer increments.
 * Space Complexity: O(Capacity) pre-allocated array.
 */
class CircularRingBuffer {
    /**
     * @param {number} capacity - Fixed slot size
     */
    constructor(capacity = 8) {
        if (!Number.isInteger(capacity) || capacity <= 0) {
            throw new RangeError('Capacity must be a positive integer.');
        }
        this.capacity = capacity;
        this.buffer = new Array(capacity).fill(null);
        this.head = 0; // Read cursor
        this.tail = 0; // Write cursor
        this.count = 0;
    }

    /**
     * Pushes an item into the buffer.
     * Time Complexity: O(1)
     * @param {*} item
     * @returns {{ success: boolean, overwritten: boolean }}
     */
    enqueue(item) {
        let overwritten = false;
        if (this.isFull()) {
            // Advancing read cursor to overwrite oldest element (lossy telemetry queue)
            this.head = (this.head + 1) % this.capacity;
            this.count--;
            overwritten = true;
        }

        this.buffer[this.tail] = item;
        this.tail = (this.tail + 1) % this.capacity;
        this.count++;

        return { success: true, overwritten };
    }

    /**
     * Pops oldest item from the buffer.
     * Time Complexity: O(1)
     * @returns {*}
     */
    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        const item = this.buffer[this.head];
        this.buffer[this.head] = null;
        this.head = (this.head + 1) % this.capacity;
        this.count--;
        return item;
    }

    isEmpty() {
        return this.count === 0;
    }

    isFull() {
        return this.count === this.capacity;
    }

    peek() {
        return this.isEmpty() ? null : this.buffer[this.head];
    }

    getSlots() {
        return this.buffer.map((val, idx) => ({
            index: idx,
            value: val,
            isHead: idx === this.head && !this.isEmpty(),
            isTail: idx === this.tail
        }));
    }
}

// Export for module/browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BSTNode,
        BinarySearchTree,
        MinHeap,
        Graph,
        LRUNode,
        LRUCache,
        CircularRingBuffer
    };
}
