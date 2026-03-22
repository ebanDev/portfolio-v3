import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const DEFAULT_CERT_PATH = '.ssl/cert.pem'
const DEFAULT_KEY_PATH = '.ssl/key.pem'

const createDevCertificate = (certPath, keyPath) => {
  fs.mkdirSync(path.dirname(certPath), { recursive: true })

  execFileSync('openssl', [
    'req',
    '-x509',
    '-newkey',
    'rsa:2048',
    '-keyout',
    keyPath,
    '-out',
    certPath,
    '-days',
    '365',
    '-nodes',
    '-subj',
    '/CN=localhost',
  ], {
    stdio: 'inherit',
  })
}

export const getServerTlsOptions = () => {
  const isDev = process.argv.includes('--dev')
  const envCertPath = process.env.CERT_PATH
  const envKeyPath = process.env.KEY_PATH

  if (isDev) {
    const certPath = path.resolve(process.cwd(), envCertPath || DEFAULT_CERT_PATH)
    const keyPath = path.resolve(process.cwd(), envKeyPath || DEFAULT_KEY_PATH)

    if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
      createDevCertificate(certPath, keyPath)
    }

    return {
      cert: fs.readFileSync(certPath),
      key: fs.readFileSync(keyPath),
      passphrase: process.env.KEY_PASSPHRASE,
    }
  }

  if (!envCertPath || !envKeyPath) {
    throw new Error('CERT_PATH and KEY_PATH environment variables must be set')
  }

  const certPath = path.resolve(process.cwd(), envCertPath)
  const keyPath = path.resolve(process.cwd(), envKeyPath)

  return {
    cert: fs.readFileSync(certPath),
    key: fs.readFileSync(keyPath),
    passphrase: process.env.KEY_PASSPHRASE,
  }
}
