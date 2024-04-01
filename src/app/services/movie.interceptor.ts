import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MovieService } from './movie.service';

export const movieInterceptor: HttpInterceptorFn = (req, next) => {
  const movieService = inject(MovieService);
  const bearerToken = movieService.token

  if (bearerToken) {
    const clone = req.clone({
      setHeaders: { authorization: `Bearer ${bearerToken}` }
    });
    return next(clone);
  } else {
    return next(req);
  }
};
