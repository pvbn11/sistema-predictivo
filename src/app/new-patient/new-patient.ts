import { Component, inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { PatientService, Paciente } from '../services/patient.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-new-patient',
  imports: [CommonModule, FormsModule, Sidebar, RouterLink],
  templateUrl: './new-patient.html',
  styleUrl: './new-patient.css',
})
export class NewPatient {
  patient: Paciente = {
    nombres: '',
    apellidos: '',
    dni: '',
    fechaNacimiento: '',
    fechaProbableParto: ''
  };

  registerError: string | null = null;
  formSubmitted = false;

  @ViewChild('patientForm') patientForm!: NgForm;

  private patientService = inject(PatientService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  get calculatedAge(): number | null {
    if (!this.patient.fechaNacimiento) return null;
    const birthDate = new Date(this.patient.fechaNacimiento);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  isFutureDate(dateStr: string): boolean {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  }

  save() {
    this.formSubmitted = true;
    this.registerError = null;

    if (this.patientForm.invalid) {
      Object.values(this.patientForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    if (this.patient.dni.length !== 8 || !/^\d+$/.test(this.patient.dni)) {
      return;
    }

    if (this.isFutureDate(this.patient.fechaNacimiento)) {
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.idMedico) {
      this.patient.medico = { idMedico: currentUser.idMedico };
    }

    this.patientService.createPatient(this.patient).subscribe({
      next: () => {
        alert('Paciente registrada exitosamente');
        this.router.navigate(['/patients']);
      },
      error: (err) => {
        console.error(err);
        if (err.status === 409) {
          this.registerError = 'Ya existe una paciente registrada con este DNI';
          this.cdr.detectChanges(); // Force update
        } else {
          alert('Error al registrar paciente: ' + (err.error || 'Error desconocido'));
        }
      }
    });
  }

  cancel() {
    this.router.navigate(['/patients']);
  }
}
