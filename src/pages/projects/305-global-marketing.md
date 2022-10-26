---
pageUrl: https://305gm.com
public: true
password: 305gm
createdAt: 1666207522109
updatedAt: 1666805574491
layout: ../../layouts/project.astro
title: 305 Global Marketing
tags:
  - job
slug: 305-global-marketing
thumbnail: /projects/305-global-marketing_thumbnail.png
---



**305 Global Marketing** is an multi tenant e-commerce platform that allows users to build a fully customizable franchise store from which they can buy and sell products to earn discounts, commissions, and bonuses.

## Core Features
The application's core features were required to be built from the ground up, such as a shopping cart, a checkout process, a payout system, an affiliate system, a multi-tenant architecture, a wallet system, and a member dashboard.

## My Role
As the sole developer, I was able to work on backend and frontend feature implementations, including Authentication and Authorization, Database Schema, API, and UI Component Library development. As the project grew, so did our team. Having a bigger team allowed me to delegate tasks and focus on the backend, where I built and deployed APIs, such as a wallet feature with credit, debit, and transfer functionality. 

![thumbnail](/projects/305-global-marketing_thumbnail.png)
![305 Global Marketing - multi-tenant store](/projects/305-global-marketing_305-global-marketing-multi-tenant-store.png)

![305gm-wallet-profile.png](/projects/305-global-marketing_305-gm-wallet-profile-png.png)

## Tech Stack
I opted for this stack because while we needed high interactiveness in some parts of the application, the majority of it was static data that needed partial revalidation from time to time; Next.js is great for that.

| Job Type           | Stack            | Website                        |
| ------------------ | ---------------- | ------------------------------ |
| Full-time contract | Next.js             | [View site 🔗](https://305gm.com) |
|                    | React            |                                |
|                    | Styled-components |                                |
|                    | Styled-system    |                                |
|                    | Node             |                                |
|                    | Express          |                                |
|                    | tRPC|                                |
|                    | AWS              |                                |
|                    | Prisma|                                |
|                    | MongoDB|                                |

## Purpose and Goal

This e-commerce application was my first job after attending Fullstack Academy. The reason I accepted this challenge was its high level of complexity. Being able to put my knowledge to the test and succeed was an incredible achievement.

The main goal of this application was to build an experience that would feel like standard e-commerce. The client wanted to allow users to purchase membership packages that provide the following privileges: product discounts of up to 50%, a customizable store allocated to a subdomain based on their username, commission distribution for sales originating on the said store, a payout system so users could retrieve their generated earnings.

![305gm-profile-shop-orders.png](/projects/305-global-marketing_305-gm-profile-shop-orders-png.png)
## Spotlight
I'm very proud of the member tree, which vividly displays how members are connected. This feature was challenging to implement, starting with the server, where we had to fetch the tree's head plus children and recursively attach each other. Our most significant hurdle happened in the front end. The tree did not render in Safari, and most of our users used this browser; this forced me to opt for a data visualization library called D3.js, which was extremely difficult to handle in a Next.js server environment. After learning about Next.js dynamic imports, I could take all of this interaction client side and successfully render the tree without issues.

![305-profile-tree.png](/projects/305-global-marketing_305-profile-tree-png.png)

Also, I wanted to mention a shipping calculator feature built with the USPS API. The client wanted to calculate shipping costs based on the product's weight, dimensions, and destination address, so I created the shipping calculator API with Shipengine; this allowed me to automate the shipping calculation, label purchases, and provide tracking information.

![305gm-checkout-address-gen.png](/projects/305-global-marketing_305-gm-checkout-address-gen-png.png)

## Current Status

The design and infrastructure of this application primarily aim to help non-tech individuals start an e-commerce business online. This approach has been very successful; currently, over 5 thousand users own a 305 Global Marketing franchise store.

## Lessons Learned

This project helped me solidify the knowledge I gained at Fullstack Academy. I learned how to host a backend on AWS EC2 with many production-ready APIs, such as file uploading and email server, and an interactive front end with Next.js and React. I also learned how to work with a team and communicate with clients remotely.