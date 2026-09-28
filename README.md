# ⚡ ForgeJudge (formerly CodePad)

A high-performance, zero-dependency **Local Algorithmic & OOPS Test Execution Engine** featuring **93 verified problems** (**53 CSES Problem Set** classics + **40 Java OOPS** problems) with multi-language local compilation and multi-testcase judging.

![stack](https://img.shields.io/badge/stack-node.js%20%2B%20local%20compilers-38bdf8) ![problems](https://img.shields.io/badge/problems-93%20verified%20(53%20CSES%20%2B%2040%20OOPS)-10b981) ![languages](https://img.shields.io/badge/languages-Java%20%7C%20C%2B%2B17%20%7C%20Python%203%20%7C%20Node.js-818cf8)

## ✨ Key Upgrades in ForgeJudge v2.0

- **93 Verified Problems (222 Testcases)**:
  - **CSES Problem Set Track (53 Problems)** across 5 major sections:
    - *CSES · Introductory Problems* (Weird Algorithm, Missing Number, Repetitions, Increasing Array, Permutations, Number Spiral, Two Knights, Two Sets, Bit Strings, Trailing Zeros, Coin Piles, Palindrome Reorder, Gray Code, Tower of Hanoi, Apple Division)
    - *CSES · Sorting & Searching* (Distinct Numbers, Apartments, Ferris Wheel, Restaurant Customers, Movie Festival, Sum of Two Values, Maximum Subarray Sum, Stick Lengths, Missing Coin Sum, Collecting Numbers, Towers, Subarray Sums I)
    - *CSES · Dynamic Programming* (Dice Combinations, Minimizing Coins, Coin Combinations I & II, Removing Digits, Grid Paths, Book Shop, Edit Distance, Increasing Subsequence, Money Sums)
    - *CSES · Graph Algorithms & Trees* (Counting Rooms, Labyrinth, Building Roads, Message Route, Shortest Routes I & II, Subordinates, Tree Diameter)
    - *CSES · Range Queries, Math & Strings* (Static Range Sum/Min Queries, Dynamic Range Sum Queries, Range Xor Queries, Exponentiation, Counting Divisors, Common Divisors, String Matching)
  - **Java OOPS 40 Track (40 Problems)** across 4 sections (*Static Members*, *OOP & Inheritance*, *Strings*, *2D Arrays*), now enriched with multi-testcase verification suites.
- **Multi-Language Local Execution Engine (`server/services/local-runner.js`)**:
  - Automatic startup detection for **Java (`javac` / `java`)**, **C++17 (`g++ -O2`)**, **Python 3 (`python`)**, and **Node.js (`node`)**.
  - **Single-Compile Batch Judging**: Compiles source code once per submission and executes the compiled binary across all sample and hidden testcases.
  - **Accurate Verdict Classification**: Distinguishes `ACCEPTED`, `WRONG_ANSWER`, `TIME_LIMIT_EXCEEDED` (TLE), `RUNTIME_ERROR` (RTE), and `COMPILE_ERROR` (CE).
- **ForgeJudge Cyber-Obsidian IDE**:
  - Track switcher (`All`, `CSES`, `OOPS`), difficulty & unsolved filter pills, `🎲 Random` problem selector, and built-in practice **Stopwatch Timer**.
  - Multi-tab **Testcase Workbench** (`Case 1`, `Case 2`, `Case 3` + live diff inspector) and auto-formatter (`Format` / `Shift+Alt+F`).

## 🚀 Quick Start (Local Execution Engine)

```bash
npm test           # Run automated self-test suite across Java, C++17, Python 3, Node.js & 93 problems
npm start          # Launch ForgeJudge local server -> http://localhost:3000
```

## 🛠️ Rebuilding the Verified Problem Bank

```bash
npm run build:bank # Compiles all 93 reference solutions and regenerates public/questions.json
```
