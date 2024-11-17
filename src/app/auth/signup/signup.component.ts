import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {UserService} from '../service/user.service';
import {HotToastService} from '@ngxpert/hot-toast';
import {util} from '../../util/util';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss', '../login/login.component.scss']
})
export class SignupComponent {
  private fb =  inject(FormBuilder)
  private router = inject(Router);
  private userService = inject(UserService);
  private toastService = inject(HotToastService);

  signupForm!: FormGroup;


  ngOnInit() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['',[ Validators.required, Validators.minLength(6)]],
    });
  }

  onSignup(){
    if(!this.signupForm.valid){
      return;
    }
    const {name, email, password} = this.signupForm.value;

    this.userService.signUp(name, email, password).subscribe({
      next: success => {
        this.router.navigate(['/chat']);
      },
      error: error => {
        this.toastService.error(util(error.code));
      }
    });

  }

}
