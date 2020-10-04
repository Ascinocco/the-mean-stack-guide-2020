import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// The subject is the observable
import { Subject } from 'rxjs-compat';
import { Post } from './post.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

interface PostsResponse {
  message: string;
  posts: any;
  maxPosts: number;
}

@Injectable({
  // Injects the service at the root level and only create one instance of it for the entire app
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  // Returns observable so we can watch data from the component
  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>('http://localhost:3000/api/posts/' + id);
  }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    // observables from built in angular packages will automatically unsubscribe upon
    // destroy event
    this.http
      .get<PostsResponse>('http://localhost:3000/api/posts' + queryParams)
      .pipe(map((data: PostsResponse) => {
        // Strips message since we aren't using it
        return {
          posts: data.posts.map(post => ({
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath,
          })),
          maxPosts: data.maxPosts,
        };
      }))
      .subscribe((data) => {
        this.posts = data.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: data.maxPosts,
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http
      .post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;

    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image,
      };
    }

    this.http
      .put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }
}
