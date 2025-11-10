package com.habittracker.habittrackerbackend.controller;

import com.habittracker.habittrackerbackend.model.Habit;
import com.habittracker.habittrackerbackend.model.User;
import com.habittracker.habittrackerbackend.service.StatisticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "*")
public class StatisticsController {

    private final StatisticsService statisticsService;

    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getUserStatistics(@AuthenticationPrincipal User user) {
        Map<String, Object> stats = statisticsService.getUserStatistics(user);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/top-habits")
    public ResponseEntity<List<Habit>> getTopPerformingHabits(@AuthenticationPrincipal User user) {
        List<Habit> topHabits = statisticsService.getTopPerformingHabits(user);
        return ResponseEntity.ok(topHabits);
    }
}
