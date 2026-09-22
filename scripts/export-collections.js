import { mkdir, writeFile } from 'node:fs/promises'
import { connectDatabase } from '../src/database.js'
const { client, db } = await connectDatabase()
try { await mkdir('exports', { recursive: true }); for (const name of ['lessons', 'orders', 'teachers']) { const rows = await db.collection(name).find({}).toArray(); await writeFile(`exports/${name}.json`, JSON.stringify(rows, null, 2)); console.log(`Exported ${rows.length} ${name}.`) } } finally { await client.close() }
