package com.habittracker.habittrackerbackend.service;

import com.habittracker.habittrackerbackend.model.Habit;
import com.habittracker.habittrackerbackend.model.HabitCompletion;
import com.habittracker.habittrackerbackend.model.User;
import com.habittracker.habittrackerbackend.repository.HabitCompletionRepository;
import com.habittracker.habittrackerbackend.repository.HabitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class HabitService {

    private final HabitRepository habitRepository;
    private final HabitCompletionRepository completionRepository;

    public HabitService(HabitRepository habitRepository, HabitCompletionRepository completionRepository) {
        this.habitRepository = habitRepository;
        this.completionRepository = completionRepository;
    }

    public List<Habit> getUserHabits(User user) {
        return habitRepository.findByUser(user);
    }

    public List<Habit> getActiveUserHabits(User user) {
        return habitRepository.findByUserAndIsActive(user, true);
    }

    public Optional<Habit> getHabitById(Long id) {
        return habitRepository.findById(id);
    }

    @Transactional
    public Habit createHabit(Habit habit, User user) {
        habit.setUser(user);
        return habitRepository.save(habit);
    }

    @Transactional
    public Habit updateHabit(Habit habit) {
        return habitRepository.save(habit);
    }

    @Transactional
    public void deleteHabit(Long id) {
        habitRepository.deleteById(id);
    }

    @Transactional
    public void toggleHabitCompletion(Habit habit, LocalDate date) {
        Optional<HabitCompletion> existingCompletion = completionRepository.findByHabitAndCompletionDate(habit, date);

        if (existingCompletion.isPresent()) {
            completionRepository.delete(existingCompletion.get());
            updateHabitStats(habit);
        } else {
            HabitCompletion completion = new HabitCompletion(habit, date);
            completionRepository.save(completion);
            updateHabitStats(habit);
        }
    }

    private void updateHabitStats(Habit habit) {
        // Calculate streak and completion rate
        List<HabitCompletion> completions = completionRepository.findByHabit(habit);
        int totalDays = 30; // Last 30 days
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(totalDays);

        long recentCompletions = completions.stream()
                .filter(c -> c.getCompletionDate().isAfter(thirtyDaysAgo))
                .count();

        habit.setCompletionRate((double) recentCompletions / totalDays * 100);

        // Calculate current streak
        int streak = 0;
        LocalDate currentDate = LocalDate.now();
        while (completionRepository.findByHabitAndCompletionDate(habit, currentDate).isPresent()) {
            streak++;
            currentDate = currentDate.minusDays(1);
        }
        habit.setStreak(streak);

        habitRepository.save(habit);
    }

    public List<Habit> getHabitsByCategory(User user, String category) {
        return habitRepository.findActiveHabitsByUserAndCategory(user, category);
    }

    public long getActiveHabitsCount(User user) {
        return habitRepository.countActiveHabitsByUser(user);
    }

    public List<Habit> getTopHabitsByStreak(User user) {
        return habitRepository.findTopHabitsByStreak(user);
    }
}
