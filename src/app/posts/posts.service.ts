import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// The subject is the observable
import { Subject } from 'rxjs-compat';
import { Post } from './post.model';
import { map } from 'rxjs/operators';

interface PostsResponse {
  message: string;
  posts: any;
}

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
      .get<PostsResponse>('http://localhost:3000/api/posts')
      .pipe(map((data: PostsResponse) => {
        // Strips message since we aren't using it
        return data.posts.map(post => ({
          id: post._id,
          title: post.title,
          content: post.title,
        }));
      }))
      .subscribe((posts) => {
        this.posts = posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {
      id: null,
      title,
      content,
    };

    this.http
      .post<{message: string}>('http://localhost:3000/api/posts', post)
      .subscribe((data) => {
        console.log('data.message', data.message);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId) {
    this.http
      .delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        this.posts = this.posts.filter(post => post.id !== postId);;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
