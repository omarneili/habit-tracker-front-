package com.habittracker.habittrackerbackend.repository;

import com.habittracker.habittrackerbackend.model.Habit;
import com.habittracker.habittrackerbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HabitRepository extends JpaRepository<Habit, Long> {
    List<Habit> findByUserAndIsActive(User user, boolean isActive);
    List<Habit> findByUser(User user);

    @Query("SELECT h FROM Habit h WHERE h.user = :user AND h.isActive = true AND h.category = :category")
    List<Habit> findActiveHabitsByUserAndCategory(@Param("user") User user, @Param("category") String category);

    @Query("SELECT COUNT(h) FROM Habit h WHERE h.user = :user AND h.isActive = true")
    long countActiveHabitsByUser(@Param("user") User user);

    @Query("SELECT h FROM Habit h WHERE h.user = :user AND h.isActive = true ORDER BY h.streak DESC")
    List<Habit> findTopHabitsByStreak(@Param("user") User user);
}
