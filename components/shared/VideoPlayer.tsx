import { PauseIcon, PlayIcon, Volume2Icon, VolumeXIcon } from 'lucide-react'
import ReactPlayer from 'react-player'
import {
  MediaProvider,
  useMediaDispatch,
  useMediaSelector,
  useMediaRef,
  MediaActionTypes,
} from 'media-chrome/react/media-store'
import { ReactPlayerProps } from 'react-player/types'

function Video({
  src,
  ...playerProps
}: { src: string } & Pick<ReactPlayerProps, 'muted' | 'autoPlay' | 'loop'>) {
  const mediaRef = useMediaRef()

  return (
    <ReactPlayer
      ref={mediaRef}
      src={src}
      preload="auto"
      // controls={false}
      playsInline
      crossOrigin=""
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      }}
      {...playerProps}
    />
  )
}

export const VideoPlayer = ({
  src,
  hiddenControls,
  ...playerProps
}: {
  src: string
  hiddenControls?: boolean
} & Pick<ReactPlayerProps, 'muted' | 'autoPlay' | 'loop'>) => {
  return (
    <MediaProvider>
      <Video src={src} {...playerProps} />
      {!hiddenControls && (
        <div className="absolute left-0 bottom-0 flex w-full justify-center bg-slate-900/50">
          <PlayButton />
          <MuteButton />
        </div>
      )}
    </MediaProvider>
  )
}

function PlayButton() {
  const dispatch = useMediaDispatch()
  const mediaPaused = useMediaSelector(state => state.mediaPaused)

  return (
    <button
      onClick={() => {
        dispatch({
          type: mediaPaused
            ? MediaActionTypes.MEDIA_PLAY_REQUEST
            : MediaActionTypes.MEDIA_PAUSE_REQUEST,
        })
      }}
      aria-label={mediaPaused ? 'Play' : 'Pause'}
      className="p-2"
    >
      {mediaPaused ? <PlayIcon /> : <PauseIcon />}
    </button>
  )
}
function MuteButton() {
  const dispatch = useMediaDispatch()
  const mediaMuted = useMediaSelector(state => state.mediaMuted)

  return (
    <button
      onClick={() => {
        dispatch({
          type: mediaMuted
            ? MediaActionTypes.MEDIA_UNMUTE_REQUEST
            : MediaActionTypes.MEDIA_MUTE_REQUEST,
        })
      }}
      aria-label={mediaMuted ? 'Unmute' : 'Mute'}
      className="p-2"
    >
      {mediaMuted ? <VolumeXIcon /> : <Volume2Icon />}
    </button>
  )
}
