// mdx-components.jsx

import Image from 'next/image'
import React from 'react'

const generateSlug = (string) => {
  let str = string.replace(/^\s+|\s+$/g, '')
  str = str.toLowerCase()
  str = str
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  return str
}

const generateComponent = (tag, { node, ...props }) =>
  React.createElement(tag, {
    id: generateSlug(React.Children.toArray(props.children).join('')),
    ...props,
  })

// Default or global MDX components you might want to use across your app:
const defaultComponents = {
  // TODO: h1: (props) => generateComponent('h1', props),
  h2: (props) => generateComponent('h2', props),
  h3: (props) => generateComponent('h3', props),
  h4: (props) => generateComponent('h4', props),
  h5: (props) => generateComponent('h5', props),
  h6: (props) => generateComponent('h6', props),
  Image: (props) => (
    <Image
      {...props}
      alt={props.alt}
    />
  ),
}

export function useMDXComponents(customComponents = {}) {
  return {
    ...defaultComponents,
    // This will allow you to override default components when calling the hook:
    ...customComponents,
  }
}
