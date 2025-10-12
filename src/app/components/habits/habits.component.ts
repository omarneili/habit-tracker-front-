import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface Habit {
  id: number;
  name: string;
  category: string;
  frequency: string;
  goal: string;
  color: string;
  icon: string;
  createdAt: string;
  isActive: boolean;
  streak: number;
  completionRate: number;
  priority: 'high' | 'medium' | 'low';
  reminder: boolean;
  tags: string[];
}

@Component({
  selector: 'app-habits',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink,RouterLinkActive],
  templateUrl: './habits.component.html',
  styleUrls: ['./habits.component.css']
})
export class HabitsComponent implements OnInit, OnDestroy {
  @HostBinding('class.dark') isDarkMode = false;
  private themeSubscription: Subscription;

  habitsForm: FormGroup;
  isCreatingHabit: boolean = false;
  editMode: boolean = false;
  editingHabitId: number | null = null;
  viewMode: 'grid' | 'list' = 'grid';
  selectedCategory: string = 'all';

  categories = [
    { value: 'sante', label: 'Santé & Bien-être', icon: '❤️', color: '#EF4444' },
    { value: 'productivite', label: 'Productivité', icon: '⚡', color: '#F59E0B' },
    { value: 'apprentissage', label: 'Apprentissage', icon: '🎓', color: '#8B5CF6' },
    { value: 'sport', label: 'Sport & Fitness', icon: '💪', color: '#10B981' },
    { value: 'creativite', label: 'Créativité', icon: '🎨', color: '#EC4899' },
    { value: 'social', label: 'Social', icon: '👥', color: '#3B82F6' }
  ];

  frequencies = [
    { value: 'quotidien', label: 'Quotidien', icon: '📅' },
    { value: 'hebdomadaire', label: 'Hebdomadaire', icon: '📆' },
    { value: 'mensuel', label: 'Mensuel', icon: '🗓️' },
    { value: 'personnalise', label: 'Personnalisé', icon: '⚙️' }
  ];

  priorities = [
    { value: 'high', label: 'Haute', color: '#EF4444', icon: '🔴' },
    { value: 'medium', label: 'Moyenne', color: '#F59E0B', icon: '🟡' },
    { value: 'low', label: 'Basse', color: '#10B981', icon: '🟢' }
  ];

  habits: Habit[] = [
    {
      id: 1,
      name: 'Méditation matinale',
      category: 'sante',
      frequency: 'quotidien',
      goal: '15 minutes de pleine conscience',
      color: '#8B5CF6',
      icon: '🧘',
      createdAt: '15/01/2024',
      isActive: true,
      streak: 15,
      completionRate: 92,
      priority: 'high',
      reminder: true,
      tags: ['bien-être', 'mental']
    },
    {
      id: 2,
      name: 'Lecture technique',
      category: 'apprentissage',
      frequency: 'quotidien',
      goal: '30 minutes de lecture',
      color: '#10B981',
      icon: '📚',
      createdAt: '10/01/2024',
      isActive: true,
      streak: 8,
      completionRate: 78,
      priority: 'medium',
      reminder: true,
      tags: ['développement', 'apprentissage']
    },
    {
      id: 3,
      name: 'Session HIIT',
      category: 'sport',
      frequency: 'hebdomadaire',
      goal: '3 sessions par semaine',
      color: '#EF4444',
      icon: '💪',
      createdAt: '20/01/2024',
      isActive: true,
      streak: 3,
      completionRate: 85,
      priority: 'high',
      reminder: false,
      tags: ['fitness', 'santé']
    },
    {
      id: 4,
      name: 'Revue hebdomadaire',
      category: 'productivite',
      frequency: 'hebdomadaire',
      goal: 'Planification du dimanche',
      color: '#F59E0B',
      icon: '📊',
      createdAt: '05/01/2024',
      isActive: false,
      streak: 0,
      completionRate: 45,
      priority: 'medium',
      reminder: true,
      tags: ['organisation', 'planification']
    }
  ];

  constructor(private fb: FormBuilder, public themeService: ThemeService) {
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    this.habitsForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      frequency: ['quotidien', Validators.required],
      goal: [''],
      color: ['#8B5CF6'],
      icon: ['✅'],
      priority: ['medium'],
      reminder: [true],
      tags: ['']
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  getCategoryIcon(categoryValue: string): string {
    const category = this.categories.find(cat => cat.value === categoryValue);
    return category ? category.icon : '📌';
  }

  getCategoryColor(categoryValue: string): string {
    const category = this.categories.find(cat => cat.value === categoryValue);
    return category ? category.color : '#6B7280';
  }

  getCategoryLabel(categoryValue: string): string {
    const category = this.categories.find(cat => cat.value === categoryValue);
    return category ? category.label : 'Autre';
  }

  getPriorityInfo(priority: string): any {
    return this.priorities.find(p => p.value === priority) || this.priorities[1];
  }

  startCreatingHabit(): void {
    this.isCreatingHabit = true;
    this.editMode = false;
    this.editingHabitId = null;
    this.habitsForm.reset({
      frequency: 'quotidien',
      color: '#8B5CF6',
      icon: '✅',
      priority: 'medium',
      reminder: true
    });
  }

  startEditingHabit(habit: Habit): void {
    this.isCreatingHabit = true;
    this.editMode = true;
    this.editingHabitId = habit.id;
    this.habitsForm.patchValue({
      name: habit.name,
      category: habit.category,
      frequency: habit.frequency,
      goal: habit.goal,
      color: habit.color,
      icon: habit.icon,
      priority: habit.priority,
      reminder: habit.reminder,
      tags: habit.tags.join(', ')
    });
  }

  cancelCreation(): void {
    this.isCreatingHabit = false;
    this.editMode = false;
    this.editingHabitId = null;
    this.habitsForm.reset();
  }

  saveHabit(): void {
    if (this.habitsForm.valid) {
      const formValue = this.habitsForm.value;
      const tags = formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()) : [];

      if (this.editMode && this.editingHabitId) {
        const index = this.habits.findIndex(h => h.id === this.editingHabitId);
        if (index !== -1) {
          this.habits[index] = {
            ...this.habits[index],
            ...formValue,
            tags
          };
        }
      } else {
        const today = new Date();
        const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
        
        const newHabit: Habit = {
          id: Math.max(...this.habits.map(h => h.id)) + 1,
          name: formValue.name,
          category: formValue.category,
          frequency: formValue.frequency,
          goal: formValue.goal,
          color: formValue.color,
          icon: formValue.icon,
          createdAt: formattedDate,
          isActive: true,
          streak: 0,
          completionRate: 0,
          priority: formValue.priority,
          reminder: formValue.reminder,
          tags
        };
        this.habits.unshift(newHabit);
      }

      this.cancelCreation();
    }
  }

  toggleHabitStatus(habit: Habit): void {
    habit.isActive = !habit.isActive;
    if (!habit.isActive) {
      habit.streak = 0;
    }
  }

  deleteHabit(habitId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette habitude ?')) {
      this.habits = this.habits.filter(h => h.id !== habitId);
    }
  }

  getActiveHabits(): Habit[] {
    let habits = this.habits.filter(habit => habit.isActive);
    if (this.selectedCategory !== 'all') {
      habits = habits.filter(habit => habit.category === this.selectedCategory);
    }
    return habits;
  }

  getInactiveHabits(): Habit[] {
    return this.habits.filter(habit => !habit.isActive);
  }

  getHabitsByCategory(category: string): Habit[] {
    return this.habits.filter(habit => habit.category === category && habit.isActive);
  }

  getCompletionRateColor(rate: number): string {
    if (rate >= 80) return '#10B981';
    if (rate >= 60) return '#F59E0B';
    return '#EF4444';
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  setCategory(category: string): void {
    this.selectedCategory = category;
  }

  getCategoryStats(): any[] {
    return this.categories.map(category => {
      const count = this.getHabitsByCategory(category.value).length;
      const totalActive = this.getActiveHabits().length;
      const percentage = totalActive > 0 ? (count / totalActive) * 100 : 0;
      
      return {
        ...category,
        count,
        percentage
      };
    });
  }
}