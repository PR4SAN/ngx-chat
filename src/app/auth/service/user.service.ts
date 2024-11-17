import { Injectable, inject } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  UserInfo,
} from '@angular/fire/auth';
import {concatMap, from, map, Observable, of, switchMap} from 'rxjs';
import {getDownloadURL, ref, Storage, uploadBytes} from '@angular/fire/storage';
import {doc, Firestore, setDoc} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private auth = inject(Auth);
  private storage = inject(Storage);
  $currentUser: Observable<UserInfo | null> = authState(this.auth);
  private firestore = inject(Firestore);

  constructor() { }

  login(username: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, username, password));
  }


  updateProfileImage(profileData: Partial<UserInfo>): Observable<any> {
    const user = this.auth.currentUser;
    return of(user).pipe(
      switchMap((user) => updateProfile(user!, profileData)),
      switchMap(() => {
        const userDocRef = doc(this.firestore, `users/${user!.uid}`);
        return from(setDoc(userDocRef, { photoURL: profileData.photoURL }, { merge: true }));
      })
    );
  }

  signUp(name: string, username: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, username, password)).pipe(
      switchMap(({user}) =>
        from(updateProfile(user, {displayName: name})).pipe(
          map(() => user)
        )
      ),
      switchMap((user) => {
        const searchField = `${name?.toLowerCase() || ''} ${username?.toLowerCase() || ''}`.trim();
        const userData = {
          uid: user.uid,
          email: username,
          displayName: name,
          photoURL: null,
          createdAt: Date.now(),
          searchField,
        };
        const userDocRef = doc(this.firestore, 'users', user.uid);
        return from(setDoc(userDocRef, userData));
      })
    );
  }

  logout() {
    return from(this.auth.signOut());
  }

  uploadImage(image: File, path: string): Observable<string> {
    const storageRef = ref(this.storage, path);
    const uploadTask = from(uploadBytes(storageRef, image));
    return uploadTask.pipe(
      switchMap((result) => getDownloadURL(result.ref))
    );
  }
}
