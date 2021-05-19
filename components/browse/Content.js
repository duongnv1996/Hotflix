import Billboard from './Billboard';
import Player from './Player';
import Details from './Details';
import Loading from 'components/layout/background/Loading';

import { ProfileContext } from 'components/layout/Layout';

import useWindowDimensions from 'hooks/useWindowDimensions';

import { useState, useContext } from 'react';

// I added comments for some browse related components because they're kinda messy and confusing

// this Component serves a purpose of managing cross component's states
export default function Content() {
  const { selectedProfile } = useContext(ProfileContext);
  const { avatar } = selectedProfile;
  const { width } = useWindowDimensions();

  // states for visual effects
  const [loading, setLoading] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  // handle situations when users click 'Play' or 'More info' buttons before video starts to play
  const [distracted, setDistracted] = useState(false);

  // states for both player and detail modals
  const [playerVideo, setPlayerVideo] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // states for cross components usage
  const [mute, setMute] = useState(true);

  return (
    <section>
      {loading ? <Loading src={avatar} /> : <Loading.Finished />}
      {playerVideo && (
        <Player playerVideo={playerVideo} setPlayerVideo={setPlayerVideo} />
      )}
      {selectedItem && (
        <Details
          width={width}
          mute={mute}
          setMute={setMute}
          selectedItem={selectedItem}
          setShowTrailer={setShowTrailer}
          setSelectedItem={setSelectedItem}
          setPlayerVideo={setPlayerVideo}
        />
      )}
      <Billboard
        avatar={avatar}
        width={width}
        mute={mute}
        setMute={setMute}
        showTrailer={showTrailer}
        setShowTrailer={setShowTrailer}
        distracted={distracted}
        setDistracted={setDistracted}
        setLoading={setLoading}
        setPlayerVideo={setPlayerVideo}
        setSelectedItem={setSelectedItem}
      />
    </section>
  );
}
