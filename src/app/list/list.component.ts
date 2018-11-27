import { Input, Component, OnInit } from '@angular/core';
import { BlogService, Post } from '../blog.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})

export class ListComponent implements OnInit {
    constructor(private blogService: BlogService) {
    }

    ngOnInit() {
        let username = this.parseJWT(document.cookie);
        this.blogService.fetchPosts(username);
    }
    
    newPost(){
        let username = this.parseJWT(document.cookie);
        let res = this.blogService.newPost(username);
        if(res == null) {
            console.log("New post creation failed");
            alert("New post creation failed");
        }
    }
    
    parseJWT(token: string):string {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64)).username;
    }

}
