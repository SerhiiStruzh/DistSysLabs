package lab1;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class PrimeUtils {

    public static boolean isPrime(int number) {
        if (number < 2) {
            return false;
        }
        for (int i = 2; i <= (int) Math.sqrt(number); i++) {
            if (number % i == 0) {
                return false;
            }
        }
        return true;
    }
    
    public static int[] findMaxPrimeGap(int n) {
        int previousPrime = 2;
        int maxGap = 0;
        int startPrime = -1;
        int endPrime = -1;
        
        for (int i = 2; i < n; i++) {
            if (PrimeUtils.isPrime(i)) {
            	int gap = i - previousPrime;
                if (gap > maxGap) {
                    maxGap = gap;
                    startPrime = previousPrime;
                    endPrime = i;
                }
                previousPrime = i;
            }
        }
        
        return new int[] {maxGap, startPrime, endPrime};
    }
    
    
    public static int[] findMaxPrimeGapMultithreaded(List<Integer> primes, int numThreads) {
        ExecutorService executor = Executors.newFixedThreadPool(numThreads);
        List<Future<int[]>> futures = new ArrayList<>();

        int size = primes.size();
        int partSize = size / numThreads;
        int start = 0;

        for (int i = 0; i < numThreads; i++) {
            int end = start + partSize;
            if (i == numThreads - 1) {
                end = size;
            }

            int adjustedStart = Math.max(start - 1, 0);
            int adjustedEnd = Math.min(end + 1, size);

            Future<int[]> future = executor.submit(new GapFinderTask(primes.subList(adjustedStart, adjustedEnd)));
            futures.add(future);

            start = end;
        }

        int maxGap = 0;
        int startPrime = -1;
        int endPrime = -1;

        for (Future<int[]> future : futures) {
            try {
                int[] result = future.get();
                if (result[0] > maxGap) {
                    maxGap = result[0];
                    startPrime = result[1];
                    endPrime = result[2];
                }
            } catch (InterruptedException | ExecutionException e) {
                e.printStackTrace();
            }
        }

        executor.shutdown();
        return new int[] {maxGap, startPrime, endPrime};
    }

    
    public static List<Integer> findPrimesMultithreaded(int n, int numThreads) {
        ExecutorService executor = Executors.newFixedThreadPool(numThreads);
        List<Future<List<Integer>>> futures = new ArrayList<>();
        
        int rangeSize = (n - 1) / numThreads;
        int start = 2;
        
        for (int i = 0; i < numThreads; i++) {
            int end = start + rangeSize - 1;
            if (i == numThreads - 1) {
                end = n;
            }

            Future<List<Integer>> future = executor.submit(new PrimeFinderTask(start, end));
            futures.add(future);
            start = end + 1;
        }
        
        List<Integer> primes = new ArrayList<>();
        for (Future<List<Integer>> future : futures) {
            try {
                primes.addAll(future.get());
            } catch (InterruptedException | ExecutionException e) {
                e.printStackTrace();
            }
        }
        
        executor.shutdown();
        return primes;
    }
}
