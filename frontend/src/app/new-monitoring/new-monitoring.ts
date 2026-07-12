import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../sidebar/sidebar';
import { PatientService } from '../services/patient.service';

@Component({
    selector: 'app-new-monitoring',
    standalone: true,
    imports: [CommonModule, RouterModule, Sidebar, FormsModule],
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

    // View states for predictive analysis
    viewState: 'form' | 'loading' | 'result' = 'form';
    progressValue: number = 0;
    riskResult: any = null;
    private progressInterval: any = null;
    private fastProgressInterval: any = null;

    // Scale variables for CTG tracing paper
    escalaX: number = 1;
    escalaY: number = 20;

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

    preventNonInteger(event: KeyboardEvent) {
        const keysToPrevent = ['e', 'E', '.', ',', '-', '+'];
        if (keysToPrevent.includes(event.key)) {
            event.preventDefault();
        }
    }

    preventNonIntegerPaste(event: ClipboardEvent) {
        const clipboardData = event.clipboardData;
        const pastedText = clipboardData?.getData('text') || '';
        if (!/^\d+$/.test(pastedText)) {
            event.preventDefault();
        }
    }

    isFieldInvalid(fieldName: 'escalaX' | 'escalaY'): boolean {
        const val: any = this[fieldName];
        if (val === null || val === undefined || val === '') {
            return true;
        }
        const num = Number(val);
        if (!Number.isInteger(num)) return true;
        
        if (fieldName === 'escalaX') {
            return ![1, 2, 3].includes(num);
        }
        
        return num <= 0;
    }

    isSaveDisabled(): boolean {
        return !this.uploadedFile || this.isFieldInvalid('escalaX') || this.isFieldInvalid('escalaY') || this.isSaving;
    }

    onCancel() {
        if (this.viewState === 'result' || this.viewState === 'loading') {
            if (this.progressInterval) clearInterval(this.progressInterval);
            if (this.fastProgressInterval) clearInterval(this.fastProgressInterval);
            this.viewState = 'form';
            this.isSaving = false;
            this.cdr.detectChanges();
        } else {
            window.history.back();
        }
    }

    isSaving = false;

    onSave() {
        if (this.isSaveDisabled() || !this.patient || !this.patient.idPaciente) return;
        
        this.isSaving = true;
        this.viewState = 'loading';
        this.progressValue = 0;
        this.riskResult = null;

        if (this.progressInterval) clearInterval(this.progressInterval);
        if (this.fastProgressInterval) clearInterval(this.fastProgressInterval);

        // Simulate 0% to 95% progress
        this.progressInterval = setInterval(() => {
            if (this.progressValue < 80) {
                this.progressValue += Math.floor(Math.random() * 3) + 1;
            } else if (this.progressValue < 95) {
                this.progressValue += parseFloat((Math.random() * 0.8).toFixed(1));
            } else if (this.progressValue < 98) {
                this.progressValue += parseFloat((Math.random() * 0.2).toFixed(2));
            }
            
            if (this.progressValue > 98) {
                this.progressValue = 98;
            }
            this.progressValue = parseFloat(this.progressValue.toFixed(1));
            this.cdr.detectChanges();
        }, 150);

        const formData = new FormData();
        formData.append('file', this.uploadedFile!);
        formData.append('escalaX', this.escalaX.toString());
        formData.append('pacienteId', this.patient.idPaciente.toString());
        
        const medicoId = this.patient.medico?.idMedico || 1;
        formData.append('medicoId', medicoId.toString());

        this.patientService.uploadMonitoreo(formData).subscribe({
            next: (res) => {
                if (this.progressInterval) clearInterval(this.progressInterval);
                this.progressInterval = null;

                // Animate remaining to 100%
                this.fastProgressInterval = setInterval(() => {
                    this.progressValue += 5;
                    if (this.progressValue >= 100) {
                        this.progressValue = 100;
                        clearInterval(this.fastProgressInterval);
                        this.fastProgressInterval = null;
                        
                        setTimeout(() => {
                            this.isSaving = false;
                            this.riskResult = res;
                            this.viewState = 'result';
                            this.cdr.detectChanges();
                        }, 450);
                    }
                    this.cdr.detectChanges();
                }, 40);
            },
            error: (err) => {
                if (this.progressInterval) clearInterval(this.progressInterval);
                if (this.fastProgressInterval) clearInterval(this.fastProgressInterval);
                this.progressInterval = null;
                this.fastProgressInterval = null;
                
                this.isSaving = false;
                this.viewState = 'form';
                this.cdr.detectChanges();
                
                console.error('Error in prediction', err);
                alert('Ocurrió un error procesando el monitoreo: ' + (err.error?.error || err.message));
            }
        });
    }

    finishAndGoBack() {
        window.history.back();
    }

    openImageInNewTab() {
        if (this.uploadedFileUrl) {
            const newWindow = window.open();
            if (newWindow) {
                newWindow.document.write(`<img src="${this.uploadedFileUrl}" style="max-width:100%; height:auto; margin: auto; display: block;" />`);
                newWindow.document.title = "Visualización CTG";
                newWindow.document.close();
            }
        }
    }
}
