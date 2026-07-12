import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../sidebar/sidebar';
import { PatientService } from '../services/patient.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, Sidebar, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  patientService = inject(PatientService);
  private cdr = inject(ChangeDetectorRef);

  totalPacientes = 0;
  riesgoAlterado = 0;
  riesgoOptimo = 0;

  pacientesRiesgo: any[] = [];
  monitoreosRecientes: any[] = [];

  ngOnInit() {
    this.patientService.getPatients().subscribe({
      next: (patients) => {
        this.totalPacientes = patients.length;
        this.cdr.detectChanges();
        
        if (patients.length === 0) return;

        const requests = patients.map(p => 
          this.patientService.getMonitorings(p.idPaciente!).pipe(
            catchError(() => of([]))
          )
        );

        forkJoin(requests).subscribe(results => {
        let allMonitorings: any[] = [];
        let patientsWithRisk: any[] = [];

        patients.forEach((p, index) => {
          let monitorings = results[index];

          if (monitorings.length > 0) {
            const latest = monitorings[0];
            
            allMonitorings.push(...monitorings.map((m: any) => {
               let nR = m.nivelRiesgo;
               if (nR === 'Alto' || nR === 'Medio' || nR === 'Patológico' || nR === 'Sospechoso' || nR === 'Alterado') {
                  nR = 'Alterado';
               } else {
                  nR = 'Óptimo';
               }
               return { ...m, nivelRiesgo: nR, patientName: p.nombres + ' ' + p.apellidos, patientId: p.idPaciente };
            }));

            let riskLevel = latest.nivelRiesgo;
            if (riskLevel === 'Alto' || riskLevel === 'Medio' || riskLevel === 'Patológico' || riskLevel === 'Sospechoso' || riskLevel === 'Alterado') {
               riskLevel = 'Alterado';
            } else {
               riskLevel = 'Óptimo';
            }

            let percent = latest.porcentajeRiesgo;
            
            if (riskLevel === 'Alterado') {
               this.riesgoAlterado++;
               if (!percent) percent = 70;
            } else {
               this.riesgoOptimo++;
               if (!percent) percent = 15;
            }

            patientsWithRisk.push({
               patient: p,
               latestRisk: riskLevel,
               riskPercent: percent
            });
          }
        });

        patientsWithRisk.sort((a, b) => b.riskPercent - a.riskPercent);
        this.pacientesRiesgo = patientsWithRisk.slice(0, 5);

        allMonitorings.sort((a, b) => new Date(b.fechaMonitoreo).getTime() - new Date(a.fechaMonitoreo).getTime());
        this.monitoreosRecientes = allMonitorings.slice(0, 5);
        
        this.cdr.detectChanges();
      });
    },
    error: (err) => console.error('Error fetching patients in dashboard:', err)
    });
  }

  getRiskClass(nivel: string) {
      if (nivel === 'Alto' || nivel === 'Patológico' || nivel === 'Medio' || nivel === 'Sospechoso' || nivel === 'Alterado') {
          return 'high';
      }
      return 'low';
  }
}
