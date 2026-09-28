/**
 * CSES Problem Set — Track 3: Dynamic Programming (10 problems, IDs 301-310)
 */
module.exports = [
  {
    id: 301,
    csesId: 1633,
    track: 'CSES Problem Set',
    title: 'Dice Combinations',
    difficulty: 'EASY',
    concept: '1D Linear Recurrence DP',
    section: { name: 'CSES · Dynamic Programming', title: 'Dynamic Programming' },
    statement: 'Your task is to count the number of ways to construct sum n by throwing a dice one or more times. Each throw produces an outcome between 1 and 6.\n\nPrint the number of ways modulo 10^9 + 7.',
    constraints: '1 <= n <= 10^6',
    explanation: 'Let dp[s] be the number of ways to form sum s. Base case: dp[0] = 1. For each s from 1 to n, dp[s] = sum_{d=1..6, s-d >= 0} dp[s - d] (mod 10^9 + 7).',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Compute ways to form sum n modulo 10^9+7
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long mod = 1000000007L;
        long[] dp = new long[n + 1];
        dp[0] = 1;
        for (int i = 1; i <= n; i++) {
            long ways = 0;
            for (int d = 1; d <= 6 && i - d >= 0; d++) {
                ways += dp[i - d];
            }
            dp[i] = ways % mod;
        }
        System.out.println(dp[n]);
    }
}`,
    sampleInput: '3',
    sampleOutput: '4',
    testInputs: ['3', '4', '10', '50'],
  },
  {
    id: 302,
    csesId: 1634,
    track: 'CSES Problem Set',
    title: 'Minimizing Coins',
    difficulty: 'MEDIUM',
    concept: 'Unbounded Knapsack Minimum Coins DP',
    section: { name: 'CSES · Dynamic Programming', title: 'Dynamic Programming' },
    statement: 'Consider a money system consisting of n coins. Each coin has a positive integer value. Your task is to produce a sum of money x using the available coins in such a way that the number of coins is minimal.\n\nPrint one integer: the minimum number of coins, or -1 if it is not possible.',
    constraints: '1 <= n <= 100\n1 <= x <= 10^6\n1 <= c_i <= 10^6',
    explanation: 'Initialize dp[0] = 0 and dp[1..x] = INF. For each coin c and sum s from c to x: dp[s] = min(dp[s], dp[s - c] + 1).',
    timeComplexity: 'O(N * X)',
    spaceComplexity: 'O(X)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int x = sc.nextInt();
        // Write your DP solution here
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int x = sc.nextInt();
        int[] coins = new int[n];
        for (int i = 0; i < n; i++) coins[i] = sc.nextInt();
        int INF = 1_000_000_000;
        int[] dp = new int[x + 1];
        Arrays.fill(dp, INF);
        dp[0] = 0;
        for (int c : coins) {
            for (int s = c; s <= x; s++) {
                if (dp[s - c] + 1 < dp[s]) {
                    dp[s] = dp[s - c] + 1;
                }
            }
        }
        System.out.println(dp[x] >= INF ? -1 : dp[x]);
    }
}`,
    sampleInput: '3 11\n1 5 7',
    sampleOutput: '3',
    testInputs: ['3 11\n1 5 7', '2 7\n3 5', '3 15\n1 5 10'],
  },
  {
    id: 303,
    csesId: 1635,
    track: 'CSES Problem Set',
    title: 'Coin Combinations I',
    difficulty: 'MEDIUM',
    concept: 'Ordered Unbounded Knapsack DP',
    section: { name: 'CSES · Dynamic Programming', title: 'Dynamic Programming' },
    statement: 'Consider a money system consisting of n coins. Each coin has a positive integer value. Your task is to calculate the number of distinct ordered ways you can produce a money sum x using the available coins.\n\nPrint the number of ways modulo 10^9 + 7.',
    constraints: '1 <= n <= 100\n1 <= x <= 10^6',
    explanation: 'Because order matters, the outer loop iterates over sums s = 1..x and the inner loop iterates over coins c: dp[s] = (dp[s] + dp[s - c]) % MOD.',
    timeComplexity: 'O(N * X)',
    spaceComplexity: 'O(X)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int x = sc.nextInt();
        // Write your code here
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int x = sc.nextInt();
        int[] coins = new int[n];
        for (int i = 0; i < n; i++) coins[i] = sc.nextInt();
        long mod = 1000000007L;
        long[] dp = new long[x + 1];
        dp[0] = 1;
        for (int s = 1; s <= x; s++) {
            long sum = 0;
            for (int c : coins) {
                if (s >= c) sum += dp[s - c];
            }
            dp[s] = sum % mod;
        }
        System.out.println(dp[x]);
    }
}`,
    sampleInput: '3 9\n2 3 5',
    sampleOutput: '8',
    testInputs: ['3 9\n2 3 5', '2 5\n1 2', '3 6\n2 4 6'],
  },
  {
    id: 304,
    csesId: 1636,
    track: 'CSES Problem Set',
    title: 'Coin Combinations II',
    difficulty: 'MEDIUM',
    concept: 'Unordered Unbounded Knapsack DP',
    section: { name: 'CSES · Dynamic Programming', title: 'Dynamic Programming' },
    statement: 'Consider a money system consisting of n coins. Your task is to calculate the number of distinct unordered ways you can produce a money sum x using the available coins.\n\nPrint the number of ways modulo 10^9 + 7.',
    constraints: '1 <= n <= 100\n1 <= x <= 10^6',
    explanation: 'Because order does NOT matter, the outer loop iterates over each coin c and the inner loop iterates over sums s = c..x: dp[s] = (dp[s] + dp[s - c]) % MOD.',
    timeComplexity: 'O(N * X)',
    spaceComplexity: 'O(X)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int x = sc.nextInt();
        // Write your code here
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int x = sc.nextInt();
        int[] coins = new int[n];
        for (int i = 0; i < n; i++) coins[i] = sc.nextInt();
        long mod = 1000000007L;
        long[] dp = new long[x + 1];
        dp[0] = 1;
        for (int c : coins) {
            for (int s = c; s <= x; s++) {
                dp[s] = (dp[s] + dp[s - c]) % mod;
            }
        }
        System.out.println(dp[x]);
    }
}`,
    sampleInput: '3 9\n2 3 5',
    sampleOutput: '3',
    testInputs: ['3 9\n2 3 5', '2 5\n1 2', '3 6\n1 2 3'],
  },
  {
    id: 305,
    csesId: 1637,
    track: 'CSES Problem Set',
    title: 'Removing Digits',
    difficulty: 'EASY',
    concept: 'Digit DP / Greedy Largest Digit',
    section: { name: 'CSES · Dynamic Programming', title: 'Dynamic Programming' },
    statement: 'You are given an integer n. On each step, you may subtract one of the digits from the number.\n\nHow many steps are required to make the number equal to 0?',
    constraints: '1 <= n <= 10^6',
    explanation: 'At any number v > 0, subtracting its maximum decimal digit (or taking min over all digits d > 0 of dp[v - d] + 1) yields the minimum steps.',
    timeComplexity: 'O(N log_10 N)',
    spaceComplexity: 'O(N)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Write your code here
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int steps = 0;
        while (n > 0) {
            int temp = n, maxDigit = 0;
            while (temp > 0) {
                maxDigit = Math.max(maxDigit, temp % 10);
                temp /= 10;
            }
            n -= maxDigit;
            steps++;
        }
        System.out.println(steps);
    }
}`,
    sampleInput: '27',
    sampleOutput: '5',
    testInputs: ['27', '9', '100', '2026'],
  },
  {
    id: 306,
    csesId: 1638,
    track: 'CSES Problem Set',
    title: 'Grid Paths',
    difficulty: 'MEDIUM',
    concept: '2D Grid Path Counting DP',
    section: { name: 'CSES · Dynamic Programming', title: 'Dynamic Programming' },
    statement: 'Consider an n x n grid whose squares may have traps (*). It is not allowed to move to a square with a trap.\n\nYour task is to calculate the number of paths from the upper-left square to the lower-right square. You can only move right or down. Print the answer modulo 10^9 + 7.',
    constraints: '1 <= n <= 1000',
    explanation: 'dp[r][c] = 0 if grid[r][c] == "*", else dp[r][c] = (dp[r-1][c] + dp[r][c-1]) % MOD with base case dp[0][0] = 1 (if not a trap).',
    timeComplexity: 'O(N^2)',
    spaceComplexity: 'O(N^2)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Read n lines of grid and compute paths modulo 10^9+7
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long mod = 1000000007L;
        long[][] dp = new long[n][n];
        for (int r = 0; r < n; r++) {
            String row = sc.next();
            for (int c = 0; c < n; c++) {
                if (row.charAt(c) == '*') {
                    dp[r][c] = 0;
                } else if (r == 0 && c == 0) {
                    dp[r][c] = 1;
                } else {
                    long up = r > 0 ? dp[r - 1][c] : 0;
                    long left = c > 0 ? dp[r][c - 1] : 0;
                    dp[r][c] = (up + left) % mod;
                }
            }
        }
        System.out.println(dp[n - 1][n - 1]);
    }
}`,
    sampleInput: '4\n....\n.*..\n...*\n*...',
    sampleOutput: '3',
    testInputs: ['4\n....\n.*..\n...*\n*...', '2\n*.\n..', '3\n...\n...\n...'],
  },
  {
    id: 307,
    csesId: 1158,
    track: 'CSES Problem Set',
    title: 'Book Shop',
    difficulty: 'MEDIUM',
    concept: '0/1 Knapsack Dynamic Programming',
    section: { name: 'CSES · Dynamic Programming', title: 'Dynamic Programming' },
    statement: 'You are in a book shop which sells n different books. You know the price and number of pages of each book.\n\nYou have decided that the total price of your purchases will be at most x. What is the maximum number of pages you can buy? You can buy each book at most once.',
    constraints: '1 <= n <= 1000\n1 <= x <= 10^5\n1 <= h_i, s_i <= 1000',
    explanation: 'Classic 0/1 Knapsack: maintain 1D array dp[0..x]. For each book i with price h and pages s, iterate budget w backwards from x down to h: dp[w] = max(dp[w], dp[w - h] + s).',
    timeComplexity: 'O(N * X)',
    spaceComplexity: 'O(X)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int x = sc.nextInt();
        // Write your 0/1 Knapsack solution
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int x = sc.nextInt();
        int[] price = new int[n];
        int[] pages = new int[n];
        for (int i = 0; i < n; i++) price[i] = sc.nextInt();
        for (int i = 0; i < n; i++) pages[i] = sc.nextInt();
        int[] dp = new int[x + 1];
        for (int i = 0; i < n; i++) {
            int h = price[i], s = pages[i];
            for (int w = x; w >= h; w--) {
                if (dp[w - h] + s > dp[w]) {
                    dp[w] = dp[w - h] + s;
                }
            }
        }
        System.out.println(dp[x]);
    }
}`,
    sampleInput: '4 10\n4 8 5 3\n5 12 8 1',
    sampleOutput: '13',
    testInputs: ['4 10\n4 8 5 3\n5 12 8 1', '3 5\n2 3 4\n10 20 30', '2 3\n5 6\n10 20'],
  },
  {
    id: 308,
    csesId: 1639,
    track: 'CSES Problem Set',
    title: 'Edit Distance',
    difficulty: 'MEDIUM',
    concept: 'Levenshtein String DP',
    section: { name: 'CSES · Dynamic Programming', title: 'Dynamic Programming' },
    statement: 'The edit distance between two strings is the minimum number of operations required to transform one string into the other.\n\nThe allowed operations are:\n- Add one character to the string.\n- Remove one character from the string.\n- Replace one character in the string.\n\nCalculate the edit distance between two given strings.',
    constraints: '1 <= |s1|, |s2| <= 5000',
    explanation: 'Let dp[i][j] be the edit distance between prefixes s1[0..i) and s2[0..j). If s1[i-1] == s2[j-1], dp[i][j] = dp[i-1][j-1]; else 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).',
    timeComplexity: 'O(N * M)',
    spaceComplexity: 'O(M)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String a = sc.next();
        String b = sc.next();
        // Compute Levenshtein edit distance
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String a = sc.next();
        String b = sc.next();
        int n = a.length(), m = b.length();
        int[] prev = new int[m + 1];
        int[] cur = new int[m + 1];
        for (int j = 0; j <= m; j++) prev[j] = j;
        for (int i = 1; i <= n; i++) {
            cur[0] = i;
            char ca = a.charAt(i - 1);
            for (int j = 1; j <= m; j++) {
                if (ca == b.charAt(j - 1)) {
                    cur[j] = prev[j - 1];
                } else {
                    cur[j] = 1 + Math.min(prev[j - 1], Math.min(prev[j], cur[j - 1]));
                }
            }
            int[] tmp = prev; prev = cur; cur = tmp;
        }
        System.out.println(prev[m]);
    }
}`,
    sampleInput: 'LOVE\nMOVIE',
    sampleOutput: '2',
    testInputs: ['LOVE\nMOVIE', 'KITTEN\nSITTING', 'ABC\nABC'],
  },
  {
    id: 309,
    csesId: 1145,
    track: 'CSES Problem Set',
    title: 'Increasing Subsequence',
    difficulty: 'MEDIUM-HARD',
    concept: 'O(N log N) Longest Increasing Subsequence (LIS)',
    section: { name: 'CSES · Dynamic Programming', title: 'Dynamic Programming' },
    statement: 'You are given an array containing n integers. Your task is to determine the longest strictly increasing subsequence in the array, i.e., the longest subsequence where every element is larger than the previous one.',
    constraints: '1 <= n <= 2 * 10^5\n1 <= x_i <= 10^9',
    explanation: 'Maintain tails[k] = smallest tail of all increasing subsequences of length k+1. For each x, binary search (lower_bound) in tails and replace or append.',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Find length of Longest Increasing Subsequence
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] tails = new int[n];
        int len = 0;
        for (int i = 0; i < n; i++) {
            int x = sc.nextInt();
            int pos = Arrays.binarySearch(tails, 0, len, x);
            if (pos < 0) pos = -(pos + 1);
            tails[pos] = x;
            if (pos == len) len++;
        }
        System.out.println(len);
    }
}`,
    sampleInput: '8\n7 3 5 3 6 2 9 8',
    sampleOutput: '4',
    testInputs: ['8\n7 3 5 3 6 2 9 8', '5\n5 4 3 2 1', '5\n1 2 3 4 5'],
  },
  {
    id: 310,
    csesId: 1745,
    track: 'CSES Problem Set',
    title: 'Money Sums',
    difficulty: 'MEDIUM',
    concept: 'Subset Sum Bitset / Boolean DP',
    section: { name: 'CSES · Dynamic Programming', title: 'Dynamic Programming' },
    statement: 'You have n coins with certain values. Your task is to find all money sums you can create using these coins.\n\nFirst print the number of distinct positive sums, then print all possible sums in increasing order.',
    constraints: '1 <= n <= 100\n1 <= x_i <= 1000',
    explanation: 'The maximum total sum is S <= 100,000. Use a boolean array reachable[0..S] with reachable[0] = true. For each coin c, iterate s from S down to c and set reachable[s] |= reachable[s - c].',
    timeComplexity: 'O(N * Sum)',
    spaceComplexity: 'O(Sum)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Find all possible subset sums
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] coins = new int[n];
        int maxSum = 0;
        for (int i = 0; i < n; i++) {
            coins[i] = sc.nextInt();
            maxSum += coins[i];
        }
        boolean[] dp = new boolean[maxSum + 1];
        dp[0] = true;
        for (int c : coins) {
            for (int s = maxSum; s >= c; s--) {
                if (dp[s - c]) dp[s] = true;
            }
        }
        List<Integer> sums = new ArrayList<>();
        for (int s = 1; s <= maxSum; s++) {
            if (dp[s]) sums.add(s);
        }
        StringBuilder sb = new StringBuilder();
        sb.append(sums.size()).append('\\n');
        for (int i = 0; i < sums.size(); i++) {
            if (i > 0) sb.append(' ');
            sb.append(sums.get(i));
        }
        System.out.println(sb.toString());
    }
}`,
    sampleInput: '4\n4 2 5 2',
    sampleOutput: '9\n2 4 5 6 7 8 9 11 13',
    testInputs: ['4\n4 2 5 2', '3\n1 2 4', '2\n5 5'],
  },
];
