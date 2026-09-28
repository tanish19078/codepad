/**
 * CSES Problem Set — Track 2: Sorting and Searching (12 problems, IDs 201-212)
 */
module.exports = [
  {
    id: 201,
    csesId: 1621,
    track: 'CSES Problem Set',
    title: 'Distinct Numbers',
    difficulty: 'EASY',
    concept: 'Sorting / HashSet',
    section: { name: 'CSES · Sorting & Searching', title: 'Sorting and Searching' },
    statement: 'You are given a list of n integers, and your task is to calculate the number of distinct values in the list.',
    constraints: '1 <= n <= 2 * 10^5\n1 <= x_i <= 10^9',
    explanation: 'Sort the array and count adjacent elements that differ (arr[i] != arr[i-1]), or insert all elements into a HashSet.',
    timeComplexity: 'O(N log N)',
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
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        Arrays.sort(a);
        int distinct = n > 0 ? 1 : 0;
        for (int i = 1; i < n; i++) {
            if (a[i] != a[i - 1]) distinct++;
        }
        System.out.println(distinct);
    }
}`,
    sampleInput: '5\n2 3 2 2 3',
    sampleOutput: '2',
    testInputs: ['5\n2 3 2 2 3', '6\n1 2 3 4 5 6', '4\n9 9 9 9'],
  },
  {
    id: 202,
    csesId: 1084,
    track: 'CSES Problem Set',
    title: 'Apartments',
    difficulty: 'MEDIUM',
    concept: 'Sorting + Two Pointers Greedy Matching',
    section: { name: 'CSES · Sorting & Searching', title: 'Sorting and Searching' },
    statement: 'There are n applicants and m free apartments. Your task is to distribute the apartments so that as many applicants as possible will get an apartment.\n\nEach applicant has a desired apartment size, and they will accept any apartment whose size is close enough to the desired size (within +-k).',
    constraints: '1 <= n, m <= 2 * 10^5\n0 <= k <= 10^9\n1 <= a_i, b_j <= 10^9',
    explanation: 'Sort both applicant desires and apartment sizes. Use two pointers i and j: if |a[i] - b[j]| <= k, match them and advance both; if b[j] < a[i] - k, apartment j is too small so j++; otherwise i++.',
    timeComplexity: 'O(N log N + M log M)',
    spaceComplexity: 'O(N + M)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int m = sc.nextInt();
        long k = sc.nextLong();
        // Write your two-pointer greedy matching solution
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int m = sc.nextInt();
        long k = sc.nextLong();
        long[] a = new long[n];
        long[] b = new long[m];
        for (int i = 0; i < n; i++) a[i] = sc.nextLong();
        for (int j = 0; j < m; j++) b[j] = sc.nextLong();
        Arrays.sort(a);
        Arrays.sort(b);
        int i = 0, j = 0, matches = 0;
        while (i < n && j < m) {
            if (Math.abs(a[i] - b[j]) <= k) {
                matches++;
                i++;
                j++;
            } else if (b[j] < a[i] - k) {
                j++;
            } else {
                i++;
            }
        }
        System.out.println(matches);
    }
}`,
    sampleInput: '4 3 5\n60 45 80 60\n30 60 75',
    sampleOutput: '2',
    testInputs: ['4 3 5\n60 45 80 60\n30 60 75', '3 3 0\n10 20 30\n10 20 30', '3 2 2\n10 20 30\n1 100'],
  },
  {
    id: 203,
    csesId: 1090,
    track: 'CSES Problem Set',
    title: 'Ferris Wheel',
    difficulty: 'MEDIUM',
    concept: 'Two Pointers, Greedy Pairing',
    section: { name: 'CSES · Sorting & Searching', title: 'Sorting and Searching' },
    statement: 'There are n children who want to go to a Ferris wheel, and your task is to find a gondola for each child.\n\nEach gondola may have one or two children in it, and in addition, the total weight in a gondola may not exceed x. You know the weight of every child.\n\nWhat is the minimum number of gondolas needed for the children?',
    constraints: '1 <= n <= 2 * 10^5\n1 <= x <= 10^9\n1 <= p_i <= x',
    explanation: 'Sort weights. Pair the heaviest remaining child (right pointer r) with the lightest remaining child (left pointer l) if p[l] + p[r] <= x; otherwise the heaviest child rides alone. Each step uses 1 gondola.',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long x = sc.nextLong();
        // Write your code here
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long x = sc.nextLong();
        long[] p = new long[n];
        for (int i = 0; i < n; i++) p[i] = sc.nextLong();
        Arrays.sort(p);
        int l = 0, r = n - 1, gondolas = 0;
        while (l <= r) {
            if (p[l] + p[r] <= x) l++;
            r--;
            gondolas++;
        }
        System.out.println(gondolas);
    }
}`,
    sampleInput: '4 10\n7 2 3 9',
    sampleOutput: '3',
    testInputs: ['4 10\n7 2 3 9', '4 10\n5 5 5 5', '3 6\n6 6 6'],
  },
  {
    id: 204,
    csesId: 1619,
    track: 'CSES Problem Set',
    title: 'Restaurant Customers',
    difficulty: 'MEDIUM',
    concept: 'Sweep-Line Event Sorting',
    section: { name: 'CSES · Sorting & Searching', title: 'Sorting and Searching' },
    statement: 'You are given the arrival and leaving times of n customers in a restaurant.\n\nWhat was the maximum number of customers in the restaurant at any time?',
    constraints: '1 <= n <= 2 * 10^5\n1 <= a < b <= 10^9\nAll arrival and leaving times are distinct.',
    explanation: 'Convert each customer into two events: (+1 at arrival a) and (-1 at departure b). Sort events by timestamp and maintain the running sum and its maximum.',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Write your sweep-line solution
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long[] arr = new long[n];
        long[] dep = new long[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextLong();
            dep[i] = sc.nextLong();
        }
        Arrays.sort(arr);
        Arrays.sort(dep);
        int i = 0, j = 0, cur = 0, best = 0;
        while (i < n && j < n) {
            if (arr[i] < dep[j]) {
                cur++;
                if (cur > best) best = cur;
                i++;
            } else {
                cur--;
                j++;
            }
        }
        System.out.println(best);
    }
}`,
    sampleInput: '3\n5 8\n2 4\n3 9',
    sampleOutput: '2',
    testInputs: ['3\n5 8\n2 4\n3 9', '4\n1 10\n2 9\n3 8\n4 7', '3\n1 2\n3 4\n5 6'],
  },
  {
    id: 205,
    csesId: 1629,
    track: 'CSES Problem Set',
    title: 'Movie Festival',
    difficulty: 'MEDIUM',
    concept: 'Greedy Interval Scheduling (Sort by End Time)',
    section: { name: 'CSES · Sorting & Searching', title: 'Sorting and Searching' },
    statement: 'In a movie festival n movies will be shown. You know the starting and ending time of each movie. What is the maximum number of movies you can watch entirely?',
    constraints: '1 <= n <= 2 * 10^5\n1 <= a < b <= 10^9',
    explanation: 'Classic interval scheduling: sort movies in ascending order of their ending time b. Greedily pick the next movie whose start time a >= lastEnd.',
    timeComplexity: 'O(N log N)',
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
        long[][] movies = new long[n][2];
        for (int i = 0; i < n; i++) {
            movies[i][0] = sc.nextLong();
            movies[i][1] = sc.nextLong();
        }
        Arrays.sort(movies, (u, v) -> Long.compare(u[1], v[1]));
        int count = 0;
        long lastEnd = -1;
        for (int i = 0; i < n; i++) {
            if (movies[i][0] >= lastEnd) {
                count++;
                lastEnd = movies[i][1];
            }
        }
        System.out.println(count);
    }
}`,
    sampleInput: '3\n3 5\n4 9\n5 8',
    sampleOutput: '2',
    testInputs: ['3\n3 5\n4 9\n5 8', '4\n1 3\n2 4\n3 5\n4 6', '3\n1 10\n2 3\n4 5'],
  },
  {
    id: 206,
    csesId: 1640,
    track: 'CSES Problem Set',
    title: 'Sum of Two Values',
    difficulty: 'EASY',
    concept: 'HashMap / Two-Sum Lookup',
    section: { name: 'CSES · Sorting & Searching', title: 'Sorting and Searching' },
    statement: 'You are given an array of n integers, and your task is to find two values (at distinct 1-based positions i < j) whose sum is x.\n\nPrint the two 1-based positions in increasing order (preferring the earliest second index j if multiple exist), or print "IMPOSSIBLE" if no solution exists.',
    constraints: '1 <= n <= 2 * 10^5\n1 <= x, a_i <= 10^9',
    explanation: 'Iterate j from 1 to n. Check if (x - a[j]) is already in our HashMap of seen values. If found at index i, print i and j and terminate.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long x = sc.nextLong();
        // Find 1-based indices i < j such that a[i] + a[j] == x
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long x = sc.nextLong();
        Map<Long, Integer> seen = new HashMap<>();
        for (int i = 1; i <= n; i++) {
            long val = sc.nextLong();
            long need = x - val;
            if (seen.containsKey(need)) {
                System.out.println(seen.get(need) + " " + i);
                return;
            }
            if (!seen.containsKey(val)) {
                seen.put(val, i);
            }
        }
        System.out.println("IMPOSSIBLE");
    }
}`,
    sampleInput: '4 8\n2 7 5 1',
    sampleOutput: '2 4',
    testInputs: ['4 8\n2 7 5 1', '3 10\n1 2 3', '4 6\n3 3 1 5'],
  },
  {
    id: 207,
    csesId: 1643,
    track: 'CSES Problem Set',
    title: 'Maximum Subarray Sum',
    difficulty: 'EASY',
    concept: "Kadane's Algorithm",
    section: { name: 'CSES · Sorting & Searching', title: 'Sorting and Searching' },
    statement: 'Given an array of n integers, your task is to find the maximum sum of values in a contiguous, non-empty subarray.',
    constraints: '1 <= n <= 2 * 10^5\n-10^9 <= x_i <= 10^9',
    explanation: "By Kadane's algorithm, the maximum subarray ending at index i is cur = max(a[i], cur + a[i]). Track the global maximum across all i.",
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Implement Kadane's Algorithm
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long cur = sc.nextLong();
        long best = cur;
        for (int i = 1; i < n; i++) {
            long x = sc.nextLong();
            cur = Math.max(x, cur + x);
            best = Math.max(best, cur);
        }
        System.out.println(best);
    }
}`,
    sampleInput: '8\n-1 3 -2 5 3 -5 2 2',
    sampleOutput: '9',
    testInputs: ['8\n-1 3 -2 5 3 -5 2 2', '3\n-5 -2 -9', '5\n1 2 3 4 5'],
  },
  {
    id: 208,
    csesId: 1074,
    track: 'CSES Problem Set',
    title: 'Stick Lengths',
    difficulty: 'EASY',
    concept: 'Median Minimizes L1 Distance',
    section: { name: 'CSES · Sorting & Searching', title: 'Sorting and Searching' },
    statement: 'There are n sticks with some lengths. Your task is to modify the sticks so that each stick has the same length.\n\nYou can either lengthen and shorten each stick. Both operations cost x where x is the difference between the new and original length.\n\nWhat is the minimum total cost?',
    constraints: '1 <= n <= 2 * 10^5\n1 <= p_i <= 10^9',
    explanation: 'The sum of absolute deviations sum(|p_i - T|) is minimized when T is the median of the array (p[n/2] after sorting).',
    timeComplexity: 'O(N log N)',
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
        long[] p = new long[n];
        for (int i = 0; i < n; i++) p[i] = sc.nextLong();
        Arrays.sort(p);
        long median = p[n / 2];
        long cost = 0;
        for (long x : p) cost += Math.abs(x - median);
        System.out.println(cost);
    }
}`,
    sampleInput: '5\n2 3 1 5 2',
    sampleOutput: '5',
    testInputs: ['5\n2 3 1 5 2', '4\n10 10 10 10', '4\n1 10 100 1000'],
  },
  {
    id: 209,
    csesId: 2183,
    track: 'CSES Problem Set',
    title: 'Missing Coin Sum',
    difficulty: 'MEDIUM',
    concept: 'Greedy Reachable Prefix Range',
    section: { name: 'CSES · Sorting & Searching', title: 'Sorting and Searching' },
    statement: 'You have n coins with positive integer values. What is the smallest sum you cannot create using a subset of the coins?',
    constraints: '1 <= n <= 2 * 10^5\n1 <= x_i <= 10^9',
    explanation: 'Sort the coins. Maintain the smallest unreachable value target = 1 (meaning all sums in [1, target-1] are achievable). If the next coin c <= target, we can extend our reachable range to [1, target + c - 1]; otherwise target cannot be formed.',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Find smallest unreachable coin sum
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long[] c = new long[n];
        for (int i = 0; i < n; i++) c[i] = sc.nextLong();
        Arrays.sort(c);
        long target = 1;
        for (long x : c) {
            if (x > target) break;
            target += x;
        }
        System.out.println(target);
    }
}`,
    sampleInput: '5\n2 9 1 2 7',
    sampleOutput: '6',
    testInputs: ['5\n2 9 1 2 7', '3\n2 3 4', '4\n1 1 1 1'],
  },
  {
    id: 210,
    csesId: 2216,
    track: 'CSES Problem Set',
    title: 'Collecting Numbers',
    difficulty: 'MEDIUM',
    concept: 'Permutation Inversions / Position Lookup',
    section: { name: 'CSES · Sorting & Searching', title: 'Sorting and Searching' },
    statement: 'You are given an array that contains each number between 1 ... n exactly once. Your task is to collect the numbers from 1 to n in increasing order.\n\nOn each round, you go through the array from left to right and collect as many numbers as possible. How many rounds will it take?',
    constraints: '1 <= n <= 2 * 10^5',
    explanation: 'Store the index pos[v] of each value v in 1..n. Start with 1 round. Whenever pos[v] < pos[v - 1], value v appears to the left of v - 1, so we must start a new round.',
    timeComplexity: 'O(N)',
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
        int[] pos = new int[n + 1];
        for (int i = 0; i < n; i++) {
            pos[sc.nextInt()] = i;
        }
        int rounds = 1;
        for (int v = 2; v <= n; v++) {
            if (pos[v] < pos[v - 1]) rounds++;
        }
        System.out.println(rounds);
    }
}`,
    sampleInput: '5\n4 2 1 5 3',
    sampleOutput: '3',
    testInputs: ['5\n4 2 1 5 3', '4\n1 2 3 4', '4\n4 3 2 1'],
  },
  {
    id: 211,
    csesId: 1073,
    track: 'CSES Problem Set',
    title: 'Towers',
    difficulty: 'MEDIUM',
    concept: 'Patience Sorting, Upper-Bound Binary Search',
    section: { name: 'CSES · Sorting & Searching', title: 'Sorting and Searching' },
    statement: 'You are given n cubes in a certain order, and your task is to build towers using them. Whenever two cubes are one on top of the other, the upper cube must be strictly smaller than the lower cube.\n\nYou must process the cubes in the given order. What is the minimum possible number of towers?',
    constraints: '1 <= n <= 2 * 10^5\n1 <= k_i <= 10^9',
    explanation: 'Maintain a sorted list of the top cube sizes of all active towers. For each incoming cube x, binary search for the smallest tower top strictly greater than x (upper_bound). If found, replace that top with x; otherwise start a new tower.',
    timeComplexity: 'O(N log N)',
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
        ArrayList<Integer> tops = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            int x = sc.nextInt();
            int lo = 0, hi = tops.size();
            while (lo < hi) {
                int mid = (lo + hi) >>> 1;
                if (tops.get(mid) > x) hi = mid;
                else lo = mid + 1;
            }
            if (lo == tops.size()) tops.add(x);
            else tops.set(lo, x);
        }
        System.out.println(tops.size());
    }
}`,
    sampleInput: '5\n3 8 2 1 5',
    sampleOutput: '2',
    testInputs: ['5\n3 8 2 1 5', '4\n1 2 3 4', '4\n4 3 2 1'],
  },
  {
    id: 212,
    csesId: 1660,
    track: 'CSES Problem Set',
    title: 'Subarray Sums I',
    difficulty: 'MEDIUM',
    concept: 'Sliding Window / Prefix Sum Map',
    section: { name: 'CSES · Sorting & Searching', title: 'Sorting and Searching' },
    statement: 'Given an array of n positive integers, your task is to count the number of subarrays having sum x.',
    constraints: '1 <= n <= 2 * 10^5\n1 <= x, a_i <= 10^9',
    explanation: 'Maintain prefix sum frequencies in a HashMap (or use a two-pointer sliding window since all elements are positive). For each prefix sum P, add count[P - x] to the answer.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long x = sc.nextLong();
        // Count subarrays with sum equal to x
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long x = sc.nextLong();
        long[] a = new long[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextLong();
        int l = 0;
        long sum = 0, count = 0;
        for (int r = 0; r < n; r++) {
            sum += a[r];
            while (sum > x && l <= r) {
                sum -= a[l++];
            }
            if (sum == x) count++;
        }
        System.out.println(count);
    }
}`,
    sampleInput: '5 7\n2 4 1 2 7',
    sampleOutput: '3',
    testInputs: ['5 7\n2 4 1 2 7', '4 3\n1 1 1 1', '3 10\n1 2 3'],
  },
];
