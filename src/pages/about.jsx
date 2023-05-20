import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from '@/components/SocialIcons'
import portraitImage from '@/images/portrait.jpg'

function SocialLink({ className, href, children, icon: Icon }) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

export default function About() {
  return (
    <>
      <Head>
        <title>About - Ryan Jafari</title>
        <meta
          name="description"
          content="I’m Ryan Jafari. I live in New York City, where I design the future."
        />
      </Head>
      <Container className="mt-16 sm:mt-32">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
          <div className="lg:pl-20">
            <div className="max-w-xs px-2.5 lg:max-w-none">
              <Image
                src={portraitImage}
                alt=""
                sizes="(min-width: 1024px) 32rem, 20rem"
                className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
              />
            </div>
          </div>
          <div className="lg:order-first lg:row-span-2">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-4xl">
              I'm Ryan Jafari, a lifelong tech lover turned polyglot programmer, entrepreneur, educator, and containerization and machine learning enthusiast.
            </h1>
            <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
              <p>My journey in tech started early. I was fortunate enough to grow up with family computers that kept pace with the times: Macs, PCs, and various game consoles. Their inner workings both fascinated and eluded me, which led me to break quite a few things! By the late '90s, the video game review website I built rivaled the likes of IGN. However, it was not until late high school and early college that I truly delved into "real programming," with my earliest code written in assembly, C, and Java.</p>

              <p>After college, I transitioned into the agency world where I worked with Java and C# for household brands. It was around this time that I overheard a conversation about how much my work was worth, and it was a lot more than I was being paid. This realization led me to embrace my entrepreneurial spirit, co-founding a Ruby on Rails consultancy called "Ryan & Carlos" with my cousin. Together, we dedicated our efforts towards building NYC-based startups from the ground up. We achieved considerable success in our work, building startups that not only grossed millions in annual recurring revenue, but also attracted acquisitions from industry titans like Oracle.</p>

              <p>My career pivoted after six years at "Ryan & Carlos" when I began teaching. My students ranged from executives at Fortune 500 companies to career changers at various bootcamps in NYC. I eventually went into management, overseeing admissions, teaching, curriculum, and placement, ultimately landing thousands of my students jobs working in tech as software developers.</p>

              <p>A new chapter in my life began with the birth of my first child and the purchase of my first home. I found an opportunity in the almost hundred-year-old house to become an amateur electrician. I also figured while I was at it, why not go ahead and set up an enterprise-level network infrastructure? Back on the software side, I was experimenting with container orchestration technology, specifically Kubernetes. I began a self-hosting binge, serving highly available apps from my office to the world.</p>

              <p>During each of these periods, I learned a ton, and my fascination with technology continues unabated. I am currently interested in containerization and machine learning, particularly in the role ML can play in container orchestration to improve network efficiency and reduce hosting costs.</p>

              <p>As I continue to learn and innovate, I remain a testament to the fact that a lifelong love for technology will keep you breaking things, taking you places you never thought you could go, and doing things you never thought you could do.</p>
            </div>
          </div>
          <div className="lg:pl-20">
            <ul role="list">
              <SocialLink href="#" icon={TwitterIcon}>
                Follow on Twitter
              </SocialLink>
              <SocialLink href="#" icon={InstagramIcon} className="mt-4">
                Follow on Instagram
              </SocialLink>
              <SocialLink href="#" icon={GitHubIcon} className="mt-4">
                Follow on GitHub
              </SocialLink>
              <SocialLink href="#" icon={LinkedInIcon} className="mt-4">
                Follow on LinkedIn
              </SocialLink>
              <SocialLink
                href="mailto:spencer@planetaria.tech"
                icon={MailIcon}
                className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
              >
                spencer@planetaria.tech
              </SocialLink>
            </ul>
          </div>
        </div>
      </Container>
    </>
  )
}
