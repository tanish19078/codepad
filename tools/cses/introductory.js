/**
 * CSES Problem Set — Track 1: Introductory Problems (15 problems, IDs 101-115)
 */
module.exports = [
  {
    id: 101,
    csesId: 1068,
    track: 'CSES Problem Set',
    title: 'Weird Algorithm',
    difficulty: 'EASY',
    concept: 'Simulation, Collatz Conjecture, 64-bit Integers',
    section: { name: 'CSES · Introductory', title: 'Introductory Problems' },
    statement: 'Consider an algorithm that takes as input a positive integer n. If n is even, the algorithm divides it by two, and if n is odd, the algorithm multiplies it by three and adds one. The algorithm repeats this, until n is one.\n\nYour task is to simulate the execution of the algorithm for a given value of n.',
    constraints: '1 <= n <= 10^6\nNote: Intermediate values can exceed 32-bit signed integer limits; use 64-bit integers (long in Java / long long in C++).',
    explanation: 'Starting from n, repeatedly print n and update n = (n % 2 == 0) ? n / 2 : 3 * n + 1 until n == 1. Use a 64-bit integer type to avoid overflow.',
    timeComplexity: 'O(steps)',
    spaceComplexity: 'O(1)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        // Write your code here
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        StringBuilder sb = new StringBuilder();
        while (true) {
            sb.append(n);
            if (n == 1) break;
            sb.append(' ');
            if (n % 2 == 0) n /= 2;
            else n = 3 * n + 1;
        }
        System.out.println(sb.toString());
    }
}`,
    sampleInput: '3',
    sampleOutput: '3 10 5 16 8 4 2 1',
    testInputs: ['3', '1', '7', '15'],
  },
  {
    id: 102,
    csesId: 1083,
    track: 'CSES Problem Set',
    title: 'Missing Number',
    difficulty: 'EASY',
    concept: 'Gauss Sum Formula, Bitwise XOR',
    section: { name: 'CSES · Introductory', title: 'Introductory Problems' },
    statement: 'You are given all numbers between 1, 2, ..., n except one. Your task is to find the missing number.',
    constraints: '2 <= n <= 2 * 10^5',
    explanation: 'The sum of numbers from 1 to n is n*(n+1)/2. Subtract the sum of the given n-1 numbers from n*(n+1)/2 (using 64-bit long) to obtain the missing number.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Read n-1 integers and print the missing number
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        long expected = n * (n + 1) / 2;
        long actual = 0;
        for (int i = 0; i < n - 1; i++) {
            actual += sc.nextLong();
        }
        System.out.println(expected - actual);
    }
}`,
    sampleInput: '5\n2 3 1 5',
    sampleOutput: '4',
    testInputs: ['5\n2 3 1 5', '2\n1', '6\n6 5 4 2 1', '10\n1 2 3 4 5 6 7 8 10'],
  },
  {
    id: 103,
    csesId: 1069,
    track: 'CSES Problem Set',
    title: 'Repetitions',
    difficulty: 'EASY',
    concept: 'String Scan, Sliding Run-Length',
    section: { name: 'CSES · Introductory', title: 'Introductory Problems' },
    statement: 'You are given a DNA sequence: a string consisting of characters A, C, G, and T. Your task is to find the longest repetition in the sequence. This is a maximum-length substring containing only one type of character.',
    constraints: '1 <= |s| <= 10^6',
    explanation: 'Maintain the current run length cur and maximum run length best. Whenever s[i] == s[i-1], increment cur; otherwise reset cur = 1.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        // Write your code here
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int best = 1, cur = 1;
        for (int i = 1; i < s.length(); i++) {
            if (s.charAt(i) == s.charAt(i - 1)) {
                cur++;
                if (cur > best) best = cur;
            } else {
                cur = 1;
            }
        }
        System.out.println(best);
    }
}`,
    sampleInput: 'ATTCGGGA',
    sampleOutput: '3',
    testInputs: ['ATTCGGGA', 'A', 'AAAAACCCCCGGGGTTTTTT', 'ACGTACGT'],
  },
  {
    id: 104,
    csesId: 1094,
    track: 'CSES Problem Set',
    title: 'Increasing Array',
    difficulty: 'EASY',
    concept: 'Greedy Prefix Maximum',
    section: { name: 'CSES · Introductory', title: 'Introductory Problems' },
    statement: 'You are given an array of n integers. You want to modify the array so that it is increasing, i.e., every element is at least as large as the previous element.\n\nOn each move, you may increase the value of any element by one. What is the minimum number of moves required?',
    constraints: '1 <= n <= 2 * 10^5\n1 <= x_i <= 10^9',
    explanation: 'Track the maximum element seen so far (mx). If the current element x < mx, we must increment it by (mx - x) moves, and its new value becomes mx.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
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
        long moves = 0;
        long mx = 0;
        for (int i = 0; i < n; i++) {
            long x = sc.nextLong();
            if (x < mx) moves += (mx - x);
            else mx = x;
        }
        System.out.println(moves);
    }
}`,
    sampleInput: '5\n3 2 5 1 7',
    sampleOutput: '5',
    testInputs: ['5\n3 2 5 1 7', '1\n10', '4\n10 7 4 1', '5\n1 2 3 4 5'],
  },
  {
    id: 105,
    csesId: 1070,
    track: 'CSES Problem Set',
    title: 'Permutations',
    difficulty: 'EASY',
    concept: 'Constructive Parity Partition',
    section: { name: 'CSES · Introductory', title: 'Introductory Problems' },
    statement: 'A permutation of integers 1, 2, ..., n is called beautiful if there are no adjacent elements whose difference is 1.\n\nGiven n, construct a beautiful permutation by printing all even integers in increasing order followed by all odd integers in increasing order, or print "NO SOLUTION" if no such permutation exists.',
    constraints: '1 <= n <= 10^6',
    explanation: 'For n = 1, the answer is "1". For n = 2 and n = 3, no valid arrangement exists ("NO SOLUTION"). For n >= 4, printing all even numbers (2, 4, 6, ...) followed by all odd numbers (1, 3, 5, ...) guarantees adjacent differences are at least 2.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Print even numbers then odd numbers, or NO SOLUTION
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n == 1) {
            System.out.println(1);
            return;
        }
        if (n == 2 || n == 3) {
            System.out.println("NO SOLUTION");
            return;
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 2; i <= n; i += 2) {
            sb.append(i).append(' ');
        }
        for (int i = 1; i <= n; i += 2) {
            sb.append(i).append(' ');
        }
        System.out.println(sb.toString().trim());
    }
}`,
    sampleInput: '5',
    sampleOutput: '2 4 1 3 5',
    testInputs: ['5', '3', '1', '4', '6'],
    checker: `
      const n = parseInt(input.trim(), 10);
      if (n === 2 || n === 3) return actual.trim() === 'NO SOLUTION';
      const arr = actual.trim().split(/\\s+/).map(Number);
      if (arr.length !== n) return false;
      const seen = new Set();
      for (let i = 0; i < n; i++) {
        if (arr[i] < 1 || arr[i] > n || seen.has(arr[i])) return false;
        seen.add(arr[i]);
        if (i > 0 && Math.abs(arr[i] - arr[i - 1]) === 1) return false;
      }
      return true;
    `,
  },
  {
    id: 106,
    csesId: 1071,
    track: 'CSES Problem Set',
    title: 'Number Spiral',
    difficulty: 'MEDIUM',
    concept: 'Grid Mathematics, Layer Parity',
    section: { name: 'CSES · Introductory', title: 'Introductory Problems' },
    statement: 'A number spiral is an infinite grid whose upper-left square has number 1. Here are the first five layers of the spiral:\n\n1  2  9 10 25\n4  3  8 11 24\n5  6  7 12 23\n16 15 14 13 22\n17 18 19 20 21\n\nYour task is to find the number in row y and column x.',
    constraints: '1 <= t <= 10^5\n1 <= y, x <= 10^9',
    explanation: 'Let z = max(y, x). The L-shaped layer z contains numbers from (z-1)^2 + 1 to z^2. Depending on whether z is even or odd, the numbers increase clockwise or counter-clockwise.',
    timeComplexity: 'O(T)',
    spaceComplexity: 'O(1)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int t = sc.nextInt();
        while (t-- > 0) {
            long y = sc.nextLong();
            long x = sc.nextLong();
            // Write your code here
        }
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int t = sc.nextInt();
        StringBuilder sb = new StringBuilder();
        while (t-- > 0) {
            long y = sc.nextLong();
            long x = sc.nextLong();
            long z = Math.max(y, x);
            long z2 = (z - 1) * (z - 1);
            long ans;
            if (z % 2 == 0) {
                if (y == z) ans = z * z - x + 1;
                else ans = z2 + y;
            } else {
                if (x == z) ans = z * z - y + 1;
                else ans = z2 + x;
            }
            sb.append(ans).append('\\n');
        }
        System.out.print(sb.toString());
    }
}`,
    sampleInput: '3\n2 3\n1 1\n4 2',
    sampleOutput: '8\n1\n15',
    testInputs: ['3\n2 3\n1 1\n4 2', '2\n5 5\n3 4', '3\n10 1\n1 10\n6 6'],
  },
  {
    id: 107,
    csesId: 1072,
    track: 'CSES Problem Set',
    title: 'Two Knights',
    difficulty: 'MEDIUM',
    concept: 'Combinatorics, Attacking Subgrids',
    section: { name: 'CSES · Introductory', title: 'Introductory Problems' },
    statement: 'Your task is to count for k = 1, 2, ..., n the number of ways two knights can be placed on a k x k chessboard so that they do not attack each other.',
    constraints: '1 <= n <= 10000',
    explanation: 'Total ways to place two identical knights on k^2 squares is k^2 * (k^2 - 1) / 2. Every 2x3 or 3x2 subgrid contains 2 attacking pairs. There are (k-1)(k-2) subgrids of each orientation, so subtract 4 * (k-1) * (k-2).',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
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
        StringBuilder sb = new StringBuilder();
        for (long k = 1; k <= n; k++) {
            long total = (k * k) * (k * k - 1) / 2;
            long attack = 4 * (k - 1) * (k - 2);
            sb.append(total - attack).append('\\n');
        }
        System.out.print(sb.toString());
    }
}`,
    sampleInput: '8',
    sampleOutput: '0\n6\n28\n96\n252\n550\n1056\n1848',
    testInputs: ['8', '3', '5'],
  },
  {
    id: 108,
    csesId: 1092,
    track: 'CSES Problem Set',
    title: 'Two Sets',
    difficulty: 'MEDIUM',
    concept: 'Greedy Subset Construction, Number Theory',
    section: { name: 'CSES · Introductory', title: 'Introductory Problems' },
    statement: 'Your task is to divide the numbers 1, 2, ..., n into two sets of equal sum. Print "NO" if it is impossible, otherwise print "YES" followed by the number of elements and elements of the first set (picked greedily from n down to 1), and then the second set in decreasing order.',
    constraints: '1 <= n <= 10^6',
    explanation: 'The sum S = n(n+1)/2 is even iff n % 4 == 0 or n % 4 == 3. When S is even, greedily iterate from n down to 1: if the current number <= remaining target sum S/2, place it in Set 1 and subtract from target; otherwise place it in Set 2.',
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
        long sum = (long) n * (n + 1) / 2;
        if (sum % 2 != 0) {
            System.out.println("NO");
            return;
        }
        System.out.println("YES");
        long target = sum / 2;
        List<Integer> s1 = new ArrayList<>();
        List<Integer> s2 = new ArrayList<>();
        for (int i = n; i >= 1; i--) {
            if (i <= target) {
                s1.add(i);
                target -= i;
            } else {
                s2.add(i);
            }
        }
        StringBuilder sb = new StringBuilder();
        sb.append(s1.size()).append('\\n');
        for (int i = 0; i < s1.size(); i++) {
            if (i > 0) sb.append(' ');
            sb.append(s1.get(i));
        }
        sb.append('\\n').append(s2.size()).append('\\n');
        for (int i = 0; i < s2.size(); i++) {
            if (i > 0) sb.append(' ');
            sb.append(s2.get(i));
        }
        System.out.println(sb.toString());
    }
}`,
    sampleInput: '7',
    sampleOutput: 'YES\n3\n7 6 1\n4\n5 4 3 2',
    testInputs: ['7', '6', '8', '3'],
    checker: `
      const n = parseInt(input.trim(), 10);
      const sum = (n * (n + 1)) / 2;
      if (sum % 2 !== 0) return actual.trim() === 'NO';
      const lines = actual.trim().split('\\n').map(l => l.trim());
      if (lines[0] !== 'YES' || lines.length < 5) return false;
      const s1Count = parseInt(lines[1], 10);
      const s1 = lines[2].split(/\\s+/).map(Number);
      const s2Count = parseInt(lines[3], 10);
      const s2 = lines[4].split(/\\s+/).map(Number);
      if (s1.length !== s1Count || s2.length !== s2Count) return false;
      if (s1Count + s2Count !== n) return false;
      const seen = new Set();
      let sum1 = 0, sum2 = 0;
      for (const x of s1) { if (x < 1 || x > n || seen.has(x)) return false; seen.add(x); sum1 += x; }
      for (const x of s2) { if (x < 1 || x > n || seen.has(x)) return false; seen.add(x); sum2 += x; }
      return sum1 === sum2 && sum1 === sum / 2;
    `,
  },
  {
    id: 109,
    csesId: 1617,
    track: 'CSES Problem Set',
    title: 'Bit Strings',
    difficulty: 'EASY',
    concept: 'Modular Arithmetic, Binary Exponentiation',
    section: { name: 'CSES · Introductory', title: 'Introductory Problems' },
    statement: 'Your task is to calculate the number of bit strings of length n.\nFor example, if n = 3, the correct answer is 8, because the possible bit strings are 000, 001, 010, 011, 100, 101, 110, and 111.\n\nPrint the result modulo 10^9 + 7.',
    constraints: '1 <= n <= 10^6',
    explanation: 'Each of the n positions has 2 choices (0 or 1), yielding 2^n modulo 1000000007.',
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        // Print 2^n % 1000000007
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        long mod = 1000000007L;
        long res = 1, base = 2;
        while (n > 0) {
            if ((n & 1) == 1) res = (res * base) % mod;
            base = (base * base) % mod;
            n >>= 1;
        }
        System.out.println(res);
    }
}`,
    sampleInput: '3',
    sampleOutput: '8',
    testInputs: ['3', '10', '50', '1000000'],
  },
  {
    id: 110,
    csesId: 1618,
    track: 'CSES Problem Set',
    title: 'Trailing Zeros',
    difficulty: 'EASY',
    concept: 'Legendre Formula, Prime Factors of 5',
    section: { name: 'CSES · Introductory', title: 'Introductory Problems' },
    statement: 'Your task is to calculate the number of trailing zeros in the factorial n!.\nFor example, 20! = 2432902008176640000 and it has 4 trailing zeros.',
    constraints: '1 <= n <= 10^9',
    explanation: 'Trailing zeros are produced by factors of 10 = 2 * 5. Since factors of 2 are always more plentiful than 5, count the powers of 5 dividing n!: floor(n/5) + floor(n/25) + floor(n/125) + ...',
    timeComplexity: 'O(log_5 N)',
    spaceComplexity: 'O(1)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        // Write your code here
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        long count = 0;
        for (long p = 5; p <= n; p *= 5) {
            count += n / p;
        }
        System.out.println(count);
    }
}`,
    sampleInput: '20',
    sampleOutput: '4',
    testInputs: ['20', '5', '100', '1000000000'],
  },
  {
    id: 111,
    csesId: 1754,
    track: 'CSES Problem Set',
    title: 'Coin Piles',
    difficulty: 'EASY',
    concept: 'Invariant Math, Linear Equations',
    section: { name: 'CSES · Introductory', title: 'Introductory Problems' },
    statement: 'You have two coin piles containing a and b coins. On each move, you can either remove one coin from the left pile and two coins from the right pile, or two coins from the left pile and one coin from the right pile.\n\nYour task is to efficiently find out if you can empty both the piles.',
    constraints: '1 <= t <= 10^5\n0 <= a, b <= 10^9',
    explanation: 'Each move removes 3 coins in total, so (a + b) must be divisible by 3. Furthermore, the larger pile cannot have more than twice the coins of the smaller pile: max(a, b) <= 2 * min(a, b).',
    timeComplexity: 'O(T)',
    spaceComplexity: 'O(1)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int t = sc.nextInt();
        while (t-- > 0) {
            long a = sc.nextLong();
            long b = sc.nextLong();
            // Print YES or NO
        }
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int t = sc.nextInt();
        StringBuilder sb = new StringBuilder();
        while (t-- > 0) {
            long a = sc.nextLong();
            long b = sc.nextLong();
            if ((a + b) % 3 == 0 && Math.max(a, b) <= 2 * Math.min(a, b)) {
                sb.append("YES\\n");
            } else {
                sb.append("NO\\n");
            }
        }
        System.out.print(sb.toString());
    }
}`,
    sampleInput: '3\n2 1\n2 2\n3 3',
    sampleOutput: 'YES\nNO\nYES',
    testInputs: ['3\n2 1\n2 2\n3 3', '4\n0 0\n1 3\n4 2\n10 20'],
  },
  {
    id: 112,
    csesId: 1755,
    track: 'CSES Problem Set',
    title: 'Palindrome Reorder',
    difficulty: 'MEDIUM',
    concept: 'Frequency Counting, Lexicographical Palindrome',
    section: { name: 'CSES · Introductory', title: 'Introductory Problems' },
    statement: 'Given a string of uppercase letters A-Z, your task is to reorder its letters in such a way that it becomes the lexicographically smallest palindrome (or print "NO SOLUTION" if impossible).',
    constraints: '1 <= |s| <= 10^6',
    explanation: 'Count frequencies of A-Z. At most one character can have an odd count. Construct the left half using count[c]/2 copies of each letter from A to Z, place the odd character (if any) in the middle, and append the reversed left half.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        // Write your code here
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int[] freq = new int[26];
        for (int i = 0; i < s.length(); i++) {
            freq[s.charAt(i) - 'A']++;
        }
        int oddCount = 0, oddChar = -1;
        for (int i = 0; i < 26; i++) {
            if (freq[i] % 2 != 0) {
                oddCount++;
                oddChar = i;
            }
        }
        if (oddCount > 1) {
            System.out.println("NO SOLUTION");
            return;
        }
        StringBuilder half = new StringBuilder();
        for (int i = 0; i < 26; i++) {
            for (int k = 0; k < freq[i] / 2; k++) {
                half.append((char) ('A' + i));
            }
        }
        StringBuilder ans = new StringBuilder(half);
        if (oddChar != -1) {
            for (int k = 0; k < freq[oddChar]; k++) {
                if (k == freq[oddChar] / 2) ans.append((char) ('A' + oddChar));
            }
        }
        ans.append(half.reverse());
        System.out.println(ans.toString());
    }
}`,
    sampleInput: 'AAAACACBA',
    sampleOutput: 'AAACBCAAA',
    testInputs: ['AAAACACBA', 'ABAB', 'ABCDEF', 'RACECAR'],
  },
  {
    id: 113,
    csesId: 2205,
    track: 'CSES Problem Set',
    title: 'Gray Code',
    difficulty: 'MEDIUM',
    concept: 'Bit Manipulation, i ^ (i >> 1)',
    section: { name: 'CSES · Introductory', title: 'Introductory Problems' },
    statement: 'A Gray code is a list of all 2^n bit strings of length n, where any two successive strings differ in exactly one bit (i.e., their Hamming distance is one).\n\nGenerate the standard binary reflected Gray code where the i-th string (0 <= i < 2^n) is the n-bit binary representation of i ^ (i >> 1).',
    constraints: '1 <= n <= 16',
    explanation: 'The standard Gray code for integer i is given by g(i) = i ^ (i >> 1). Format each value as an n-bit binary string padded with leading zeros.',
    timeComplexity: 'O(N * 2^N)',
    spaceComplexity: 'O(2^N)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Print 2^n Gray code strings
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int total = 1 << n;
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < total; i++) {
            int g = i ^ (i >> 1);
            for (int b = n - 1; b >= 0; b--) {
                sb.append(((g >> b) & 1));
            }
            sb.append('\\n');
        }
        System.out.print(sb.toString());
    }
}`,
    sampleInput: '2',
    sampleOutput: '00\n01\n11\n10',
    testInputs: ['2', '1', '3'],
  },
  {
    id: 114,
    csesId: 2165,
    track: 'CSES Problem Set',
    title: 'Tower of Hanoi',
    difficulty: 'MEDIUM',
    concept: 'Recursion, Divide and Conquer',
    section: { name: 'CSES · Introductory', title: 'Introductory Problems' },
    statement: 'The Tower of Hanoi game consists of three stacks (left = 1, middle = 2, right = 3) and n round disks of different sizes. Initially, the left stack has all the disks, in increasing order of size from top to bottom.\n\nThe goal is to move all the disks to the right stack using the middle stack. First print the minimum number of moves, then print each move "a b".',
    constraints: '1 <= n <= 16',
    explanation: 'Moving n disks from stack A to stack C using auxiliary stack B requires: (1) move n-1 disks from A to B, (2) move disk n from A to C, (3) move n-1 disks from B to C. Total moves: 2^n - 1.',
    timeComplexity: 'O(2^N)',
    spaceComplexity: 'O(N)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Write your recursive Tower of Hanoi solution
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    static StringBuilder sb = new StringBuilder();

    static void solve(int n, int from, int aux, int to) {
        if (n == 0) return;
        solve(n - 1, from, to, aux);
        sb.append(from).append(' ').append(to).append('\\n');
        solve(n - 1, aux, from, to);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        sb.append((1 << n) - 1).append('\\n');
        solve(n, 1, 2, 3);
        System.out.print(sb.toString());
    }
}`,
    sampleInput: '2',
    sampleOutput: '3\n1 2\n1 3\n2 3',
    testInputs: ['2', '1', '3'],
  },
  {
    id: 115,
    csesId: 1623,
    track: 'CSES Problem Set',
    title: 'Apple Division',
    difficulty: 'MEDIUM',
    concept: 'Bitmask Enumeration / Backtracking',
    section: { name: 'CSES · Introductory', title: 'Introductory Problems' },
    statement: 'There are n apples with known weights. Your task is to divide the apples into two groups so that the difference between the weights of the groups is minimal.',
    constraints: '1 <= n <= 20\n1 <= p_i <= 10^9',
    explanation: 'Since n <= 20, there are only 2^n <= 1,048,576 subsets. Iterate over all bitmasks (or recursively branch on each apple) and minimize |totalSum - 2 * subsetSum|.',
    timeComplexity: 'O(2^N)',
    spaceComplexity: 'O(N)',
    predefinedCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long[] p = new long[n];
        for (int i = 0; i < n; i++) p[i] = sc.nextLong();
        // Find minimum weight difference
    }
}`,
    solutionCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long[] p = new long[n];
        long total = 0;
        for (int i = 0; i < n; i++) {
            p[i] = sc.nextLong();
            total += p[i];
        }
        long best = Long.MAX_VALUE;
        int limit = 1 << n;
        for (int mask = 0; mask < limit; mask++) {
            long sub = 0;
            for (int i = 0; i < n; i++) {
                if ((mask & (1 << i)) != 0) sub += p[i];
            }
            best = Math.min(best, Math.abs(total - 2 * sub));
        }
        System.out.println(best);
    }
}`,
    sampleInput: '5\n3 2 7 4 1',
    sampleOutput: '1',
    testInputs: ['5\n3 2 7 4 1', '4\n10 10 10 10', '3\n1 2 100'],
  },
];
