const collapseWhitespace = (value) => value.replace(/\s+/g, ' ').trim()

const dedupeLinks = (links) => {
  const seen = new Set()

  return links.filter((link) => {
    const key = `${link.url} ${link.label}`

    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

const stripInlineFormatting = (text) => {
  return text
    .replace(/\\([()[\]#:])/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
}

const normalizeUrl = (url) => {
  const cleanUrl = url.trim().replace(/\\:/g, ':').replace(/\\([()])/g, '$1')

  if (/^(https?:|gemini:|mailto:)/.test(cleanUrl) || cleanUrl.startsWith('/')) {
    return cleanUrl
  }

  if (/^[a-z0-9.-]+\.[a-z]{2,}(?:[/:?#]|$)/i.test(cleanUrl)) {
    return `https://${cleanUrl}`
  }

  return `/${cleanUrl}`
}

const parseStandaloneLink = (text) => {
  if (!text.startsWith('[') || !text.endsWith(')')) {
    return null
  }

  const separatorIndex = text.indexOf('](')

  if (separatorIndex === -1) {
    return null
  }

  return {
    label: text.slice(1, separatorIndex),
    url: text.slice(separatorIndex + 2, -1),
  }
}

const parseStandaloneImage = (text) => {
  if (!text.startsWith('![') || !text.endsWith(')')) {
    return null
  }

  const separatorIndex = text.indexOf('](')

  if (separatorIndex === -1) {
    return null
  }

  return {
    alt: text.slice(2, separatorIndex),
    url: text.slice(separatorIndex + 2, -1),
  }
}

const extractInlineLinks = (text) => {
  const links = []

  let plainText = text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
      const cleanLabel = collapseWhitespace(stripInlineFormatting(label))
      links.push({ url: normalizeUrl(url), label: cleanLabel || normalizeUrl(url) })
      return cleanLabel
    })
    .replace(/<((?:https?:|gemini:|mailto:)[^>]+)>/g, (_, url) => {
      const normalizedUrl = normalizeUrl(url)
      links.push({ url: normalizedUrl, label: normalizedUrl })
      return normalizedUrl
    })

  plainText = stripInlineFormatting(plainText)
  plainText = collapseWhitespace(plainText)

  return {
    text: plainText,
    links: dedupeLinks(links),
  }
}

const flushParagraph = (paragraphLines, output) => {
  if (paragraphLines.length === 0) {
    return
  }

  const paragraph = collapseWhitespace(paragraphLines.join(' '))
  const { text, links } = extractInlineLinks(paragraph)

  if (text) {
    output.push(text)
  }

  for (const link of links) {
    output.push(`=> ${link.url} ${link.label}`)
  }

  output.push('')
  paragraphLines.length = 0
}

const flushTable = (tableLines, output) => {
  if (tableLines.length === 0) {
    return
  }

  output.push('```')
  output.push(...tableLines)
  output.push('```')
  output.push('')
  tableLines.length = 0
}

const mergeMultilineImages = (markdown) => {
  const mergedLines = []
  let pendingImage = null

  for (const rawLine of markdown.split('\n')) {
    const trimmedLine = rawLine.trim()

    if (pendingImage !== null) {
      pendingImage += `\n${trimmedLine}`

      if (parseStandaloneImage(pendingImage)) {
        mergedLines.push(pendingImage)
        pendingImage = null
      }

      continue
    }

    if (trimmedLine.startsWith('![') && !parseStandaloneImage(trimmedLine)) {
      pendingImage = trimmedLine
      continue
    }

    mergedLines.push(rawLine)
  }

  if (pendingImage !== null) {
    mergedLines.push(pendingImage)
  }

  return mergedLines
}

export const convertMarkdownToGemtext = (markdown) => {
  const output = []
  const paragraphLines = []
  const tableLines = []
  let inCodeBlock = false

  for (const line of mergeMultilineImages(markdown.replace(/\r\n/g, '\n'))) {
    const trimmedLine = line.trim()

    if (trimmedLine.startsWith('```')) {
      flushParagraph(paragraphLines, output)
      flushTable(tableLines, output)
      output.push('```')
      inCodeBlock = !inCodeBlock
      continue
    }

    if (inCodeBlock) {
      output.push(line)
      continue
    }

    if (!trimmedLine) {
      flushParagraph(paragraphLines, output)
      flushTable(tableLines, output)
      continue
    }

    if (/^\|.*\|$/.test(trimmedLine)) {
      flushParagraph(paragraphLines, output)
      tableLines.push(trimmedLine)
      continue
    }

    flushTable(tableLines, output)

    const image = parseStandaloneImage(trimmedLine)

    if (image) {
      flushParagraph(paragraphLines, output)
      const altText = collapseWhitespace(stripInlineFormatting(image.alt.replace(/\n+/g, ' ')))
      output.push(`=> ${normalizeUrl(image.url)} ${altText || 'View image'}`)
      output.push('')
      continue
    }

    const heading = trimmedLine.match(/^(#{1,3})\s+(.*)$/)

    if (heading) {
      flushParagraph(paragraphLines, output)
      const [, level, headingText] = heading
      const { text, links } = extractInlineLinks(headingText)
      output.push(`${level} ${text}`)

      for (const link of links) {
        output.push(`=> ${link.url} ${link.label}`)
      }

      output.push('')
      continue
    }

    if (/^>/.test(trimmedLine)) {
      flushParagraph(paragraphLines, output)
      const { text, links } = extractInlineLinks(trimmedLine.replace(/^>\s?/, ''))
      output.push(`> ${text}`)

      for (const link of links) {
        output.push(`=> ${link.url} ${link.label}`)
      }

      continue
    }

    if (/^(- |\d+\. )/.test(trimmedLine)) {
      flushParagraph(paragraphLines, output)
      const itemText = trimmedLine.replace(/^(- |\d+\. )/, '')
      const { text, links } = extractInlineLinks(itemText)
      output.push(`* ${text}`)

      for (const link of links) {
        output.push(`=> ${link.url} ${link.label}`)
      }

      continue
    }

    const standaloneLink = parseStandaloneLink(trimmedLine)

    if (standaloneLink) {
      flushParagraph(paragraphLines, output)
      const label = collapseWhitespace(stripInlineFormatting(standaloneLink.label))
      output.push(`=> ${normalizeUrl(standaloneLink.url)} ${label || normalizeUrl(standaloneLink.url)}`)
      output.push('')
      continue
    }

    if (/^<((?:https?:|gemini:|mailto:)[^>]+)>$/.test(trimmedLine)) {
      flushParagraph(paragraphLines, output)
      const normalizedUrl = normalizeUrl(trimmedLine.slice(1, -1))
      output.push(`=> ${normalizedUrl} ${normalizedUrl}`)
      output.push('')
      continue
    }

    paragraphLines.push(trimmedLine)
  }

  flushParagraph(paragraphLines, output)
  flushTable(tableLines, output)

  return output
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
