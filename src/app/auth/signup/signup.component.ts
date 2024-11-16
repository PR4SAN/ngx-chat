import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

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

  signupForm!: FormGroup;


  ngOnInit() {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['',[ Validators.required, Validators.minLength(6)]],
    });
  }

  onSignup(){
    if(!this.signupForm.valid){
      return;
    }
    console.log(this.signupForm.value);
  }

}
