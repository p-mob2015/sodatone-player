import React from 'react'
import ReactPlayer from 'react-player'
import styled from 'styled-components'
import { faPause, faPlay, faStepForward, faStepBackward } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #333;
`;
const Meta = styled.div`
  display: flex;
  padding: 10px;
`;
const ArtworkWrapper = styled.div`
  height: 60px;
  margin-right: 10px;
`;
const Artwork = styled.img`
  height: 100%;
`;
const TrackName = styled.div`
  font-size: 19px;
  margin-bottom: 5px;
  color: white;
`;
const ArtistName = styled.div`
  font-size: 13px;
  color: white;
`;
const Controls = styled.div`
  display: flex;
  justify-content: center;
  padding: 5px 0;
  background-color: black;
`;
const Control = styled.div`
  cursor: pointer;
  font-size: 20px;
  color: white;

  &:hover {
    color: green;
  }
  &:not(:last-child) {
    margin-right: 30px;
  }
`;

class Player extends React.Component {
  constructor(props) {
    super(props);
    // This is the 'playlist' of tracks that we're playing/pausing, navigating through, etc.
    this.tracks = [
      {
        id: 1,
        trackName: "The Pretender",
        artistName: "Foo Fighters",
        artworkUrl: "https://images.sk-static.com/images/media/profile_images/artists/29315/huge_avatar",
        mediaUrl: "https://p.scdn.co/mp3-preview/6aba2f4e671ffe07fd60807ca5fef82d48146d4c?cid=1cef747d7bdf4c52ac981490515bda71",
        durationMilliseconds: 30000 // This track is 30 seconds long (30,000 milliseconds).
      },
      {
        id: 2,
        artistName: "Arctic Monkeys",
        trackName: "Do I Wanna Know?",
        artworkUrl: "https://cps-static.rovicorp.com/3/JPG_500/MI0003/626/MI0003626958.jpg?partner=allrovi.com",
        mediaUrl: "https://p.scdn.co/mp3-preview/9ec5fce4b39656754da750499597fcc1d2cc82e5?cid=1cef747d7bdf4c52ac981490515bda71",
        durationMilliseconds: 30000
      },
    ];
  }

  state = {
    playing: false,
    trackIndex: 0,
    played: 0,
    loaded: 0,
  };

  prevTrack = () => {
    const { trackIndex } = this.state;

    this.setState({
      trackIndex: (trackIndex - 1 + this.tracks.length) % this.tracks.length,
    });
  }

  nextTrack = () => {
    const { trackIndex } = this.state;

    this.setState({
      trackIndex: (trackIndex + 1) % this.tracks.length,
    });
  }

  togglePlay = () => {
    this.setState({
      playing: !this.state.playing,
    })
  }

  onRef = player => {
    this.player = player;
  }

  onProgress = ({ played, loaded }) => {
    this.setState({
      played,
      loaded,
    });
  }

  onSeek = fraction => {
    if (!this.player) return;

    const validFraction = Math.min(fraction, this.state.loaded);
    this.player.seekTo(validFraction, 'fraction');
  }

  renderMeta(track) {
    return (
      <Meta>
        <ArtworkWrapper>
          <Artwork src={track.artworkUrl} alt={track.artistName} />
        </ArtworkWrapper>
        <div>
          <TrackName>{track.trackName}</TrackName>
          <ArtistName>{track.artistName}</ArtistName>
        </div>
      </Meta>
    );
  }

  renderControls() {
    const { playing } = this.state;

    return (
      <Controls>
        <Control><FontAwesomeIcon icon={faStepBackward} onClick={this.prevTrack} /></Control>
        <Control><FontAwesomeIcon icon={playing ? faPause : faPlay} onClick={this.togglePlay} /></Control>
        <Control><FontAwesomeIcon icon={faStepForward} onClick={this.nextTrack} /></Control>
      </Controls>
    );
  }

  render() {
    const { trackIndex, playing, played, loaded } = this.state;
    const track = this.tracks[trackIndex];

    return (
      <Container>
        {this.renderMeta(track)}
        <Seeker
          loaded={loaded}
          played={played}
          onSeek={this.onSeek}
        />
        {this.renderControls()}
        <MediaPlayer
          playing={playing}
          url={track.mediaUrl}
          onProgress={this.onProgress}
          onEnded={this.nextTrack}
          onRef={this.onRef}
        />
      </Container>
    );
  }
}

const FullBar = styled.div`
  position: relative;
  width: 100%;
  height: 10px;
  cursor: pointer;
  background-color: #111;  
`;
const LoadedBar = styled.div`
  position: absolute;
  height: 100%;
  z-index: 5;
  background-color: rgba(0,255,0,0.1);
`;
const PlayedBar = styled.div`
  position: absolute;
  height: 100%;
  z-index: 10;
  background-color: green;
`;
const TouchBar = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 15;
`;

class Seeker extends React.Component {
  onSeek = ({ nativeEvent }) => {
    const clientWidth = nativeEvent.toElement.clientWidth;
    const clientX = nativeEvent.clientX;

    this.props.onSeek(clientX / clientWidth);
  }

  render() {
    const { loaded, played } = this.props;

    return (
      <FullBar>
        <LoadedBar style={{ width: `${loaded * 100}%` }} />
        <PlayedBar style={{ width: `${played * 100}%` }} />
        <TouchBar onMouseDown={this.onSeek} />
      </FullBar>
    );
  }
}

/*
Library documentation: https://www.npmjs.com/package/react-player
*/
class MediaPlayer extends React.Component {
  render() {
    const { playing, url, onProgress, onEnded, onRef } = this.props;

    return (
      <div>
        <ReactPlayer
          ref={onRef}
          playing={playing}
          height={'0px'}
          width={'0px'}
          config={{ file: { forceAudio: true } }}
          progressInterval={100}
          onProgress={onProgress}
          onEnded={onEnded}
          url={url} /> 
      </div>
    )
  }
}

export default Player;
