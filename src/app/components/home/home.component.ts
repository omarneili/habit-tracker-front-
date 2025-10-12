import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Habit } from '../../models/habit.model';
import { SoundService, SoundOption } from '../../services/sound.service';
import { ThemeService } from '../../services/theme.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule , RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  currentDate: string = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });



  showForm: boolean = false;
  newHabit: Habit = { name: '', time: '' };
  customHabitName: string = '';
  showCustomHabitInput: boolean = false;
  showDeleteConfirm: boolean = false;
  deleteIndex: number = -1;
  notificationTimeouts: number[] = [];

  // Sound settings
  showSoundSettings: boolean = false;
  soundOptions: SoundOption[] = [];
  selectedSound: string = 'bell';
  soundVolume: number = 0.5;

  // Theme
  @HostBinding('class.dark') isDarkMode: boolean = false;



  habitOptions: string[] = [
    'Méditation matinale',
    'Sport 30min',
    'Lire 20 pages',
    'Boire 2L d\'eau',
    'Journaling',
    'coding',
    'musique',
    'Autre'
  ];

  habits: Habit[] = [
    { name: 'Méditation matinale', time: '07:00', completed: false },
    { name: 'Sport 30min', time: '08:00', completed: false },
    { name: 'Lire 20 pages', time: '20:00', completed: false },
    { name: 'Boire 2L d\'eau', time: 'Toute la journée', completed: false },
    { name: 'Journaling', time: '21:00', completed: false }
  ];

  constructor(private soundService: SoundService, private router: Router, private themeService: ThemeService) {}

  ngOnInit() {
    this.requestNotificationPermission();
    this.scheduleHabitNotifications();
    this.loadSoundSettings();
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  ngOnDestroy() {
    this.clearAllTimeouts();
  }

  clearAllTimeouts() {
    this.notificationTimeouts.forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    this.notificationTimeouts = [];
  }

  getHabitIcon(name: string): string {
    const icons: { [key: string]: string } = {
      'Méditation matinale': '🧘‍♀️',
      'Sport 30min': '💪',
      'Lire 20 pages': '📚',
      'Boire 2L d\'eau': '💧',
      'Journaling': '📝',
      'coding':'👨🏻‍💻',
      'musique':'🎵',
      'Autre': '⭐'
    };
    return icons[name] || '📌';
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.showCustomHabitInput = false;
    this.customHabitName = '';
  }

  onHabitChange() {
    this.showCustomHabitInput = this.newHabit.name === 'Autre';
    if (!this.showCustomHabitInput) {
      this.customHabitName = '';
    }
  }

  addHabit() {
    if (this.newHabit.name && this.newHabit.time) {
      let habitName = this.newHabit.name;
      if (this.newHabit.name === 'Autre' && this.customHabitName.trim()) {
        habitName = this.customHabitName.trim();
      }
      this.habits.push({ name: habitName, time: this.newHabit.time, completed: false });
      this.newHabit = { name: '', time: '' };
      this.customHabitName = '';
      this.showCustomHabitInput = false;
      this.showForm = false;
      this.scheduleHabitNotifications(); // Reschedule after adding
    }
  }

  toggleHabitCompletion(index: number) {
    this.habits[index].completed = !this.habits[index].completed;
  }

  confirmDelete(index: number) {
    this.showDeleteConfirm = true;
    this.deleteIndex = index;
  }

  deleteHabit() {
    if (this.deleteIndex >= 0) {
      this.habits.splice(this.deleteIndex, 1);
      this.showDeleteConfirm = false;
      this.deleteIndex = -1;
      this.clearAllTimeouts();
      this.scheduleHabitNotifications(); // Reschedule after deleting
    }
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.deleteIndex = -1;
  }

  requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        } else {
          console.log('Notification permission denied');
        }
      });
    }
  }

  scheduleHabitNotifications() {
    this.clearAllTimeouts();
    const now = new Date();

    this.habits.forEach(habit => {
      if (habit.time && habit.time !== 'Toute la journée') {
        const [hours, minutes] = habit.time.split(':').map(Number);
        const habitTime = new Date();
        habitTime.setHours(hours, minutes, 0, 0);

        if (habitTime <= now) {
          habitTime.setDate(habitTime.getDate() + 1); // Next day
        }

        const timeUntilNotification = habitTime.getTime() - now.getTime();
        const timeoutId = window.setTimeout(() => {
          this.showHabitNotification(habit);
          // Reschedule for next day
          this.scheduleSingleHabitNotification(habit);
        }, timeUntilNotification);

        this.notificationTimeouts.push(timeoutId);
      }
    });
  }

  scheduleSingleHabitNotification(habit: Habit) {
    if (habit.time && habit.time !== 'Toute la journée') {
      const [hours, minutes] = habit.time.split(':').map(Number);
      const habitTime = new Date();
      habitTime.setHours(hours, minutes, 0, 0);
      habitTime.setDate(habitTime.getDate() + 1); // Next day

      const now = new Date();
      const timeUntilNotification = habitTime.getTime() - now.getTime();

      const timeoutId = window.setTimeout(() => {
        this.showHabitNotification(habit);
        this.scheduleSingleHabitNotification(habit); // Recurse for next day
      }, timeUntilNotification);

      this.notificationTimeouts.push(timeoutId);
    }
  }

  showHabitNotification(habit: Habit) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(`Rappel d'habitude: ${habit.name}`, {
        body: `Il est temps de faire votre habitude: ${habit.name}`,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Play improved sound
      this.soundService.playSound(this.selectedSound);
    }
  }

  // Sound settings methods
  loadSoundSettings() {
    this.soundOptions = this.soundService.soundOptions;
    this.selectedSound = this.soundService.getCurrentSound();
    this.soundVolume = this.soundService.getVolume();
    this.soundService.setVolume(this.soundVolume);
  }

  toggleSoundSettings() {
    this.showSoundSettings = !this.showSoundSettings;
  }

  onSoundChange(soundId: string) {
    this.selectedSound = soundId;
    this.soundService.setCurrentSound(soundId);
    this.previewSound();
  }

  onVolumeChange(volume: number) {
    this.soundVolume = volume;
    this.soundService.setVolume(volume);
  }

  previewSound() {
    this.soundService.previewSound(this.selectedSound);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logout() {
    this.router.navigate(['/login']);
  }

  // Remove old method
  playNotificationSound() {
    // This method is now replaced by the sound service
  }
}
