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

    updatePatient(id: number, patient: Paciente): Observable<Paciente> {
        return this.http.put<Paciente>(`${this.apiUrl}/${id}`, patient);
    }

    getNotasClinicas(patientId: number): Observable<NotaClinica[]> {
        return this.http.get<NotaClinica[]>(`http://localhost:8080/api/notas/patient/${patientId}`);
    }

    createNotaClinica(nota: NotaClinica): Observable<NotaClinica> {
        return this.http.post<NotaClinica>('http://localhost:8080/api/notas', nota);
    }

    updateNotaClinica(id: number, nota: NotaClinica): Observable<NotaClinica> {
        return this.http.put<NotaClinica>(`http://localhost:8080/api/notas/${id}`, nota);
    }

    deleteNotaClinica(id: number): Observable<any> {
        return this.http.delete(`http://localhost:8080/api/notas/${id}`);
    }

    uploadMonitoreo(formData: FormData): Observable<any> {
        return this.http.post<any>(`http://localhost:8080/api/monitoreos/predict`, formData);
    }
}
