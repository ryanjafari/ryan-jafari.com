---
date: '2024-01-04'
title: 'A Couple of Years With Github Codespaces'
description: ''
layout: EntryLayout
---

Ah the remote development environment, it's been sort of a holy grail for me since I was introduced to the idea, around the time that nitrous.io was around. For one reason or another, it never quite worked out: it was either slow, buggy, hard to access, expensive, whatever. I'd pursue it in bursts, giving up on it periodically, only to renew the chase some years later.

Enter GitHub Codespaces in 2020, the code hosting juggernaut's answer to the problem. If anyone could swing it, it had to be Microsoft, right? I took the plunge, and even though they delivered, after two years, I'm out. Here's why:

* **Speed:** with both network latency and shared resources going against you, it's never going to be close to as fast as running on the metal in front of you. One of the reason it matters especially is in workflows that are heavy on the edit-save-refresh cycle, which is basically most workflows? Next.js is supposed to be fast-compiling, and it mostly is, but it's hamstrung when it lives on a remote machine because of the network gap between. It takes a bit for the response with the refresh to get to you.
* **Blackouts:** periodic dropouts of the connection. I'm running on FiOS 1 gig, to my knowledge one of the better networks in the country. Still, occasionally you'd get shut out for no reason. And sometimes it's not easy to get back in.
* **Errors:** especially when you start to go custom with Docker and Docker Compose (which is going to be in most projects that around for long enough) your container build will error out and it can be nigh-impossible to track down the reason why.
* **Hardware-Specific Workflows:** now this isn't a problem specific to Codespaces, but I include it here because it's the reason why I started to explore going back to local development. In certain workflows where you'd like to take advantage of the GPU sitting in front of you, with remote development there's no way I know of to forward your GPU to the remote environment (duh?). Actually, I found out that even if I went to local development with Docker, being I'm on an M3 Mac, I was still out of luck (the support from host to container is either NVIDIA or AMD only; no Metal).
* **Learning Curve:** I'm not going to be able to recall specifics, but I had a hell of time setting up and getting used to Codespaces, with the caveat being that I was rolling a custom Docker image. Of course that could've been the problem: even when you're good at Docker it can be a hell of a job.

At the end of the day, despite these gotchas, I'd still say my experience with GH Codespaces was the best I've ever had with a remote development environment. It just wasn't for me anymore, right now. Putting a premium on speed of iteration and leveraging fancy new hardware for ML workflows puts me off the Codespaces bandwagon for now.


