import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Paciente {
    idPaciente?: number;
    nombres: string;
    apellidos: string;
    dni: string;
    fechaNacimiento: string;
    fechaProbableParto: string | null;
    fechaAltaPaciente?: string;
    medico?: { idMedico: number };
}

export interface NotaClinica {
    idNota?: number;
    medico?: any;
    paciente?: any;
    fechaNota?: string | Date;
    contenido: string;
}

@Injectable({
    providedIn: 'root'
})
export class PatientService {
    private http = inject(HttpClient);
    private getBaseUrl(): string {
        return window.location.hostname === 'localhost' 
            ? 'http://localhost:8080' 
            : 'https://tu-app-backend.azurewebsites.net'; // <-- Reemplazar por URL de Azure
    }

    private apiUrl = `${this.getBaseUrl()}/api/patients`;

    getPatients(): Observable<Paciente[]> {
        return this.http.get<Paciente[]>(this.apiUrl);
    }

    createPatient(paciente: Paciente): Observable<Paciente> {
        return this.http.post<Paciente>(this.apiUrl, paciente);
    }

    getPatientById(id: number): Observable<Paciente> {
        return this.http.get<Paciente>(`${this.apiUrl}/${id}`);
    }

    // MODIFICACIÓN: Ruta estática cambiada a dinámica
    getMonitorings(patientId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.getBaseUrl()}/api/monitoreos/patient/${patientId}`);
    }

    updatePatient(id: number, patient: Paciente): Observable<Paciente> {
        return this.http.put<Paciente>(`${this.apiUrl}/${id}`, patient);
    }

    // MODIFICACIÓN: Ruta estática cambiada a dinámica
    getNotasClinicas(patientId: number): Observable<NotaClinica[]> {
        return this.http.get<NotaClinica[]>(`${this.getBaseUrl()}/api/notas/patient/${patientId}`);
    }

    // MODIFICACIÓN: Ruta estática cambiada a dinámica
    createNotaClinica(nota: NotaClinica): Observable<NotaClinica> {
        return this.http.post<NotaClinica>(`${this.getBaseUrl()}/api/notas`, nota);
    }

    // MODIFICACIÓN: Ruta estática cambiada a dinámica
    updateNotaClinica(id: number, nota: NotaClinica): Observable<NotaClinica> {
        return this.http.put<NotaClinica>(`${this.getBaseUrl()}/api/notas/${id}`, nota);
    }

    // MODIFICACIÓN: Ruta estática cambiada a dinámica
    deleteNotaClinica(id: number): Observable<any> {
        return this.http.delete(`${this.getBaseUrl()}/api/notas/${id}`);
    }

    // MODIFICACIÓN: Ruta estática cambiada a dinámica
    uploadMonitoreo(formData: FormData): Observable<any> {
        return this.http.post<any>(`${this.getBaseUrl()}/api/monitoreos/predict`, formData);
    }
}
