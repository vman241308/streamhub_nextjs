export interface XtreamCredentials {
  username: string
  password: string
  url: string
}

// Base category interface from API
export interface BaseCategory {
  category_id: string
  category_name: string
  parent_id: number | null
}

// Extended category interface with badges for internal use
export interface Category extends BaseCategory {
  badges?: CategoryBadge[] | null
}

export interface Channel {
  num: number
  stream_id: number
  name: string
  stream_type: string
  stream_icon: string
  epg_channel_id: string
  added: string
  is_adult: number
  category_id: string
  custom_sid: string
  tv_archive: number
  direct_source: string
  tv_archive_duration: number
  category_name?: string
  category_badges?: CategoryBadge[] // Change to array of badges
}