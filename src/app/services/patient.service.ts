import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Paciente {
    idPaciente?: number;
    nombres: string;
    apellidos: string;
    dni: string;
    fechaNacimiento: string;
    fechaProbableParto: string;
    fechaAltaPaciente?: string;
    medico?: { idMedico: number };
}

@Injectable({
    providedIn: 'root'
})
export class PatientService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/patients';

    getPatients(): Observable<Paciente[]> {
        return this.http.get<Paciente[]>(this.apiUrl);
    }

    createPatient(paciente: Paciente): Observable<Paciente> {
        return this.http.post<Paciente>(this.apiUrl, paciente);
    }

    getPatientById(id: number): Observable<Paciente> {
        return this.http.get<Paciente>(`${this.apiUrl}/${id}`);
    }

    getMonitorings(patientId: number): Observable<any[]> {
        return this.http.get<any[]>(`http://localhost:8080/api/monitoreos/patient/${patientId}`);
    }
}
