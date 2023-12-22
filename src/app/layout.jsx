import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'

import '@/styles/tailwind.css'

export const metadata = {
  title: {
    template: '%s - Ryan Jafari',
    default:
      'Ryan Jafari - Software engineer, entrepreneur, educator, early adopter, and emergent-tech enthusiast',
  },
  description:
    "I'm Ryan, a software engineer and entrepreneur based in New York. I thrive on crafting products driven by robust software, using bleeding-edge technology on top of sound engineering practices. At the same time, I enjoy empowering my colleagues to carve their own unique paths in the tech landscape.",
  alternates: {
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed.xml`,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html
      className="h-full antialiased"
      lang="en"
      suppressHydrationWarning
    >
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        <Providers>
          <div className="flex w-full">
            <Layout>{children}</Layout>
          </div>
        </Providers>
      </body>
    </html>
  )
}
