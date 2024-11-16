import {AuthComponent} from './auth.component';
import {Routes} from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./login/login.component').then((m) => m.LoginComponent)
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./signup/signup.component').then((m) => m.SignupComponent)
      }
    ]
  },
];
