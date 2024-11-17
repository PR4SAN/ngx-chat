import {Component} from '@angular/core';
import {ChatListComponent} from './chat-list/chat-list.component';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ChatListComponent, RouterModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {}

