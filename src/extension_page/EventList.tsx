import React from 'react'
import { convertTimeStampToDateString } from '../utils/time'
import { EventItem } from './EventItem'
import { Event } from './hooks/useEvents'

type Props = {
  events: Event[]
}

export const EventList = ({ events }: Props) => {
  return (
    <ul>
      {events.map((event, index) => (
        <EventItem
          key={event.start_timestamp + event.video_info.videoId}
          start={convertTimeStampToDateString(event.start_timestamp)}
          end={convertTimeStampToDateString(event.end_timestamp)}
          author={event.video_info.channel_name}
          author_url={event.video_info.channel_url}
          thumbnail_url={`https://i.ytimg.com/vi/${event.video_info.videoId}/hqdefault.jpg`}
          title={event.video_info.title}
          video_url={`https://www.youtube.com/watch?v=${event.video_info.videoId}`}
        />
      ))}
    </ul>
  )
}
