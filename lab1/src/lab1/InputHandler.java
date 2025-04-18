package lab1;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Random;
import java.util.Scanner;

public class InputHandler {

    public static int readInput() {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Введіть значення n: ");
        
        while (!scanner.hasNextInt()) {
            System.out.println("Помилка! Введіть ціле число.");
            scanner.next();
        }

        return scanner.nextInt();
    }
    
    public static int readInputFromFile(String filename) throws FileNotFoundException {
        try (Scanner fileScanner = new Scanner(new File(filename))) {
			if (fileScanner.hasNextInt()) {
			    return fileScanner.nextInt();
			} else {
			    throw new IllegalArgumentException("Файл не містить ціле число.");
			}
		}
    }
    
    public static int generateRandomInput(int min, int max) {
        Random random = new Random();
        return random.nextInt(max - min + 1) + min;
    }
}
