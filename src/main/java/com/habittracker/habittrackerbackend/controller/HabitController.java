package com.habittracker.habittrackerbackend.controller;

import com.habittracker.habittrackerbackend.model.Habit;
import com.habittracker.habittrackerbackend.model.User;
import com.habittracker.habittrackerbackend.service.HabitService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/habits")
@CrossOrigin(origins = "*")
public class HabitController {

    private final HabitService habitService;

    public HabitController(HabitService habitService) {
        this.habitService = habitService;
    }

    @GetMapping
    public ResponseEntity<List<Habit>> getUserHabits(@AuthenticationPrincipal User user) {
        List<Habit> habits = habitService.getUserHabits(user);
        return ResponseEntity.ok(habits);
    }

    @GetMapping("/active")
    public ResponseEntity<List<Habit>> getActiveUserHabits(@AuthenticationPrincipal User user) {
        List<Habit> habits = habitService.getActiveUserHabits(user);
        return ResponseEntity.ok(habits);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Habit> getHabitById(@PathVariable Long id) {
        return habitService.getHabitById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Habit> createHabit(@Valid @RequestBody Habit habit, @AuthenticationPrincipal User user) {
        Habit createdHabit = habitService.createHabit(habit, user);
        return ResponseEntity.ok(createdHabit);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Habit> updateHabit(@PathVariable Long id, @Valid @RequestBody Habit habit) {
        habit.setId(id);
        Habit updatedHabit = habitService.updateHabit(habit);
        return ResponseEntity.ok(updatedHabit);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabit(@PathVariable Long id) {
        habitService.deleteHabit(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/toggle-completion")
    public ResponseEntity<Void> toggleHabitCompletion(@PathVariable Long id, @RequestParam LocalDate date) {
        habitService.getHabitById(id).ifPresent(habit -> habitService.toggleHabitCompletion(habit, date));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Habit>> getHabitsByCategory(@PathVariable String category, @AuthenticationPrincipal User user) {
        List<Habit> habits = habitService.getHabitsByCategory(user, category);
        return ResponseEntity.ok(habits);
    }
}
