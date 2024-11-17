import {Routes} from '@angular/router';
import {ChatComponent} from './chat.component';

export const routes: Routes = [
  {
    path: '',
    component: ChatComponent,
    children: [
      {
        path: ':chatId',
        loadComponent: () => import('./chat-details/chat-details.component').then((m) => m.ChatDetailsComponent),
      }
    ]
  }
]
