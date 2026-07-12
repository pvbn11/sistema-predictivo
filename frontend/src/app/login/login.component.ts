import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  template: `
<div class="login-container">
    <!-- Toast Notification -->
    <div class="toast-notification" *ngIf="showToast">
        <span class="icon">!</span>
        <span>Usuario o contraseña incorrectos</span>
    </div>

    <div class="login-card">
        <div class="logo-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2979FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
        </div>
        <h1>Sistema de Monitoreo Prenatal</h1>
        <p class="subtitle">Ingrese sus credenciales para acceder al sistema</p>

        <form (ngSubmit)="login()">
            <div class="form-group">
                <label for="usuario">Usuario</label>
                <div class="input-wrapper">
                    <span class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9E9E9E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </span>
                    <input type="text" id="usuario" name="usuario" placeholder="Ingrese su usuario" [(ngModel)]="username">
                </div>
            </div>
            <div class="form-group">
                <label for="password">Contraseña</label>
                <div class="input-wrapper">
                    <span class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9E9E9E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </span>
                    <input type="password" id="password" name="password" placeholder="Ingrese su contraseña" [(ngModel)]="password">
                </div>
            </div>

            <button type="submit" class="btn-login">Ingresar</button>
        </form>

        <div class="test-credentials">
            <p class="test-title">Credenciales de prueba:</p>
            <p>Usuario: dra.rodriguez</p>
            <p>Contraseña: password123</p>
        </div>
    </div>
</div>
  `,
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  showToast = false;
  toastTimer: any;

  private router = inject(Router);
  private authService = inject(AuthService);

  login() {
    // Clear previous timer if any
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: (response) => {
          this.showToast = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.showToast = true;
          this.toastTimer = setTimeout(() => {
            this.showToast = false;
          }, 8000);
        }
      });
  }
}
