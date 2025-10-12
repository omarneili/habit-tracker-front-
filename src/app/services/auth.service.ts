// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AdminUser {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ADMIN_USERS: AdminUser[] = [
    { email: 'omarneili308@gmail.com', password: '999999' },
    { email: 'aminewerfelli20@gmail.com', password: '999999' }
  ];

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentAdminSubject = new BehaviorSubject<AdminUser | null>(null);
  public currentAdmin$ = this.currentAdminSubject.asObservable();

  constructor() {
    this.checkExistingAuth();
  }

  private checkExistingAuth(): void {
    const storedAdmin = localStorage.getItem('adminUser');
    const loginTime = localStorage.getItem('adminLoginTime');
    
    if (storedAdmin && loginTime) {
      // Vérifier si la session n'a pas expiré (24h)
      const loginDate = new Date(loginTime);
      const now = new Date();
      const hoursDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff < 24) {
        const admin = JSON.parse(storedAdmin);
        this.isAuthenticatedSubject.next(true);
        this.currentAdminSubject.next(admin);
      } else {
        this.clearStorage();
      }
    }
  }

  login(email: string, password: string): boolean {
    const admin = this.ADMIN_USERS.find(
      user => user.email === email && user.password === password
    );

    if (admin) {
      this.isAuthenticatedSubject.next(true);
      this.currentAdminSubject.next(admin);
      localStorage.setItem('adminUser', JSON.stringify(admin));
      localStorage.setItem('adminLoginTime', new Date().toISOString());
      return true;
    }

    return false;
  }

  logout(): void {
    this.isAuthenticatedSubject.next(false);
    this.currentAdminSubject.next(null);
    this.clearStorage();
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentAdmin(): AdminUser | null {
    return this.currentAdminSubject.value;
  }

  private clearStorage(): void {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminLoginTime');
  }
}