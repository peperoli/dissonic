import { EnvSchema } from '@/lib/validateEnv'

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends EnvSchema {}
  }
}
