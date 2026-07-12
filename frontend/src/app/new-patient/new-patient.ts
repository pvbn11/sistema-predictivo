import { Component, inject, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { PatientService, Paciente } from '../services/patient.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-new-patient',
  imports: [CommonModule, FormsModule, Sidebar, RouterLink],
  templateUrl: './new-patient.html',
  styleUrl: './new-patient.css',
})
export class NewPatient implements OnInit {
  patient: Paciente = {
    nombres: '',
    apellidos: '',
    dni: '',
    fechaNacimiento: '',
    fechaProbableParto: ''
  };

  registerError: string | null = null;
  formSubmitted = false;
  isEditing = false;
  patientId?: number;

  @ViewChild('patientForm') patientForm!: NgForm;

  private patientService = inject(PatientService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditing = true;
        this.patientId = +id;
        this.loadPatient(this.patientId);
      }
    });
  }

  loadPatient(id: number) {
    this.patientService.getPatientById(id).subscribe({
      next: (data) => {
        this.patient = data;
        this.cdr.detectChanges(); // Force view update to show preloaded data
      },
      error: (err) => {
        console.error('Error loading patient for edit', err);
        alert('Error al cargar datos del paciente');
        this.router.navigate(['/patients']);
      }
    });
  }

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

    // Prepare payload
    const payload = { ...this.patient };
    if (!payload.fechaProbableParto) {
      payload.fechaProbableParto = null;
    }

    if (this.isEditing && this.patientId) {
      this.patientService.updatePatient(this.patientId, payload).subscribe({
        next: () => {
          alert('Paciente editada exitosamente');
          this.router.navigate(['/patients']);
        },
        error: (err) => {
          console.error(err);
          alert('Error al editar paciente: ' + (err.error || 'Error desconocido'));
        }
      });
    } else {
      this.patientService.createPatient(payload).subscribe({
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
  }

  cancel() {
    this.router.navigate(['/patients']);
  }
}
