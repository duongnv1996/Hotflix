import axios from 'axios'
import tmdb from 'data/dynamic/tmdb'
import phimhd from 'data/dynamic/phimhd'
import { TMDB } from 'data/dynamic/tmdbEndpoints'


/**
 * Return a random number that's less than data array's length.
 *
 * @param {Number} dataLength - data array's length.
 * @return {Number} a random number less than data array's length.
 * @example chooseRandomBanner(filteredResults.length)
 */
export const chooseRandomBanner = (dataLength) =>
  Math.floor(Math.random() * dataLength)

/**
 * Return shorter description
 *
 * @param {String} description - a string needed to be shortened
 * @param {Number} length - desired length
 * @return {String} a shortened string or original string depends on the length.
 * @example shortDescription('long string!',2)
 */
export const shortDescription = (description, length) =>
  description.length > length
    ? description.substr(0, length - 1) + '...'
    : description

/**
 * Return a boolean value to see whether the Tv show or movie is newly released or not.
 *
 * @param {String} date - a date string like "2016-01-25"
 * @return {Boolean}
 * @example isNewRelease('2016-01-25')
 */
export const isNewRelease = (date) => {
  const releaseDate = new Date(date)
  const currentDate = new Date()
  const gap = currentDate.getTime() - releaseDate.getTime()
  return Math.ceil(gap / (1000 * 3600 * 24)) <= 30
}
const getBannerFromTmdb =async (category) => {
  const { data: data1 } = await tmdb.get(
    TMDB[category].sections[1].endpoint.replace('_pageNumber', 1)
  )
  const { data: data2 } = await tmdb.get(
    TMDB[category].sections[1].endpoint.replace('_pageNumber', 2)
  )
  const { results: results1 } = data1
  const { results: results2 } = data2
  const resultsPools = [...results1, ...results2]
  const filteredResults = resultsPools.filter(
    ({ original_language, original_name, original_title }) =>
      original_language === 'en' &&
      // get rid of items that its video can't be played
      (original_name || original_title) !== 'Mortal Kombat' &&
      (original_name || original_title) !== 'The Walking Dead' &&
      (original_name || original_title) !== 'Superman & Lois' &&
      (original_name || original_title) !== 'Fear the Walking Dead' &&
      (original_name || original_title) !== 'Master of None'
  )
  const banner = filteredResults[chooseRandomBanner(filteredResults.length)]
  console.log("Banner",banner);
  return banner
}
const getBannerFromPhimHD = async (category) => {
  let listMovie =await getSliderItemsFromPhimHD(TMDB[category].sections[0])
  const banner = listMovie[chooseRandomBanner(listMovie.length)]
  console.log("Banner", banner)
  return banner
}
// below are fetch functions that are quite straightforward
export const getBanner = async (category) => {
  return getBannerFromPhimHD(category)
}
const getTrailerFromTmdb = async (category, id) => {
  const method =
    category === 'TVShows' ? 'fetchTVTrailers' : 'fetchMovieTrailers'

  const trailerEndpoint = TMDB[category].helpers[method].replace('_id', id)

  let trailer = null
  const { data } = await tmdb.get(trailerEndpoint)
  const { results } = data
  if (results.length > 0) {
    const trailerDetails = results.reverse().find(
      ({ site, type }) =>
        site === 'YouTube' &&
        // get all possible types
        (type === 'Trailer' ||
          type === 'Featurette' ||
          type === 'Clip' ||
          type === 'Opening Credits')
    )
    if (trailerDetails) {
      trailer = trailerDetails.key
    }
  }

  return trailer
}
export const getTrailer = async (category, id) => {
  let detail = await getDetailFromPhimHD(id)
  // return getTrailerFromTmdb(category, id)
  return detail.trailer || null
}

const getDetailFromPhimHD = async (id) => {
  try {
    let responseFromPhimHD = await phimhd.get(`/api/phimhd/getDetailInfoMovie?urlDetail=${id}&serverQuery=phimhd2`)
    console.log("responseFromPhimHD", responseFromPhimHD.data.data)
    let detailFromPhimHD = responseFromPhimHD.data.data.movie
    let sample = {
      "details": {
        "adult": false,
        "backdrop_path": detailFromPhimHD.poster_url || detailFromPhimHD.thumb_url,
        "created_by": [

        ],
        "episode_run_time": [
          45
        ],
        "first_air_date": "2022-05-26",
        "genres": detailFromPhimHD.category.map((item) => {
          return {
            "id": 10765,
            "name": item
          }
        }),
        "homepage": "https://www.disneyplus.com/series/obi-wan-kenobi/2JYKcHv9fRJb",
        "id": detailFromPhimHD.slug,
        "in_production": true,
        "languages": [
          "en"
        ],
        "last_air_date": "2022-06-08",
        "last_episode_to_air": {
          "air_date": "2022-06-08",
          "episode_number": 4,
          "id": 3635493,
          "name": "Part IV",
          "overview": "Obi-Wan Kenobi plots a daring mission into enemy territory.",
          "production_code": "",
          "runtime": 39,
          "season_number": 1,
          "still_path": "/y96Ch2lxXJBDfjwti4GsguGKVzV.jpg",
          "vote_average": 6.8,
          "vote_count": 16
        },
        "name": detailFromPhimHD.name,
        "next_episode_to_air": {
          "air_date": "2022-06-15",
          "episode_number": 5,
          "id": 3635494,
          "name": "Part V",
          "overview": "Obi-Wan plans his next move as the Empire, closing in, tries to draw him out.",
          "production_code": "",
          "runtime": 43,
          "season_number": 1,
          "still_path": "/wUhxilAHdArLYyWwkrwCntRlzjW.jpg",
          "vote_average": 7.571,
          "vote_count": 7
        },
        "networks": [
          {
            "name": "Disney+",
            "id": 2739,
            "logo_path": "/uzKjVDmQ1WRMvGBb7UNRE0wTn1H.png",
            "origin_country": "US"
          }
        ],
        "number_of_episodes": 6,
        "number_of_seasons": 1,
        "origin_country": detailFromPhimHD.country.map((item) => item),
        "original_language": "en",
        "original_name": detailFromPhimHD.origin_name,
        "overview": detailFromPhimHD.content,
        "popularity": 2605.383,
        "poster_path": detailFromPhimHD.thumb_url || detailFromPhimHD.poster_url,
        "production_companies": [
          {
            "id": 1,
            "logo_path": "/o86DbpburjxrqAzEDhXZcyE8pDb.png",
            "name": "Lucasfilm Ltd.",
            "origin_country": "US"
          }
        ],
        "production_countries": [
          {
            "iso_3166_1": "US",
            "name": "United States of America"
          }
        ],
        "seasons": detailFromPhimHD.episodes.map((group, index) => {
          return {
            "air_date": "2022-05-26",
            "episode_count": group.server_data.length,
            "id": group.server_name,
            "name": group.server_name,
            "overview": "",
            "poster_path": null,
            "season_number": group.server_name,
            "listEpisode": getListEpisodeFromGroupPhimHD(detailFromPhimHD, group.server_data)
          }
        }),
        "spoken_languages": [
          {
            "english_name": "English",
            "iso_639_1": "en",
            "name": "English"
          }
        ],
        "status": "Returning Series",
        "tagline": "Between darkness and defeat, hope survives.",
        "type": "Miniseries",
        "vote_average": 8.1,
        "vote_count": 271
      },
      "cast": detailFromPhimHD.actor.map((item) => {
        return {
          "adult": false,
          "gender": 2,
          "id": 3061,
          "known_for_department": "Acting",
          "name": item,
          "original_name": item,
          "popularity": 38.835,
          "profile_path": "/aEmyadfRXTmmR7UW7OXsm5a6smS.jpg",
          "roles": [
            {
              "credit_id": "5d628a9e39a45d0012c058fc",
              "character": "Obi-Wan Kenobi",
              "episode_count": 6
            }
          ],
          "total_episode_count": 6,
          "order": 0
        }
      }),
      "trailer": detailFromPhimHD.trailer_url,
      "raw": responseFromPhimHD.data.data
    }
    console.log("Sample", sample)
    return sample

  } catch (error) {
    console.error(error.toString())
    return {}
  }
}
const getDetailTmdb = async (category, id) => {
  const getMethod = (method) => {
    switch (method) {
      case 'trailer':
        return category === 'TVShows'
          ? 'fetchTVTrailers'
          : 'fetchMovieTrailers'
      case 'details':
        return category === 'TVShows' ? 'fetchTVDetails' : 'fetchMovieDetails'
      case 'credits':
        return category === 'TVShows'
          ? 'fetchTVAggregateCredits'
          : 'fetchMovieCredits'
    }
  }

  const getEndPoint = (method) => {
    switch (method) {
      case 'trailer':
        return TMDB[category].helpers[getMethod('trailer')].replace('_id', id)
      case 'details':
        return TMDB[category].helpers[getMethod('details')].replace('_id', id)
      case 'credits':
        return TMDB[category].helpers[getMethod('credits')].replace('_id', id)
    }
  }

  const { data: details } = await tmdb.get(getEndPoint('details'))
  const { data: castData } = await tmdb.get(getEndPoint('credits'))
  const { cast } = castData

  let trailer = null
  const { data: trailerData } = await tmdb.get(getEndPoint('trailer'))
  const { results: trailerResults } = trailerData
  if (trailerResults.length > 0) {
    const trailerDetails = trailerResults
      .reverse()
      .find(({ site, type }) => site === 'YouTube' && type === 'Trailer')
    if (trailerDetails) {
      trailer = trailerDetails.key
    }
  }
  return { details, cast, trailer }
}
export const getDetails = async (category, id) => {
  console.log("getDetails", `${category} - ${id}`)
  // return getDetailTmdb(category, id)
  return getDetailFromPhimHD(id)
}
const getListEpisodeFromGroupPhimHD = (detailFromPhimHD, server_data) => {
  return server_data.map((item) => {
    return {
      "air_date": "2022-02-25",
      "episode_number": item.name,
      "crew": [
        {
          "job": "Director",
          "department": "Directing",
          "credit_id": "601a0cebe942ee0041f43661",
          "adult": false,
          "gender": 2,
          "id": 19346,
          "known_for_department": "Directing",
          "name": "Niels Arden Oplev",
          "original_name": "Niels Arden Oplev",
          "popularity": 2.398,
          "profile_path": "/yGdxpPjMhIaeGaJL8TsVSpDuEbh.jpg"
        },
        {
          "job": "Writer",
          "department": "Writing",
          "credit_id": "601a0cf10f1e580041e95f6a",
          "adult": false,
          "gender": 2,
          "id": 7671,
          "known_for_department": "Writing",
          "name": "Jeb Stuart",
          "original_name": "Jeb Stuart",
          "popularity": 4.728,
          "profile_path": "/jIDFAtot30xEHhEqi9T6ljb1Laj.jpg"
        },
        {
          "job": "Producer",
          "department": "Production",
          "credit_id": "601a0cf7470ead003e72b10a",
          "adult": false,
          "gender": 2,
          "id": 19346,
          "known_for_department": "Directing",
          "name": "Niels Arden Oplev",
          "original_name": "Niels Arden Oplev",
          "popularity": 2.398,
          "profile_path": "/yGdxpPjMhIaeGaJL8TsVSpDuEbh.jpg"
        }
      ],
      "guest_stars": [
        {
          "character": "Magnús Gunnarsson",
          "credit_id": "6218eda392e55b001b69f2e5",
          "order": 6,
          "adult": false,
          "gender": 2,
          "id": 2186683,
          "known_for_department": "Acting",
          "name": "Leifur Sigurdarson",
          "original_name": "Leifur Sigurdarson",
          "popularity": 3.018,
          "profile_path": "/qcsEbKSZLBlV1IqS0OWIaHNp32P.jpg"
        },
        {
          "character": "Sten Sigurdsson",
          "credit_id": "6218edc592e55b0041edf8ce",
          "order": 7,
          "adult": false,
          "gender": 2,
          "id": 1400211,
          "known_for_department": "Acting",
          "name": "Wolfgang Cerny",
          "original_name": "Wolfgang Cerny",
          "popularity": 6.413,
          "profile_path": "/xBhu43lVyTfWle3Em8oT6T4XdfS.jpg"
        },
        {
          "character": "Merin",
          "credit_id": "6218edffa885870042196ed3",
          "order": 8,
          "adult": false,
          "gender": 0,
          "id": 1510913,
          "known_for_department": "Acting",
          "name": "Yvonne May",
          "original_name": "Yvonne May",
          "popularity": 1.22,
          "profile_path": null
        },
        {
          "character": "Viking Sailor",
          "credit_id": "6218ee75d144430043f8f73f",
          "order": 12,
          "adult": false,
          "gender": 2,
          "id": 3035786,
          "known_for_department": "Acting",
          "name": "Matthew Malone",
          "original_name": "Matthew Malone",
          "popularity": 1.4,
          "profile_path": null
        },
        {
          "character": "Aelfrun",
          "credit_id": "6218ee9ea885870042197201",
          "order": 13,
          "adult": false,
          "gender": 0,
          "id": 3443175,
          "known_for_department": "Acting",
          "name": "Shane Quigley Murphy",
          "original_name": "Shane Quigley Murphy",
          "popularity": 0.6,
          "profile_path": null
        },
        {
          "character": "Ødger",
          "credit_id": "6218ef477b7b4d0042753e6d",
          "order": 18,
          "adult": false,
          "gender": 0,
          "id": 3443177,
          "known_for_department": "Acting",
          "name": "Bill Murphy",
          "original_name": "Bill Murphy",
          "popularity": 0.6,
          "profile_path": null
        },
        {
          "character": "Becken",
          "credit_id": "6218ef817b7b4d0042753f44",
          "order": 21,
          "adult": false,
          "gender": 0,
          "id": 3443180,
          "known_for_department": "Acting",
          "name": "Jay Cosgrave",
          "original_name": "Jay Cosgrave",
          "popularity": 1.094,
          "profile_path": null
        },
        {
          "character": "Largest Becken",
          "credit_id": "6218ef93a27502004274c34c",
          "order": 22,
          "adult": false,
          "gender": 0,
          "id": 1283439,
          "known_for_department": "Acting",
          "name": "Tristan McConnell",
          "original_name": "Tristan McConnell",
          "popularity": 1.96,
          "profile_path": "/7w4KX6aatZtJ2DtALVNYYWLSQe0.jpg"
        },
        {
          "character": "Aethelred the Unready",
          "credit_id": "6218ed6579a1c30043fb53fc",
          "order": 24,
          "adult": false,
          "gender": 2,
          "id": 33401,
          "known_for_department": "Acting",
          "name": "Bosco Hogan",
          "original_name": "Bosco Hogan",
          "popularity": 6.194,
          "profile_path": "/sMa4b3F9KoHqReJ84pVybL0atQ2.jpg"
        },
        {
          "character": "Birger",
          "credit_id": "6218ee0da885870042196ef1",
          "order": 24,
          "adult": false,
          "gender": 0,
          "id": 2625340,
          "known_for_department": "Acting",
          "name": "Frank Blake",
          "original_name": "Frank Blake",
          "popularity": 6.489,
          "profile_path": "/vapsLZpKx7Y2gPt3XQNRswJZfc5.jpg"
        },
        {
          "character": "Jarl Gorm",
          "credit_id": "6218ef6e489d0000437556d3",
          "order": 24,
          "adult": false,
          "gender": 0,
          "id": 3443179,
          "known_for_department": "Acting",
          "name": "Julian Saeger",
          "original_name": "Julian Saeger",
          "popularity": 0.6,
          "profile_path": null
        },
        {
          "character": "Ulf",
          "credit_id": "6218ee4779a1c3006b8f895a",
          "order": 31,
          "adult": false,
          "gender": 0,
          "id": 3443174,
          "known_for_department": "Acting",
          "name": "Sam Stafford",
          "original_name": "Sam Stafford",
          "popularity": 0.6,
          "profile_path": null
        },
        {
          "character": "Toke",
          "credit_id": "6218ee3a8d2f8d0042a26fca",
          "order": 33,
          "adult": false,
          "gender": 0,
          "id": 3443173,
          "known_for_department": "Acting",
          "name": "Jack Mullarkey",
          "original_name": "Jack Mullarkey",
          "popularity": 0.6,
          "profile_path": null
        },
        {
          "character": "Tomas",
          "credit_id": "6218eebca27502004274c074",
          "order": 44,
          "adult": false,
          "gender": 2,
          "id": 1879381,
          "known_for_department": "Acting",
          "name": "Robert McCormack",
          "original_name": "Robert McCormack",
          "popularity": 1.128,
          "profile_path": "/7osXpXngkTeI19KJBhyLIjhxUWg.jpg"
        },
        {
          "character": "Earl of East Anglia",
          "credit_id": "6218ecb27b7b4d001bcf91cb",
          "order": 48,
          "adult": false,
          "gender": 2,
          "id": 1780244,
          "known_for_department": "Acting",
          "name": "Gavin O'Connor",
          "original_name": "Gavin O'Connor",
          "popularity": 3.105,
          "profile_path": "/7AKnSf9YM1b6CrnKymNwXe5lkB5.jpg"
        },
        {
          "character": "Skarde",
          "credit_id": "6218ed460e597b001b9eb93a",
          "order": 49,
          "adult": false,
          "gender": 0,
          "id": 1488080,
          "known_for_department": "Acting",
          "name": "Edward Franklin",
          "original_name": "Edward Franklin",
          "popularity": 0.62,
          "profile_path": null
        },
        {
          "character": "Yrsa",
          "credit_id": "6218ed7d90cf5100415583d0",
          "order": 56,
          "adult": false,
          "gender": 0,
          "id": 1894609,
          "known_for_department": "Acting",
          "name": "Álfrún Laufeyjardóttir",
          "original_name": "Álfrún Laufeyjardóttir",
          "popularity": 2.716,
          "profile_path": null
        },
        {
          "character": "Vestian",
          "credit_id": "6218eec779a1c3006b8f8b7d",
          "order": 57,
          "adult": false,
          "gender": 0,
          "id": 3443176,
          "known_for_department": "Acting",
          "name": "Ethan Dillon",
          "original_name": "Ethan Dillon",
          "popularity": 0.6,
          "profile_path": null
        },
        {
          "character": "Jarl Nóri",
          "credit_id": "6218ef0dce5d82001b4289c2",
          "order": 57,
          "adult": false,
          "gender": 2,
          "id": 1437419,
          "known_for_department": "Acting",
          "name": "Kenneth M. Christensen",
          "original_name": "Kenneth M. Christensen",
          "popularity": 3.422,
          "profile_path": "/p2tjxZrFJAc8sxMdJkXj2ZGdmL.jpg"
        },
        {
          "character": "Liv",
          "credit_id": "6218ed8aafa1b0001e24cbd3",
          "order": 72,
          "adult": false,
          "gender": 1,
          "id": 1977048,
          "known_for_department": "Acting",
          "name": "Lujza Richter",
          "original_name": "Lujza Richter",
          "popularity": 12.239,
          "profile_path": "/nhIMC58znoWz3Aq1TeqbSoF0n0y.jpg"
        },
        {
          "character": "Hertha",
          "credit_id": "6218eee992e55b001b69f7aa",
          "order": 74,
          "adult": false,
          "gender": 0,
          "id": 2728058,
          "known_for_department": "Acting",
          "name": "Jinny Lofthouse",
          "original_name": "Jinny Lofthouse",
          "popularity": 1.38,
          "profile_path": null
        },
        {
          "character": "Arne",
          "credit_id": "6218ef5d79a1c3006b8f8dbc",
          "order": 75,
          "adult": false,
          "gender": 2,
          "id": 1418974,
          "known_for_department": "Acting",
          "name": "Pääru Oja",
          "original_name": "Pääru Oja",
          "popularity": 4.884,
          "profile_path": "/uH98UWuNfnzpRxxsfj7IC2FUTPM.jpg"
        }
      ],
      "id": item.link_embed,
      "linkM3u8": item.link_m3u8,
      "name": `Tập ${item.name}`,
      "overview": detailFromPhimHD.content,
      "production_code": "",
      "runtime": 51,
      "season_number": 1,
      "still_path": detailFromPhimHD.poster_url || detailFromPhimHD.thumb_url,
      "vote_average": 7.788,
      "vote_count": 33
    }
  })
}
const getEpisodesFromPhimHD = async (season, id, rawResponseDetail) => {
  let detailFromPhimHD = null
  if (rawResponseDetail) {
    detailFromPhimHD = rawResponseDetail.data.movie
  } else {
    let responseFromPhimHD = await phimhd.get(`/api/phimhd/getDetailInfoMovie?urlDetail=${id}&serverQuery=phimhd2`)
    console.log("responseFromPhimHD", responseFromPhimHD.data.data)
    detailFromPhimHD = responseFromPhimHD.data.data.movie
  }

  let sample = getListEpisodeFromGroupPhimHD(detailFromPhimHD, detailFromPhimHD.episodes.find((group) => group.server_name == season).server_data)
  console.log("Episode Phimhd" + season, sample)

  return sample
}
const getEpisodeFromTmdb = async (season, id) => {
  const { data } = await tmdb.get(
    TMDB.TVShows.helpers.fetchTVSeason
      .replace('_id', id)
      .replace('_seasonNumber', season)
  )

  const { episodes } = data
  console.log("Episode ", episodes)
  return episodes
}
export const getEpisodes = async (season, id, rawResponseDetail) => {
  console.log("getEpisodes", `${season} - ${id} - ${rawResponseDetail}`)

  return getEpisodesFromPhimHD(season, id)
}
const getRecommendationsFromTmdb = async (category, id) => {
  const getMethod = () =>
    category === 'TVShows'
      ? 'fetchTVRecommendations'
      : 'fetchMovieRecommendations'

  const { data } = await tmdb.get(
    TMDB[category].helpers[getMethod()].replace('_id', id)
  )

  const { results: recommendations } = data
  console.log("getRecommendationsFromTmdb", recommendations)
  return recommendations
}
const getRecommendationsFromPhimHD = async (category, id, rawResponseDetail) => {

  let data = null
  if (rawResponseDetail) {
    data = rawResponseDetail.listMovieRelate
  } else {
    let responseFromPhimHD = await phimhd.get(`/api/phimhd/getDetailInfoMovie?urlDetail=${id}&serverQuery=phimhd2`)
    console.log("responseFromPhimHD", responseFromPhimHD.data.data)
    data = responseFromPhimHD.data.data.listMovieRelate
  }
  return data.map((item) => {
    return {
      "adult": false,
      "backdrop_path": item.poster_url || item.thumb_url,
      "genre_ids": [
        80,
        18
      ],
      "id": item.slug,
      "media_type": "tv",
      "name": item.name,
      "origin_country": [
        "SE"
      ],
      "original_language": "sv",
      "original_name": item.origin_name,
      "overview": item.content,
      "popularity": 10.066,
      "poster_path": item.thumb_url || item.poster_url,
      "first_air_date": "2022-05-05",
      "vote_average": 7.115,
      "vote_count": 26
    }
  })
}
export const getRecommendations = async (category, id, rawResponseDetail) => {
  console.log("getRecommendationsFromPhimHD", `${category} - ${id} - ${rawResponseDetail}`)

  return getRecommendationsFromPhimHD(category, id, rawResponseDetail)
}
const getSliderItemsFromTmdb = async (section) => {
  const { data } = await tmdb.get(
    section.endpoint.replace('&page=_pageNumber', '')
  )

  const { results: sliderItems } = data

  return sliderItems
}
const getSliderItemsFromPhimHD = async (section) => {
  const responsePhimHD = await phimhd.get(
    section.endpoint
  )

  let listMovieFromPhimHD = responsePhimHD.data.data.listMovie

  // const { results } = data
  const results = listMovieFromPhimHD.map((item) => {
    return {
      "adult": false,
      "backdrop_path": item.poster_url || item.thumb_url,
      "genre_ids": [
        80,
        18
      ],
      "id": item.slug,
      "media_type": "tv",
      "name": item.name,
      "origin_country": [
        "SE"
      ],
      "original_language": "sv",
      "original_name": item.origin_name,
      "overview": item.content,
      "popularity": 10.066,
      "poster_path": item.thumb_url || item.poster_url,
      "first_air_date": "2022-05-05",
      "vote_average": 7.115,
      "vote_count": 26
    }
  })
  console.log("getSliderItemsFromPhimHD",results);
  return results
}
export const getSliderItems = async (section) => {
 return getSliderItemsFromPhimHD(section)
}

export const getGenres = async (category) => {
  const getMethod = () =>
    category === 'TVShows' ? 'fetchTVGenres' : 'fetchMovieGenres'

  const { data } = await tmdb.get(TMDB[category].helpers[getMethod()])

  const { genres } = data

  return genres
}

export const getSearchResults = async (category, query) => {
  const getMethod = () => (category === 'TVShows' ? 'searchTV' : 'searchMovie')

  const { data } = await tmdb.get(
    TMDB[category].helpers[getMethod()].replace('_query', query)
  )


  let responsePhimHD = await phimhd.get(`/api/phimhd/searchByQuery?query=${query}&serverQuery=phimhd2&forceRefresh=true`)
  console.log("responsePhimHD", responsePhimHD.data)
  let listMovieFromPhimHD = responsePhimHD.data.data.listMovie

  // const { results } = data
  const results = listMovieFromPhimHD.map((item) => {
    return {
      adult: false,
      backdrop_path: item.poster_url || item.thumb_url,
      genre_ids: [53, 28],
      id: item.slug,
      original_language: "en",
      original_title: item.origin_name,
      overview: item.content,
      popularity: 520.332,
      poster_path: item.thumb_url || item.poster_url,
      release_date: "2022-04-08",
      title: item.name,
      video: false,
      vote_average: 6.1,
      vote_count: 272,
    }
  })
  console.log("Search Res:", results)
  let sample = {
    adult: false,
    backdrop_path: "/xicKILMzPn6XZYCOpWwaxlUzg6S.jpg",
    genre_ids: (2)[53, 28],
    id: 294793,
    original_language: "en",
    original_title: "All the Old Knives",
    overview: "When the CIA discovers one of its agents leaked information that cost more than 100 people their lives, veteran operative Henry Pelham is assigned to root out the mole with his former lover and colleague Celia Harrison.",
    popularity: 520.332,
    poster_path: "/g4tMniKxol1TBJrHlAtiDjjlx4Q.jpg",
    release_date: "2022-04-08",
    title: "All the Old Knives",
    video: false,
    vote_average: 6.1,
    vote_count: 272,

  }
  const filteredResults = results
    .filter(({ backdrop_path }) => backdrop_path)
    .sort((a, b) => b.popularity - a.popularity)

  return filteredResults
}

export const playerConfig = {
  playerVars: {
    // player not respond to keyboard controls
    disablekb: 1,
    // video annotations not be shown
    iv_load_policy: 3,
  },
}
