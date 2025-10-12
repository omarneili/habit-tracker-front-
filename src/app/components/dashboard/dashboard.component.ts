import { Component, OnInit, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink , RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink , RouterLinkActive  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  selectedPeriod: string = 'this_week';
  showAdvancedMetrics: boolean = false;
  @HostBinding('class.dark') isDarkMode: boolean = false;

  performanceMetrics = [
    { name: 'Taux de Réussite Global', value: 75, change: 5.2, trend: 'up' },
    { name: 'Consistance Quotidienne', value: 82, change: -2.1, trend: 'down' },
    { name: 'Progression Mensuelle', value: 68, change: 12.8, trend: 'up' },
    { name: 'Score de Motivation', value: 91, change: 3.7, trend: 'up' }
  ];

  analyticsData = [
    { period: 'Cette semaine', completionRate: 75, habitsCompleted: 15 },
    { period: 'Semaine dernière', completionRate: 69, habitsCompleted: 14 },
    { period: 'Il y a 2 semaines', completionRate: 72, habitsCompleted: 13 }
  ];

  habitPerformance = [
    { name: 'Méditation matinale', completionRate: 92, streak: 12, trend: 'up' },
    { name: 'Sport 30min', completionRate: 78, streak: 8, trend: 'stable' },
    { name: 'Lire 20 pages', completionRate: 65, streak: 5, trend: 'down' },
    { name: 'Boire 2L d\'eau', completionRate: 88, streak: 15, trend: 'up' }
  ];

  timeDistribution = [
    { category: 'Matin (6h-12h)', percentage: 45, habits: 3 },
    { category: 'Après-midi (12h-18h)', percentage: 30, habits: 2 },
    { category: 'Soir (18h-22h)', percentage: 25, habits: 2 }
  ];

  constructor(public themeService: ThemeService) { }

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  onPeriodChange(period: string): void {
    this.selectedPeriod = period;
    // Ici on pourrait charger les données pour la période sélectionnée
    console.log('Période changée:', period);
  }

  toggleAdvancedMetrics(): void {
    this.showAdvancedMetrics = !this.showAdvancedMetrics;
  }

  exportData(): void {
    // Fonctionnalité d'export à implémenter
    console.log('Export des données...');
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  getTrendColor(trend: string): string {
    switch (trend) {
      case 'up': return '#28a745';
      case 'down': return '#dc3545';
      case 'stable': return '#6c757d';
      default: return '#6c757d';
    }
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '→';
      default: return '→';
    }
  }
}
