/**
 * @file math.js
 * @description Applied Mathematics & Discrete Logic Computational Engine
 * Implements rigorous mathematical algorithms: combinatorics, graph invariants,
 * probability distributions, and propositional logic truth table synthesis.
 */

'use strict';

class DiscreteMathEngine {
    // ========================================================================
    // 1. COMBINATORICS & PROBABILITY
    // ========================================================================

    /**
     * Computes Factorial n! using BigInt to prevent 64-bit IEEE float overflow.
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     * @param {number} n
     * @returns {bigint}
     */
    static factorial(n) {
        if (!Number.isInteger(n) || n < 0) {
            throw new RangeError('Factorial requires a non-negative integer.');
        }
        let result = 1n;
        for (let i = 2n; i <= BigInt(n); i++) {
            result *= i;
        }
        return result;
    }

    /**
     * Permutations P(n, r) = n! / (n - r)!
     * Number of ways to choose and arrange r elements out of n.
     * Time Complexity: O(r)
     * Space Complexity: O(1)
     * @param {number} n
     * @param {number} r
     * @returns {bigint}
     */
    static permutations(n, r) {
        if (n < 0 || r < 0 || r > n) {
            throw new RangeError('Permutations condition requires 0 <= r <= n.');
        }
        let result = 1n;
        const bigN = BigInt(n);
        const bigR = BigInt(r);
        for (let i = 0n; i < bigR; i++) {
            result *= (bigN - i);
        }
        return result;
    }

    /**
     * Combinations C(n, r) = (n choose r) = n! / [r! * (n - r)!]
     * Time Complexity: O(min(r, n - r))
     * Space Complexity: O(1)
     * @param {number} n
     * @param {number} r
     * @returns {bigint}
     */
    static combinations(n, r) {
        if (n < 0 || r < 0 || r > n) {
            throw new RangeError('Combinations condition requires 0 <= r <= n.');
        }
        const effectiveR = Math.min(r, n - r);
        let numerator = 1n;
        let denominator = 1n;
        const bigN = BigInt(n);

        for (let i = 1n; i <= BigInt(effectiveR); i++) {
            numerator *= (bigN - i + 1n);
            denominator *= i;
        }
        return numerator / denominator;
    }

    /**
     * Binomial Probability: P(X = k) = C(n, k) * p^k * (1 - p)^(n - k)
     * Time Complexity: O(n)
     * @param {number} n - Number of trials
     * @param {number} k - Number of successes
     * @param {number} p - Probability of success [0, 1]
     * @returns {number}
     */
    static binomialProbability(n, k, p) {
        if (p < 0 || p > 1) {
            throw new RangeError('Probability p must lie in the closed interval [0, 1].');
        }
        if (k < 0 || k > n) return 0;

        const c = Number(this.combinations(n, k));
        return c * Math.pow(p, k) * Math.pow(1 - p, n - k);
    }

    // ========================================================================
    // 2. GRAPH INVARIANTS & TOPOLOGY
    // ========================================================================

    /**
     * Evaluates Euler's Planar Polyhedral Formula: V - E + F = 2
     * Checks if a given configuration of vertices, edges, and faces satisfies planarity.
     * @param {number} V - Vertices
     * @param {number} E - Edges
     * @param {number} F - Faces
     * @returns {{ satisfiesEuler: boolean, chi: number, maxEdgesPlanar: number }}
     */
    static verifyPlanarInvariants(V, E, F) {
        if (V < 1 || E < 0 || F < 1) {
            throw new RangeError('Topological invariants require V >= 1, E >= 0, F >= 1.');
        }
        const chi = V - E + F; // Euler characteristic for a sphere / connected planar graph
        const satisfiesEuler = chi === 2;
        // For simple planar graph with V >= 3: E <= 3V - 6
        const maxEdgesPlanar = V >= 3 ? 3 * V - 6 : E;

        return {
            satisfiesEuler,
            chi,
            maxEdgesPlanar,
            isSimplePlanarCandidate: E <= maxEdgesPlanar
        };
    }

    /**
     * Handshaking Lemma Verification: sum(deg(v)) = 2 * |E|
     * The sum of all vertex degrees is always even and equals twice the edge count.
     * @param {number[]} degrees
     * @returns {{ sumDegrees: number, edgeCount: number, isValid: boolean }}
     */
    static verifyHandshakingLemma(degrees) {
        const sumDegrees = degrees.reduce((acc, d) => acc + d, 0);
        const isValid = sumDegrees % 2 === 0;
        return {
            sumDegrees,
            edgeCount: isValid ? sumDegrees / 2 : null,
            isValid
        };
    }

    // ========================================================================
    // 3. PROPOSITIONAL LOGIC & TRUTH TABLE GENERATOR
    // ========================================================================

    /**
     * Generates a complete Truth Table for a Boolean expression over variables A, B, C.
     * Supported operators:
     * - '&' or 'AND'  : Conjunction (∧)
     * - '|' or 'OR'   : Disjunction (∨)
     * - '!' or 'NOT'  : Negation (¬)
     * - '^' or 'XOR'  : Exclusive OR (⊕)
     * - '->'          : Material Conditional (→)
     * - '<->'         : Biconditional (↔)
     * 
     * @param {string} exprString - Mathematical or symbolic proposition
     * @returns {{ variables: string[], rows: Array<{inputs: Object, result: boolean}>, classification: string }}
     */
    static generateTruthTable(exprString) {
        const cleaned = exprString.trim();
        if (!cleaned) {
            throw new Error('Boolean expression cannot be empty.');
        }

        // Detect variables present (A, B, C)
        const variables = ['A', 'B', 'C'].filter(v => cleaned.includes(v));
        if (variables.length === 0) {
            throw new Error('Expression must contain at least one variable (A, B, or C).');
        }

        const totalCombinations = 1 << variables.length;
        const rows = [];
        let trueCount = 0;

        for (let i = 0; i < totalCombinations; i++) {
            const assignment = {};
            variables.forEach((v, idx) => {
                // Bitwise assignment for standard truth table ordering
                const bit = (i >> (variables.length - 1 - idx)) & 1;
                assignment[v] = Boolean(bit);
            });

            const result = this._evaluateExpression(cleaned, assignment);
            if (result) trueCount++;

            rows.push({
                inputs: assignment,
                result
            });
        }

        let classification = 'Contingency';
        if (trueCount === totalCombinations) classification = 'Tautology (Always True)';
        if (trueCount === 0) classification = 'Contradiction (Always False)';

        return {
            variables,
            rows,
            classification,
            validModelsCount: trueCount,
            totalRows: totalCombinations
        };
    }

    /**
     * Safely evaluates boolean expression under variable assignments.
     * Sanitizes operators to JavaScript boolean logic.
     * @private
     */
    static _evaluateExpression(expr, vars) {
        let jsExpr = expr
            .replace(/<->/g, ' === ')
            .replace(/->/g, ' <= ') // (P -> Q) is logically equivalent to (!P || Q), in boolean math P <= Q
            .replace(/\bAND\b/gi, ' && ')
            .replace(/∧/g, ' && ')
            .replace(/&/g, ' && ')
            .replace(/\bOR\b/gi, ' || ')
            .replace(/∨/g, ' || ')
            .replace(/\|/g, ' || ')
            .replace(/\bNOT\b/gi, ' !')
            .replace(/¬/g, ' !')
            .replace(/~/g, ' !')
            .replace(/\bXOR\b/gi, ' !== ')
            .replace(/⊕/g, ' !== ')
            .replace(/\^/g, ' !== ');

        // Inject variables
        for (const [v, val] of Object.entries(vars)) {
            const regex = new RegExp(`\\b${v}\\b`, 'g');
            jsExpr = jsExpr.replace(regex, val ? 'true' : 'false');
        }

        // Whitelist allowed characters to prevent arbitrary code execution
        if (!/^[true fals!&|=<>()\s]+$/.test(jsExpr)) {
            throw new Error('Expression contains invalid tokens or unsafe characters.');
        }

        try {
            // Function evaluation of sanitized pure boolean expression
            return Boolean(new Function(`return (${jsExpr});`)());
        } catch (err) {
            throw new Error(`Syntax error parsing expression: ${err.message}`);
        }
    }
}

// Export for module/browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DiscreteMathEngine };
}
