import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    RouterModule,
    NgOptimizedImage
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

}
