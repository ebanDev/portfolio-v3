import fs from 'node:fs'
import path from 'node:path'

import { PUBLIC_DIR, findArticleByPath, loadArticles, loadHomePage } from './content.js'
import { renderArticlePage, renderArticlesPage, renderHomePage } from './render.js'

const GEMTEXT_MIME = 'text/gemini; charset=utf-8'

const MIME_TYPES = {
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.md': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
}

const normalizePath = (requestPath) => {
  if (requestPath === '/') {
    return requestPath
  }

  return requestPath.replace(/\/+$/, '')
}

const sendGemtext = (res, body) => {
  res.mimeType = GEMTEXT_MIME
  res.end(body)
}

const sendFile = (res, filePath) => {
  const extension = path.extname(filePath).toLowerCase()
  res.mimeType = MIME_TYPES[extension] || 'application/octet-stream'
  fs.createReadStream(filePath).pipe(res)
}

const tryServePublicFile = (requestPath, res) => {
  const relativePath = requestPath.replace(/^\/+/, '')

  if (!relativePath) {
    return false
  }

  const filePath = path.resolve(PUBLIC_DIR, relativePath)

  if (filePath !== PUBLIC_DIR && !filePath.startsWith(`${PUBLIC_DIR}${path.sep}`)) {
    return false
  }

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return false
  }

  sendFile(res, filePath)
  return true
}

export const handleRequest = (req, res) => {
  const requestPath = normalizePath(req.path)

  if (tryServePublicFile(requestPath, res)) {
    return
  }

  if (requestPath === '/') {
    sendGemtext(res, renderHomePage(loadHomePage(), loadArticles()))
    return
  }

  if (requestPath === '/articles') {
    sendGemtext(res, renderArticlesPage(loadArticles()))
    return
  }

  if (requestPath.startsWith('/articles/')) {
    const article = findArticleByPath(requestPath)

    if (article) {
      sendGemtext(res, renderArticlePage(article))
      return
    }
  }

  res.notFound()
}
