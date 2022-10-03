import Navigation from "../../components/navigation";
import supabase from "../../utils/supabase";
import NewConcertForm from "../../components/NewConcertForm";

export default function AddConcert({ bands }) {
    return (
        <div className="flex">
            <Navigation />
            <main className="w-full max-w-2xl p-8">
                <h1>Neues Konzert hinzufügen</h1>
                <NewConcertForm bands={bands} />
            </main>
        </div>
    )
}

export async function getStaticProps() {
    const { data: bands, error } = await supabase.from('bands').select('*')
  
    if (error) {
      throw new Error(error)
    }
  
    return {
      props: {
        bands,
      }
    }
  }