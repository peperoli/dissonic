import { createClient } from '@/utils/supabase/server'

async function fetchGenres() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('genres')
    .select(
      `*,
      children:genre_relations!genre_relations_parent_id_fkey(
        genre:genres!genre_relations_child_id_fkey(*)
      ),
      parents:genre_relations!genre_relations_child_id_fkey(*)`
    )
    .order('name', { ascending: true })

  if (error) {
    throw error
  }

  return { genres: data }
}

export default async function GenresPage() {
  const { genres } = await fetchGenres()
  return (
    <main>
      <h1>Genres</h1>
      <ul>
        {genres
          .filter(genre => !genre.parents.length)
          .map(genre => (
            <li key={genre.id}>
              {genre.name}
              {genre.children.length > 0 && (
                <ul className="ml-4">
                  {genre.children.map(child => (
                    <li key={child.genre.id}>{child.genre.name}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
      </ul>
    </main>
  )
}
