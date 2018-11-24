import { Component, OnInit } from '@angular/core';
import { Parser, HtmlRenderer } from 'commonmark';
import { ActivatedRoute } from '@angular/router';
import { Post, BlogService } from '../blog.service'

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
    title: string;
    body: string;
    username: string;
    postid: number;

    constructor(private blogService: BlogService, private activatedRoute: ActivatedRoute) { }

    ngOnInit() { 
        this.activatedRoute.paramMap.subscribe( () => {
            this.username = this.parseJWT(document.cookie);
            let id = this.activatedRoute.snapshot.paramMap.get('id');
            let post = this.blogService.getPost(this.username, parseInt(id));
            this.title = this.parseMarkdown(post.title);
            this.body = this.parseMarkdown(post.body);
            this.postid = post.postid;
        });
    }
    
    parseMarkdown(markdown: string):string {
        let reader = new Parser();
        let writer = new HtmlRenderer();
        let parsed = reader.parse(markdown);
        return writer.render(parsed);
    }

    parseJWT(token: string):string {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64)).username;
    }
    
}
