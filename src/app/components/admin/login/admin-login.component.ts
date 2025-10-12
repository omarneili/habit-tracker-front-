// admin-login.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loginError: string = '';
  isLoading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.createLoginForm();
  }

  ngOnInit(): void {
    // Vérifier si l'utilisateur est déjà connecté
    if (this.authService.isAuthenticated()) {
      this.redirectToDashboard();
    }

    // Écouter les changements du formulaire pour reset les erreurs
    this.loginForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.loginError) {
          this.loginError = '';
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createLoginForm(): FormGroup {
    return this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [
        Validators.required, 
        Validators.minLength(6),
        Validators.maxLength(50)
      ]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.attemptLogin();
    } else {
      this.markFormGroupTouched();
      this.showFormErrors();
    }
  }

  private attemptLogin(): void {
    this.isLoading = true;
    this.loginError = '';

    const { email, password } = this.loginForm.value;

    // Simulation d'appel API avec timeout
    setTimeout(() => {
      try {
        const success = this.authService.login(email, password);

        if (success) {
          this.handleLoginSuccess();
        } else {
          this.handleLoginFailure();
        }
      } catch (error) {
        this.handleLoginError(error);
      } finally {
        this.isLoading = false;
      }
    }, 1500);
  }

  private handleLoginSuccess(): void {
    // Animation de succès
    this.triggerSuccessAnimation();
    
    // Redirection après un délai pour voir l'animation
    setTimeout(() => {
      this.redirectToDashboard();
    }, 500);
  }

  private handleLoginFailure(): void {
    this.loginError = 'Email ou mot de passe incorrect';
    this.triggerErrorAnimation();
    
    // Reset du mot de passe pour la sécurité
    this.password?.setValue('');
    this.password?.markAsUntouched();
  }

  private handleLoginError(error: any): void {
    console.error('Login error:', error);
    this.loginError = 'Une erreur est survenue. Veuillez réessayer.';
    this.triggerErrorAnimation();
  }

  private redirectToDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  private showFormErrors(): void {
    if (this.email?.errors?.['required'] || this.password?.errors?.['required']) {
      this.loginError = 'Veuillez remplir tous les champs obligatoires';
    } else if (this.email?.errors?.['email'] || this.email?.errors?.['pattern']) {
      this.loginError = 'Veuillez entrer une adresse email valide';
    } else if (this.password?.errors?.['minlength']) {
      this.loginError = 'Le mot de passe doit contenir au moins 6 caractères';
    }
  }

  private triggerErrorAnimation(): void {
    const form = document.querySelector('.login-form');
    form?.classList.add('shake-animation');
    
    setTimeout(() => {
      form?.classList.remove('shake-animation');
    }, 600);
  }

  private triggerSuccessAnimation(): void {
    const card = document.querySelector('.login-card');
    card?.classList.add('success-animation');
    
    setTimeout(() => {
      card?.classList.remove('success-animation');
    }, 600);
  }

  // Méthodes utilitaires pour le template
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    
    if (field?.errors?.['required']) {
      return 'Ce champ est requis';
    } else if (field?.errors?.['email'] || field?.errors?.['pattern']) {
      return 'Format invalide';
    } else if (field?.errors?.['minlength']) {
      return `Minimum ${field.errors?.['minlength'].requiredLength} caractères`;
    } else if (field?.errors?.['maxlength']) {
      return `Maximum ${field.errors?.['maxlength'].requiredLength} caractères`;
    }
    
    return '';
  }
}