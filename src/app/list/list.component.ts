import { Component, OnInit } from '@angular/core';
import { BlogService, Post } from '../blog.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})

export class ListComponent implements OnInit {
    posts: Post[];

    constructor(private blogService: BlogService) {
        this.posts = blogService.getPosts('cs144');
    }

    ngOnInit() {
    }

    getPosts(){
        this.posts = this.blogService.getPosts('cs144');
    }

    parseJWT(token: string):string {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    }
}