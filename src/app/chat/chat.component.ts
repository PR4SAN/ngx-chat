import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import {ChatListComponent} from './chat-list/chat-list.component';
import {ChatDetailsComponent} from './chat-details/chat-details.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [RouterModule, ChatListComponent, ChatDetailsComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

}
