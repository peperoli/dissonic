import { ConcertPage } from '../../../components/concerts/ConcertPage'
import React from 'react'

export const revalidate = 60

export default async function Page({ params }: { params: { id: string } }) {
  return (
    <ConcertPage concertId={params.id} />
  )
}
