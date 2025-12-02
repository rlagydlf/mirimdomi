import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './css/Login.css';
import { supabase } from '../supabaseClient'; // Supabase 클라이언트 가져오기

const imgDeviconGoogle = "/img/google-icon.svg";

function Login({ onLoginSuccess }) {
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Google 사용자 정보 가져오기
        const userInfoResponse = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const userInfo = {
          id: userInfoResponse.data.sub,
          email: userInfoResponse.data.email,
          name: userInfoResponse.data.name,
          picture: userInfoResponse.data.picture,
        };

        console.log('로그인 성공:', userInfo);

        // Supabase 'users' 테이블에 사용자 정보 저장 (upsert)
        const { data, error } = await supabase
          .from('users')
          .upsert(
            {
              id: userInfo.id,
              email: userInfo.email,
              name: userInfo.name,
              profile_image: userInfo.picture,
            },
            { onConflict: 'id' }
          )
          .select();

        if (error) {
          console.error('Supabase 데이터 저장 실패:', error);
          alert('데이터베이스에 사용자 정보를 저장하는 중 오류가 발생했습니다.');
          return;
        }

        console.log('Supabase에 사용자 정보 저장 완료:', data);

        // 토큰 저장
        localStorage.setItem('googleAccessToken', tokenResponse.access_token);

        // 부모 컴포넌트에 로그인 성공 알림
        if (onLoginSuccess) {
          onLoginSuccess(userInfo);
        }
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
        alert('사용자 정보를 가져오는 중 오류가 발생했습니다.');
      }
    },
    onError: (error) => {
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다.');
    },
  });

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-card-inner">
          <p className="login-title">미림도미</p>
          <button className="google-login-button" onClick={handleGoogleLogin}>
            <div className="google-icon">
              <img alt="Google" src={imgDeviconGoogle} />
            </div>
            <p className="google-login-text">구글 계정으로 로그인</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;

