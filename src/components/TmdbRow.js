import Blits from '@lightningjs/blits'

import Hero from './Hero.js'
import Poster from './Poster.js'
import PosterTitle from './PosterTitle.js'

export default Blits.Component('TmdbRow', {
  components: {
    Hero,
    Poster,
    PosterTitle,
  },
  template: `
    <Element>
      <Element :x.transition="{value: $x, duration: 300, easing: 'ease-in-out'}" y="80">
        <Component
          is="$type"
          :for="(item, index) in $items"
          index="$index"
          item="$item"
          ref="poster"
          key="$item.identifier"
          :x="$index * $sizeX"
        />
      </Element>
    </Element>
  `,
  props: {
    title: '',
    type: '',
    items: [],
    sizeX: 0,
  },
  state() {
    return {
      focused: 0,
      offset: 0,
    }
  },
  hooks: {
    focus() {
      this.$trigger('focused')
    },
  },
  computed: {
    x() {
      return 150 - Math.min(this.focused, this.items.length - 1720 / this.sizeX) * this.sizeX
    },
  },
  watch: {
    focused(value) {
      const focusItem = this.$select('poster' + value)
      if (focusItem && focusItem.$focus) {
        focusItem.$focus()
        this.$emit('posterSelect', this.items[value])
      }
    },
  },
  input: {
    left() {
      this.focused = Math.max(this.focused - 1, 0)
    },
    right() {
      this.focused = Math.min(this.focused + 1, this.items.length - 1)
    },
  },
})
