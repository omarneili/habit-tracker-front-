import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  onRegister(form: any) {
    if (form.valid && form.value.password === form.value.confirmPassword) {
      console.log('Register:', form.value);
      // TODO: Implement registration logic
    }
  }
}
