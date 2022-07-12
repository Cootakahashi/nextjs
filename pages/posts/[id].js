import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { getALlPostIds, getAllPostsIds, getPostData } from '../../lib/posts'

// Postコンポーネントを作る
export default function Post({ post }) {
  const router = useRouter()
  // post objがない場合以下をreturnする
  if (router.isFallback || !post) {
    return <div>Loading...</div>
  }
  return (
    <Layout title={post.title}>
      <p className="m-4">
        {'ID : '}
        {post.id}
      </p>
      <p className="mb-4 text-xl font-bold">{post.title}</p>
      <p className="mb-12">{post.created_at}</p>
      <p className="px-10">{post.content}</p>
      <Link href="/blog-page">
        <div className="flex cursor-pointer mt-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
            />
          </svg>
          <span>Back to blog-page</span>
        </div>
      </Link>
    </Layout>
  )
}

export async function getStaticPaths() {
    const paths = await getALlPostIds();
    return {
        paths,
        fallback: true,
    };
}
export async function getStaticProps({ params }) {
    const { post: post } = await getPostData(params.id);
    return {
        props: {
            post,
        },
        revalidate: 3,
    };
}
