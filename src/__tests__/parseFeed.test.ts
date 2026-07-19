import { describe, it, expect } from 'vitest'
import { parseFeed } from '../../api/_youtube.js'

const SAMPLE_FEED = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015">
  <title>Iglesia Nueva Casa</title>
  <entry>
    <yt:videoId>WLtDOUJU3Y4</yt:videoId>
    <title>Servicio Online &amp; Alabanza 24/05/2026</title>
    <published>2026-05-25T06:48:03+00:00</published>
  </entry>
  <entry>
    <yt:videoId>jTv_DvH-LxY</yt:videoId>
    <title>Servicio Online 17/05/2026</title>
    <published>2026-05-18T06:45:21+00:00</published>
  </entry>
</feed>`

describe('parseFeed', () => {
  it('extrae videos con id, título decodificado, fecha, url y miniatura', () => {
    const videos = parseFeed(SAMPLE_FEED)
    expect(videos).toHaveLength(2)
    expect(videos[0]).toEqual({
      id: 'WLtDOUJU3Y4',
      title: 'Servicio Online & Alabanza 24/05/2026',
      published: '2026-05-25T06:48:03+00:00',
      url: 'https://www.youtube.com/watch?v=WLtDOUJU3Y4',
      thumbnail: 'https://i.ytimg.com/vi/WLtDOUJU3Y4/hqdefault.jpg',
    })
  })

  it('respeta el límite', () => {
    expect(parseFeed(SAMPLE_FEED, 1)).toHaveLength(1)
  })

  it('devuelve arreglo vacío si no hay entries', () => {
    expect(parseFeed('<feed></feed>')).toEqual([])
  })
})
