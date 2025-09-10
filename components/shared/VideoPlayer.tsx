import { PauseIcon, PlayIcon } from 'lucide-react'
import ReactPlayer from 'react-player'
import {
  MediaProvider,
  useMediaDispatch,
  useMediaSelector,
  useMediaRef,
  MediaActionTypes,
} from 'media-chrome/react/media-store'
import { ReactPlayerProps } from 'react-player/types'
import clsx from 'clsx'
import * as Slider from '@radix-ui/react-slider'
import { useEffect, useState } from 'react'
import { formatTime } from 'media-chrome/dist/utils/time.js'

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

export function VideoPlayer({
  ...props
}: {
  src: string
  hiddenControls?: boolean
} & Pick<ReactPlayerProps, 'muted' | 'autoPlay' | 'loop'>) {
  return (
    <MediaProvider>
      <VideoWrapper {...props} />
    </MediaProvider>
  )
}

function VideoWrapper({
  src,
  hiddenControls,
  ...playerProps
}: {
  src: string
  hiddenControls?: boolean
} & Pick<ReactPlayerProps, 'muted' | 'autoPlay' | 'loop'>) {
  const [visibleControls, setVisibleControls] = useState(true)
  const mediaPaused = useMediaSelector(state => state.mediaPaused)

  function showControls() {
    setVisibleControls(true)
  }

  function hideControls() {
    if (!mediaPaused) {
      setVisibleControls(false)
    }
  }

  function toggleControls() {
    setVisibleControls(!visibleControls)
  }

  useEffect(() => {
    console.log(mediaPaused, visibleControls)
    if (!mediaPaused) {
      const timeout = setTimeout(() => {
        setVisibleControls(false)
      }, 2000)

      return () => clearTimeout(timeout)
    }
  }, [mediaPaused, visibleControls])

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={showControls}
      onMouseLeave={hideControls}
      onClick={toggleControls}
      onMouseMove={showControls}
    >
      <Video src={src} {...playerProps} />
      {!hiddenControls && (
        <div
        onClick={event => event.stopPropagation()}
          className={clsx(visibleControls ? '' : 'opacity-0 transition group-hover:opacity-100')}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <PlayButton />
          </div>
          <SeekBar />
        </div>
      )}
    </div>
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
      className="grid size-16 place-content-center rounded-full bg-black/50"
    >
      {mediaPaused ? (
        <PlayIcon className="size-6 fill-white" />
      ) : (
        <PauseIcon className="size-6 fill-white" />
      )}
    </button>
  )
}

function SeekBar() {
  const dispatch = useMediaDispatch()
  const mediaCurrentTime = useMediaSelector(state => state.mediaCurrentTime)
  const [min, max] = useMediaSelector(state => state.mediaSeekable) ?? []

  return (
    <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-slate-900/70 p-2">
      {formatTime(mediaCurrentTime ?? 0, max)}
      <Slider.Root
        min={min}
        max={max}
        value={[mediaCurrentTime ?? 0]}
        onValueChange={([value]) => {
          dispatch({
            type: MediaActionTypes.MEDIA_SEEK_REQUEST,
            detail: value,
          })
        }}
        className="relative flex h-4 w-full items-center"
      >
        <Slider.Track className="relative h-1 flex-1 rounded bg-slate-300">
          <Slider.Range className="absolute h-full rounded bg-venom" />
        </Slider.Track>
        <Slider.Thumb className="block size-4 rounded-full bg-venom" />
      </Slider.Root>
      {formatTime(max ?? 0, max)}
    </div>
  )
}
