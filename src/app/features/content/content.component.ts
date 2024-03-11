import {Component, OnInit} from '@angular/core';
import {PaginationModel} from '../../core/models/pagination.model';
import {MoviesService} from './services/movies.service';
import {take} from 'rxjs/operators';
import {Router} from "@angular/router";
import {OnTVService} from "./services/onTV.service";

import {MovieCardComponent} from "../../shared/components/poster-card-view/poster-card.component";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {NgForOf, TitleCasePipe} from "@angular/common";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-movies',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  imports: [
    InfiniteScrollModule,
    MovieCardComponent,
    MatButtonModule,
    MatCardModule,
    TitleCasePipe,
    NgForOf
  ],
  standalone: true
})
export class ContentComponent implements OnInit {

  contentType = '';
  nowPlaying: Array<PaginationModel> = [];
  totalResults: any;
  currentPage = 1;



  constructor(
    private moviesService: MoviesService,
    private tvShowsService: OnTVService,
    private router: Router
  ) {
    this.contentType = this.router.url.split('/')[1];
  }

  ngOnInit() {
    this.loadContent(this.currentPage); // Initial content load
  }

  loadContent(page: number) {
    if (this.contentType === 'movies') {
      this.getNowPlayinMovies(page);
    } else {
      this.getNowPlayinTVShows(page);
    }
  }

  onScroll() {
    this.currentPage++;
    this.loadContent(this.currentPage);
  }

  getNowPlayinMovies(page: number) {
    this.moviesService.getNowPlaying(page).pipe(take(1)).subscribe(
      res => {
        if(page === 1) {
          this.nowPlaying = res.results;
        } else {
          this.nowPlaying = [...this.nowPlaying, ...res.results];
        }
        this.totalResults = res.total_results;
      }, () => {}
    );
  }

  getNowPlayinTVShows(page: number) {
    this.tvShowsService.getTvOnTheAir(page).pipe(take(1)).subscribe(
      res => {
        if(page === 1) {
          this.nowPlaying = res.results;
        } else {
          this.nowPlaying = [...this.nowPlaying, ...res.results];
        }
        this.totalResults = res.total_results;
      }, () => {}
    );
  }


}
