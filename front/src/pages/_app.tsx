import type { AppProps } from 'next/app'
import Head from 'next/head'

const Home = ({ Component, pageProps }: AppProps) => {
  return <>
    <Head>
      <title>default title here</title>

    <meta charSet="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href={"/logo192.png"} />
    <link rel="manifest" href="/manifest.json" />

    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
      integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
      crossOrigin="anonymous"
    />
    </Head>
    <Component {...pageProps} />
  </>
}

export default Home;