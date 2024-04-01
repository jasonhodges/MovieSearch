import { AsyncPipe, JsonPipe, NgForOf, NgIf, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { RouterOutlet } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  map,
  mergeMap,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  tap,
  zip
} from 'rxjs';
import { Movies, MovieService } from './services/movie.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgForOf, AsyncPipe, MatPaginator, FormsModule, MatCardModule, JsonPipe, NgIf, NgStyle, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  title = 'movies';
  movieService = inject(MovieService)
  genres$ = this.movieService.genreMovies
  movies$!: Observable<Movies | any>;
  movieSearch = new Subject<string>()
  pageIndex: number = 0;
  pageSize: number = 10;
  length: number = this.movieService.totalMovieCount();
  searchTerm = '';
  selectedGenre: string = '';

  search(): void {
    this.pageIndex = 0;
    this.movieSearch.next(this.searchTerm);
  }

  ngOnInit() {
    this.movieService.getToken();
    this.movieService.getGenresMovies()
    this.loadMovies();
  }

  loadMovies() {
    this.movies$ = this.movieSearch.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      startWith(''),
      switchMap((term: string) => this.movieService.getMovies({
        page: this.pageIndex + 1,
        limit: this.pageSize,
        searchTerm: this.searchTerm ?? '',
        genre: this.selectedGenre ?? ''
      })),
      mergeMap((response: any) => {
        const movieDetailsObservables = response.data.map((movie: any) =>
          this.movieService.getMovieDetails(movie.id)
        );
        return zip(of(response.data), forkJoin(movieDetailsObservables));
      }),
      tap((movieDetails: any) => {
        // this.length = movieDetails[0].length;
      }),
      map(([movies, movieDetails]) => {
        return movies.map((movie: any, index: number) => ({
          ...movie,
          details: movieDetails[index]
        }));
      })
    );
  }

  getGenreMovies() {
    this.movieService.getGenresMovies();
  }

  getMoviesTitles() {
    this.movieService.getMoviesTitles();
  }

  pageChangeEvent($event: PageEvent) {
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;

    this.loadMovies();
  }

}
