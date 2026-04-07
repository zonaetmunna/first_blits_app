import Blits from '@lightningjs/blits'

import Home from './pages/Home.js'
import Tmdb from './pages/Tmdb.js'
import TmdbDetail from './pages/TmdbDetail.js'
import MoviePlayer from './pages/MoviePlayer.js'

export default Blits.Application({
  template: `
    <Element>
      <RouterView />
    </Element>
  `,
  routes: [
    { path: '/', component: Home },
    { path: '/tmdb', component: Tmdb },
    { path: '/tmdb/:id/play', component: MoviePlayer },
    { path: '/tmdb/:id', component: TmdbDetail },
  ],
})
