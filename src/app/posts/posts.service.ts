import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// The subject is the observable
import { Subject } from 'rxjs-compat';
import { Post } from './post.model';

@Injectable({
  // Injects the service at the root level and only create one instance of it for the entire app
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    // observables from built in angular packages will automatically unsubscribe upon
    // destroy event
    this.http
      .get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
      .subscribe((data) => {
        this.posts = data.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {
      title,
      content,
    };

    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
