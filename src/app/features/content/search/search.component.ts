import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MoviesService } from '../services/movies.service';
import { OnTVService } from '../services/onTV.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  searchTerm: string = '';
  searchResults: any[] = [];

  constructor(
    private moviesService: MoviesService,
    private tvShowsService: OnTVService,
    private router: Router // Router is now going to be used
  ) {}

  // Use this method to navigate to the detailed page
  navigateToDetail(item: any) {
    const route = item.isMovie ? '/movies/' + item.id : '/tv-shows/' + item.id;
    this.router.navigate([route]); // Navigate to the route
  }

  search() {
    if (!this.searchTerm.trim()) return; // Added trim() to handle cases with only whitespace

    const defaultPageNumber = 1;

    forkJoin({
      movies: this.moviesService.searchMovies(this.searchTerm, defaultPageNumber),
      tvShows: this.tvShowsService.getTVShows('on_the_air', defaultPageNumber)
    }).subscribe({
      next: ({movies, tvShows}) => {
        const formattedMovies = movies.results.map(movie => ({
          ...movie,
          isMovie: true
        }));

        const formattedTvShows = tvShows.results.map(tvShow => ({
          ...tvShow,
          isMovie: false
        }));

        this.searchResults = [...formattedMovies, ...formattedTvShows];
      },
      error: error => {
        console.error('Search error:', error);
        this.searchResults = [];
      }
    });
  }
}
