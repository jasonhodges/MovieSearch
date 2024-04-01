import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, Subscription, take, tap } from 'rxjs';
import { Endpoints } from './endpoints';

interface Token {
  token: string;
}

interface Genre {
  id: string,
  movies: [{ id: string }],
  title: string
}

interface Genres {
  data: Genre[]
}

export interface Movie {
  id: string,
  title: string
}

export interface Movies {
  totalPages: number;
  data: Movie[]
}

export interface MovieSearchParams {
  page?: number,
  limit?: number,
  searchTerm: string,
  genre?: string
}
@Injectable({
  providedIn: 'root'
})
export class MovieService {
  movieApi = 'https://0kadddxyh3.execute-api.us-east-1.amazonaws.com';
  bearerToken = signal('')
  totalMovieCount = signal<number>(0);
  genresMovies = signal<any>(undefined);

  constructor(private http: HttpClient) {
  }

  private api<T>(route?: string): Observable<T> {
    return this.http.get<T>(this.movieApi + route)
  }

  getToken() {
    this.api('/auth/token').pipe(
      take(1),
    ).subscribe((res: any) => {
        this.bearerToken.set(res.token);
        localStorage.setItem('token', res.token);
      }
    )
  }

  get token(): string {
    return localStorage.getItem('token') || ''
  }

  getMovies(params: MovieSearchParams): Observable<Movies> {
    this.getMovieCount(params);
    return this.http.get<Movies>(this.movieApi +`${Endpoints.MOVIES}`, {
      params: {
        page: params.page ?? 0,
        limit: params.limit ?? 25,
        search: params.searchTerm,
        genre: params.genre ?? ''
      }
    }).pipe(
      // tap(r => r.data.length
      //   ? (params.limit && params.limit > 500 ? this.totalMovieCount.set(r.data.length) : true )
      //   : true),
      tap(r => r.data.length
        ? console.log('movies', r.data.length)
        : console.log('no movies match')),
      catchError(this.handleError<Movies>('getMovies', {totalPages: 0, data: [] }))
    )
  }

  getMovieDetails(movieId: string) {
    return this.http.get(this.movieApi + `${Endpoints.MOVIES}/${movieId}`).pipe(
      catchError(this.handleError('getMovieDetails'))
    )
  }


  getGenresMovies(page?: number, limit?: number) {
    this.api<Genres>(Endpoints.GENRES_MOVIES).pipe(
      map((res) => this.genresMovies.set(res.data)),
      take(1)).subscribe()
  }

  get genreMovies(): Observable<Genres> {
    return this.api<Genres>(Endpoints.GENRES_MOVIES).pipe((res) => {
      return res
    });
  }

  getMoviesTitles(): Subscription {
    return this.api<Movies>(Endpoints.MOVIES_TITLES).pipe(take(1)).subscribe();
  }

  private getMovieCount(params: MovieSearchParams) {
    this.http.get<Movies>(this.movieApi +`${Endpoints.MOVIES}`, {
      params: {
        page: params.page ?? 0,
        limit: 1000,
        search: params.searchTerm,
        genre: params.genre ?? ''
      }
    }).pipe(
      tap(r => r.data.length
        ? this.totalMovieCount.set(r.data.length)
        : true
      ),
      tap(() => console.log(this.totalMovieCount())),
      take(1)
    ).subscribe()
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error);

      console.error(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
