import {Component, inject} from '@angular/core';
import {UserService} from '../auth/service/user.service';
import {Router} from '@angular/router';
import {DialogRef} from '@angular/cdk/dialog';
import {CommonModule} from '@angular/common';
import {filter, switchMap, take} from 'rxjs';
import {HotToastService} from '@ngxpert/hot-toast';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  userService = inject(UserService);
  private router=  inject(Router);
  dialogRef = inject(DialogRef);
  private toast = inject(HotToastService);

  logout(){
    this.userService.logout().subscribe({
      next: ()=> {
        this.router.navigate(['/auth/login']);
        this.dialogRef.close();
      }
    });
  }

  uploadImage(event: any) {
    this.userService.$currentUser.pipe(
      take(1),
      filter(user => !!user),
      switchMap(user =>
        this.userService.uploadImage(
          event.target.files[0],
          `images/profile/${user!.uid}`
        ).pipe(
          switchMap(url =>
            this.userService.updateProfileImage({
              ...user!,
              photoURL: url
            })
          )
        )
      )
    ).subscribe(() => {
      this.toast.success('Profile Image Updated Successfully');
    });
  }
}
