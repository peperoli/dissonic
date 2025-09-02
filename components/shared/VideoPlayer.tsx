import { getCloudflareVideoUrl } from '@/lib/cloudflareHelpers'
import { PauseIcon, PlayIcon, Volume2Icon, VolumeXIcon } from 'lucide-react'
import 'cloudflare-video-element'
import ReactPlayer from 'react-player'
import {
  MediaProvider,
  useMediaDispatch,
  useMediaSelector,
  useMediaRef,
  MediaActionTypes,
} from 'media-chrome/react/media-store'

function Video({ videoId }: { videoId: string }) {
  const mediaRef = useMediaRef()

  return (
    <ReactPlayer
      ref={mediaRef}
      src={getCloudflareVideoUrl(videoId)}
      preload="auto"
      controls={false}
      muted
      crossOrigin=""
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  )
}

export const VideoPlayer = ({ videoId }: { videoId: string }) => {
  return (
    <MediaProvider>
      <Video videoId={videoId} />
      <div className="absolute bottom-0 flex justify-center w-full bg-slate-900/50">
        <PlayButton />
        <MuteButton />
      </div>
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
      className='p-2'
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
      className='p-2'
    >
      {mediaMuted ? <VolumeXIcon /> : <Volume2Icon />}
    </button>
  )
}
