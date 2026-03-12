import fs from 'fs';
import path from 'path';

function getFiles(dir) {
  let results = [];
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, f.name);
    if (f.isDirectory() && !f.name.includes('node_modules')) {
      results = results.concat(getFiles(full));
    } else if (f.name.endsWith('.ts') || f.name.endsWith('.tsx')) {
      results.push(full);
    }
  }
  return results;
}

const files = getFiles('src');
const fileContents = files.map(f =>
  `--- ${f} ---\n${fs.readFileSync(f, 'utf-8')}`
).join('\n\n');

const res = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 8192,
    messages: [{
      role: 'user',
      content: `백엔드 커밋: ${process.env.COMMIT_MSG}\n\n백엔드 diff:\n${process.env.BACKEND_DIFF}\n\n프론트엔드 코드:\n${fileContents}\n\n이 diff를 분석하여 프론트엔드 코드를 수정하세요.\n- 기존 파일만 수정, 새 파일 금지\n- 변경 불필요한 파일 제외\n- 순수 JSON만 반환: {"files": [{"path": "...", "content": "..."}]}`
    }],
  }),
});

const data = await res.json();
let text = data.content[0].text;
text = text.replace(/```json\s*/g, '').replace(/```/g, '');
const result = JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));

for (const file of result.files) {
  fs.mkdirSync(path.dirname(file.path), { recursive: true });
  fs.writeFileSync(file.path, file.content);
  console.log('Updated:', file.path);
}