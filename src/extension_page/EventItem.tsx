import React from 'react'
import "./EventItem.css"

type Props = {
  start: string
  end: string
  title: string
  author: string
  author_url: string
  video_url: string
  thumbnail_url: string
}

export const EventItem = ({ start, end, title, author, author_url, video_url, thumbnail_url }: Props) => {
  return (
    <li className="item">
      <div className="timeline">
        <div className="labels">
          <div className="start">{start}</div>
          <div className="end">{end}</div>
        </div>
        <div className="timeline-decoration">
          <img
            src="https://img.icons8.com/?size=32&id=94587&format=png"
            alt=""
          />
          <div className="line"></div>
          <img
            src="https://img.icons8.com/?size=32&id=94587&format=png"
            alt=""
          />
        </div>
      </div>
      <div className="content">
        <a href={video_url}>
          <img src={thumbnail_url} alt="Video Thumbnail" />
        </a>
        <div className="text">
          <h1>{title}</h1>
          <h2>
            <a href={author_url}>{author}</a>
          </h2>
        </div>
      </div>
    </li>
  )
}
