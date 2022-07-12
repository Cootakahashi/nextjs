import { useState } from 'react'; 
import { useRouter } from 'next/router';
import Cookie from 'universal-cookie';
import Image from 'next/image'
// JWTトークンをcookieに格納
const cookie = new Cookie()

export default function Auth() {
  // 関数の中からページ遷移したい時にrouterを使う
  const router = useRouter();
  // localステートを定義
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // loginモードとregisterモードを示す為のisLogin
  const [isLogin, setIsLogin] = useState(true);

  // Its function for login.
  const login = async () => {
    // fetchを使ってapiからJWTのトークンを取得
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/auth/jwt/create/`,
        {
          // POSTでusernameとpasswordを渡すことでaccessトークンを獲得
          method: "POST",
          body: JSON.stringify({ username: username, password: password }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.status === 400) {
          throw "authentication failed";
        } else if (res.ok) {
          // res objをjsonに変更してreturn
          return res.json();
        }
      })
      .then((data) => {
        // アクセストークンをcookieにsetする
        const options = { path: "/" };
        // optionsで上のroot path以下でcookieが有効になる
        cookie.set("access_token", data.access, options);
      });
      //成功したらrouterpushでmain-pageに遷移
      router.push("/main-page");
  } catch (err) {
      alert(err);
    }
  };

  //submitボタンが押された時onSubmitで動く関数
  const authUser = async (e) => {
    //自動で行われるreloadを防ぐ
    e.preventDefault();
    if (isLogin) {
      login();
    } else {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/register/`, {
          method: "POST",
          body: JSON.stringify({ username: username, password: password }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => {
          //fetchの内容が400で失敗した場合例外をthrowで投げる
          if (res.status === 400) {
            throw "authentication failed";
          }
        });
        // 成功した場合
        login();
      } catch (err) {
        alert(err);
      }
    }
  };


  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          {/* <Image
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="Workflow"
            width={100}
            height={100}
          /> */}
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 text-white">
            {isLogin ? "Login" : "Sign up"}
          </h2>

        </div>
        <form className="mt-8 space-y-6" onSubmit={authUser}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                //入力された内容で更新するsetUsername 更新用関数
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-sm">
              <span 
              // onClickで現在のisLoginのstateを反転させる
              onClick={() => setIsLogin(!isLogin)} 
              className="cursor-pointer font-medium text-white hover:text-indigo-500">
                change mode ?
              </span>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg> 
              </span>
              {isLogin ? "Login with JWT": "Create new user"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
