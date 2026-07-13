export interface InputField {
  key: string
  label: string
  type: 'input' | 'textarea' | 'select'
  placeholder?: string
  options?: string[]
}

export const PRODUCT = {
  name: "APIDocGen",
  slug: "api-docgen",
  tagline: "Turn an endpoint list into clean docs",
  description: "Paste a list of endpoints and get a Markdown reference with request examples and auth notes. For devs shipping internal tools who would rather not write docs by hand.",
  toolTitle: "Generate docs",
  resultLabel: "Your docs",
  ctaLabel: "Generate docs",
  features: [
  "Markdown output",
  "curl / JS / Python",
  "Auth notes",
  "Copy-ready"
],
  inputs: [
  {
    "key": "endpoints",
    "label": "Endpoints (method path - what)",
    "type": "textarea",
    "placeholder": "GET /users - list users\nPOST /users - create user"
  },
  {
    "key": "lang",
    "label": "Example language",
    "type": "select",
    "options": [
      "curl",
      "JS",
      "Python"
    ]
  }
] as InputField[],
  systemPrompt: "You are a technical writer. Given a list of endpoints (method path - description) and a language, produce Markdown API reference docs with an auth note and an example request per endpoint.",
  pricing: [
  {
    "tier": "Free",
    "price": "$0",
    "desc": "Unlimited"
  },
  {
    "tier": "Pro",
    "price": "$15/mo",
    "desc": "Schemas, export"
  },
  {
    "tier": "Team",
    "price": "$39/mo",
    "desc": "Multi-spec, API"
  }
],
  mock: (inputs: Record<string, string>): string => {
  const raw = inputs['endpoints'] || 'GET /users - list users\nPOST /users - create user'
  const lang = inputs['lang'] || 'curl'
  const lines = raw.split(/\n/).map(s => s.trim()).filter(Boolean)
  let md = '# API Reference\n\n'
  lines.forEach(l => {
    const m = l.match(/^(GET|POST|PUT|PATCH|DELETE)\s+(\/\S+)\s*-?\s*(.*)$/i)
    if (!m) return
    const method = m[1].toUpperCase(), path = m[2], desc = m[3] || ''
    md += '## ' + method + ' ' + path + '\n' + (desc ? desc + '\n\n' : '') + '**Auth:** Bearer token\n\n'
    if (lang === 'curl') md += '```bash\ncurl -X ' + method + ' https://api.example.com' + path + ' -H "Authorization: Bearer $TOKEN"\n```\n\n'
    else if (lang === 'JS') md += '```js\nfetch("https://api.example.com' + path + '", { method: "' + method + '", headers: { Authorization: "Bearer "+TOKEN } })\n```\n\n'
    else md += '```python\nimport requests\nrequests.' + method.toLowerCase() + '("https://api.example.com' + path + '", headers={"Authorization": "Bearer "+TOKEN})\n```\n\n'
  })
  return md + '--- (Mock formatter. Add OPENAI_API_KEY for auto request/response schemas.)'
}
}
