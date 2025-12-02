# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 가입하고 로그인
2. "New Project" 클릭하여 새 프로젝트 생성
3. 프로젝트 이름, 데이터베이스 비밀번호, 지역 선택
4. 프로젝트 생성 완료 대기 (약 2분)

## 2. 프로젝트 정보 확인

1. 프로젝트 대시보드에서 "Settings" → "API" 이동
2. 다음 정보 확인:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 3. 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성 (또는 기존 파일 수정):

```env
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ `.env` 파일은 `.gitignore`에 포함되어 있어야 합니다.

## 4. 데이터베이스 테이블 생성

Supabase 대시보드에서 "SQL Editor"로 이동하여 다음 SQL 실행:

### users 테이블
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  name TEXT,
  student_id TEXT,
  room_number TEXT,
  address TEXT,
  profile_image TEXT,
  bonus_points NUMERIC DEFAULT 0,
  penalty_points NUMERIC DEFAULT 0,
  info_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 데이터만 조회/수정 가능
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### timetable 테이블 (선택사항)
```sql
CREATE TABLE timetable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade INTEGER NOT NULL,
  class INTEGER NOT NULL,
  date DATE NOT NULL,
  day_of_week INTEGER NOT NULL,
  period INTEGER NOT NULL,
  subject TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_timetable_lookup ON timetable(grade, class, date, day_of_week);
```

### meals 테이블 (선택사항)
```sql
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  breakfast TEXT[], -- 조식 메뉴 배열
  lunch TEXT[],     -- 중식 메뉴 배열
  dinner TEXT[],    -- 석식 메뉴 배열
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_meals_date ON meals(date);
```

## 5. 인증 설정 (선택사항)

Google OAuth를 Supabase와 연동하려면:

1. Supabase 대시보드 → "Authentication" → "Providers"
2. "Google" 활성화
3. Google Cloud Console에서 OAuth 클라이언트 ID/Secret 발급
4. Supabase에 클라이언트 ID/Secret 입력

## 6. 스토리지 설정 (프로필 이미지용)

1. Supabase 대시보드 → "Storage"
2. "Create a new bucket" 클릭
3. 버킷 이름: `profile-images`
4. Public bucket으로 설정 (또는 RLS 정책 설정)

## 7. 테스트

환경 변수 설정 후 앱을 재시작:

```bash
npm start
```

브라우저 콘솔에서 Supabase 연결 상태 확인.

## 문제 해결

- **연결 오류**: 환경 변수가 올바르게 설정되었는지 확인
- **RLS 오류**: 테이블의 Row Level Security 정책 확인
- **인증 오류**: Supabase 인증 설정 확인

