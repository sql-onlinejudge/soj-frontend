export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface-bg px-4 py-16">
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-text-primary">개인정보처리방침</h1>
          <p className="text-sm text-text-muted">최종 수정일: 2026년 6월 10일</p>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed">
          SOJ(이하 "서비스")는 개인정보보호법 및 관련 법령에 따라 이용자의 개인정보를 보호하고, 이와 관련한 고충을 신속하게 처리하기 위해 다음과 같이 개인정보처리방침을 수립·공개합니다.
        </p>

        <Section title="제1조 (수집하는 개인정보 항목)">
          서비스는 소셜 로그인(OAuth) 방식으로만 회원가입이 가능하며, 다음 정보를 수집합니다.
          <ul className="list-disc list-inside flex flex-col gap-2 mt-2">
            <li>필수: 이메일 주소, 프로필 이름, OAuth 제공자 식별자</li>
            <li>결제 시 추가 수집: 주문번호, 결제 금액 (카드 번호 등 결제 수단 정보는 토스페이먼츠가 처리하며 서비스는 보관하지 않습니다)</li>
            <li>자동 수집: 접속 IP, 브라우저 정보, 서비스 이용 기록</li>
          </ul>
        </Section>

        <Section title="제2조 (개인정보의 수집 목적)">
          <ol className="list-decimal list-inside flex flex-col gap-2">
            <li>회원 식별 및 서비스 제공</li>
            <li>유료 서비스 결제 및 구독 관리</li>
            <li>서비스 개선 및 통계 분석</li>
            <li>공지사항 전달 및 고객 문의 응대</li>
          </ol>
        </Section>

        <Section title="제3조 (개인정보의 보유 및 이용 기간)">
          <ol className="list-decimal list-inside flex flex-col gap-2">
            <li>회원 탈퇴 시 즉시 파기합니다. 단, 관련 법령에 의해 보존이 필요한 경우 해당 기간 동안 보관합니다.</li>
            <li>전자상거래법에 따른 거래 기록: 5년 보관</li>
            <li>소비자 불만·분쟁 처리 기록: 3년 보관</li>
          </ol>
        </Section>

        <Section title="제4조 (개인정보의 제3자 제공)">
          서비스는 이용자의 개인정보를 원칙적으로 제3자에게 제공하지 않습니다. 다만 다음의 경우는 예외입니다.
          <ul className="list-disc list-inside flex flex-col gap-2 mt-2">
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령에 의하여 요구되는 경우</li>
          </ul>
          <div className="mt-3 p-3 rounded-lg bg-surface-dark border border-border-input text-xs">
            <p className="font-medium text-text-primary mb-2">결제 서비스 제공을 위한 위탁</p>
            <p>수탁자: 토스페이먼츠(주) | 위탁 목적: 결제 처리 | 보유 기간: 거래 종료 후 5년</p>
          </div>
        </Section>

        <Section title="제5조 (이용자의 권리)">
          이용자는 언제든지 다음 권리를 행사할 수 있습니다.
          <ul className="list-disc list-inside flex flex-col gap-2 mt-2">
            <li>개인정보 열람 요청</li>
            <li>개인정보 수정·삭제 요청</li>
            <li>개인정보 처리 정지 요청</li>
            <li>회원 탈퇴</li>
          </ul>
          <p className="mt-2">문의는 아래 개인정보 보호 담당자에게 연락 바랍니다.</p>
        </Section>

        <Section title="제6조 (개인정보 보호 담당자)">
          <div className="flex flex-col gap-1">
            <p>담당자: SOJ 운영팀</p>
            <p>이메일: bigtabletleaflet@gmail.com</p>
          </div>
        </Section>

        <Section title="제7조 (쿠키 및 자동 수집 정보)">
          서비스는 이용자 경험 향상을 위해 로컬 스토리지를 사용합니다. 브라우저 설정에서 언제든지 이를 삭제할 수 있으나, 일부 서비스 기능이 제한될 수 있습니다.
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-text-primary">{title}</h2>
      <div className="text-sm text-text-secondary leading-relaxed">{children}</div>
    </section>
  )
}
