package lab1;

import java.util.List;
import java.util.concurrent.Callable;

public class GapFinderTask implements Callable<int[]> {
    private final List<Integer> sublist;

    public GapFinderTask(List<Integer> sublist) {
        this.sublist = sublist;
    }

    @Override
    public int[] call() {
        int maxGap = 0;
        int startPrime = -1;
        int endPrime = -1;

        for (int i = 1; i < sublist.size(); i++) {
            int gap = sublist.get(i) - sublist.get(i - 1);
            if (gap > maxGap) {
                maxGap = gap;
                startPrime = sublist.get(i - 1);
                endPrime = sublist.get(i);
            }
        }

        return new int[] {maxGap, startPrime, endPrime};
    }
}