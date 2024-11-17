import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { SettingsComponent } from '../../settings/settings.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../service/chat.service';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import { Subject } from 'rxjs';
import {Chat} from '../../models/chat';
import {Router, RouterModule} from '@angular/router';
import {OverlayRef} from '@angular/cdk/overlay';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [DialogModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent implements OnInit, OnDestroy {
  dialog = inject(Dialog);
  chatService = inject(ChatService);
  searchTerm: string = '';
  searchResults: any[] | null = null;
  isSearching: boolean = false;
  private searchSubject = new Subject<string>();
  userChats: Chat[] = [];
  private router = inject(Router);
  private destroyed = new Subject<boolean>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      if (term) {
        this.isSearching = true;
        this.chatService.searchUsers(term).subscribe(users => {
          console.log(users);
          this.searchResults = users;
          this.isSearching = false;
        });
      } else {
        this.searchResults = null;
        this.isSearching = false;
      }
    });
  }

  search() {
    this.searchSubject.next(this.searchTerm);
  }

  ngOnInit() {
    this.chatService.getUserChats().pipe(takeUntil(this.destroyed)).subscribe(chats => {
      this.userChats = chats;
      console.log(chats);
    });
  }

  async initiateChat(user: any) {
    const chatId = await this.chatService.createOrGetChat(user);
    this.searchResults = null;
    this.isSearching = false;
    this.searchTerm = '';
    this.router.navigate(['/chat', chatId]);

  }


  openSettings() {
    this.dialog.open(SettingsComponent, {
      minWidth: '300px',
      disableClose: true,
      data: {},
    });
  }

  ngOnDestroy() {
    this.destroyed.next(true); // Emit value to unsubscribe
    this.destroyed.complete(); // Complete the subject
  }
}
