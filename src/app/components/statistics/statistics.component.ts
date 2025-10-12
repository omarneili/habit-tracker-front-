import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface StatCard {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  color: string;
}

interface TopHabit {
  name: string;
  completion: number;
  trend: 'up' | 'down' | 'stable';
  streak: number;
}

interface CategoryDistribution {
  category: string;
  percentage: number;
  color: string;
  count: number;
}

interface AdvancedMetric {
  name: string;
  value: number;
  max: number;
  trend: 'up' | 'down' | 'stable';
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterLinkActive ],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit, OnDestroy {
  @HostBinding('class.dark') isDarkMode = false;
  private themeSubscription: Subscription;

  // Cartes de statistiques principales
  statCards: StatCard[] = [
    {
      title: 'Taux de Réussite',
      value: '87%',
      change: 12,
      trend: 'up',
      icon: '📈',
      color: '#06b6d4'
    },
    {
      title: 'Série Actuelle',
      value: '24 jours',
      change: 8,
      trend: 'up',
      icon: '🔥',
      color: '#f59e0b'
    },
    {
      title: 'Habitudes Actives',
      value: '12',
      change: -2,
      trend: 'down',
      icon: '🌱',
      color: '#10b981'
    },
    {
      title: 'Temps Moyen',
      value: '18min',
      change: 5,
      trend: 'up',
      icon: '⏱️',
      color: '#8b5cf6'
    }
  ];

  // Top habitudes
  topHabits: TopHabit[] = [
    { name: 'Méditation', completion: 95, trend: 'up', streak: 24 },
    { name: 'Lecture', completion: 88, trend: 'up', streak: 18 },
    { name: 'Sport', completion: 82, trend: 'stable', streak: 12 },
    { name: 'Planification', completion: 78, trend: 'down', streak: 8 },
    { name: 'Écriture', completion: 65, trend: 'up', streak: 5 }
  ];

  // Distribution par catégorie
  categoryDistribution: CategoryDistribution[] = [
    { category: 'Santé', percentage: 35, color: '#ef4444', count: 4 },
    { category: 'Apprentissage', percentage: 25, color: '#8b5cf6', count: 3 },
    { category: 'Productivité', percentage: 20, color: '#f59e0b', count: 2 },
    { category: 'Bien-être', percentage: 15, color: '#10b981', count: 2 },
    { category: 'Social', percentage: 5, color: '#06b6d4', count: 1 }
  ];

  // Métriques avancées
  advancedMetrics: AdvancedMetric[] = [
    { name: 'Score de Consistance', value: 87, max: 100, trend: 'up' },
    { name: 'Indice de Progression', value: 92, max: 100, trend: 'up' },
    { name: 'Taux de Rétention', value: 78, max: 100, trend: 'stable' },
    { name: 'Diversité des Habitudes', value: 65, max: 100, trend: 'down' }
  ];

  selectedTimeRange: string = 'month';
  showAdvanced: boolean = false;

  constructor(public themeService: ThemeService) {
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  ngOnInit(): void {
    this.loadStatistics();
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  loadStatistics(): void {
    // Simulation de chargement des données
    console.log('Chargement des statistiques...');
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '→';
      default: return '●';
    }
  }

  getTrendColor(trend: string): string {
    switch (trend) {
      case 'up': return '#10b981';
      case 'down': return '#ef4444';
      case 'stable': return '#f59e0b';
      default: return '#6b7280';
    }
  }

  onTimeRangeChange(range: string): void {
    this.selectedTimeRange = range;
    // Recharger les données selon la période
  }

  toggleAdvancedView(): void {
    this.showAdvanced = !this.showAdvanced;
  }

  exportReport(): void {
    console.log('Export du rapport statistique...');
  }

  // Méthode pour calculer le décalage du cercle de progression
  getProgressOffset(change: number): number {
    const progress = (change + 100) / 2; // Normaliser entre 0-100
    return 226 - (226 * progress / 100);
  }

  getCategoryStart(index: number): number {
    if (index === 0) return 0;
    return this.categoryDistribution.slice(0, index).reduce((sum, curr) => sum + curr.percentage, 0);
  }

  generateHeatmapDays() {
    const days = [];
    for (let i = 0; i < 90; i++) {
      days.push({
        day: i + 1,
        count: Math.floor(Math.random() * 10),
        level: Math.floor(Math.random() * 5)
      });
    }
    return days;
  }
}
