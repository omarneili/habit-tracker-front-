// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User, LoginRequest, RegisterRequest, JwtAuthenticationResponse } from '../models/user.model';

export interface AdminUser {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_BASE_URL = 'http://localhost:8081/api';

  private readonly ADMIN_USERS: AdminUser[] = [
    { email: 'omarneili308@gmail.com', password: '999999' },
    { email: 'aminewerfelli20@gmail.com', password: '999999' }
  ];

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private currentAdminSubject = new BehaviorSubject<AdminUser | null>(null);
  public currentAdmin$ = this.currentAdminSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkExistingAuth();
  }

  private checkExistingAuth(): void {
    const token = localStorage.getItem('jwtToken');
    const user = localStorage.getItem('currentUser');
    const loginTime = localStorage.getItem('loginTime');

    if (token && user && loginTime) {
      // Vérifier si la session n'a pas expiré (24h)
      const loginDate = new Date(loginTime);
      const now = new Date();
      const hoursDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);

      if (hoursDiff < 24) {
        const parsedUser = JSON.parse(user);
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(parsedUser);
      } else {
        this.clearStorage();
      }
    }

    // Check admin auth separately
    const storedAdmin = localStorage.getItem('adminUser');
    const adminLoginTime = localStorage.getItem('adminLoginTime');

    if (storedAdmin && adminLoginTime) {
      const loginDate = new Date(adminLoginTime);
      const now = new Date();
      const hoursDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);

      if (hoursDiff < 24) {
        const admin = JSON.parse(storedAdmin);
        this.currentAdminSubject.next(admin);
      } else {
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminLoginTime');
      }
    }
  }

  // User authentication methods
  loginUser(loginRequest: LoginRequest): Observable<JwtAuthenticationResponse> {
    return this.http.post<JwtAuthenticationResponse>(`${this.API_BASE_URL}/auth/login`, loginRequest)
      .pipe(
        tap(response => {
          this.setUserSession(response);
        }),
        catchError(this.handleError)
      );
  }

  registerUser(registerRequest: RegisterRequest): Observable<JwtAuthenticationResponse> {
    return this.http.post<JwtAuthenticationResponse>(`${this.API_BASE_URL}/auth/register`, registerRequest)
      .pipe(
        tap(response => {
          this.setUserSession(response);
        }),
        catchError(this.handleError)
      );
  }

  logoutUser(): void {
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.clearUserStorage();
  }

  // Admin authentication methods (kept for backward compatibility)
  loginAdmin(email: string, password: string): boolean {
    const admin = this.ADMIN_USERS.find(
      user => user.email === email && user.password === password
    );

    if (admin) {
      this.currentAdminSubject.next(admin);
      localStorage.setItem('adminUser', JSON.stringify(admin));
      localStorage.setItem('adminLoginTime', new Date().toISOString());
      return true;
    }

    return false;
  }

  logoutAdmin(): void {
    this.currentAdminSubject.next(null);
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminLoginTime');
  }

  logout(): void {
    this.logoutUser();
    this.logoutAdmin();
  }

  // Common methods
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentAdmin(): AdminUser | null {
    return this.currentAdminSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  private setUserSession(response: JwtAuthenticationResponse): void {
    const user: User = {
      email: response.email,
      role: response.role,
      nom: '', // Will be fetched from backend if needed
      prenom: ''
    };

    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next(user);
    localStorage.setItem('jwtToken', response.jwt);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('loginTime', new Date().toISOString());
  }

  private clearUserStorage(): void {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('loginTime');
  }

  private clearStorage(): void {
    this.clearUserStorage();
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminLoginTime');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur inconnue est survenue';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.status === 401) {
        errorMessage = 'Email ou mot de passe incorrect';
      } else if (error.status === 400) {
        errorMessage = 'Données invalides';
      } else if (error.status === 403) {
        errorMessage = 'Accès refusé';
      } else if (error.status === 409) {
        errorMessage = 'Email déjà utilisé';
      } else {
        errorMessage = `Erreur ${error.status}: ${error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
