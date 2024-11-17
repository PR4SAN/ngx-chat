import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {UserService} from '../service/user.service';
import {HotToastService} from '@ngxpert/hot-toast';
import {util} from '../../util/util';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private fb =  inject(FormBuilder);
  private router = inject(Router);
  private userService = inject(UserService);
  private toastService = inject(HotToastService);

  loginForm!: FormGroup;


  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['',[ Validators.required]],
    });
  }

  onLogin(){
    if(!this.loginForm.valid){
      return;
    }
    const {email, password} = this.loginForm.value;

    this.userService.login(email, password).subscribe({
      next: success => {
        this.router.navigate(['/chat']);
      },
      error: error => {
        this.toastService.error(util(error.code));
      }
    });
  }


}
