import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: [
    './post-create.component.css',
  ],
})
export class PostCreateComponent {
  enteredTitle = '';
  enteredContent = '';
  // the output decorator allows you to list for this event in the parent
  @Output() postCreated = new EventEmitter();

  onAddPost() {
    const post = {
      title: this.enteredTitle,
      content: this.enteredContent,
    };

    this.postCreated.emit(post);
  }
}
