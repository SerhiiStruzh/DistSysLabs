package lab1;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class OutputHandler {

    private static boolean hasPrimeGap(int startPrime, int endPrime) {
        return startPrime != -1 && endPrime != -1;
    }

    public static void saveToFile(String filename, int n, int maxGap, int startPrime, int endPrime) throws IOException {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filename))) {
            writer.write("Значення n: " + n + "\n");
            
            if (hasPrimeGap(startPrime, endPrime)) {
                writer.write("Найбільший проміжок між простими числами: " + maxGap + "\n");
                writer.write("Між простими числами: " + startPrime + " і " + endPrime);
            } else {
                writer.write("Проміжку для заданих даних немає");
            }
        }
    }

    public static void printToConsole(int n, int maxGap, int startPrime, int endPrime) {
        System.out.println("Значення n: " + n);
        
        if (hasPrimeGap(startPrime, endPrime)) {
            System.out.println("Найбільший проміжок між простими числами: " + maxGap);
            System.out.println("Між простими числами: " + startPrime + " і " + endPrime);
        } else {
            System.out.println("Проміжку для заданих даних немає");
        }
    }
}
