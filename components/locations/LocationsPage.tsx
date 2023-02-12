"use client"

import { PageWrapper } from "../layout/PageWrapper"
import { PlusIcon } from "@heroicons/react/20/solid"
import { Table } from "../Table"
import { TableRow } from "../TableRow"
import { AddLocationForm } from "./AddLocationForm"
import React, { FC, useState } from "react"
import { Search } from "../Search"
import { Button } from "../Button"
import useMediaQuery from "../../hooks/useMediaQuery"
import { Location } from "../../types/types"

interface LocationsPageProps {
  initialLocations: Location[]
}

export const LocationsPage: FC<LocationsPageProps> = ({ initialLocations }) => {
  const [locations, setLocations] = useState(initialLocations)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')

  const regExp = new RegExp(query, 'i')
  const filteredLocations = locations.filter(item => item.name.match(regExp))
  const filteredLength = filteredLocations.length !== locations.length ? filteredLocations.length : null
  const isDesktop = useMediaQuery('(min-width: 768px)')
  return (
    <>
      <PageWrapper>
        <main className="p-4 md:p-8 w-full">
          {!isDesktop && (
            <div className="fixed bottom-0 right-0 m-4">
              <Button
                onClick={() => setIsOpen(true)}
                label="Location hinzufügen"
                style="primary"
                contentType="icon"
                icon={<PlusIcon className="h-icon" />}
              />
            </div>
          )}
          <div className="sr-only md:not-sr-only flex justify-between md:mb-6">
            <h1 className="mb-0">Locations</h1>
            {isDesktop && (
              <Button
                onClick={() => setIsOpen(true)}
                label="Location hinzufügen"
                style="primary"
                icon={<PlusIcon className="h-icon" />}
              />
            )}
          </div>
          <Table>
            <Search
              name="searchLocations"
              placeholder="Locations"
              query={query}
              setQuery={setQuery}
            />
            <div className="my-4 text-sm text-slate-300">
              {typeof filteredLength === 'number' && <span>{filteredLength}&nbsp;von&nbsp;</span>}
              {locations.length}&nbsp;Einträge
            </div>
            {typeof filteredLength === 'number' && filteredLength === 0 ? (
              <div>Blyat! Keine Einträge gefunden.</div>
            ) : (
              filteredLocations &&
              filteredLocations.map(location => (
                <TableRow key={location.id} href={''}>
                  <div className="md:flex items-center gap-4 w-full">
                    <div className="md:w-1/2 font-bold">{location.name}</div>
                    <div className="md:w-1/2 text-slate-300">{location.city}</div>
                  </div>
                </TableRow>
              ))
            )}
          </Table>
        </main>
      </PageWrapper>
      <AddLocationForm
        locations={locations}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setLocations={setLocations}
      />
    </>
  )
}