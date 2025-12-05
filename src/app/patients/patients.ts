import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { PatientService, Paciente } from '../services/patient.service';

@Component({
  selector: 'app-patients',
  imports: [CommonModule, FormsModule, Sidebar, MatPaginatorModule],
  templateUrl: './patients.html',
  styleUrl: './patients.css',
})
export class Patients implements OnInit {
  patients: Paciente[] = [];
  searchTerm: string = '';
  private patientService = inject(PatientService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  // Pagination
  pageIndex = 0;
  pageSize = 6;

  get filteredPatients() {
    let result = this.patients;
    if (this.searchTerm && this.searchTerm.length >= 3) {
      const lowerTerm = this.searchTerm.toLowerCase();
      result = this.patients.filter(p =>
        p.nombres.toLowerCase().includes(lowerTerm) ||
        p.apellidos.toLowerCase().includes(lowerTerm) ||
        p.dni.includes(lowerTerm)
      );
    }
    return result;
  }

  get paginatedPatients() {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredPatients.slice(startIndex, startIndex + this.pageSize);
  }

  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
  }

  viewDetails(id: number | undefined) {
    if (id) {
      this.router.navigate(['/patients', id]);
    }
  }

  ngOnInit() {
    console.log('Fetching patients...');
    this.patientService.getPatients().subscribe({
      next: (data) => {
        console.log('Patients data loaded:', data);
        this.patients = data;
        this.cdr.detectChanges(); // Force update
      },
      error: (err) => console.error('Error fetching patients:', err)
    });
  }
}
