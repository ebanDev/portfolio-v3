import fs from 'node:fs'
import path from 'node:path'

const ROOT_DIR = process.cwd()
const CONTENT_DIR = path.join(ROOT_DIR, 'content')
const ARTICLES_DIR = path.join(CONTENT_DIR, 'articles')

export const PUBLIC_DIR = path.join(ROOT_DIR, 'public')

const stripQuotes = (value) => {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1)
  }

  return value
}

const parseFrontmatter = (rawContent) => {
  const match = rawContent.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)

  if (!match) {
    return { data: {}, body: rawContent }
  }

  const [, frontmatter, body] = match
  const data = {}

  for (const line of frontmatter.split('\n')) {
    const separatorIndex = line.indexOf(':')

    if (separatorIndex === -1) {
      continue
    }

    const key = line.slice(0, separatorIndex).trim()
    const value = stripQuotes(line.slice(separatorIndex + 1).trim())

    data[key] = value
  }

  return { data, body }
}

const parseProjectCards = (rawBlock) => {
  const cards = []
  let currentCard = null

  for (const line of rawBlock.split('\n')) {
    const trimmed = line.trim()

    if (!trimmed || trimmed === 'cards:') {
      continue
    }

    if (trimmed.startsWith('- ')) {
      if (currentCard) {
        cards.push(currentCard)
      }

      currentCard = {}
      const field = trimmed.slice(2)
      const separatorIndex = field.indexOf(':')

      if (separatorIndex !== -1) {
        const key = field.slice(0, separatorIndex).trim()
        const value = stripQuotes(field.slice(separatorIndex + 1).trim())
        currentCard[key] = value
      }

      continue
    }

    if (!currentCard) {
      continue
    }

    const separatorIndex = trimmed.indexOf(':')

    if (separatorIndex === -1) {
      continue
    }

    const key = trimmed.slice(0, separatorIndex).trim()
    const value = stripQuotes(trimmed.slice(separatorIndex + 1).trim())
    currentCard[key] = value
  }

  if (currentCard) {
    cards.push(currentCard)
  }

  return cards.filter((card) => card.title && card.link)
}

const parseDate = (date) => {
  const timestamp = Date.parse(date || '')
  return Number.isNaN(timestamp) ? 0 : timestamp
}

export const loadHomePage = () => {
  const filePath = path.join(CONTENT_DIR, 'index.md')
  const rawContent = fs.readFileSync(filePath, 'utf8')
  const { data, body } = parseFrontmatter(rawContent)

  const withoutAvatarStack = body.replace(/::avatar-stack[\s\S]*?::\s*/m, '').trim()
  const [introMarkdown = '', afterProjects = ''] = withoutAvatarStack.split(/^## Projects\s*$/m)
  const [projectsSection = ''] = afterProjects.split(/^## Articles\s*$/m)
  const projectBlock = projectsSection.match(/::card-list\s*\n---\n([\s\S]*?)\n---\n::/m)?.[1] || ''

  return {
    title: data.title || 'Home',
    description: data.description || '',
    introMarkdown: introMarkdown.trim(),
    projects: parseProjectCards(projectBlock),
  }
}

export const loadArticles = () => {
  return fs.readdirSync(ARTICLES_DIR)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const filePath = path.join(ARTICLES_DIR, fileName)
      const rawContent = fs.readFileSync(filePath, 'utf8')
      const { data, body } = parseFrontmatter(rawContent)
      const slug = data.slug || fileName.replace(/\.md$/, '')

      return {
        ...data,
        body: body.trim(),
        slug,
        path: `/articles/${slug}`,
      }
    })
    .filter((article) => article.published !== 'No')
    .sort((left, right) => parseDate(right.date) - parseDate(left.date))
}

export const findArticleByPath = (requestPath) => {
  return loadArticles().find((article) => article.path === requestPath) || null
}
