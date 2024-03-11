

// PaginationModel to represent this data, with the results
//  array containing instances of MovieModel or TvModel
//  based on the content type. This setup enables efficient
//   data handling and user interface rendering for potentially
//    large datasets.

// Example:
// When fetching movie data from an API, the response could be mapped to an instance of PaginationModel, with each movie in the results array represented by a MovieModel. This allows the frontend to easily display the movies in a paginated format, with controls for navigating between pages based on the
// page, total_pages, and total_results properties

import {TvModel} from '../../features/content/models/tv.model';
import {MovieModel} from '../../features/content/models/movie.model';

export class PaginationModel {

  public dates?: Object;
  public page: number;
  public results: Array<MovieModel | TvModel>;
  public total_pages: number;
  public total_results: number;

}
