import * as styled from './detailsStyles'
import { MuteIcon, NotMuteIcon, PlayIcon } from './billboardStyles'

import Episode from './Episode'
import Recommendation from './Recommendation'

import { getDetails as fetchDetails } from 'helpers/browseHelpers'
import useSafeMounted from 'hooks/useSafeMounted'

import { useState, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player/youtube'
import Image from 'next/image'

export default function Details({
  mute,
  setMute,
  category,
  windowWidth,
  selectedItem,
  setShowTrailer,
  setPlayerVideo,
  setSelectedItem

}) {
  const { id, start, placeholder } = selectedItem

  const [details, setDetails] = useState(null)
  const [cast, setCast] = useState(null)
  const [trailer, setTrailer] = useState(null)
  const [rawResponseDetail, setRawResponseDetail] = useState(null)
  const [showBanner, setShowBanner] = useState(false)

  const playerRef = useRef(null)
  const modalRef = useRef()

  const mountRef = useSafeMounted()

  useEffect(() => {
    mountRef.current && setShowTrailer(false)

    const onOutsideClick = (e) =>
      (modalRef.current && modalRef.current.contains(e.target)) ||
      (mountRef.current && setSelectedItem(null))

    document.body.addEventListener('mousedown', onOutsideClick)

    return () => document.body.removeEventListener('mousedown', onOutsideClick)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
      /* you can also use 'auto' behaviour
         in place of 'smooth' */
    })
  }

  useEffect(() => {
    const getDetails = async () => {
      const { details, cast, trailer, raw } = await fetchDetails(category, id)
      mountRef.current && setDetails(details)
      setRawResponseDetail(raw)
      mountRef.current && setCast(cast)
      if (trailer) mountRef.current && setTrailer(trailer)
    }
    getDetails()
  }, [selectedItem])

  return (
    details &&
    cast && (
      <styled.Details>
        <styled.FullScreen />
        <styled.Wrapper ref={modalRef}>
          {!showBanner && trailer && (
            <styled.Video>
              <ReactPlayer
                ref={playerRef}
                url={`https://www.youtube-nocookie.com/embed/${trailer}`}
                className="details"
                width="100%"
                height="100%"
                playing
                muted={mute}
                onEnded={() => setShowBanner(true)}
                config={{ playerVars: { start: Math.floor(start) } }}
              />
              <styled.Mute
                onClick={(e) => {
                  setMute(!mute)
                  e.stopPropagation()
                }}
              >
                {mute ? <MuteIcon /> : <NotMuteIcon />}
              </styled.Mute>
            </styled.Video>
          )}
          {details.backdrop_path && (showBanner || !trailer) && (
            <styled.Banner>
              <Image
                src={details.backdrop_path.includes("https") ? `${details.backdrop_path}` : `https://image.tmdb.org/t/p/${windowWidth <= 600
                  ? 'w780'
                  : windowWidth <= 1000
                    ? 'w1280'
                    : 'original'
                  }${details.backdrop_path}`}
                alt={details.title}
                layout="fill"
                objectFit="cover"
              />
            </styled.Banner>
          )}
          <styled.Close onClick={() => setSelectedItem(null)}>
            <styled.CloseIcon />
          </styled.Close>
          <styled.Overlay />
          {details && details.seasons && details.seasons.length > 0 && details.seasons[0].listEpisode && details.seasons[0].listEpisode.length > 0 && (
            <styled.ButtonWrapper>
              <styled.PlayButton
                onClick={() => {
                  setPlayerVideo({
                    trailer: details.seasons[0].listEpisode[0].id,
                    start: playerRef.current?.getCurrentTime() || 0,
                  })
                  setSelectedItem(null)
                }}
              >
                <PlayIcon />
                <span>Play</span>
              </styled.PlayButton>
            </styled.ButtonWrapper>
          )}
          <styled.Summary>
            <styled.Panel className="major-details">
              <styled.Title>
                {details.name || details.title || details.original_name}
              </styled.Title>
              <p className="air-date">
                <span>
                  {new Date(
                    details.first_air_date || details.release_date
                  ).getFullYear()}
                </span>
                {category === 'TVShows' && (
                  <span>{`${details.number_of_seasons} ${details.number_of_seasons > 1 ? 'Seasons' : 'Season'
                    }`}</span>
                )}
              </p>
              <p className="overview">{details.overview}</p>
            </styled.Panel>
            <styled.Panel className="minor-details">
              {cast && (
                <styled.MinorDetails>
                  <span>Cast:</span>{' '}
                  {cast.map(({ name }, i) => {
                    if (i > 5) return null
                    return i === cast.length - 1 ? name : name + ', '
                  })}
                  {cast.length > 6 && <i>more</i>}
                </styled.MinorDetails>
              )}
              <styled.MinorDetails>
                <span>Genres:</span>{' '}
                {details.genres.map(({ name }, i) =>
                  i === details.genres.length - 1 ? name : name + ', '
                )}
              </styled.MinorDetails>
            </styled.Panel>
          </styled.Summary>
          {(
            <Episode
              id={id}
              raw={rawResponseDetail ? rawResponseDetail : null}
              seasons={details.seasons}
              placeholder={placeholder}
              onClick={(item) => {
                setPlayerVideo({
                  trailer: item.id,
                  start: playerRef.current?.getCurrentTime() || 0,
                })
                setSelectedItem(null)
              }}
            />
          )}
          <Recommendation
            raw={rawResponseDetail ? rawResponseDetail : null}
            category={category}
            id={id}
            placeholder={placeholder}
            setSelectedItem={setSelectedItem}
          />
        </styled.Wrapper>
      </styled.Details>
    )
  )
}
