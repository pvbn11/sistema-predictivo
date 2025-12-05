import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { PatientService, Paciente } from '../services/patient.service';

@Component({
    selector: 'app-patient-details',
    imports: [CommonModule, Sidebar, RouterLink],
    templateUrl: './patient-details.html',
    styleUrl: './patient-details.css',
})
export class PatientDetails {
    patient: Paciente | null = null;
    monitorings: any[] = [];
    errorMessage: string = '';

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private patientService = inject(PatientService);
    private cdr = inject(ChangeDetectorRef);

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        console.log('PatientDetails Init. Route ID:', id);
        if (id) {
            this.loadPatient(Number(id));
            this.loadMonitorings(Number(id));
        } else {
            this.errorMessage = 'No se encontró el ID del paciente en la URL.';
        }
    }

    loadPatient(id: number) {
        console.log('Fetching patient with ID:', id);
        this.patientService.getPatientById(id).subscribe({
            next: (data) => {
                console.log('Patient loaded successfully:', data);
                this.patient = data;
                this.cdr.detectChanges(); // Force view update
            },
            error: (err) => {
                console.error('Error loading patient:', err);
                this.errorMessage = 'Error al cargar paciente: ' + (err.error?.message || err.statusText || err.message);
                this.cdr.detectChanges();
            }
        });
    }

    loadMonitorings(id: number) {
        console.log('Fetching monitorings for patient ID:', id);
        this.patientService.getMonitorings(id).subscribe({
            next: (data) => {
                console.log('Monitorings loaded:', data);
                this.monitorings = data;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading monitorings', err);
                // Non-critical, just log
            }
        });
    }

    calculateAge(dob: string): number {
        if (!dob) return 0;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
}
