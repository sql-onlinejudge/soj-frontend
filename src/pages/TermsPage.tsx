export function TermsPage() {
  return (
    <div className="min-h-screen bg-surface-bg px-4 py-16">
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-text-primary">이용약관</h1>
          <p className="text-sm text-text-muted">최종 수정일: 2026년 6월 10일</p>
        </div>

        <Section title="제1조 (목적)">
          이 약관은 SOJ(이하 "서비스")가 제공하는 SQL 학습 플랫폼 서비스의 이용 조건 및 절차, 이용자와 서비스 간의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.
        </Section>

        <Section title="제2조 (용어의 정의)">
          <ol className="list-decimal list-inside flex flex-col gap-2">
            <li>"서비스"란 SOJ가 운영하는 SQL 학습 플랫폼 및 관련 제반 서비스를 의미합니다.</li>
            <li>"이용자"란 이 약관에 동의하고 서비스를 이용하는 모든 자를 말합니다.</li>
            <li>"프리미엄 회원"이란 유료 구독을 통해 프리미엄 기능을 이용하는 이용자를 말합니다.</li>
          </ol>
        </Section>

        <Section title="제3조 (약관의 효력 및 변경)">
          <ol className="list-decimal list-inside flex flex-col gap-2">
            <li>이 약관은 서비스 화면에 게시하거나 이메일 등의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.</li>
            <li>서비스는 필요한 경우 약관을 변경할 수 있으며, 변경 시 최소 7일 전에 공지합니다. 단, 이용자에게 불리한 변경의 경우 30일 전에 공지합니다.</li>
          </ol>
        </Section>

        <Section title="제4조 (서비스 이용)">
          <ol className="list-decimal list-inside flex flex-col gap-2">
            <li>서비스는 소셜 로그인(OAuth)을 통해 가입 후 이용할 수 있습니다.</li>
            <li>이용자는 타인의 정보를 도용하거나 허위 정보를 제공해서는 안 됩니다.</li>
            <li>서비스는 운영상·기술상 필요에 따라 사전 공지 후 서비스를 일시 중단할 수 있습니다.</li>
          </ol>
        </Section>

        <Section title="제5조 (유료 서비스)">
          <ol className="list-decimal list-inside flex flex-col gap-2">
            <li>프리미엄 구독은 월정액 1,900원이며, 결제는 토스페이먼츠를 통해 처리됩니다.</li>
            <li>구독 기간은 결제일로부터 1개월입니다.</li>
            <li>자동 갱신되지 않으며, 다음 결제 주기 전 언제든지 해지할 수 있습니다.</li>
            <li>환불 정책은 별도의 환불 정책 페이지에 따릅니다.</li>
          </ol>
        </Section>

        <Section title="제6조 (이용자의 의무)">
          이용자는 다음 행위를 해서는 안 됩니다.
          <ul className="list-disc list-inside flex flex-col gap-2 mt-2">
            <li>서비스의 운영을 방해하는 행위</li>
            <li>타인의 개인정보를 무단으로 수집·이용하는 행위</li>
            <li>서비스 내 콘텐츠를 무단으로 복제·배포하는 행위</li>
            <li>기타 관련 법령에 위반되는 행위</li>
          </ul>
        </Section>

        <Section title="제7조 (지적재산권)">
          서비스가 제공하는 문제, 해설, 콘텐츠 등에 관한 저작권 및 지적재산권은 서비스에 귀속됩니다. 이용자는 서비스의 사전 동의 없이 이를 상업적으로 이용할 수 없습니다.
        </Section>

        <Section title="제8조 (면책조항)">
          <ol className="list-decimal list-inside flex flex-col gap-2">
            <li>서비스는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력으로 인한 서비스 제공 불가에 대해 책임을 지지 않습니다.</li>
            <li>서비스는 이용자가 서비스를 통해 기대하는 학습 성과에 대해 보증하지 않습니다.</li>
          </ol>
        </Section>

        <Section title="제9조 (관할법원 및 준거법)">
          이 약관과 관련된 분쟁은 대한민국 법률에 따르며, 관할법원은 서울중앙지방법원으로 합니다.
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
