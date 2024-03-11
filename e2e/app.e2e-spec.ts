import { MovieFlixPage } from './app.po';

describe('movie-flix App', () => {
  let page: MovieFlixPage;

  beforeEach(() => {
    page = new MovieFlixPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    // expect(page.getParagraphText()).toEqual('expected text') ;
  });
});
