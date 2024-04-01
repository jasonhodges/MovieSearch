# Movies

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.2.

○ Highlight something in your project that you thought was especially
interesting or significant to your overall implementation.

○ Tell us what you are most pleased or proud of with your implementation.

○ Given more time, what next feature or improvement would you like to add
to your project?

Minimum Requirements
As a user,
- I can search for movies and see a paginated list of results
- I can filter search results by genre
- I can navigate through the next and previous pages of the paginated results
- I see the total count of search results
- I see notable information for each search result, such as the summary, poster,
duration, rating, etc.

API endpoint 
- https://0kadddxyh3.execute-api.us-east-1.amazonaws.com


Referenced the Official Angular documentation for search functionality.

- Highlight something in your project that you thought was especially
interesting or significant to your overall implementation.
  - One thing I found interesting was the RESTful Endpoint configuration. I think if I were working with it in a real world situation I would ask a backend engineer to make some modifications and set up some new endpoints to get basic responses like a list of genres as well as adding a totalCount response in the movie call. This could be different with the GraphQL setup but I was unable to test in the sandbox. 

- Tell us what you are most pleased or proud of with your implementation. 
  - To be completely honest I am not pleased with my implementation. I think there is much room for improvement. 

- Given more time, what next feature or improvement would you like to add
  to your project?
  - Here is a list of things I would add or improve upon:
    - E2E & Unit tests
    - Styling:
      - I would style the main page so that it has more of a WOW factor and is attractive.
      - Fix the pagination bar to the bottom of the screen.
      - Make the cards more flashy with items such as stars for ratings. 
      - Make the form for search and genre selection look better. 
    - UX:
      - Build in ability to save favorite movies to lists like 'Watch Later, Watched, etc.'
      - If database contained information on Actors, make their names clickable to get more info. Maybe IMDB or Wikipedia if DB didn't contain info.
      - Ability to click on result cards to navigate to a full detail page on the movie. Full route with params so link could be shared or saved. 
      - Ability to filter by multiple genres. 
  - As mentioned previously, as backend to set up endpoint for just genres and add totalCount as part of response when fetching movies.
  - I would separate out all the components instead of just shoving everything into app.component. 
  - Ensure UI is fully accessible. 
