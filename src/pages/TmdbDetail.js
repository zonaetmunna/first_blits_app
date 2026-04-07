import Blits from '@lightningjs/blits'

import Background from '../components/Background'
import { fetchMovieDetails } from '../api/providers/'

export default Blits.Component('TmdbDetail', {
  components: {
    Background,
  },
  props: {
    id: null,
  },
  template: `
    <Element w="1920" h="1080" color="black">
      <Background :bgImg="$src" />
      <Element>
        <Element x="140" y="120">
          <Text :content="$title" font="raleway" size="90" maxwidth="1300" maxlines="2" />
          <Text :content="$tagline" size="36" color="#ccc" y="120" maxwidth="1300" maxlines="2" />
          <Text :content="$overview" size="30" color="#ddd" y="180" maxwidth="1300" lineheight="44" maxlines="6" />
          <Element y="520">
            <Text content="Release:" size="28" color="#fff" />
            <Text :content="$releaseDate" size="28" color="#fff" x="220" y="0" />
            <Text content="Genres:" size="28" color="#fff" y="50" />
            <Text :content="$genres" size="28" color="#fff" x="220" y="50" maxwidth="1200" />
          </Element>
          <Element y="720">
            <Text content="Movie Run" size="40" color="#fff" />
            <Element
              w="360"
              h="90"
              x="0"
              y="70"
              rounded="20"
              color="#111827"
              :scale.transition="{value: $runScale, duration: 200}"
              :alpha.transition="{value: $runAlpha, duration: 200}"
            >
              <Text content="Play Movie" size="32" color="#fff" mount="{x:0.5, y:0.5}" x="180" y="45" />
            </Element>
          </Element>
        </Element>
      </Element>
    </Element>
  `,
  state() {
    return {
      src: '',
      title: '',
      overview: '',
      tagline: '',
      genres: '',
      releaseDate: '',
      runScale: 1,
      runAlpha: 1,
    }
  },
  hooks: {
    async init() {
      const movieId = this.id || this.$router?.currentRoute?.params?.id
      if (movieId) {
        await this.loadMovie(movieId)
      }
    },
    ready() {
      this.$focus()
    },
    focus() {
      this.runScale = 1.05
      this.runAlpha = 1
    },
    unfocus() {
      this.runScale = 1
      this.runAlpha = 0.8
    },
  },
  methods: {
    async loadMovie(movieId) {
      const item = await fetchMovieDetails(movieId)
      this.src = item.background
      this.title = item.title
      this.overview = item.overview
      this.tagline = item.tagline || ''
      this.genres = item.genres || ''
      this.releaseDate = item.release_date || ''
    },
  },
  input: {
    enter() {
      const movieId = this.id || this.$router?.currentRoute?.params?.id
      this.$router?.to(`/tmdb/${movieId}/play`)
      return true
    },
  },
})
