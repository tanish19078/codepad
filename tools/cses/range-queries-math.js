/**
 * CSES Problem Set — Track 5: Range Queries, Mathematics & Strings (8 problems, IDs 501-508)
 */
module.exports = [
  {
    id: 501,
    csesId: 1646,
    track: 'CSES Problem Set',
    title: 'Static Range Sum Queries',
    difficulty: 'EASY',
    concept: '1D Prefix Sums',
    section: { name: 'CSES · Range Queries & Math', title: 'Range Queries, Math & Strings' },
    statement: 'Given an array of n integers, your task is to process q queries of the form: what is the sum of values in range [a, b] (1-indexed)?',
    constraints: '1 <= n, q <= 2 * 10^5\n1 <= x_i <= 10^9\n1 <= a <= b <= n',
    explanation: 'Precompute prefix sums pref[i] = pref[i-1] + x[i] in O(n) time. Each query [a, b] is answered in O(1) as pref[b] - pref[a-1].',
    timeComplexity: 'O(N + Q)',
    spaceComplexity: 'O(N)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int q = sc.nextInt();
        // Answer q range sum queries [a, b]
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int q = sc.nextInt();
        long[] pref = new long[n + 1];
        for (int i = 1; i <= n; i++) {
            pref[i] = pref[i - 1] + sc.nextLong();
        }
        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int a = sc.nextInt();
            int b = sc.nextInt();
            sb.append(pref[b] - pref[a - 1]).append('\\n');
        }
        System.out.print(sb.toString());
    }
}`,
    sampleInput: '8 4\n3 2 4 5 1 1 5 3\n2 4\n5 6\n1 8\n3 3',
    sampleOutput: '11\n2\n24\n4',
    testInputs: ['8 4\n3 2 4 5 1 1 5 3\n2 4\n5 6\n1 8\n3 3', '4 2\n10 20 30 40\n1 4\n2 3'],
  },
  {
    id: 502,
    csesId: 1647,
    track: 'CSES Problem Set',
    title: 'Static Range Minimum Queries',
    difficulty: 'MEDIUM',
    concept: 'Sparse Table / RMQ',
    section: { name: 'CSES · Range Queries & Math', title: 'Range Queries, Math & Strings' },
    statement: 'Given an array of n integers, your task is to process q queries of the form: what is the minimum value in range [a, b] (1-indexed)?',
    constraints: '1 <= n, q <= 2 * 10^5\n1 <= x_i <= 10^9\n1 <= a <= b <= n',
    explanation: 'Build a Sparse Table st[k][i] = minimum in [i, i + 2^k - 1] in O(n log n) time. Answer each query [a, b] in O(1) using k = floor(log2(b - a + 1)).',
    timeComplexity: 'O(N log N + Q)',
    spaceComplexity: 'O(N log N)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int q = sc.nextInt();
        // Answer q range minimum queries [a, b]
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int q = sc.nextInt();
        int LOG = 18;
        int[][] st = new int[LOG][n + 1];
        for (int i = 1; i <= n; i++) st[0][i] = sc.nextInt();
        for (int k = 1; k < LOG; k++) {
            for (int i = 1; i + (1 << k) - 1 <= n; i++) {
                st[k][i] = Math.min(st[k - 1][i], st[k - 1][i + (1 << (k - 1))]);
            }
        }
        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int a = sc.nextInt();
            int b = sc.nextInt();
            int k = 31 - Integer.numberOfLeadingZeros(b - a + 1);
            sb.append(Math.min(st[k][a], st[k][b - (1 << k) + 1])).append('\\n');
        }
        System.out.print(sb.toString());
    }
}`,
    sampleInput: '8 4\n3 2 4 5 1 1 5 3\n2 4\n5 6\n1 8\n3 3',
    sampleOutput: '2\n1\n1\n4',
    testInputs: ['8 4\n3 2 4 5 1 1 5 3\n2 4\n5 6\n1 8\n3 3', '5 2\n9 8 7 6 5\n1 3\n3 5'],
  },
  {
    id: 503,
    csesId: 1648,
    track: 'CSES Problem Set',
    title: 'Dynamic Range Sum Queries',
    difficulty: 'MEDIUM-HARD',
    concept: 'Fenwick Tree (Binary Indexed Tree) / Segment Tree',
    section: { name: 'CSES · Range Queries & Math', title: 'Range Queries, Math & Strings' },
    statement: 'Given an array of n integers, your task is to process q queries of the following types:\n1. update the value at position k to u\n2. what is the sum of values in range [a, b]?',
    constraints: '1 <= n, q <= 2 * 10^5\n1 <= x_i, u <= 10^9',
    explanation: 'Maintain a Fenwick Tree (Binary Indexed Tree) supporting point add in O(log n) and prefix sum in O(log n).',
    timeComplexity: 'O((N + Q) log N)',
    spaceComplexity: 'O(N)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int q = sc.nextInt();
        // Implement Fenwick Tree / Segment Tree
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    static long[] bit;
    static int n;

    static void add(int idx, long delta) {
        for (; idx <= n; idx += idx & -idx) bit[idx] += delta;
    }

    static long query(int idx) {
        long s = 0;
        for (; idx > 0; idx -= idx & -idx) s += bit[idx];
        return s;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        int q = sc.nextInt();
        long[] arr = new long[n + 1];
        bit = new long[n + 1];
        for (int i = 1; i <= n; i++) {
            arr[i] = sc.nextLong();
            add(i, arr[i]);
        }
        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int type = sc.nextInt();
            if (type == 1) {
                int k = sc.nextInt();
                long u = sc.nextLong();
                add(k, u - arr[k]);
                arr[k] = u;
            } else {
                int a = sc.nextInt();
                int b = sc.nextInt();
                sb.append(query(b) - query(a - 1)).append('\\n');
            }
        }
        System.out.print(sb.toString());
    }
}`,
    sampleInput: '8 4\n3 2 4 5 1 1 5 3\n2 2 4\n1 3 1\n2 2 4\n2 1 8',
    sampleOutput: '11\n8\n21',
    testInputs: ['8 4\n3 2 4 5 1 1 5 3\n2 2 4\n1 3 1\n2 2 4\n2 1 8', '4 3\n1 2 3 4\n2 1 4\n1 2 10\n2 1 4'],
  },
  {
    id: 504,
    csesId: 1650,
    track: 'CSES Problem Set',
    title: 'Range Xor Queries',
    difficulty: 'EASY',
    concept: 'Prefix XOR Accumulator',
    section: { name: 'CSES · Range Queries & Math', title: 'Range Queries, Math & Strings' },
    statement: 'Given an array of n integers, your task is to process q queries of the form: what is the xor sum of values in range [a, b]?',
    constraints: '1 <= n, q <= 2 * 10^5\n1 <= x_i <= 10^9',
    explanation: 'Since x ^ x = 0, the XOR sum of range [a, b] is simply prefXor[b] ^ prefXor[a - 1].',
    timeComplexity: 'O(N + Q)',
    spaceComplexity: 'O(N)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int q = sc.nextInt();
        // Answer q range XOR queries
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int q = sc.nextInt();
        int[] px = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            px[i] = px[i - 1] ^ sc.nextInt();
        }
        StringBuilder sb = new StringBuilder();
        while (q-- > 0) {
            int a = sc.nextInt();
            int b = sc.nextInt();
            sb.append(px[b] ^ px[a - 1]).append('\\n');
        }
        System.out.print(sb.toString());
    }
}`,
    sampleInput: '8 4\n3 2 4 5 1 1 5 3\n2 4\n5 6\n1 8\n3 3',
    sampleOutput: '3\n0\n6\n4',
    testInputs: ['8 4\n3 2 4 5 1 1 5 3\n2 4\n5 6\n1 8\n3 3', '4 2\n7 7 7 7\n1 2\n1 3'],
  },
  {
    id: 505,
    csesId: 1095,
    track: 'CSES Problem Set',
    title: 'Exponentiation',
    difficulty: 'EASY',
    concept: 'Modular Binary Exponentiation (O(log B))',
    section: { name: 'CSES · Range Queries & Math', title: 'Range Queries, Math & Strings' },
    statement: 'Your task is to efficiently calculate the values a^b modulo 10^9 + 7.\nNote that in this task we assume that 0^0 = 1.',
    constraints: '1 <= n <= 2 * 10^5\n0 <= a, b <= 10^9',
    explanation: 'Square-and-multiply binary exponentiation computes a^b mod M in O(log b) multiplications.',
    timeComplexity: 'O(N log B)',
    spaceComplexity: 'O(1)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Compute a^b mod 10^9+7 for each query
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long mod = 1000000007L;
        StringBuilder sb = new StringBuilder();
        while (n-- > 0) {
            long a = sc.nextLong();
            long b = sc.nextLong();
            long res = 1;
            a %= mod;
            while (b > 0) {
                if ((b & 1) == 1) res = (res * a) % mod;
                a = (a * a) % mod;
                b >>= 1;
            }
            sb.append(res).append('\\n');
        }
        System.out.print(sb.toString());
    }
}`,
    sampleInput: '3\n3 4\n2 8\n123 123',
    sampleOutput: '81\n256\n921450052',
    testInputs: ['3\n3 4\n2 8\n123 123', '3\n0 0\n5 0\n2 10'],
  },
  {
    id: 506,
    csesId: 1713,
    track: 'CSES Problem Set',
    title: 'Counting Divisors',
    difficulty: 'EASY',
    concept: 'Divisor Sieve / Trial Division',
    section: { name: 'CSES · Range Queries & Math', title: 'Range Queries, Math & Strings' },
    statement: 'Given n integers, your task is to report for each integer the number of its divisors.\nFor example, if x = 18, the correct answer is 6 because its divisors are 1, 2, 3, 6, 9, 18.',
    constraints: '1 <= n <= 10^5\n1 <= x <= 10^6',
    explanation: 'Precompute divisor counts for all integers up to MAX = 10^6 using a sieve in O(MAX log MAX) time: for i = 1..MAX, for j = i, 2i, 3i..MAX, divs[j]++.',
    timeComplexity: 'O(MAX log MAX + N)',
    spaceComplexity: 'O(MAX)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Count divisors for each query x
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] qs = new int[n];
        int maxX = 0;
        for (int i = 0; i < n; i++) {
            qs[i] = sc.nextInt();
            if (qs[i] > maxX) maxX = qs[i];
        }
        int[] divs = new int[maxX + 1];
        for (int i = 1; i <= maxX; i++) {
            for (int j = i; j <= maxX; j += i) {
                divs[j]++;
            }
        }
        StringBuilder sb = new StringBuilder();
        for (int x : qs) sb.append(divs[x]).append('\\n');
        System.out.print(sb.toString());
    }
}`,
    sampleInput: '3\n16\n17\n18',
    sampleOutput: '5\n2\n6',
    testInputs: ['3\n16\n17\n18', '4\n1\n6\n12\n36'],
  },
  {
    id: 507,
    csesId: 1081,
    track: 'CSES Problem Set',
    title: 'Common Divisors',
    difficulty: 'MEDIUM-HARD',
    concept: 'Harmonic Multiple Counting Sieve',
    section: { name: 'CSES · Range Queries & Math', title: 'Range Queries, Math & Strings' },
    statement: 'You are given an array of n positive integers. Your task is to find two integers such that their greatest common divisor is as large as possible.',
    constraints: '2 <= n <= 2 * 10^5\n1 <= x_i <= 10^6',
    explanation: 'Count frequencies freq[v] of all input numbers. Iterate potential GCD g from MAX down to 1, summing freq[g] + freq[2g] + freq[3g] + ... The first g with total multiples >= 2 is the maximum GCD.',
    timeComplexity: 'O(MAX log MAX)',
    spaceComplexity: 'O(MAX)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Find max GCD among all pairs
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int maxVal = 0;
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
            if (arr[i] > maxVal) maxVal = arr[i];
        }
        int[] freq = new int[maxVal + 1];
        for (int x : arr) freq[x]++;
        for (int g = maxVal; g >= 1; g--) {
            int multiples = 0;
            for (int m = g; m <= maxVal; m += g) {
                multiples += freq[m];
                if (multiples >= 2) {
                    System.out.println(g);
                    return;
                }
            }
        }
        System.out.println(1);
    }
}`,
    sampleInput: '5\n3 14 15 7 9',
    sampleOutput: '7',
    testInputs: ['5\n3 14 15 7 9', '4\n12 18 24 5', '3\n7 11 13'],
  },
  {
    id: 508,
    csesId: 1753,
    track: 'CSES Problem Set',
    title: 'String Matching',
    difficulty: 'MEDIUM',
    concept: 'Knuth-Morris-Pratt (KMP) Prefix Automaton',
    section: { name: 'CSES · Range Queries & Math', title: 'Range Queries, Math & Strings' },
    statement: 'Given a string s and a pattern p, your task is to count the number of positions where the pattern occurs in the string.',
    constraints: '1 <= |s|, |p| <= 10^6',
    explanation: 'Build the KMP prefix function (pi table) on the concatenated string "p#s". Count how many positions have pi[i] == |p|.',
    timeComplexity: 'O(|S| + |P|)',
    spaceComplexity: 'O(|S| + |P|)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        String p = sc.next();
        // Count occurrences of pattern p in string s using KMP
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        String p = sc.next();
        String combined = p + "#" + s;
        int n = combined.length();
        int m = p.length();
        int[] pi = new int[n];
        int count = 0;
        for (int i = 1; i < n; i++) {
            int j = pi[i - 1];
            while (j > 0 && combined.charAt(i) != combined.charAt(j)) {
                j = pi[j - 1];
            }
            if (combined.charAt(i) == combined.charAt(j)) j++;
            pi[i] = j;
            if (j == m) count++;
        }
        System.out.println(count);
    }
}`,
    sampleInput: 'saippuakauppias\npp',
    sampleOutput: '2',
    testInputs: ['saippuakauppias\npp', 'aaaaa\naa', 'abcdef\nxyz'],
  },
];
