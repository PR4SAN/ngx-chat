import { Routes} from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';


const redirectToLogin = () => redirectUnauthorizedTo(['auth']);
const redirectToChat = () => redirectLoggedInTo(['chat']);

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'chat',
    pathMatch: 'full',
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.routes').then((m) => m.routes),
    ...canActivate(redirectToLogin)
  },
  {
    path:'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
    ...canActivate(redirectToChat)
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];
