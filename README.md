### [actualpoints.com](https://www.actualpoints.com/)

My private markdown blog where users can apply to write for the site and once approved can sign in, edit their profile and post articles. I launched the site in July and got approved for Adsense in August. I took an Agile approach hence only the essential features are present at this point in time. 

I haven't been publishing articles recently because I've been focused on developing a component library. This library will have its own blog where I plan to share my insights on design, UX, and frontend development. This will not only enhance my resume but also improve the site's SEO.

**Please send me an email so I can add you as a writer for you to check out the CMS.**



* Next.js
    * ISR
        * Every page seen by the public on the site is updated every 12 hours to save on reads
        * There used to be a real time tag search but it was safer (considering I used Firebase), more cost effective and faster to statically generate each tags page
    * Realtime
        * The CMS is generated in real time because writers need the current state of their profile and articles
    * API
        * I figured out late that Firebase has no rate limiting or DDOS protection and so I moved all the public calls into the Next API and applied rate limiting and IP checking there
* React
    * Full mobile support
    * Real time input validation when choosing a username or a new article name
    * YUP form validation when editing your profile or articles
    * Toast for success, error, info etc
    * Tool for uploading multiple images, auto compressing them, adding their alt texts and captions
    * Modals for confirmation, help etc
    * Tag search with suggestions in article edit
    * Image shimmer for images that are loading
    * Loading in more articles since only the first 10 are displayed on each page
    * Context
        * For auth
        * I’m not a fan of 100vh so I have hooks and context for a window.outerheight calculation that doesn’t jump every time the inner height changes on mobile browsers
* Firebase
    * Firestore
        * Article
            * Article data + snippet of writers info
            * Stores category, tags and username so they can be found in their respective profile(future)/category/tag pages
            * Key: article name + writers username (for uniqueness) slug
        * Category
            * Key: name slug
            * Stores name and image
        * Email
            * Verified writers emails added by me
        * Slide
            * Slide images, text, button text, link etc
        * Tag
            * Key: tag name slug
            * Count of how many articles use the tag
        * User and Username
            * Writers public info etc
    * Cloud functions (Firebases Lambda alternative)
        * On user update
            * Update user info snippet on each of their articles
        * On sign up
            * Checks Email table for email and updates permissions accordingly
        * Add/remove in Email table
            * Sets permissions of existing users accordingly
        * Every 12 hours
            * Counts the amount of times a tag appears in each Article and updates Tag accordingly
        * On article publish
            * Creates a Slide with the same image etc
    * Security Rules
        * Users can only edit their own info and articles
        * Users can’t do anything if their email isn’t in Email
        * Server side form validation with the same spec as the front end validation
        * Users can only add images to their own folder
* Vercel hosting
* SEO
    * Starting with the gardening niche first since you need less domain authority than for something like the medical niche
    * Will branch out to other niches in the future but branching too early doesn’t seem beneficial if we still need more authority in the gardening niche
    * We already rank on the front page of Google for some long tail keywords
* Future changes
    * Features
        * Waiting for the Next js layout update
            * So that I can reuse static props across the site to make significant read savings
        * Change carousel to one with smaller bundle size
        * List of writers and their profiles
        * Better tag styling when editing articles
        * Image modal
        * Amazon product components
        * Articles go through review process before they’re allowed to be published
        * Put the CMS calls into the API to reduce bundle size and to add security etc
        * Back buttons in the CMS
        * Loading skeletons
        * Dark mode
        * Toast, info color to black and border radius to 0
        * Category hover animations
        * Bot to post on socials as soon as article is approved
        * Apple sign in
        * Better field naming in database tables
    * Bugs
        * Auto ads misbehaving
        * Cookie consent reappearing
        * MUI hydration errors
* What I would do differently
    * Typescript
        * I wanted to get more familiar with JS first but that happened very early on in the project and so I missed out on all the benefits of TS
    * Not Firebase
        * The supposed benefit of user created queries on the frontend have no rate limiting or DDOS protection so I might as well have gone with MySQL calls in the API
        * I could’ve essentially done everything cheaper and better with a MySQL db in Railway or Planetscale
    * Not MUI
        * Bloats every pages bundle size
        * The way you write it takes much longer than just writing it in Tailwind etc
        * Causes many hydration errors with Next.js
        * Bad integration with Next js and Vercel
