import { getRelativeTime } from '@/lib/getRelativeTime'
import { TablesInsert, TablesUpdate } from '@/types/supabase'
import { createClient } from '@/utils/supabase/server'
import { ArrowRight } from 'lucide-react'
import { cookies } from 'next/headers'

async function fetchData() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase.from('contributions').select('*')

  if (error) {
    throw error
  }

  return data
}

type State = TablesInsert<'bands'> | TablesUpdate<'bands'> | null

export default async function Contributions() {
  const contributions = await fetchData()

  function findChanges(oldState: State, newState: State) {
    if (!oldState || !newState) {
      return []
    }

    const changes: { key: string; old: unknown; new: unknown }[] = []

    Object.entries(oldState).forEach(([key, value]) => {
      if (newState[key] !== value) {
        changes.push({ key, old: oldState[key], new: newState[key] })
      }
    })

    return changes
  }

  return (
    <main>
      <table className="w-full">
        <tbody>
          {contributions.map(contribution => (
            <tr key={contribution.id}>
              <td>{contribution.id}</td>
              <td>{getRelativeTime(contribution.timestamp, 'de-CH')}</td>
              <td>{contribution.ressource_type}</td>
              <td>{contribution.ressource_id}</td>
              <td>{contribution.operation}</td>
              <td>
                {contribution.operation === 'UPDATE' && (
                  <div>
                    {findChanges(
                      contribution.state_old as State,
                      contribution.state_new as State
                    ).map(change => (
                      <div key={change.key}>
                        {JSON.stringify(change.old)} <ArrowRight className="size-icon" />{' '}
                        {JSON.stringify(change.new)}
                      </div>
                    ))}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
