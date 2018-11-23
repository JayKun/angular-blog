import { Component, OnInit } from '@angular/core';
import { Post, BlogService } from '../blog.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
    post: Post;
    username: string;    

    constructor(private blogService: BlogService, private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.username = this.parseJWT(document.cookie);
        this.activatedRoute.paramMap.subscribe( () => {
            let id = this.activatedRoute.snapshot.paramMap.get('id');
            this.post = this.blogService.getPost(this.username, parseInt(id))
        });
    }

    parseJWT(token: string):string {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64)).username;
    }

    updatePost() {
        this.blogService.updatePost(this.username, this.post);
    }
    
    deletePost() {
        this.blogService.deletePost(this.username, this.post.postid);
    }
}
