/**
 * CSES Problem Set — Track 4: Graph Algorithms & Trees (8 problems, IDs 401-408)
 */
module.exports = [
  {
    id: 401,
    csesId: 1192,
    track: 'CSES Problem Set',
    title: 'Counting Rooms',
    difficulty: 'MEDIUM',
    concept: 'Grid Connected Components (BFS / DFS Flood Fill)',
    section: { name: 'CSES · Graphs & Trees', title: 'Graph Algorithms & Trees' },
    statement: 'You are given a map of a building, and your task is to count the number of its rooms. The size of the map is n x m squares, and each square is either floor (.) or wall (#). You can walk left, right, up, and down through the floor squares.',
    constraints: '1 <= n, m <= 1000',
    explanation: 'Iterate over every cell (r, c). Whenever an unvisited floor cell "." is found, increment the room counter and run BFS/DFS flood fill to mark all connected "." cells as visited.',
    timeComplexity: 'O(N * M)',
    spaceComplexity: 'O(N * M)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int m = sc.nextInt();
        // Count connected components of '.' cells
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int m = sc.nextInt();
        char[][] grid = new char[n][];
        for (int i = 0; i < n; i++) grid[i] = sc.next().toCharArray();
        int rooms = 0;
        int[] dr = {-1, 1, 0, 0};
        int[] dc = {0, 0, -1, 1};
        int[] q = new int[n * m];
        for (int r = 0; r < n; r++) {
            for (int c = 0; c < m; c++) {
                if (grid[r][c] == '.') {
                    rooms++;
                    grid[r][c] = '#';
                    int head = 0, tail = 0;
                    q[tail++] = r * m + c;
                    while (head < tail) {
                        int cur = q[head++];
                        int cr = cur / m, cc = cur % m;
                        for (int d = 0; d < 4; d++) {
                            int nr = cr + dr[d], nc = cc + dc[d];
                            if (nr >= 0 && nr < n && nc >= 0 && nc < m && grid[nr][nc] == '.') {
                                grid[nr][nc] = '#';
                                q[tail++] = nr * m + nc;
                            }
                        }
                    }
                }
            }
        }
        System.out.println(rooms);
    }
}`,
    sampleInput: '5 8\n########\n#..#...#\n####.#.#\n#..#...#\n########',
    sampleOutput: '3',
    testInputs: ['5 8\n########\n#..#...#\n####.#.#\n#..#...#\n########', '3 3\n...\n...\n...', '3 3\n#.#\n.#.\n#.#'],
  },
  {
    id: 402,
    csesId: 1193,
    track: 'CSES Problem Set',
    title: 'Labyrinth (Shortest Path Distance)',
    difficulty: 'MEDIUM',
    concept: 'Grid Shortest Path BFS',
    section: { name: 'CSES · Graphs & Trees', title: 'Graph Algorithms & Trees' },
    statement: 'You are given a map of a labyrinth of size n x m, and your task is to find the shortest path from start A to end B.\n\nPrint "YES" followed by the minimum number of steps on the next line if a path exists, or print "NO" if B is unreachable.',
    constraints: '1 <= n, m <= 1000',
    explanation: 'Run breadth-first search (BFS) starting from cell A. Since all edges have unit weight 1, the first time BFS reaches B gives the shortest path distance.',
    timeComplexity: 'O(N * M)',
    spaceComplexity: 'O(N * M)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int m = sc.nextInt();
        // Find shortest path length from A to B using BFS
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int m = sc.nextInt();
        char[][] g = new char[n][];
        int sr = 0, sc0 = 0, er = 0, ec = 0;
        for (int i = 0; i < n; i++) {
            g[i] = sc.next().toCharArray();
            for (int j = 0; j < m; j++) {
                if (g[i][j] == 'A') { sr = i; sc0 = j; }
                if (g[i][j] == 'B') { er = i; ec = j; }
            }
        }
        int[][] dist = new int[n][m];
        for (int[] row : dist) Arrays.fill(row, -1);
        dist[sr][sc0] = 0;
        int[] q = new int[n * m];
        int head = 0, tail = 0;
        q[tail++] = sr * m + sc0;
        int[] dr = {-1, 1, 0, 0};
        int[] dc = {0, 0, -1, 1};
        while (head < tail) {
            int u = q[head++];
            int r = u / m, c = u % m;
            if (r == er && c == ec) break;
            for (int d = 0; d < 4; d++) {
                int nr = r + dr[d], nc = c + dc[d];
                if (nr >= 0 && nr < n && nc >= 0 && nc < m && g[nr][nc] != '#' && dist[nr][nc] == -1) {
                    dist[nr][nc] = dist[r][c] + 1;
                    q[tail++] = nr * m + nc;
                }
            }
        }
        if (dist[er][ec] == -1) {
            System.out.println("NO");
        } else {
            System.out.println("YES");
            System.out.println(dist[er][ec]);
        }
    }
}`,
    sampleInput: '5 8\n########\n#.A#...#\n#.##.#B#\n#......#\n########',
    sampleOutput: 'YES\n9',
    testInputs: ['5 8\n########\n#.A#...#\n#.##.#B#\n#......#\n########', '3 3\nA#B\n###\n...', '2 3\nA.B\n...'],
  },
  {
    id: 403,
    csesId: 1666,
    track: 'CSES Problem Set',
    title: 'Building Roads',
    difficulty: 'MEDIUM',
    concept: 'Disjoint Set Union (DSU) / Connected Components',
    section: { name: 'CSES · Graphs & Trees', title: 'Graph Algorithms & Trees' },
    statement: 'Byteland has n cities, and m roads between them. The goal is to construct new roads so that there is a route between any two cities.\n\nYour task is to find the minimum number of new roads required. If C is the number of connected components, the answer is C - 1.',
    constraints: '1 <= n <= 10^5\n1 <= m <= 2 * 10^5',
    explanation: 'Use Disjoint Set Union (Union-Find) or DFS to count the number of connected components C. Connecting C components into a single connected graph requires exactly C - 1 edges.',
    timeComplexity: 'O((N + M) alpha(N))',
    spaceComplexity: 'O(N)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int m = sc.nextInt();
        // Print minimum roads required (components - 1)
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    static int[] parent;
    static int find(int x) {
        return parent[x] == x ? x : (parent[x] = find(parent[x]));
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int m = sc.nextInt();
        parent = new int[n + 1];
        for (int i = 1; i <= n; i++) parent[i] = i;
        int comps = n;
        for (int i = 0; i < m; i++) {
            int u = find(sc.nextInt());
            int v = find(sc.nextInt());
            if (u != v) {
                parent[u] = v;
                comps--;
            }
        }
        System.out.println(comps - 1);
    }
}`,
    sampleInput: '4 2\n1 2\n3 4',
    sampleOutput: '1',
    testInputs: ['4 2\n1 2\n3 4', '5 0', '4 3\n1 2\n2 3\n3 4'],
  },
  {
    id: 404,
    csesId: 1667,
    track: 'CSES Problem Set',
    title: 'Message Route',
    difficulty: 'MEDIUM',
    concept: 'Unweighted Graph BFS Shortest Path',
    section: { name: 'CSES · Graphs & Trees', title: 'Graph Algorithms & Trees' },
    statement: 'Syrjälä\'s network has n computers and m connections. Your task is to find if Uolevi can send a message to Maija (from computer 1 to computer n), and if it is possible, what is the minimum number of computers on such a route (including 1 and n). Print "IMPOSSIBLE" if no route exists.',
    constraints: '2 <= n <= 10^5\n1 <= m <= 2 * 10^5',
    explanation: 'Run BFS from vertex 1. Track dist[u] (number of nodes on shortest path from 1 to u, with dist[1] = 1). Output dist[n] or "IMPOSSIBLE".',
    timeComplexity: 'O(N + M)',
    spaceComplexity: 'O(N + M)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int m = sc.nextInt();
        // Find minimum number of computers from 1 to n
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int m = sc.nextInt();
        List<List<Integer>> adj = new ArrayList<>(n + 1);
        for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < m; i++) {
            int u = sc.nextInt(), v = sc.nextInt();
            adj.get(u).add(v);
            adj.get(v).add(u);
        }
        int[] dist = new int[n + 1];
        Arrays.fill(dist, -1);
        Queue<Integer> q = new ArrayDeque<>();
        dist[1] = 1;
        q.add(1);
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : adj.get(u)) {
                if (dist[v] == -1) {
                    dist[v] = dist[u] + 1;
                    q.add(v);
                }
            }
        }
        System.out.println(dist[n] == -1 ? "IMPOSSIBLE" : dist[n]);
    }
}`,
    sampleInput: '5 5\n1 2\n1 3\n1 4\n2 3\n5 4',
    sampleOutput: '3',
    testInputs: ['5 5\n1 2\n1 3\n1 4\n2 3\n5 4', '4 2\n1 2\n3 4', '3 2\n1 2\n2 3'],
  },
  {
    id: 405,
    csesId: 1671,
    track: 'CSES Problem Set',
    title: 'Shortest Routes I',
    difficulty: 'MEDIUM-HARD',
    concept: "Dijkstra's Shortest Path Algorithm",
    section: { name: 'CSES · Graphs & Trees', title: 'Graph Algorithms & Trees' },
    statement: 'There are n cities and m flight connections between them. Your task is to determine the length of the shortest route from Syrjälä (city 1) to every city 1, 2, ..., n.\nAll flight Connections are directed with positive edge weights.',
    constraints: '1 <= n <= 10^5\n1 <= m <= 2 * 10^5\n1 <= c <= 10^9',
    explanation: "Use Dijkstra's algorithm with a min-PriorityQueue storing (distance, vertex) pairs. Use 64-bit longs for distances.",
    timeComplexity: 'O((N + M) log N)',
    spaceComplexity: 'O(N + M)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int m = sc.nextInt();
        // Implement Dijkstra's Algorithm from node 1
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int m = sc.nextInt();
        List<List<long[]>> adj = new ArrayList<>(n + 1);
        for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < m; i++) {
            int u = sc.nextInt();
            int v = sc.nextInt();
            long w = sc.nextLong();
            adj.get(u).add(new long[]{v, w});
        }
        long[] dist = new long[n + 1];
        Arrays.fill(dist, Long.MAX_VALUE);
        dist[1] = 0;
        PriorityQueue<long[]> pq = new PriorityQueue<>(Comparator.comparingLong(a -> a[0]));
        pq.add(new long[]{0, 1});
        while (!pq.isEmpty()) {
            long[] top = pq.poll();
            long d = top[0];
            int u = (int) top[1];
            if (d > dist[u]) continue;
            for (long[] edge : adj.get(u)) {
                int v = (int) edge[0];
                long w = edge[1];
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    pq.add(new long[]{dist[v], v});
                }
            }
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= n; i++) {
            if (i > 1) sb.append(' ');
            sb.append(dist[i]);
        }
        System.out.println(sb.toString());
    }
}`,
    sampleInput: '3 4\n1 2 6\n1 3 2\n3 2 3\n1 3 4',
    sampleOutput: '0 5 2',
    testInputs: ['3 4\n1 2 6\n1 3 2\n3 2 3\n1 3 4', '4 3\n1 2 5\n2 3 5\n3 4 5'],
  },
  {
    id: 406,
    csesId: 1672,
    track: 'CSES Problem Set',
    title: 'Shortest Routes II',
    difficulty: 'MEDIUM-HARD',
    concept: 'Floyd-Warshall All-Pairs Shortest Path',
    section: { name: 'CSES · Graphs & Trees', title: 'Graph Algorithms & Trees' },
    statement: 'There are n cities and m two-way roads between them. Your task is to process q queries where you have to determine the length of the shortest route between two given cities (or -1 if no route exists).',
    constraints: '1 <= n <= 500\n1 <= m <= n^2\n1 <= q <= 10^5\n1 <= c <= 10^9',
    explanation: 'Run Floyd-Warshall in O(n^3): dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]) for intermediate k = 1..n. Handle multiple edges between the same pair by keeping the minimum weight.',
    timeComplexity: 'O(N^3 + Q)',
    spaceComplexity: 'O(N^2)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int m = sc.nextInt();
        int q = sc.nextInt();
        // Implement Floyd-Warshall
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int m = sc.nextInt();
        int q = sc.nextInt();
        long INF = (long) 1e18;
        long[][] d = new long[n + 1][n + 1];
        for (int i = 1; i <= n; i++) {
            Arrays.fill(d[i], INF);
            d[i][i] = 0;
        }
        for (int i = 0; i < m; i++) {
            int u = sc.nextInt(), v = sc.nextInt();
            long w = sc.nextLong();
            if (w < d[u][v]) {
                d[u][v] = d[v][u] = w;
            }
        }
        for (int k = 1; k <= n; k++) {
            for (int i = 1; i <= n; i++) {
                if (d[i][k] == INF) continue;
                for (int j = 1; j <= n; j++) {
                    if (d[k][j] != INF && d[i][k] + d[k][j] < d[i][j]) {
                        d[i][j] = d[i][k] + d[k][j];
                    }
                }
            }
        }
        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int u = sc.nextInt(), v = sc.nextInt();
            sb.append(d[u][v] >= INF ? -1 : d[u][v]).append('\\n');
        }
        System.out.print(sb.toString());
    }
}`,
    sampleInput: '4 3 5\n1 2 5\n1 3 9\n2 3 3\n1 2\n2 1\n1 3\n1 4\n3 2',
    sampleOutput: '5\n5\n8\n-1\n3',
    testInputs: ['4 3 5\n1 2 5\n1 3 9\n2 3 3\n1 2\n2 1\n1 3\n1 4\n3 2', '3 2 2\n1 2 4\n2 3 6\n1 3\n2 2'],
  },
  {
    id: 407,
    csesId: 1674,
    track: 'CSES Problem Set',
    title: 'Subordinates',
    difficulty: 'MEDIUM',
    concept: 'Tree DFS / Subtree Size DP',
    section: { name: 'CSES · Graphs & Trees', title: 'Graph Algorithms & Trees' },
    statement: 'Given the structure of a company of n employees (employee 1 is the general director, and you are given the direct boss of each employee 2, 3, ..., n), calculate for each employee the total number of their subordinates (direct and indirect).',
    constraints: '1 <= n <= 2 * 10^5',
    explanation: 'In a rooted tree at 1, the number of subordinates of node u is (subtreeSize[u] - 1). Process nodes in reverse topological order (or post-order DFS) accumulating child subtree sizes into their parent.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Calculate subtree sizes for employees 1..n
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] parent = new int[n + 1];
        int[] deg = new int[n + 1];
        for (int i = 2; i <= n; i++) {
            parent[i] = sc.nextInt();
            deg[parent[i]]++;
        }
        int[] sub = new int[n + 1];
        Queue<Integer> q = new ArrayDeque<>();
        for (int i = 1; i <= n; i++) {
            if (deg[i] == 0) q.add(i);
        }
        while (!q.isEmpty()) {
            int u = q.poll();
            if (u == 1) break;
            int p = parent[u];
            sub[p] += sub[u] + 1;
            if (--deg[p] == 0) q.add(p);
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= n; i++) {
            if (i > 1) sb.append(' ');
            sb.append(sub[i]);
        }
        System.out.println(sb.toString());
    }
}`,
    sampleInput: '5\n1 1 2 3',
    sampleOutput: '4 1 1 0 0',
    testInputs: ['5\n1 1 2 3', '4\n1 2 3', '4\n1 1 1'],
  },
  {
    id: 408,
    csesId: 1131,
    track: 'CSES Problem Set',
    title: 'Tree Diameter',
    difficulty: 'MEDIUM',
    concept: 'Two-BFS Farthest Node Tree Diameter',
    section: { name: 'CSES · Graphs & Trees', title: 'Graph Algorithms & Trees' },
    statement: 'You are given a tree consisting of n nodes. The diameter of a tree is the maximum distance between two nodes. Your task is to determine the diameter of the tree.',
    constraints: '1 <= n <= 2 * 10^5',
    explanation: 'Run BFS from an arbitrary node (node 1) to find the farthest node X. Then run a second BFS starting from X; the maximum distance from X to any node is the diameter of the tree.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Compute tree diameter using Two-BFS
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    static int[] bfs(int start, int n, List<List<Integer>> adj) {
        int[] dist = new int[n + 1];
        Arrays.fill(dist, -1);
        dist[start] = 0;
        Queue<Integer> q = new ArrayDeque<>();
        q.add(start);
        int farthest = start;
        while (!q.isEmpty()) {
            int u = q.poll();
            if (dist[u] > dist[farthest]) farthest = u;
            for (int v : adj.get(u)) {
                if (dist[v] == -1) {
                    dist[v] = dist[u] + 1;
                    q.add(v);
                }
            }
        }
        return new int[]{farthest, dist[farthest]};
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        List<List<Integer>> adj = new ArrayList<>(n + 1);
        for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < n - 1; i++) {
            int u = sc.nextInt(), v = sc.nextInt();
            adj.get(u).add(v);
            adj.get(v).add(u);
        }
        int[] first = bfs(1, n, adj);
        int[] second = bfs(first[0], n, adj);
        System.out.println(second[1]);
    }
}`,
    sampleInput: '5\n1 2\n1 3\n3 4\n3 5',
    sampleOutput: '3',
    testInputs: ['5\n1 2\n1 3\n3 4\n3 5', '1', '4\n1 2\n2 3\n3 4'],
  },
];
