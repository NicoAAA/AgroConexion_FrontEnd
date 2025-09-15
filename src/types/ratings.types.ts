export interface StarRow {
  star: number
  count: number
  percentage: number
}

export interface RatingStatsResp {
  product_id: number
  total_ratings: number
  stars: StarRow[]
}

export interface Props {
  productId: number
}