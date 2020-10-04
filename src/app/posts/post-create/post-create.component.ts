import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PostsService } from '../posts.service';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: [
    './post-create.component.css',
  ],
})
export class PostCreateComponent implements OnInit {
  isLoading = false;
  private mode = 'create';
  private postId: string;
  public post: Post;
  form: FormGroup;

  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      'title': new  FormControl(null, {
          validators: [
            Validators.required,
            Validators.minLength(3),
          ],
          updateOn: 'blur',
      }),
      'content': new  FormControl(null, {
        validators: [
          Validators.required,
        ],
        updateOn: 'blur',
      }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
          };
          this.form.setValue({
            'title': this.post.title || '',
            'content': this.post.content || '',
          });
          this.isLoading = false;
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }



  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;

    const title = this.form.value.title;
    const content = this.form.value.content;

    console.log('this.form.value', this.form.value);

    if (this.mode === 'create') {
      this.postsService.addPost(title, content);
    } else {
      this.postsService.updatePost(
        this.post.id,
        title,
        content,
      );
    }

    this.form.reset();
  }
}
