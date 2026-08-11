import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

export const metadata = {
  title: "스마트팜 디지털 트윈 파이프라인 설명서",
  description: "물리 시뮬레이션 + 실측 + AI 대리모델 + 언리얼. 용어는 검증 에이전트가 사실검증.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} antialiased`} suppressHydrationWarning>
      <body style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}>{children}</body>
    </html>
  );
}
