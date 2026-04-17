// TODO: pipeline-engineer 본 구현 완료 시 활성화.
// 현재는 인증/구현이 없는 스캐폴드이므로 501 응답으로 차단한다.

import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Not Implemented",
      message: "필터 엔드포인트는 아직 구현되지 않았습니다.",
    },
    { status: 501 }
  );
}
