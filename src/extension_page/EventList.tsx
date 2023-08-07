import React from 'react'
import { convertTimeStampToDateString } from '../utils/time'
import { extractYouTubeVideoId } from './utils'
import { EventData } from '../background/event_storage'
import { EventItem } from './EventItem'

type Props = {
  events: EventData[]
}

export const EventList = ({ events }: Props) => {
  return (
    <ul>
      {events.map((event, index) => (
        <EventItem
          key={event.timestamp}
          start={convertTimeStampToDateString(event.timestamp)}
          end={convertTimeStampToDateString(event.timestamp)}
          author='Autor'
          author_url='link'
          thumbnail_url={`https://i.ytimg.com/vi/${extractYouTubeVideoId(event.url)}/hqdefault.jpg`}
          title='Tytuł'
          video_url={event.url}
        />
      ))}
    </ul>
  )
}
