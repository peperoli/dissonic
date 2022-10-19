import PageWrapper from "../../components/PageWrapper"
import supabase from "../../utils/supabase"
import { PlusIcon } from "@heroicons/react/24/solid"
import Table from "../../components/Table"
import TableRow from "../../components/TableRow"
import AddLocationForm from "../../components/AddLocationForm"
import Modal from "../../components/Modal"
import Button from "../../components/Button"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Search from "../../components/Search"

export default function PageLocations({ initialLocations }) {
  const [locations, setLocations] = useState(initialLocations)
  const [isOpen, setIsOpen] = useState(false)

  const notifyInsert = () => toast.success("Location erfolgreich hinzugefügt!")

  useEffect(() => {
    const subscriptionInsert = supabase.from('locations').on('INSERT', payload => {
      setLocations([
        ...locations,
        payload.new
      ])
      setIsOpen(false)
      notifyInsert()
    }).subscribe()

    return () => supabase.removeSubscription(subscriptionInsert)
  }, [locations])

  const [query, setQuery] = useState('')

	const regExp = new RegExp(query, 'i')
	const filteredLocations = locations.filter(item => item.name.match(regExp))
  return (
    <>
      <PageWrapper>
        <main className="p-8 w-full">
          <div className="flex justify-between mb-6">
            <h1 className="mb-0">
              Locations
            </h1>
            <button onClick={() => setIsOpen(true)} className="btn btn-primary">
              <PlusIcon className="h-text" />
              Location hinzufügen
            </button>
          </div>
          <Table>
            <Search name="searchLocations" query={query} setQuery={setQuery} />
            {filteredLocations && filteredLocations.map(location => (
              <TableRow key={location.id} href={''}>
                <div>
                  {location.name}
                </div>
                <div className="text-slate-300">
                  {location.city}
                </div>
              </TableRow>
            ))}
          </Table>
        </main>
      </PageWrapper>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <AddLocationForm locations={locations} cancelButton={<Button onClick={() => setIsOpen(false)} label="Abbrechen" />} />
      </Modal>
    </>
  )
}

export async function getServerSideProps({ params }) {
  const { data: locations, error } = await supabase
    .from('locations')
    .select('*')
    .order('name')

  if (error) {
    console.error(error)
  }

  return {
    props: {
      initialLocations: locations,
    }
  }
}