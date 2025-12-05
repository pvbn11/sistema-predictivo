import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { Dashboard } from './dashboard/dashboard';
import { Patients } from './patients/patients';
import { NewPatient } from './new-patient/new-patient';
import { PatientDetails } from './patient-details/patient-details';
import { Profile } from './profile/profile';
import { NewMonitoringComponent } from './new-monitoring/new-monitoring';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'dashboard', component: Dashboard },
    { path: 'patients', component: Patients },
    { path: 'patients/:id', component: PatientDetails },
    { path: 'patients/:id/new-monitoring', component: NewMonitoringComponent },
    { path: 'new-patient', component: NewPatient },
    { path: 'profile', component: Profile },
    { path: '**', redirectTo: '' }
];
