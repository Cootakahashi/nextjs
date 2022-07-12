import Layout from '../components/Layout'
import Link from "next/link";
import { getAllPostsData } from "../lib/posts";
import Post from "../components/Post";
// 下で呼び出したブログ一覧を渡して自動でHTMLに埋め込まれ静的HTMLファイルを事前に生成

//受け取った一覧をmapで展開してPostに渡す
export default function BlogPage({ filteredPosts }) {
    return (
  <Layout title="Blog page">
      <ul>
          {filteredPosts &&
           filteredPosts.map((post) => <Post key={post.id} post={post} />)}
      </ul>
      <Link href="/main-page">
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
        d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"
      />
    </svg>
    <span>Back to main page</span>
    </div>
    </Link>
  </Layout>
  );
}

// build時に呼び出されてサーバーサイドで実行される
// 関数ないでgetAllPostsData呼び出しrestapiからブログ投稿一覧取得
// propsの形でreturnする
export async function getStaticProps() {
    const filteredPosts = await getAllPostsData();
    return {
        props: { filteredPosts },
        revalidate: 3,
    };
}