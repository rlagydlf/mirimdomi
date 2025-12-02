const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS 설정
app.use(cors());
app.use(express.json());

// NEIS API 프록시 - 급식 정보
app.get('/api/meal', async (req, res) => {
  try {
    const { date, schoolCode = '7011569', officeCode = 'B10' } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: '날짜가 필요합니다.' });
    }

    const dateStr = date.replace(/\./g, '').replace(/\s/g, '');
    const url = `https://open.neis.go.kr/hub/mealServiceDietInfo`;
    
    const params = new URLSearchParams({
      Type: 'json',
      pIndex: '1',
      pSize: '100',
      ATPT_OFCDC_SC_CODE: officeCode,
      SD_SCHUL_CODE: schoolCode,
      MLSV_YMD: dateStr,
    });

    const response = await axios.get(`${url}?${params.toString()}`);
    res.json(response.data);
  } catch (error) {
    console.error('급식 API 오류:', error.message);
    res.status(500).json({ error: '급식 정보를 가져오는데 실패했습니다.' });
  }
});

// NEIS API 프록시 - 시간표 정보
app.get('/api/timetable', async (req, res) => {
  try {
    const { date, grade, classNum, schoolCode = '7011569', officeCode = 'B10' } = req.query;
    
    if (!date || !grade || !classNum) {
      return res.status(400).json({ error: '날짜, 학년, 반이 필요합니다.' });
    }

    const dateStr = date.replace(/\./g, '').replace(/\s/g, '');
    const url = `https://open.neis.go.kr/hub/hisTimetable`;
    
    const params = new URLSearchParams({
      Type: 'json',
      pIndex: '1',
      pSize: '100',
      ATPT_OFCDC_SC_CODE: officeCode,
      SD_SCHUL_CODE: schoolCode,
      GRADE: grade,
      CLASS_NM: classNum,
      ALL_TI_YMD: dateStr,
    });

    const response = await axios.get(`${url}?${params.toString()}`);
    res.json(response.data);
  } catch (error) {
    console.error('시간표 API 오류:', error.message);
    res.status(500).json({ error: '시간표 정보를 가져오는데 실패했습니다.' });
  }
});

app.listen(PORT, () => {
  console.log(`프록시 서버가 포트 ${PORT}에서 실행 중입니다.`);
});

