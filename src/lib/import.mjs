import './env.mjs'
import { LiveExporter, toKebabCase } from '@inkdropapp/live-export'

const { INKDROP_USERNAME, INKDROP_PASSWORD, INKDROP_PORT, INKDROP_BOOKID } =
  process.env

const liveExport = new LiveExporter({
  username: INKDROP_USERNAME,
  password: INKDROP_PASSWORD,
  port: Number(INKDROP_PORT)
})

// const basePath = `./pages/project`
// const publicPath = `../public/project`
const basePath = `./src/pages/posts`
const publicPath = `./public/posts`

await liveExport.start({
  live: true,
  bookId: INKDROP_BOOKID,
  // preProcess lets you modify the note before it is exported
  preProcessNote: ({ note, frontmatter, tags }) => {
    frontmatter.layout = '../layouts/project.astro'
    frontmatter.title = note.title
    frontmatter.description = note.description
    frontmatter.createdAt = note.createdAt
    frontmatter.updatedAt = note.updatedAt
    frontmatter.tags = tags.map(t => t.name)
    if (!frontmatter.slug) {
      frontmatter.slug = toKebabCase(note.title)
    }
  },
  pathForNote: ({ frontmatter }) => {
    if (frontmatter.public) {
      return `${basePath}/${frontmatter.slug}.md`
    } else return false
  },
  pathForFile: ({ mdastNode, frontmatter, extension }) => {
    if (mdastNode.alt) {
      const fn = `${frontmatter.slug}_${toKebabCase(mdastNode.alt)}${extension}`
      const res = {
        filePath: `${publicPath}/${fn}`,
        url: `/project/${fn}`
      }
      if (mdastNode.alt === thumbnail) {
        frontmatter.thumbnail = res.url
      }
      return res
    } else return false
  },
  postProcessNote: ({ md }) => {
    // remove the thumbnail from the note body
    const md2 = md.replace(/\!\[thumbnail\]\(.*\)\n/, '')
    return md2
  }
})
// await liveExport.start({
//   live: true,
//   bookId: INKDROP_BOOKID,
//   preProcessNote: ({ note, frontmatter, tags }) => {
//     console.log('running preProcessNote')
//     frontmatter.layout = '../layouts/project.astro'
//     frontmatter.title = note.title
//     frontmatter.createdAt = note.createdAt
//     frontmatter.updatedAt = note.updatedAt
//     frontmatter.tags = tags.map(t => t.name)
//     // frontmatter.heroImage = '/astrojs.jpg'
//     if (!frontmatter.slug) frontmatter.slug = toKebabCase(note.title)
//   },
//   pathForNote: ({ frontmatter }) => {
//     if (frontmatter.public) {
//       return `${basePath}/${frontmatter.slug}.md`
//     } else return false
//   },
//   urlForNote: ({ note, frontmatter }) => {
//     if (frontmatter.public) {
//       if (!frontmatter.slug) frontmatter.slug = toKebabCase(note.title)
//       return `/project/${frontmatter.slug}`
//     } else return false
//   },
//   pathForFile: ({ mdastNode, /* note, file, */ extension, frontmatter }) => {
//     if (mdastNode.alt) {
//       const fn = `${frontmatter.slug}_${toKebabCase(mdastNode.alt)}${extension}`
//       const res = {
//         filePath: `${publicPath}/${fn}`,
//         url: `/project/${fn}`
//       }
//       if (mdastNode.alt === 'thumbnail') {
//         frontmatter.heroImage = res.url
//       }
//       return res
//     } else return false
//   },
//   postProcessNote: ({ md }) => {
//     // Remove the thumbnail from the note body
//     const md2 = md.replace(/\!\[thumbnail\]\(.*\)\n/, '')
//     return md2
//   }
// })
