import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group({

    name: ['', Validators.required],

    email: ['', [
      Validators.required,
      Validators.email
    ]],

    password: ['', [
      Validators.required,
      Validators.minLength(6)
    ]]

  });

  register() {

    if (this.registerForm.invalid) {
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({

      next: () => {

        alert('Registration Successful');

        this.router.navigate(['/login']);

      },

      error: (err) => {

        alert(err.error.message);

      }

    });

  }

}