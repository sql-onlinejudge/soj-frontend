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

const prompt = `당신은 프론트엔드 개발자입니다.
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
3. 타입 정의, API 호출, 컴포넌트 순서로 수정하세요

## 규칙
- 기존 파일만 수정하세요. 새 파일을 만들지 마세요
- 기존 코드 스타일과 패턴을 유지하세요
- 변경이 필요 없는 파일은 포함하지 마세요
- API 변경과 무관한 코드는 건드리지 마세요
- .github, 설정 파일 등은 절대 수정하지 마세요
- diff가 API 변경이 아니면 (CI 설정, 문서 등) 빈 배열을 반환하세요

## 반환 형식 (순수 JSON만, 설명 없이)
{"files": [{"path": "src/...", "content": "전체 파일 내용"}]}

API 변경이 없으면:
{"files": []}`;

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
      content: `${prompt} 백엔드 커밋: ${process.env.COMMIT_MSG}\n\n백엔드 diff:\n${process.env.BACKEND_DIFF}\n\n프론트엔드 코드:\n${fileContents}\n\n이 diff를 분석하여 프론트엔드 코드를 수정하세요.\n- 기존 파일만 수정, 새 파일 금지\n- 변경 불필요한 파일 제외\n- 순수 JSON만 반환: {"files": [{"path": "...", "content": "..."}]}`
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