import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  currentAdmin: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentAdmin = this.authService.getCurrentAdmin();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
