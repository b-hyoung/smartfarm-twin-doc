// 정적 내보내기 빌드 (out/). Windows 에서도 env 설정이 되도록 node 로 감싼다.
import { spawnSync } from 'node:child_process';

const r = spawnSync('npx', ['next', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, STATIC_EXPORT: '1' },
});
process.exit(r.status ?? 1);
