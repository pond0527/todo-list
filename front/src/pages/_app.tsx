import type { AppProps } from 'next/app'

const Home = ({ Component, pageProps }: AppProps) => {
  return (
    <Component {...pageProps} />
  )
}

export default Home;