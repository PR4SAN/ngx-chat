import {inject, Injectable} from '@angular/core';
import {
  addDoc,
  and,
  collection,
  collectionData,
  doc, docData,
  Firestore,
  getDocs,
  orderBy,
  query, updateDoc,
  where
} from '@angular/fire/firestore';
import {combineLatest, from, Observable, of, switchMap} from 'rxjs';
import {map} from 'rxjs/operators';
import {Auth, authState, User, UserInfo} from '@angular/fire/auth';
import {Chat} from '../../models/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private firestore = inject(Firestore);
  auth: Auth = inject(Auth);
  private user$: Observable<User | null>;
  private readonly chatsCollection;

  constructor() {
    this.user$ = authState(this.auth);
    this.chatsCollection = collection(this.firestore, 'chats');
  }

  searchUsers(searchTerm: string): Observable<any[]> {
    const usersRef = collection(this.firestore, 'users');
    const searchTermLower = searchTerm.toLowerCase();

    const q = query(
      usersRef,
      where('searchField', '>=', searchTermLower),
      where('searchField', '<=', searchTermLower + '\uf8ff'),
    );

    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs
        .map(doc => doc.data())
        .filter(user => user['uid'] !== this.auth.currentUser?.uid)
      )
    );
  }

  async createOrGetChat(otherUser: any): Promise<string> {
    const currentUserId = this.auth.currentUser!.uid;
    const chatsRef = collection(this.firestore, 'chats');

    // Check if chat exists
    const chatQuery = query(chatsRef,
      and(
        where('type', '==', 'private'),
        where('members', 'array-contains', currentUserId)
      )
    );

    const querySnapshot = await getDocs(chatQuery);
    const existingChat = querySnapshot.docs.find(doc => {
      const chat = doc.data() as Chat;
      return chat.members.includes(otherUser.uid);
    });

    if (existingChat) {
      return existingChat.id;
    }

    // Create new chat
    const newChat: Chat = {
      members: [currentUserId, otherUser.uid],
      createdAt: Date.now(),
      type: 'private',
      lastMessage: {
        content: '',
        timestamp: Date.now(),
        senderId: currentUserId,
        id: ''
      }
    };

    const chatDoc = await addDoc(chatsRef, newChat);
    return chatDoc.id;
  }

  getUserChats(): Observable<Chat[]> {
    return this.user$.pipe(
      switchMap(user => {
        if (!user) return of([]);
        const q = query(this.chatsCollection, where('members', 'array-contains', user.uid), orderBy('lastMessage.timestamp', 'desc'));
        return collectionData(q, { idField: 'id' }).pipe(
          map(chats => ({ chats, user }))
        ) as Observable<{ chats: Chat[], user: User }>;
      }),
      // @ts-ignore
      switchMap(({ chats, user }) => {
        console.log(user, chats);
        if (!chats || chats.length === 0) {
          return of([]);
        }

        const otherUserIds = chats.map((chat: { members: any[]; }) =>
          chat.members.find(member => member !== user.uid)!
        ).filter((id: any) => !!id);

        const users$ = otherUserIds.map((id: any) => docData(doc(this.firestore, `users/${id}`)));

        return combineLatest([of(chats), ...users$]).pipe(
          map(([chats, ...users]) => {
            return chats.map((chat: Chat[], index: number) => ({
              ...chat,
              // @ts-ignore
              displayName: users[index]?.displayName,
              // @ts-ignore
              photoURL: users[index]?.photoURL
            }));
          })
        );
      })
    );
  }

  getChatMessages(chatId: string): Observable<any[]> {
    const messagesRef = collection(this.firestore, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    return collectionData(q);
  }

  async sendMessage(chatId: string, content: string) {
    const messagesRef = collection(this.firestore, `chats/${chatId}/messages`);
    const newMessage = {
      content,
      senderId: this.auth.currentUser!.uid,
      timestamp: Date.now(),
    };

    const messageDoc = await addDoc(messagesRef, newMessage);

    const chatRef = doc(this.firestore, `chats/${chatId}`);
    await updateDoc(chatRef, {
      lastMessage: {
        content,
        timestamp: newMessage.timestamp,
        senderId: newMessage.senderId,
        id: messageDoc.id
      }
    });
  }

  getOtherUser(chatId: string): Observable<any> {
    return this.user$.pipe(
      switchMap(user => {
        if(!user) throw new Error("User not logged in");
        return docData(doc(this.firestore, `chats/${chatId}`)) as Observable<Chat>
      }),
      switchMap(chat => {
        const otherUserId = chat.members.find(member => member !== this.auth.currentUser!.uid);
        if (!otherUserId) {
          return of(null);
        }
        return docData(doc(this.firestore, `users/${otherUserId}`));
      })
    );
  }

}

