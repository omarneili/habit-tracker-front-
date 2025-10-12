import { Component, OnInit, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, query, style, animate, group } from '@angular/animations';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routeAnimations', [
      transition('login => register', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
        group([
          query(':enter', [
            style({ transform: 'translateX(100%)' }),
            animate('0.3s ease-out', style({ transform: 'translateX(0%)' }))
          ], { optional: true }),
          query(':leave', [
            animate('0.3s ease-out', style({ transform: 'translateX(-100%)' }))
          ], { optional: true })
        ])
      ]),
      transition('register => login', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
        group([
          query(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate('0.3s ease-out', style({ transform: 'translateX(0%)' }))
          ], { optional: true }),
          query(':leave', [
            animate('0.3s ease-out', style({ transform: 'translateX(100%)' }))
          ], { optional: true })
        ])
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'habit-tracker';
  @HostBinding('class.dark') isDarkMode: boolean = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Apply initial theme on app load
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  getRouteAnimationState(outlet: RouterOutlet) {
    return outlet.activatedRouteData?.['animation'] || '';
  }
}
