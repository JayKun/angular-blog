import { Input, Component, OnInit } from '@angular/core';
import { BlogService, Post } from '../blog.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})

export class ListComponent implements OnInit {
    @Input() posts: Post[];

    constructor(private blogService: BlogService) {
    }

    ngOnInit() {
    }

    getPosts() {
        let username = this.parseJWT(document.cookie);
        this.posts = this.blogService.getPosts(username);
    }

    parseJWT(token: string):string {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64)).username;
    }

    getUsernameFromToken(token: string) {
        const helper = new JwtHelperService();
        try{
            return helper.decodeToken(token).usr;
        }
        catch(Error){
            console.log(Error);
            return null;
        }
    }
}
