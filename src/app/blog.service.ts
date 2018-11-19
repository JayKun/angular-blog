import { Injectable } from '@angular/core';

export class Post {
  postid: number;
  created: Date;
  modified: Date;
  title: string;
  body: string;
}

@Injectable({
  providedIn: 'root'
})

export class BlogService {
    posts: Post[];

    constructor() {}

    fetchPosts(username: string): void {
        let url = "http://192.168.99.100:3000/api/" + username;
        let options = {
            method: "GET",
            credentials: "include",
            headers:{
                "Content-Type": "application/json; charset=utf-8"
            },
        };
        let p = fetch(url, {mode: 'cors', credentials: 'include'});
        p.then((res) => {
            res.json().then( data => this.posts = data);
        });
    }

    getPosts(username: string): Post[] {
        this.fetchPosts(username);
        return this.posts;
    }

/*
    getPost(username: string): Post{
    }

    newPost(username: string): Post{
        
    }
*/
}
