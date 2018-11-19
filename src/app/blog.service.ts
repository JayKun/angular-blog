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
            mode: "cors",
            credentials: "include"
        };
        let p = fetch(url, options);
        p.then((res) => {
            res.json().then( data => {
            this.posts = data});
        });
    }
    
    getMaxId(username: string): number {
        if(typeof this.posts == "undefined"){
            getPosts(username);
        }
        let res = 1;
        for(let post in this.posts){
            if(post.postid > res) {
                res = post.postid;
            }
        }
        return res;
    }

    getPosts(username: string): Post[] {
        this.fetchPosts(username);
        return this.posts;
    }

    getPost(username: string, postid: number): Post {
        for(let post in this.posts){
            if(post.postid == postid){
                return post;
            }
        }
        return null;
    }

    newPost(username: string): Post{
        let url = "http://192.168.99.100:3000/api/" + username;
        let post = {
            postid: getMaxId + 1;
            created: new Date.now();
            modified: new Date.now();
            title: "";
            body: "";       
        };
        let options = {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body = JSON.stringify(post);
        };

        let p = fetch(url, options);
        p.then( res => {
            if(response.status == 201){
                res.json().then( data => {
                    posts.push(post);
                    return data;
                });
            }
            else{
                // TODO: redirect and pop alert box.
                return null;
            }
        });
    }
}
