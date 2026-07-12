import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    // Función inteligente para detectar si estás en Local o en la Nube
    private getBaseUrl(): string {
        return window.location.hostname === 'localhost' 
            ? 'http://localhost:8080' 
            : 'https://tu-app-backend.azurewebsites.net'; // <-- Reemplazar por URL de Azure cuando la tengas
    }

    // Acoplamos la URL dinámica con la ruta de autenticación
    private apiUrl = `${this.getBaseUrl()}/api/auth`;

    private currentUserKey = 'currentUser';

    login(credentials: { username: string, password: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                if (response.medico) {
                    localStorage.setItem(this.currentUserKey, JSON.stringify(response.medico));
                }
            })
        );
    }

    logout() {
        localStorage.removeItem(this.currentUserKey);
    }

    getCurrentUser() {
        const user = localStorage.getItem(this.currentUserKey);
        return user ? JSON.parse(user) : null;
    }
}
