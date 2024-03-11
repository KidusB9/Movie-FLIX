import {Component, OnInit, Input, TemplateRef, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from "@angular/material/dialog";
import { IMovie } from '../interfaces/movie.interface'; 
import { MoviesService } from '../services/movies.service'; 
import { IContent } from '../interfaces/content.interface'; 

@Component({
  selector: 'app-movie-item',
  standalone: true,
  imports: [],
  templateUrl: './movie-item.component.html',
  styleUrl: './movie-item.component.scss'
})
export class MovieItemComponent implements OnInit {

  @Input() movie: IMovie; // Assuming movie data will be passed as input
video: IContent;
 // For storing the movie's video data
isLoading: boolean = true;


  constructor(
    private moviesService: MoviesService,
    public trailerDialog: MatDialog,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    if(this.movie) {
      this.getMovieVideo(this.movie.id.toString());
    }
  }



  getMovieVideo(id: string) {
    this.moviesService.getMovieVideos(id).subscribe(
      res => {
        if (res?.results?.length > 0) {
          const trailerList = res.results.filter(video => video.type === 'Trailer');
          this.video = trailerList[0];
          this.video['url'] = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + this.video['key']);
        } else {
          this.video = null;
        }
      }
    );
  }
}

