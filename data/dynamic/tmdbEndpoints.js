/* I chose to use NEXT_PUBLIC here because this post on TMDB website:
https://www.themoviedb.org/talk/582744abc3a3683601019dcc

'TMDB api keys aren't intended for authentication, 
so don't worry too much about making it public 
since you can get API keys for free. 
And there's very little motivation for anyone to steal it.
*/
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY

export const TMDB = {
  TVShows: {
    sections: [
      {
        title: 'Phim Chiếu Rạp',
        endpoint: `api/phimhd/searchByQuery?&filterKeyQuery=chieurap&filterValueQuery=dHJ1ZQ==&serverQuery=phimhd2`,
      },
      {
        title: 'Popular on Hotflix',
        endpoint: `api/phimhd/searchByQuery?&filterKeyQuery=category&filterValueQuery=SMOgbmggxJDhu5luZw==&serverQuery=phimhd2`,
        size: 'large'
      },
      {
        title: 'Phim Lẻ',
        endpoint: `api/phimhd/searchByQuery?&filterKeyQuery=type&filterValueQuery=c2luZ2xl&serverQuery=phimhd2`,
      },
      {
        title: 'Phim Bộ',
        endpoint: `api/phimhd/searchByQuery?&filterKeyQuery=type&filterValueQuery=c2VyaWVz&serverQuery=phimhd2`,
      },
      {
        title: 'Chill Cùng Các Oppa',
        endpoint: `api/phimhd/searchByQuery?&filterKeyQuery=country&filterValueQuery=SMOgbiBRdeG7kWM=&serverQuery=phimhd2`,
      },
      {
        title: 'Gia Đình Là Số 1',
        endpoint: `api/phimhd/searchByQuery?&filterKeyQuery=category&filterValueQuery=R2lhIMSQw6xuaA==&serverQuery=phimhd2`,
      },
      {
        title: 'Học Đường Nổi Loạn',
        endpoint: `api/phimhd/searchByQuery?&filterKeyQuery=category&filterValueQuery=SOG7jWMgxJDGsOG7nW5n&serverQuery=phimhd2`,
      },
      {
        title: 'Anime',
        endpoint: `api/phimhd/searchByQuery?&filterKeyQuery=type&filterValueQuery=aG9hdGhpbmg=&serverQuery=phimhd2`,
      }
      // {
      //   title: 'War Politics',
      //   endpoint: `/discover/tv?api_key=${API_KEY}&with_genres=10768&with_watch_providers=8&watch_region=AU`,
      // },
      // {
      //   title: 'Hotflix Original',
      //   endpoint: `/discover/tv?api_key=${API_KEY}&with_networks=213&with_watch_providers=8&watch_region=AU`,
      //   size: 'large',
      // },
      // {
      //   title: 'Sci-Fi & Fantasy',
      //   endpoint: `/discover/tv?api_key=${API_KEY}&with_genres=10765&with_watch_providers=8&watch_region=AU`,
      // },
      // {
      //   title: 'Documentary',
      //   endpoint: `/discover/tv?api_key=${API_KEY}&with_genres=99&with_watch_providers=8&watch_region=AU`,
      // },
      // {
      //   title: 'Comedy',
      //   endpoint: `/discover/tv?api_key=${API_KEY}&with_genres=35&with_watch_providers=8&watch_region=AU`,
      // },
      // {
      //   title: 'Animation',
      //   endpoint: `/discover/tv?api_key=${API_KEY}&with_genres=16&with_watch_providers=8&watch_region=AU`,
      // },
      // {
      //   title: 'Drama',
      //   endpoint: `/discover/tv?api_key=${API_KEY}&with_genres=18&with_watch_providers=8&watch_region=AU`,
      // },
      // {
      //   title: 'Family',
      //   endpoint: `/discover/tv?api_key=${API_KEY}&with_genres=10751&with_watch_providers=8&watch_region=AU`,
      // },
      // {
      //   title: 'Mystery',
      //   endpoint: `/discover/tv?api_key=${API_KEY}&with_genres=9648&with_watch_providers=8&watch_region=AU`,
      // },
      // {
      //   title: 'Action-Adventure',
      //   endpoint: `/discover/tv?api_key=${API_KEY}&with_genres=10759&with_watch_providers=8&watch_region=AU`,
      // },
      // {
      //   title: 'Crime',
      //   endpoint: `/discover/tv?api_key=${API_KEY}&with_genres=80&with_watch_providers=8&watch_region=AU`,
      // },
      // {
      //   title: 'Reality',
      //   endpoint: `/discover/tv?api_key=${API_KEY}&with_genres=10764&with_watch_providers=8&watch_region=AU`,
      // },
      // {
      //   title: 'Talk',
      //   endpoint: `/discover/tv?api_key=${API_KEY}&with_genres=10767&with_watch_providers=8&watch_region=AU`,
      // },
    ],
    helpers: {
      searchTV: `/search/tv?api_key=${API_KEY}&query=_query`,
      fetchTVGenres: `genre/tv/list?api_key=${API_KEY}`,
      fetchTVTrailers: `/tv/_id/videos?api_key=${API_KEY}`,
      fetchTVDetails: `/tv/_id?api_key=${API_KEY}`,
      fetchTVAggregateCredits: `/tv/_id/aggregate_credits?api_key=${API_KEY}`,
      fetchTVRecommendations: `/tv/_id/recommendations?api_key=${API_KEY}`,
      fetchTVSeason: `/tv/_id/season/_seasonNumber?api_key=${API_KEY}`,
    },
  },
  movies: {
    sections: [
      {
        title: 'Phim Chiếu Rạp',
        endpoint: `api/phimhd/searchByQuery?&filterKeyQuery=chieurap&filterValueQuery=dHJ1ZQ==&serverQuery=phimhd2`,
      },
      {
        title: 'Popular on Hotflix',
        endpoint: `api/phimhd/searchByQuery?&filterKeyQuery=category&filterValueQuery=SMOgbmggxJDhu5luZw==&serverQuery=phimhd2`,
      },
      {
        title: 'Phim Lẻ',
        endpoint: `api/phimhd/searchByQuery?&filterKeyQuery=type&filterValueQuery=c2luZ2xl&serverQuery=phimhd2`,
      },
      {
        title: 'Phim Bộ',
        endpoint: `api/phimhd/searchByQuery?&filterKeyQuery=type&filterValueQuery=c2VyaWVz&serverQuery=phimhd2`,
      },
      {
        title: 'Chill Cùng Các Oppa',
        endpoint: `api/phimhd/searchByQuery?&filterKeyQuery=country&filterValueQuery=SMOgbiBRdeG7kWM=&serverQuery=phimhd2`,
      },
      {
        title: 'Gia Đình Là Số 1',
        endpoint: `api/phimhd/searchByQuery?&filterKeyQuery=category&filterValueQuery=R2lhIMSQw6xuaA==&serverQuery=phimhd2`,
      },
      {
        title: 'Học Đường Nổi Loạn',
        endpoint: `api/phimhd/searchByQuery?&filterKeyQuery=category&filterValueQuery=SOG7jWMgxJDGsOG7nW5n&serverQuery=phimhd2`,
      },
      {
        title: 'Anime',
        endpoint: `api/phimhd/searchByQuery?&filterKeyQuery=type&filterValueQuery=aG9hdGhpbmg=&serverQuery=phimhd2`,
      }
    ],
    helpers: {
      searchMovie: `/search/movie?api_key=${API_KEY}&query=_query`,
      fetchMovieGenres: `genre/movie/list?api_key=${API_KEY}`,
      fetchMovieTrailers: `/movie/_id/videos?api_key=${API_KEY}`,
      fetchMovieDetails: `/movie/_id?api_key=${API_KEY}`,
      fetchMovieRecommendations: `/movie/_id/recommendations?api_key=${API_KEY}`,
      fetchMovieCredits: `/movie/_id/credits?api_key=${API_KEY}`,
    },
  },
}
