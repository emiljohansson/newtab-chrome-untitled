import jss from 'jss'

const spaceDefault = `1rem`

export const space = {
  xs: `0.25rem`,
  s: `0.5rem`,
  m: `1rem`,
  l: `2rem`,
  xl: `4rem`
}

// const insetDefault    = `${spaceDefault} ${spaceDefault} ${spaceDefault} ${spaceDefault}`

export const inset = {
  xs: `${space.xs}`,
  s: `${space.s}`,
  m: `${space.m}`,
  l: `${space.l}`,
  xl: `${space.xl}`
}

// $space.inset-squish-s   = $space.xs $space.s
// $space.inset-squish-m   = $space.s $space.m
// $space.inset-squish-l   = $space.s $space.l
// $space.inset-squish-xl  = $space.m $space.xl

// const stackDefault = `0 0 ${spaceDefault} 0`

export const stack = {
  xs: `0 0 ${space.xs} 0`,
  s: `0 0 ${space.s} 0`,
  m: `0 0 ${space.m} 0`,
  l: `0 0 ${space.l} 0`,
  xl: `0 0 ${space.xl} 0`
}

export const { classes } = jss.createStyleSheet({
  px_xs: {
    paddingLeft: space.xs,
    paddingRight: space.xs
  },
  px_m: {
    paddingLeft: space.m,
    paddingRight: space.m
  }
}).attach()
