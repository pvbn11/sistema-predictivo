import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Sidebar } from '../sidebar/sidebar';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  doctor: any = {};
  passwords = {
    current: '',
    new: '',
    confirm: ''
  };

  visibility = {
    current: false,
    new: false,
    confirm: false
  };

  validation = {
    length: false,
    upper: false,
    lower: false,
    number: false
  };

  isLoading = false;
  toast = { show: false, message: '', type: 'error' }; // type: 'success' | 'error'

  get isFormValid(): boolean {
    // Safety check for boolean properties
    return !!(this.validation.length &&
      this.validation.upper &&
      this.validation.lower &&
      this.validation.number &&
      this.passwords.new === this.passwords.confirm &&
      this.passwords.current &&
      this.passwords.current.length > 0);
  }

  toggleVisibility(field: 'current' | 'new' | 'confirm') {
    this.visibility[field] = !this.visibility[field];
  }

  checkPasswordStrength() {
    const pw = this.passwords.new;
    this.validation.length = pw.length >= 8;
    this.validation.upper = /[A-Z]/.test(pw);
    this.validation.lower = /[a-z]/.test(pw);
    this.validation.number = /[0-9]/.test(pw);
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toast = { show: true, message, type: type as any };
    setTimeout(() => {
      this.toast.show = false;
    }, 4000);
  }

  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.doctor = this.authService.getCurrentUser() || {};
  }

  updatePassword() {
    if (!this.isFormValid) return;

    this.isLoading = true;

    if (!this.doctor.idMedico) {
      this.showToast('Error: No se pudo identificar al usuario', 'error');
      this.isLoading = false;
      return;
    }

    // ==========================================
    // MODIFICACIÓN: ASIGNACIÓN DE URL DINÁMICA
    // ==========================================
    const baseUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:8080' 
      : 'https://tu-app-backend.azurewebsites.net'; // <-- Reemplazar por tu URL de Azure

    // MODIFICACIÓN: Se reemplazó la ruta quemada por `${baseUrl}`
    this.http.put(`${baseUrl}/api/doctors/${this.doctor.idMedico}/password`, {
      currentPassword: this.passwords.current,
      newPassword: this.passwords.new
    }).subscribe({
      next: (res: any) => {
        this.showToast('Contraseña actualizada correctamente', 'success');
        this.passwords = { current: '', new: '', confirm: '' };
        this.isLoading = false;
        this.checkPasswordStrength();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Password Update Error:', err);
        const msg = err.error?.message || 'Error al actualizar contraseña';
        if ((msg && msg.toLowerCase().includes('incorrect')) || err.status === 400 || err.status === 401) {
          this.showToast('La contraseña actual es incorrecta', 'error');
        } else {
          this.showToast(msg, 'error');
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}