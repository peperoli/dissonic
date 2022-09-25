import { useEffect } from "react"
import supabase from "../utils/supabase"
import Link from "next/link"

export default function PostPage({ post }) {
  useEffect(() => {
    const subscription = supabase.from('comments').on('INSERT', (payload) => {
      console.log(payload)
    }).subscribe()

    return () => supabase.removeSubscription(subscription)
  }, [])
  return (
    <main className="p-8">
      <Link href="/">
        <a className="underline text-blue-700">Go Back</a>
      </Link>
      <h1>{post.headline}</h1>
      <p>{post.content}</p>
      {post.comments && (
        post.comments.map(comment => (
          <div key={comment.id}>
            <strong className="font-bold">User {comment.user_id}</strong>
            <p>{comment.content}</p>
          </div>
        ))
      )}
      <pre>{JSON.stringify(post, null, 2)}</pre>
    </main>
  )
}

export async function getServerSideProps( { params }) {
  const { data: post, error } = await supabase
  .from('posts')
  .select('*, comments(*)')
  .eq('id', params.id)
  .single()
  
  if (error) {
    throw new Error(error.message)
  }

  return {
    props: {
      post,
    }
  }
}