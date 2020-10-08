import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: [
    './post-create.component.css',
  ],
})
export class PostCreateComponent implements OnInit, OnDestroy {
  isLoading = false;
  private mode = 'create';
  private postId: string;
  public post: Post;
  form: FormGroup;
  imagePreview: any;
  private authStatusSub: Subscription;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus) => {
      this.isLoading = false;
    });
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
      'image': new FormControl(null, {
        validators: [
          Validators.required,
        ],
        asyncValidators: [
          mimeType,
        ],
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
            imagePath: postData.imagePath,
            creator: postData.creator,
          };
          this.form.setValue({
            'title': this.post.title || '',
            'content': this.post.content || '',
            'image': this.post.imagePath,
          });
          this.isLoading = false;
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ 'image': file });

    // tells angular that you've updated a value and to re-validate and update it
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };

    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;

    const title = this.form.value.title;
    const content = this.form.value.content;
    const image = this.form.value.image;

    console.log('this.form.value', this.form.value);

    if (this.mode === 'create') {
      this.postsService.addPost(title, content, image);
    } else {
      this.postsService.updatePost(
        this.post.id,
        title,
        content,
        image,
      );
    }

    this.form.reset();
  }
}
