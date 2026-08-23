import { defineCliConfig } from 'sanity/cli'

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  'k877xljb'
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  'production'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  typegen: {
    enabled: true,
    path: '../sanity/lib/**/*.{ts,tsx,js,jsx}',
    schema: 'schema.json',
    generates: '../sanity.types.ts',
    overloadClientMethods: true,
  },
})
