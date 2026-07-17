import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  login() {

    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({

      next: (res: any) => {

        localStorage.setItem('token', res.token);

        this.router.navigate(['/dashboard']);

      },

      error: (err) => {

        alert(err.error.message);

      }

    });

  }

}