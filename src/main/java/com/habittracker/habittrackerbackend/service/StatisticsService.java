package com.habittracker.habittrackerbackend.service;

import com.habittracker.habittrackerbackend.model.Habit;
import com.habittracker.habittrackerbackend.model.User;
import com.habittracker.habittrackerbackend.repository.HabitCompletionRepository;
import com.habittracker.habittrackerbackend.repository.HabitRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StatisticsService {

    private final HabitRepository habitRepository;
    private final HabitCompletionRepository completionRepository;

    public StatisticsService(HabitRepository habitRepository, HabitCompletionRepository completionRepository) {
        this.habitRepository = habitRepository;
        this.completionRepository = completionRepository;
    }

    public Map<String, Object> getUserStatistics(User user) {
        Map<String, Object> stats = new HashMap<>();

        List<Habit> activeHabits = habitRepository.findByUserAndIsActive(user, true);
        List<Habit> allHabits = habitRepository.findByUser(user);

        // Basic stats
        stats.put("totalHabits", allHabits.size());
        stats.put("activeHabits", activeHabits.size());
        stats.put("inactiveHabits", allHabits.size() - activeHabits.size());

        // Completion rates
        double overallCompletionRate = activeHabits.stream()
                .mapToDouble(Habit::getCompletionRate)
                .average()
                .orElse(0.0);
        stats.put("overallCompletionRate", Math.round(overallCompletionRate * 100.0) / 100.0);

        // Current streak
        int maxStreak = activeHabits.stream()
                .mapToInt(Habit::getStreak)
                .max()
                .orElse(0);
        stats.put("currentMaxStreak", maxStreak);

        // Category distribution
        Map<String, Long> categoryCount = new HashMap<>();
        activeHabits.forEach(habit -> {
            categoryCount.put(habit.getCategory(),
                categoryCount.getOrDefault(habit.getCategory(), 0L) + 1);
        });
        stats.put("categoryDistribution", categoryCount);

        // Weekly progress (last 7 days)
        LocalDate weekStart = LocalDate.now().minusDays(6);
        LocalDate weekEnd = LocalDate.now();
        List<com.habittracker.habittrackerbackend.model.HabitCompletion> weeklyCompletions =
            completionRepository.findCompletionsByUserAndPeriod(user, weekStart, weekEnd);

        Map<LocalDate, Long> dailyCompletions = new HashMap<>();
        for (LocalDate date = weekStart; !date.isAfter(weekEnd); date = date.plusDays(1)) {
            LocalDate finalDate = date;
            long count = weeklyCompletions.stream()
                    .filter(c -> c.getCompletionDate().equals(finalDate))
                    .count();
            dailyCompletions.put(date, count);
        }
        stats.put("weeklyProgress", dailyCompletions);

        return stats;
    }

    public List<Habit> getTopPerformingHabits(User user) {
        return habitRepository.findTopHabitsByStreak(user).stream().limit(5).toList();
    }
}
