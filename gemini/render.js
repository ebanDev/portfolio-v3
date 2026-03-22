import { convertMarkdownToGemtext } from './markdown.js'

const FOOTER_LINKS = [
  { label: 'GitHub', url: 'https://github.com/ebanDev' },
  { label: 'Email', url: 'mailto:rami@eban.eu.org' },
  {
    label: 'GPG key',
    url: 'https://keys.openpgp.org/vks/v1/by-fingerprint/60FE4D8C912EFDC5E37AD02EE56015D56B08FDBC',
  },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/eban-rami' },
]

const joinSections = (...sections) => {
  return sections
    .filter(Boolean)
    .join('\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const renderFooter = () => {
  return [
    '## Links',
    '',
    ...FOOTER_LINKS.map((link) => `=> ${link.url} ${link.label}`),
  ].join('\n')
}

const renderProjectList = (projects) => {
  return [
    '## Projects',
    '',
    ...projects.map((project) => `=> ${project.link} ${project.title} - ${project.description}`),
  ].join('\n')
}

const renderArticleLinks = (articles) => {
  return [
    '## Articles',
    '',
    '=> /articles Browse all articles',
    '',
    ...articles.map((article) => `=> ${article.path} ${article.title} (${article.date})`),
  ].join('\n')
}

export const renderHomePage = (homePage, articles) => {
  const intro = convertMarkdownToGemtext(homePage.introMarkdown)

  return joinSections(
    `# ${homePage.title}`,
    intro,
    renderProjectList(homePage.projects),
    renderArticleLinks(articles),
    renderFooter(),
  )
}

export const renderArticlesPage = (articles) => {
  return joinSections(
    [
      '=> / Back to home',
      '',
      '# Articles',
      '',
      ...articles.map((article) => `=> ${article.path} ${article.title} (${article.date})`),
    ].join('\n'),
    renderFooter(),
  )
}

export const renderArticlePage = (article) => {
  const metaLines = [
    '=> / Back to home',
    '=> /articles All articles',
    '',
    `# ${article.title}`,
    '',
    article.date,
  ]

  if (article.initialPublisher && article.initialLink) {
    metaLines.push(`Originally published by ${article.initialPublisher}.`)
    metaLines.push(`=> ${article.initialLink} View the original article`)
  }

  if (article.cover) {
    const label = article.coverDescription ? `Cover: ${article.coverDescription}` : 'View cover image'
    metaLines.push(`=> ${article.cover} ${label}`)
  }

  return joinSections(
    metaLines.join('\n'),
    convertMarkdownToGemtext(article.body),
    renderFooter(),
  )
}
