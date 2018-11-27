import { Input, Injectable } from '@angular/core';
import { Router } from '@angular/router'

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

    constructor(private router: Router) {}

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
        let maxId = 0;
        for(let i in this.posts){
            if(this.posts[i].postid > maxId){
                maxId = this.posts[i].postid;
            }
        }
    
        let nextId = maxId + 1;

        let url = "http://192.168.99.100:3000/api/" + username + "/" + nextId.toString();
        let post = {
            postid: nextId,
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
                    return post;
            }
            else{
                // TODO: redirect and pop alert box.
                console.log("Adding new post failed");
                console.log(res);
                alert('Adding new post failed');
                this.router.navigate(['/']);
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
            console.log("No matching post found")
            return;
        }

        let payload = {
            title: post.title,
            body: post.body
        }

        console.log(payload);

        let url = "http://192.168.99.100:3000/api/" + username + "/" + match.postid.toString();
        let p = fetch(url, {
            method: "PUT",
            mode: "cors",
            credentials: "include",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        });
        
        p.then( res => {
            if(res.status == 200){
                console.log("Update is successful");
            }
            else{
                console.log("Update failed");
                console.log(res);
                alert("Update failed");
                this.router.navigate(['/']);
            }
        });
    }

    deletePost(username: string, postid: number): void {
        let match = null;
        for(let i in this.posts) {
            if(this.posts[i].postid == postid){
                match = this.posts[i];
                this.posts.splice(parseInt(i), 1);
            }
        }
        if(!match){
            console.log("Post is not found");
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
                console.log("Post deleted");
            }
            else{
                console.log("Error deleting post");
                alert("Error deleting post");
                this.router.navigate(['/']);
            }
        });
    }
}
