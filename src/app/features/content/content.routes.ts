import {Route} from '@angular/router';
import {ContentComponent} from './content.component';
import {MovieItem} from './pages/movie/movie.Item';

export const CONTENT_ROUTES: Route[] = [
  {path: '',
    children: [
      { path: '', component: ContentComponent},
      { path: ':url', component: MovieItem}
    ]},
];

