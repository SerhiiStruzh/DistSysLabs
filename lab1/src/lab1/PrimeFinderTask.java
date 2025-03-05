package lab1;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;

public class PrimeFinderTask implements Callable<List<Integer>> {
    private final int start;
    private final int end;
    
    public PrimeFinderTask(int start, int end) {
        this.start = start;
        this.end = end;
    }
    
    @Override
    public List<Integer> call() {
        List<Integer> primes = new ArrayList<>();
        for (int num = start; num <= end; num++) {
            if (PrimeUtils.isPrime(num)) {
                primes.add(num);
            }
        }
        return primes;
    }
}