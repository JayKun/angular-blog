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
        let p = fetch(url, {
            mode: "cors",
            credentials: "include"
        });
        p.then((res) => {
            res.json().then( data => {
            this.posts = data});
        });
    }

/*    
    getMaxId(username: string): number {
        if(typeof this.posts == "undefined"){
            this.getPosts(username);
        }
        let res = 1;
        for(let post in this.posts){
            if(post.postid > res) {
                res = +post.postid;
            }
        }
        return res;
    }
*/

    getPosts(username: string): Post[] {
        this.fetchPosts(username);
        return this.posts;
    }

    getPost(username: string, postid: number): Post {
        for(let post of this.posts){
            if(post.postid == postid){
                return post;
            }
        }
        return null;
    }

    newPost(username: string): Post{
        let url = "http://192.168.99.100:3000/api/" + username + "/123";
        let post = {
            postid: 123,
            created: new Date(),
            modified: new Date(),
            title: "",
            body: "",      
        };

        let p = fetch(url,{
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body : JSON.stringify(post)
        });
        p.then( res => {
            if(res.status == 201){
                res.json().then( data => {
                    this.posts.push(post);
                    return data;
                });
            }
            else{
                // TODO: redirect and pop alert box.
                this.posts.push(post);
                return null;
            }
        });
        return null;
    }
}
