export type GeoapifyResponse = {
  type: 'FeatureCollection'
  features: GeoapifyFeature[]
  query: unknown
}

export type GeoapifyFeature = {
  type: 'Feature'
  properties: {
    datasource: {
      sourcename: string
      attribution: string
      license: string
      url: string
    }
    name: string
    other_names: {
      [key: string]: string
    }
    street: string
    housenumber: string
    postcode: string
    country: string
    country_code: string
    state: string
    county: string
    city: string
    iso3166_2: string
    lon: number
    lat: number
    state_code: string
    result_type:
      | 'country'
      | 'state'
      | 'city'
      | 'postcode'
      | 'street'
      | 'amenity'
      | 'locality'
      | 'building'
    formatted: string
    address_line1: string
    address_line2: string
    category: string
    timezone: {
      [key: string]: string
    }
    plus_code: string
    plus_code_short: string
    rank: {
      importance: number
      confidence: number
      match_type: string
    }
    place_id: string
  }
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
  bbox: [number, number, number, number]
}
