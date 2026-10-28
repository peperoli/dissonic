export const enum AlgoliaIndex {
  Concerts = 'concerts',
  Bands = 'bands',
  Locations = 'locations',
  Genres = 'genres',
  FestivalRoots = 'festival_roots',
  Countries = 'countries',
}

export function parseFacetValue(facetValue: string) {
  const [id, name] = facetValue.split('||')

  return { id: parseInt(id), name }
}
