import * as styled from './recommendationStyles';
import { ShowMore, ArrowUp, ArrowDown } from './episodeStyles';

import {
  shortDescription,
  getRecommendations as fetchRecommendations,
} from 'helpers/browseHelpers';
import { onShowMoreClick } from './Episode';
import useSafeMounted from 'hooks/useSafeMounted';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Recommendation({ category, id, placeholder, raw, setSelectedItem}) {
  const [recommendations, setRecommendations] = useState();
  const [showAll, setShowAll] = useState(false);

  const mountRef = useSafeMounted();

  useEffect(() => {
    const getRecommendations = async () => {
      const recommendations = await fetchRecommendations(category, id, raw);
      mountRef.current && setRecommendations(recommendations);
    };
    getRecommendations();
  }, [id, category]);

  return recommendations && recommendations.length > 0 ? (
    <styled.Recommendation>
      <styled.Header>More Like This</styled.Header>
      {recommendations && (
        <styled.Grid>
          {recommendations.map(
            (
              {
                id,
                backdrop_path,
                overview,
                name,
                title,
                first_air_date,
                release_date,
              },
              i
            ) =>
              (showAll || (!showAll && i < 9)) && (
                <styled.GridItem key={id} onClick={(e) => {
                  e.preventDefault()
                  setSelectedItem({ id, name, backdrop_path})
                }}>
                  <styled.Wrapper>
                    <Image
                      src={`${
                        backdrop_path || placeholder
                      }`}
                      width={300}
                      height={169}
                      alt={name}
                      objectFit="cover"
                    />
                  </styled.Wrapper>
                  <styled.Details>
                    <styled.Title>{name || title}</styled.Title>
                    <styled.Year>
                      {new Date(first_air_date || release_date).getFullYear()}
                    </styled.Year>
                    <p>
                      {overview.length === 0
                        ? 'No overview available'
                        : shortDescription(overview, 175)}
                    </p>
                  </styled.Details>
                </styled.GridItem>
              )
          )}
        </styled.Grid>
      )}
      {recommendations && recommendations.length > 9 && (
        <styled.ShowMoreWrapper>
          <ShowMore onClick={(e) => onShowMoreClick(e, setShowAll)}>
            {showAll ? <ArrowUp /> : <ArrowDown />}
          </ShowMore>
        </styled.ShowMoreWrapper>
      )}
    </styled.Recommendation>
  ) : null;
}
