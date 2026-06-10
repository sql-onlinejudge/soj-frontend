export function RefundPage() {
  return (
    <div className="min-h-screen bg-surface-bg px-4 py-16">
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-text-primary">환불 정책</h1>
          <p className="text-sm text-text-muted">최종 수정일: 2026년 6월 10일</p>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed">
          SOJ는 전자상거래 등에서의 소비자보호에 관한 법률(전자상거래법)에 따라 이용자의 청약철회 및 환불 권리를 보장합니다.
        </p>

        <Section title="제1조 (청약철회)">
          <ol className="list-decimal list-inside flex flex-col gap-2">
            <li>이용자는 구독 결제일로부터 <strong className="text-text-primary">7일 이내</strong>에 별도의 위약금 없이 청약을 철회할 수 있습니다.</li>
            <li>단, 결제 후 프리미엄 콘텐츠(AI 피드백, 프리미엄 문제집 등)를 이용한 경우에는 전자상거래법 제17조 제2항에 따라 청약철회가 제한될 수 있습니다.</li>
          </ol>
        </Section>

        <Section title="제2조 (환불 기준)">
          <div className="overflow-hidden rounded-lg border border-border-input">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-surface-dark">
                  <th className="text-left px-4 py-3 text-text-secondary font-medium">환불 신청 시점</th>
                  <th className="text-left px-4 py-3 text-text-secondary font-medium">환불 금액</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-input">
                <tr>
                  <td className="px-4 py-3 text-text-secondary">결제일로부터 7일 이내 (미이용)</td>
                  <td className="px-4 py-3 text-text-primary font-medium">전액 환불</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-text-secondary">결제일로부터 7일 이내 (이용 후)</td>
                  <td className="px-4 py-3 text-text-secondary">이용 비율에 따른 차감 후 환불</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-text-secondary">결제일로부터 7일 초과</td>
                  <td className="px-4 py-3 text-text-secondary">환불 불가</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="제3조 (환불 신청 방법)">
          <ol className="list-decimal list-inside flex flex-col gap-2">
            <li>아래 담당자 이메일로 환불 신청 메일을 보내주세요.</li>
            <li>신청 메일에는 가입 이메일 주소와 결제일자, 환불 사유를 포함해 주세요.</li>
            <li>환불 요청 확인 후 영업일 기준 3~5일 이내에 처리됩니다.</li>
            <li>환불금은 결제에 사용한 카드로 입금됩니다.</li>
          </ol>
          <div className="mt-3 p-3 rounded-lg bg-surface-dark border border-border-input text-xs flex flex-col gap-1">
            <p className="font-medium text-text-primary">환불 문의</p>
            <p className="text-text-secondary">이메일: bigtabletleaflet@gmail.com</p>
          </div>
        </Section>

        <Section title="제4조 (구독 해지)">
          <ol className="list-decimal list-inside flex flex-col gap-2">
            <li>구독 해지는 서비스 내 <strong className="text-text-primary">/pricing</strong> 페이지에서 직접 처리할 수 있습니다.</li>
            <li>구독을 해지하더라도 현재 구독 기간 만료일까지 프리미엄 기능을 계속 이용할 수 있습니다.</li>
            <li>구독 해지는 자동 갱신을 중단하는 것이며, 즉각적인 서비스 종료나 환불을 의미하지 않습니다.</li>
          </ol>
        </Section>

        <Section title="제5조 (기타)">
          이 정책에 명시되지 않은 사항은 전자상거래법 및 관련 법령, 서비스 이용약관에 따릅니다.
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
