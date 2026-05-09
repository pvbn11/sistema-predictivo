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
  riesgoPatologico = 0;
  riesgoSospechoso = 0;
  riesgoNormal = 0;

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
               if (nR === 'Alto') nR = 'Patológico';
               if (nR === 'Medio') nR = 'Sospechoso';
               if (nR === 'Bajo') nR = 'Normal';
               return { ...m, nivelRiesgo: nR, patientName: p.nombres + ' ' + p.apellidos, patientId: p.idPaciente };
            }));

            let riskLevel = latest.nivelRiesgo;
            if (riskLevel === 'Alto') riskLevel = 'Patológico';
            if (riskLevel === 'Medio') riskLevel = 'Sospechoso';
            if (riskLevel === 'Bajo') riskLevel = 'Normal';

            let percent = latest.porcentajeRiesgo;
            
            if (riskLevel === 'Patológico') {
               this.riesgoPatologico++;
               if (!percent) percent = 85;
            } else if (riskLevel === 'Sospechoso') {
               this.riesgoSospechoso++;
               if (!percent) percent = 50;
            } else {
               this.riesgoNormal++;
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
      if (nivel === 'Alto' || nivel === 'Patológico') return 'high';
      if (nivel === 'Medio' || nivel === 'Sospechoso') return 'medium';
      return 'low';
  }
}
