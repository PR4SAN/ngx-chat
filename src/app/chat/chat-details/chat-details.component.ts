import {Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ChatService } from '../service/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {filter, map, Observable, of, shareReplay, Subject, switchMap, take} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {User} from '../../models/user';
import {scrollToBottom} from '../../util/util';

@Component({
  selector: 'app-chat-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-details.component.html',
  styleUrl: './chat-details.component.scss'
})
export class ChatDetailsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  public chatService = inject(ChatService);
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  private destroyed$: Subject<void> = new Subject<void>();

  messages: any[] = [];
  newMessage: string = '';
  chatUser$!: Observable<User>;
  private chatId$!: Observable<string | null>;
  isNochatSelected = false;


  ngOnInit() {

    this.chatId$ = this.route.paramMap.pipe(
      map(params => params.get('chatId'))
    );

    this.chatUser$ = this.chatId$.pipe(
      switchMap(chatId => {
        if (!chatId) {
          return of(null);
        }
        return this.chatService.getOtherUser(chatId).pipe(
          shareReplay(1)
        )
      })
    )

    this.getMessages()
  }


  getMessages(){
    this.chatId$.pipe(
      switchMap(chatId => {
        if (!chatId) {
          this.isNochatSelected = true;
          return of([]);
        }
        this.isNochatSelected = false;
        return this.chatService.getChatMessages(chatId);
      }),
      takeUntil(this.destroyed$)
    ).subscribe(messages => {
      this.messages = messages;
      scrollToBottom(this.messagesContainer);
    });

  }

  sendMessage() {
    this.chatId$.pipe(
      take(1),
      filter((chatId) => !!chatId)
    ).subscribe(chatId => {
      if (this.newMessage.trim() && chatId ) {
        this.chatService.sendMessage(chatId, this.newMessage).then(() => {
          this.newMessage = '';
        });
      }
    });
    scrollToBottom(this.messagesContainer);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
