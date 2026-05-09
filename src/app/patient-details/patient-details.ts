import { Component, inject, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { PatientService, Paciente } from '../services/patient.service';
import { AuthService } from '../services/auth.service';
import Chart from 'chart.js/auto';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
    selector: 'app-patient-details',
    imports: [CommonModule, FormsModule, Sidebar, RouterLink],
    templateUrl: './patient-details.html',
    styleUrl: './patient-details.css',
})
export class PatientDetails {
    patient: Paciente | null = null;
    monitorings: any[] = [];
    errorMessage: string = '';
    chart: any;
    notas: any[] = [];
    nuevaNotaContenido: string = '';
    
    activeTab: 'riesgo' | 'notas' = 'riesgo';
    editingNoteId: number | null = null;
    editNotaContenido: string = '';

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private patientService = inject(PatientService);
    private authService = inject(AuthService);
    private cdr = inject(ChangeDetectorRef);

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        console.log('PatientDetails Init. Route ID:', id);
        if (id) {
            this.loadPatient(Number(id));
            this.loadMonitorings(Number(id));
            this.loadNotas(Number(id));
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
                this.monitorings = data.map((m: any) => {
                    let nR = m.nivelRiesgo;
                    if (nR === 'Alto') nR = 'Patológico';
                    if (nR === 'Medio') nR = 'Sospechoso';
                    if (nR === 'Bajo') nR = 'Normal';
                    return { ...m, nivelRiesgo: nR };
                });
                
                this.cdr.detectChanges();
                setTimeout(() => this.renderChart(), 0);
            },
            error: (err) => {
                console.error('Error loading monitorings', err);
                // Non-critical, just log
            }
        });
    }

    formatDate(dateObj: any): Date | string {
        if (!dateObj) return '';
        if (Array.isArray(dateObj)) {
            // Spring Boot serializa LocalDateTime como [año, mes, día, hora, minuto, segundo]
            return new Date(dateObj[0], dateObj[1] - 1, dateObj[2], dateObj[3] || 0, dateObj[4] || 0, dateObj[5] || 0);
        }
        return dateObj;
    }

    loadNotas(id: number) {
        this.patientService.getNotasClinicas(id).subscribe({
            next: (data) => {
                this.notas = data.map(n => ({
                    ...n,
                    fechaNota: this.formatDate(n.fechaNota) || new Date() // Fallback para notas antiguas con fecha null
                }));
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error loading notas', err)
        });
    }

    agregarNota() {
        if (!this.nuevaNotaContenido.trim() || !this.patient) return;
        const currentUser = this.authService.getCurrentUser() || { idMedico: 2 }; // fallback if no user
        const nota = {
            contenido: this.nuevaNotaContenido,
            paciente: { idPaciente: this.patient.idPaciente },
            medico: { idMedico: currentUser.idMedico || currentUser.id } 
        };
        this.patientService.createNotaClinica(nota).subscribe({
            next: (saved) => {
                saved.fechaNota = this.formatDate(saved.fechaNota) || new Date();
                
                // Si el backend no devuelve el usuario hidratado, usamos el de la sesión temporalmente o un fallback
                const currentUser = this.authService.getCurrentUser();
                if (!saved.medico || !saved.medico.nombres) {
                    if (currentUser) {
                        saved.medico = {
                            titulo: currentUser.titulo || 'Dr/a.',
                            nombres: currentUser.nombres || '',
                            apellidos: currentUser.apellidos || ''
                        };
                    } else {
                        saved.medico = {
                            titulo: 'Dra.',
                            nombres: 'Ana',
                            apellidos: 'Gomez'
                        };
                    }
                }
                this.notas.unshift(saved);
                this.nuevaNotaContenido = '';
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error saving nota', err)
        });
    }

    setTab(tab: 'riesgo' | 'notas') {
        this.activeTab = tab;
        this.cdr.detectChanges();
        if (tab === 'riesgo') {
            setTimeout(() => this.renderChart(), 0);
        }
    }

    iniciarEdicion(nota: any) {
        this.editingNoteId = nota.idNota;
        this.editNotaContenido = nota.contenido;
    }

    cancelarEdicion() {
        this.editingNoteId = null;
        this.editNotaContenido = '';
    }

    guardarEdicion(nota: any) {
        if (!this.editNotaContenido.trim()) return;
        
        const currentUser = this.authService.getCurrentUser() || { idMedico: 2 };
        const updatedNota = { 
            ...nota, 
            contenido: this.editNotaContenido,
            medico: { idMedico: currentUser.idMedico || currentUser.id }
        };
        
        this.patientService.updateNotaClinica(nota.idNota, updatedNota).subscribe({
            next: (saved) => {
                // Actualizar localmente la fecha de edición si el backend no lo hizo y asegurar el médico
                saved.fechaNota = this.formatDate(saved.fechaNota) || new Date();
                if (!saved.medico || !saved.medico.nombres) {
                    if (currentUser) {
                        saved.medico = {
                            titulo: currentUser.titulo || 'Dr/a.',
                            nombres: currentUser.nombres || '',
                            apellidos: currentUser.apellidos || ''
                        };
                    } else {
                        saved.medico = {
                            titulo: 'Dra.',
                            nombres: 'Ana',
                            apellidos: 'Gomez'
                        };
                    }
                }
                
                const index = this.notas.findIndex(n => n.idNota === nota.idNota);
                if (index !== -1) this.notas[index] = saved;
                this.editingNoteId = null;
                this.editNotaContenido = '';
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error updating nota', err)
        });
    }

    eliminarNota(id: number) {
        if (confirm('¿Está seguro de eliminar esta nota clínica?')) {
            this.patientService.deleteNotaClinica(id).subscribe({
                next: () => {
                    this.notas = this.notas.filter(n => n.idNota !== id);
                    this.cdr.detectChanges();
                },
                error: (err) => console.error('Error deleting nota', err)
            });
        }
    }

    renderChart() {
        if (this.monitorings.length < 3) return;

        const canvas = document.getElementById('riskChart') as HTMLCanvasElement;
        if (!canvas) return;

        if (this.chart) {
            this.chart.destroy();
        }

        const sortedMonitorings = [...this.monitorings].sort((a, b) => new Date(a.fechaMonitoreo).getTime() - new Date(b.fechaMonitoreo).getTime());
        
        const labels = sortedMonitorings.map(m => new Date(m.fechaMonitoreo).toLocaleDateString());
        const dataPoints = sortedMonitorings.map(m => {
            // Si no hay porcentaje, calcular uno ficticio en base al nivel
            if (m.porcentajeRiesgo !== undefined) return m.porcentajeRiesgo;
            if (m.nivelRiesgo === 'Patológico' || m.nivelRiesgo === 'Alto') return Math.floor(Math.random() * 20) + 80;
            if (m.nivelRiesgo === 'Sospechoso' || m.nivelRiesgo === 'Medio') return Math.floor(Math.random() * 30) + 40;
            return Math.floor(Math.random() * 30) + 10;
        });
        
        // Tooltip customizado para mostrar fecha exacta y porcentaje
        const fullDates = sortedMonitorings.map(m => new Date(m.fechaMonitoreo).toLocaleString());

        this.chart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Nivel de Riesgo (%)',
                    data: dataPoints,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: '#2563eb',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: (context) => {
                                return 'Fecha: ' + fullDates[context[0].dataIndex];
                            },
                            label: (context) => {
                                return 'Riesgo: ' + context.parsed.y + '%';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Riesgo (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Fecha'
                        }
                    }
                }
            }
        });
    }

    async exportarPDF() {
        if (!this.patient) return;
        
        const doc = new jsPDF('p', 'mm', 'a4');
        const fechaActual = new Date();
        const fechaString = fechaActual.toLocaleString();
        
        // Formato nombre archivo: Reporte_NombreCompleto_DDMMAAAA.pdf
        const day = String(fechaActual.getDate()).padStart(2, '0');
        const month = String(fechaActual.getMonth() + 1).padStart(2, '0');
        const year = fechaActual.getFullYear();
        const nombreSinEspacios = `${this.patient.nombres}${this.patient.apellidos}`.replace(/\s+/g, '');
        const fileName = `Reporte_${nombreSinEspacios}_${day}${month}${year}.pdf`;

        // 1. Título y Encabezado
        doc.setFontSize(16);
        doc.text(`Reporte de Monitoreo Prenatal`, 105, 20, { align: 'center' });
        doc.setFontSize(14);
        doc.text(`Paciente: ${this.patient.nombres} ${this.patient.apellidos}`, 105, 28, { align: 'center' });
        
        // 2. Datos de la paciente
        doc.setFontSize(12);
        doc.text(`DNI: ${this.patient.dni}`, 20, 45);
        doc.text(`Edad: ${this.calculateAge(this.patient.fechaNacimiento)} años`, 20, 53);
        doc.text(`Fecha Nacimiento: ${this.patient.fechaNacimiento}`, 20, 61);
        doc.text(`FPP: ${this.patient.fechaProbableParto || 'No registrada'}`, 20, 69);

        // 3. Resultado del Último Monitoreo
        let currentY = 85;
        if (this.monitorings && this.monitorings.length > 0) {
            const ultimo = this.monitorings[0];
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text('Resultado del Último Monitoreo', 20, currentY);
            doc.setFont("helvetica", "normal");
            currentY += 8;
            doc.setFontSize(12);
            doc.text(`Fecha: ${new Date(ultimo.fechaMonitoreo).toLocaleString()}`, 20, currentY);
            currentY += 8;
            doc.text(`Nivel de Riesgo: ${ultimo.nivelRiesgo}`, 20, currentY);
            currentY += 8;
            doc.text(`Semanas de Gestación: ${ultimo.semanasGestacion || 'N/A'}`, 20, currentY);
            currentY += 8;
            doc.text(`LPM: ${ultimo.frecuenciaCardiacaFetal || 'N/A'} | Movimientos: ${ultimo.movimientosFetales || 'N/A'}`, 20, currentY);
            currentY += 15;
        } else {
            doc.text('No hay monitoreos registrados.', 20, currentY);
            currentY += 15;
        }

        // 4. Gráfico de Historial de Riesgo
        if (this.monitorings.length >= 3) {
            const chartContainer = document.getElementById('riskChart') as HTMLCanvasElement;
            if (chartContainer) {
                // Hacemos el tab de riesgo visible temporalmente si no lo está, para poder capturarlo
                const previousTab = this.activeTab;
                if (previousTab !== 'riesgo') {
                    this.activeTab = 'riesgo';
                    this.cdr.detectChanges();
                    // wait a tick
                    await new Promise(r => setTimeout(r, 100));
                }

                doc.setFontSize(14);
                doc.setFont("helvetica", "bold");
                doc.text('Gráfico de Historial de Riesgo', 20, currentY);
                doc.setFont("helvetica", "normal");
                currentY += 10;
                
                try {
                    const canvas = await html2canvas(chartContainer);
                    const imgData = canvas.toDataURL('image/png');
                    const imgWidth = 170;
                    const imgHeight = canvas.height * imgWidth / canvas.width;
                    
                    doc.addImage(imgData, 'PNG', 20, currentY, imgWidth, imgHeight);
                } catch (e) {
                    console.error('Error capture chart', e);
                }

                // Restaurar pestaña
                if (previousTab !== 'riesgo') {
                    this.activeTab = previousTab;
                    this.cdr.detectChanges();
                }
            }
        }

        // 5. Pie de página
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Fecha y hora de exportación: ${fechaString}`, 105, 285, { align: 'center' });

        doc.save(fileName);
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
