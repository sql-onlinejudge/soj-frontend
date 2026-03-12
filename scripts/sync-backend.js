function findMatchingBrace(text, startIndex) {
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = startIndex; i < text.length; i++) {
    const ch = text[i];
    if (escape) { escape = false; continue; }
    if (ch === '\\' && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{') depth++;
    if (ch === '}') { depth--; if (depth === 0) return i; }
  }
  return -1;
}

import fs from 'fs';
import path from 'path';

try {
  console.log('=== START ===');
  console.log('COMMIT_MSG:', process.env.COMMIT_MSG);
  console.log('DIFF length:', process.env.BACKEND_DIFF?.length);

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
  console.log('Found files:', files.length);

  const fileContents = files.map(f =>
    `--- ${f} ---\n${fs.readFileSync(f, 'utf-8')}`
  ).join('\n\n');

  console.log('Total content length:', fileContents.length);
  console.log('Calling Claude API...');
    
  const prompt = `당신은 시니어 프론트엔드 개발자입니다.
백엔드 API가 변경되었습니다. 아래 diff를 분석하고 프론트엔드 코드를 수정하세요.

## 백엔드 커밋 메시지
${process.env.COMMIT_MSG}

## 백엔드 코드 변경사항 (git diff)
${process.env.BACKEND_DIFF}

## 현재 프론트엔드 코드
${fileContents}

## 분석 순서
1. diff에서 변경된 API 엔드포인트, 요청/응답 필드, 파라미터를 파악하세요
2. 프론트엔드 코드에서 해당 API를 사용하는 파일을 찾으세요
3. 타입 정의, API 호출 코드, 컴포넌트 순서로 수정하세요

## 규칙
- 기존 파일만 수정하세요. 새 파일을 만들지 마세요
- 기존 코드 스타일과 패턴을 그대로 유지하세요
- 변경이 필요 없는 파일은 포함하지 마세요
- API 변경과 무관한 코드는 절대 건드리지 마세요
- .github, 설정 파일, package.json 등은 절대 수정하지 마세요
- diff가 API 변경이 아니면 (CI 설정, 문서, 리팩토링 등) 빈 배열을 반환하세요
- 파일의 content는 해당 파일의 전체 내용이어야 합니다 (부분 수정 아님)

## 반환 형식 (순수 JSON만, 설명 없이)
{"files": [{"path": "src/...", "content": "전체 파일 내용"}]}

API 변경이 없으면:
{"files": []}`;

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
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  console.log('API status:', res.status);
  const data = await res.json();
  console.log('API response keys:', Object.keys(data));

  if (data.error) {
    console.error('API error:', JSON.stringify(data.error));
    process.exit(1);
  }

  let text = data.content[0].text;
  console.log('Response length:', text.length);
  console.log('Response preview:', text.substring(0, 300));

  text = text.replace(/```json\s*/g, '').replace(/```/g, '');
  const start = text.indexOf('{');
  const end = findMatchingBrace(text, start);
  const result = JSON.parse(text.substring(start, end + 1));
    
  console.log('Files to update:', result.files.length);

  if (result.files.length === 0) {
    console.log('No frontend changes needed. Skipping.');
  }

  for (const file of result.files) {
    fs.mkdirSync(path.dirname(file.path), { recursive: true });
    fs.writeFileSync(file.path, file.content);
    console.log('Updated:', file.path);
  }

  console.log('=== DONE ===');
} catch (e) {
  console.error('=== ERROR ===');
  console.error(e.message);
  console.error(e.stack);
  process.exit(1);
}