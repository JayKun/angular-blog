import { Input, Injectable } from '@angular/core';

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
    nextId: number = 10;

    constructor() {}

    fetchPosts(username: string): void {
        let url = "http://192.168.99.100:3000/api/" + username;
        let request = new XMLHttpRequest();
        request.open('GET', url, false);
        request.send(null);
        request.onreadystatechange = function() {
            if(request.readyState == 4) {
                console.log("Post fetched successfully");
            }
            else {
                console.log(request.response);
                return;
            }
        };
        this.posts = JSON.parse(request.response);
    }

    getPost(username: string, postid: number): Post {
        this.fetchPosts(username);
        for(let post of this.posts){
            if(post.postid == postid){
                return post;
            }
        }
        return null;
    }

    newPost(username: string): Post {
        let url = "http://192.168.99.100:3000/api/" + username + "/" + this.nextId.toString();
        let post = {
            postid: this.nextId,
            created: new Date(),
            modified: new Date(),
            title: "",
            body: "",      
        };
        let payload = {
            title: "",
            body: ""
        }
        let p = fetch(url,{
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body : JSON.stringify(payload)
        });

        p.then( res => {
            if(res.status == 201){
                    this.posts.push(post);
                    this.nextId = this.nextId + 1;
                    return post;
            }
            else{
                // TODO: redirect and pop alert box.
                console.log("Adding new post failed");
                console.log(res);
                return null;
            }
        });
        return null;
    }

    updatePost(username: string, post: Post): void {
        let match = null;
        for(let i in this.posts){
            if(this.posts[i].postid == post.postid){
                match = this.posts[i];
                this.posts[i] = post;
            }
        }

        if(!match){
            return;
        }

        let newPost = {
            postid: match.postid,
            username: match.username,
            title: post.title,
            body: post.body,
            modified: Date.now()
        };

        let url = "http://192.168.99.100:3000/api/" + username + "/" + match.postid.toString();
        let p = fetch(url, {
            method: "PUT",
            mode: "cors",
            credentials: "include",
            body: JSON.stringify(newPost)
        });
        
        p.then( res => {
            if(res.status == 200){
                console.log("Update is successful");
            }
            else{
                console.log("Update failed");
            }
        });
    }

    deletePost(username: string, postid: number): void {
        let match = null;
        for(let i in this.posts) {
            if(this.posts[i].postid == postid){
                match = this.posts[i];
                delete this.posts[i];
            }
        }
        if(!match){
            console.log("Post is deleted");
            return;
        }
        let url = "http://192.168.99.100:3000/api/" + username + "/" + postid.toString();
        let p = fetch(url, {
            method: "DELETE",
            mode: "cors",
            credentials: "include"
        });
        p.then( res => {
            if(res.status == 204){
                console.log("Error deleting post");
            }
            else{
                console.log("Post deleted");
            }
        });
    }
}
