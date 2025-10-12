import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SplashComponent } from './components/splash/splash.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HabitsComponent } from './components/habits/habits.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { AdminLoginComponent } from './components/admin/login/admin-login.component';
import { AdminDashboardComponent } from './components/admin/dashboard/admin-dashboard.component';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: SplashComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'habits', component: HabitsComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'admin',
    children: [
      { path: 'login', component: AdminLoginComponent },
      { path: 'dashboard', component: AdminDashboardComponent, canActivate: [AdminGuard] },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
