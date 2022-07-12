export async function getAllPostsData() {
    // fetchを使ってendpointにデータを取りに行く
    const res = await fetch(
        new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-post`)
    );
    const posts = await res.json();
    // created_atを作ってるのでそれで大きい順にsortする
    // sord後のpostsを格納しreturn
    const filteredPosts = posts.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    return filteredPosts;
}

// idの一覧を取得する関数
export async function getALlPostIds() {
    const res = await fetch(
        new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-post/`)
    );
    const posts = await res.json();
    return posts.map((post) => {
        return {
            params: {
                id: String(post.id),
            },
        };
    });
}

// 指定されたIDに基づいて特定のblog記事のデータを取得
export async function getPostData(id) {
    const res = await fetch(
        new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/detail-post/${id}/`)
    );
    const post = await res.json();
    return {
        post,
    };
}