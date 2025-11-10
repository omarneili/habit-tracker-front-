package com.habittracker.habittrackerbackend.repository;

import com.habittracker.habittrackerbackend.model.Habit;
import com.habittracker.habittrackerbackend.model.HabitCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HabitCompletionRepository extends JpaRepository<HabitCompletion, Long> {
    List<HabitCompletion> findByHabit(Habit habit);
    Optional<HabitCompletion> findByHabitAndCompletionDate(Habit habit, LocalDate completionDate);

    @Query("SELECT COUNT(hc) FROM HabitCompletion hc WHERE hc.habit = :habit AND hc.completionDate >= :startDate AND hc.completionDate <= :endDate")
    long countCompletionsInPeriod(@Param("habit") Habit habit, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT hc FROM HabitCompletion hc WHERE hc.habit.user = :user AND hc.completionDate >= :startDate AND hc.completionDate <= :endDate")
    List<HabitCompletion> findCompletionsByUserAndPeriod(@Param("user") com.habittracker.habittrackerbackend.model.User user, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
