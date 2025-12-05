import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { PatientService } from '../services/patient.service';

@Component({
    selector: 'app-new-monitoring',
    standalone: true,
    imports: [CommonModule, RouterModule, Sidebar],
    templateUrl: './new-monitoring.html',
    styleUrl: './new-monitoring.css',
})
export class NewMonitoringComponent implements OnInit {
    patient: any = null;
    uploadedFile: File | null = null;
    selectedFileName: string | null = null;
    uploadedFileUrl: string | null = null;
    todayDate: Date = new Date();
    toast = { show: false, message: '' };

    private route = inject(ActivatedRoute);
    private patientService = inject(PatientService);
    private cdr = inject(ChangeDetectorRef);

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id = Number(params.get('id'));
            if (id) {
                this.loadPatient(id);
            }
        });
    }

    loadPatient(id: number) {
        this.patientService.getPatientById(id).subscribe({
            next: (data) => {
                this.patient = data;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading patient', err);
                this.cdr.detectChanges();
            }
        });
    }

    calculateAge(dateString: string): string {
        if (!dateString) return '';
        const birthDate = new Date(dateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age.toString();
    }

    onFileSelected(event: any) {
        const file: File = event.target.files[0];
        this.handleFile(file);
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            this.handleFile(files[0]);
        }
    }

    handleFile(file: File) {
        if (!file) return;

        if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
            alert('Solo se permiten archivos JPG.');
            return;
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB
            alert('El archivo excede el tamaño máximo de 10MB.');
            return;
        }

        this.uploadedFile = file;
        this.selectedFileName = file.name;

        // Create preview
        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.uploadedFileUrl = e.target.result;
            this.showToast('Imagen cargada correctamente');
            this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
    }

    removeFile() {
        this.uploadedFile = null;
        this.selectedFileName = null;
        this.uploadedFileUrl = null;
        this.cdr.detectChanges();
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
        return `${size} ${sizes[i]}`;
    }

    showToast(message: string) {
        this.toast = { show: true, message };
        setTimeout(() => {
            this.toast.show = false;
            this.cdr.detectChanges();
        }, 3000);
    }

    onCancel() {
        window.history.back();
    }

    onSave() {
        // Placeholder for save logic
        alert('Funcionalidad de guardar pendiente.');
    }
}
