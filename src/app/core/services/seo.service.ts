import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // adjust the path as necessary


// // manage SEO (Search Engine Optimization) tags for a
//  web application. This service uses Angular's Meta service,
//   provided by the @angular/platform-browser package, 
// to dynamically update the meta tags of a webpage. 




// By updating tags such as 
// og:title, og:description, og:image, and og:url,
//  the service supports the Open Graph protocol, 
//  which is widely used to integrate web content 
//  into the social media platform ecosystem. This means
//   when links to your site are shared on platforms like
//    Facebook or Twitter, the content is presented attractively, 
// with a title, description, and image.

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(private meta: Meta) { }
  generateTags(config) {
    // default values
    config = {
      title: 'Movie FLIX and Series',
      description: 'My SEO friendly Angular Component',
      image: 'https://movie-flix-c91ba.firebaseapp.com/images/logo.png',
      slug: '',
      ...config
    };
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:site_name', content: 'AngularMovie' });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:image', content: config.image });
    this.meta.updateTag({ property: 'og:url', content: `https://movie-flix-c91ba.firebaseapp.com/${config.slug}` });
  }
}
