import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { createServer, DEFAULT_PORT } from '@derhuerst/gemini'
import dotenv from 'dotenv'

import { getServerTlsOptions } from './certs.js'
import { handleRequest } from './routes.js'

dotenv.config()

export const startServer = () => {
  const server = createServer(getServerTlsOptions(), handleRequest)

  server.listen(DEFAULT_PORT)
  server.on('error', console.error)

  return server
}

const isEntrypoint = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isEntrypoint) {
  startServer()
}
