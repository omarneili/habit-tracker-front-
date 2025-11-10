import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerRequest: RegisterRequest = { nom: '', prenom: '', email: '', password: '' };
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Ensure form is reset when component initializes
    this.registerRequest = { nom: '', prenom: '', email: '', password: '' };
    this.errorMessage = '';
    this.isLoading = false;
  }

  onRegister(form: any) {
    if (form.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.registerUser(this.registerRequest).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
