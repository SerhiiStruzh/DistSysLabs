package lab1;

import java.io.IOException;
import java.util.List;

public class Main {

    public static void main(String[] args) throws IOException {
    	int n = InputHandler.readInputFromFile("./src/lab1/input.txt");

    	int numThreads = Runtime.getRuntime().availableProcessors();
    	
        long startTime = System.currentTimeMillis();

        int[] result = PrimeUtils.findMaxPrimeGap(n);
        int maxGap = result[0];
        int startPrime = result[1];
        int endPrime = result[2];

        long endTime = System.currentTimeMillis();

        OutputHandler.printToConsole(n, maxGap, startPrime, endPrime);
        OutputHandler.saveToFile("./src/lab1/output_lin.txt", n, maxGap, startPrime, endPrime);
        System.out.println("Час виконання для лінійного алгоритму: " + (endTime - startTime) + " мс");
        
        
        startTime = System.currentTimeMillis();

        List<Integer> primes = PrimeUtils.findPrimesMultithreaded(endPrime, numThreads);
        result = PrimeUtils.findMaxPrimeGapMultithreaded(primes, numThreads);
        maxGap = result[0];
        startPrime = result[1];
        endPrime = result[2];

        endTime = System.currentTimeMillis();

        OutputHandler.printToConsole(n, maxGap, startPrime, endPrime);
        OutputHandler.saveToFile("./src/lab1/output_paralel.txt", n, maxGap, startPrime, endPrime);
        System.out.println("Час виконання для багатопотокового алгоритму: " + (endTime - startTime) + " мс");
    }
}
