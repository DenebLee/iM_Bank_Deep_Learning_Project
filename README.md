# 딥러닝 프로젝트 웹사이트

이 프로젝트는 딥러닝 서비스를 제공하기 위해 구현된 간닪나 웹사이트 입니다. Express 서버와 PostgreSQL 데이터베이스를 사용하며, 중간 서버에서 딥러닝 모델이 학습되고, 사용자가 API를 통해 서버에 요청하면 모델이 실행되어 결과를 반환합니다. 이 모든 과정은 JSON 형식으로 데이터를 송수신하여 이루어집니다.

## 주요 기능

- **Express 서버**: 사용자의 요청을 처리하고, 딥러닝 모델과의 API 통신을 담당합니다.
- **PostgreSQL 데이터베이스**: 사용자 입력 및 모델 결과 등 필요한 데이터를 저장합니다.
- **딥러닝 모델**: 미들 서버에서 실행되며, 사용자의 요청을 처리하고 그 결과를 반환합니다.
- **API 통신**: 클라이언트가 서버에 JSON 데이터를 전송하면, 딥러닝 모델이 처리한 결과를 다시 JSON 형식으로 반환합니다.

## 프로젝트 구조

```bash
Test/
├── README.md
├── app.js
├── bin/
│   └── www
├── package-lock.json
├── package.json
├── public/
│   ├── images/
│   │   ├── 1.jpg -> 기타 필요한 사진 파일들
│   │   ├── ranking/ 
│   │   │   └── 페이지 구현에 필요한 사진들 모음 
│   │   ├── seob.jpeg
│   │   └── test.png
│   ├── javascripts/
│   │   ├── app2.js
│   │   ├── header.js
│   │   ├── login.js
│   │   └── model.js
│   └── stylesheets/
│       ├── info.css
│       ├── login.css
│       ├── model.css
│       ├── reset.css
│       ├── shop.css
│       └── style.css
├── routes/
│   ├── index.js
│   └── users.js
└── views/
├── error.pug
├── header.html
├── index.html
├── index.pug
├── info.html
├── layout.pug
├── login.html
└── model.html
```

## 설치 및 실행 방법

1. 해당 프로젝트 클론:

   ```bash
   git clone <repository-url>
   
2. 프로젝트 디렉토리로 이동:
    ```bash
   cd iM_Bank_Deep_Learning_Project

3. 필요한 패키지 설치
   ```bash
   npm install

4. PostgreSQL 데이터베이스 연결 설정을 app.js 파일에서 본인의 설정에 맞게 수정
   ```bash
    const pool = new Pool({
    user: 'postgres',
    host: 'your_url',
    database: 'your_db',
    password: 'your_password',
    port: 5432, # Default PostgreSQL port
    });
5. 서버를 실행
   ```bash
    npm start


## API 명세서

| 기능            | HTTP 메서드 | 엔드포인트           | Request         | Response         |
|----------------|-------------|----------------------|-----------------|------------------|
| 로그인         | POST        | /accounts/token/      | [Request](#로그인-request)   | [Response](#로그인-response)   |
| 회원가입       | POST        | /accounts/register/   | [Request](#회원가입-request)   | [Response](#회원가입-response)   |
| 분류 모델 예측 | POST        | /predict/             | [Request](#분류-모델-예측-request)   | [Response](#분류-모델-예측-response)   |
| llm 결과 출력  | POST        | /gemma               | [Request](#llm-결과-출력-request)   | [Response](#llm-결과-출력-response)   |
| 포맷팅 결과    | GET         | /gemma               | [Request](#포맷팅-결과-request)   | [Response](#포맷팅-결과-response)   |

---

### Request and Response Descriptions

#### 1. **로그인 (POST /accounts/token/)**

- **Request**:
```json
{
  "username": "your_username",
  "password": "your_password"
}
```
- **Response**:
```json
{
   "refresh": "토큰",
   "access": "토큰"
}
```
</br></br>
#### 2. **회원가입 (POST /accounts/register/)**

- **Request**:
```json
{
  "username": "your_username",
  "password": "your_password",
  "email": "your_email"
}
```
- **Response**:
```json
{
   "message": "User registered successfully",
   "status": "success"
} 
```
</br></br>
### 3. 분류 모델 예측 (POST /predict/)

- **Request**:

```json
{
  Authorization: Bearer <your_access_token>  # 헤더는 Authorization
}

Body
{
  img파일
}
```
- **Response**:
```json
{
   "이마 나이 예측": 2,
   "이마 나이 확률": "86.81%",
   "왼쪽 볼 나이 예측": 2,
   "왼쪽 볼 나이 확률": "76.78%",
   "오른쪽 볼 나이 예측": 1,
   "오른쪽 볼 나이 확률": "80.16%",
   "이마 색소 예측": 0,
   "이마 색소 확률": "75.96%",
   "이마 수분 예측": 0,
   "이마 수분 확률": "95.36%",
   "왼쪽 볼 수분 예측": 0,
   "왼쪽 볼 수분 확률": "77.47%",
   "오른쪽 볼 수분 예측": 1,
   "오른쪽 볼 수분 확률": "87.68%",
   "이마 스킨 타입 예측": 1,
   "이마 스킨 타입 확률": "35.93%",
   "왼쪽 볼 스킨 타입 예측": 1,
   "왼쪽 볼 스킨 타입 확률": "35.77%",
   "오른쪽 볼 스킨 타입 예측": 2,
   "오른쪽 볼 스킨 타입 확률": "37.71%"
}
```
</br></br>
#### 4. **llm 결과 출력 (POST /gemma/)**

- **Request**:
```json
{
   Authorization: Bearer <your_access_token>  # 헤더는 Authorization
}
```
- **Response**:
```json
{
   "formatted_data": "이마 나이 예측: 50대~60대, 왼쪽 볼 나이 예측: 50대~60대, 오른쪽 볼 나이 예측: 30대~40대. 이마 색소 침착 예측: 색소침착이 없음. 수분 상태: 이마 수분이 없음, 왼쪽 볼 수분이 없음, 오른쪽 볼 수분이 있음. 스킨 타입 예측: 이마 중성, 왼쪽 볼 중성, 오른쪽 볼 지성. 피부 관리를 어떻게 하면 좋을까요?",
   "gemma_response": "각 부위의 나이와 스킨 타입이 다르다는 점을 고려하여 맞춤형 피부 관리 계획을 세우세요! \n\n**1. 이마:**\n\n* **나이 대비 적절한 케어**: 50대~60대인 만큼 수분 보충과 노화 방지가 중요합니다.\n* **상황에 맞는 제품 사용**:  고농도의 영양 성분을 함유한 시리움, 비타민C 에센스 등을 활용하여 피부 윤기를 되찾으세요. 콜라겐 합성을 촉진하는 레티놀이나 아자엘릭산 등은 노화 방지에 효과적입니다.\n* **마사지**:  피부를 살리고 자극을 줄이는 목적으로 부드러운 마사지를 해주는 것이 좋습니다.\n\n**2. 왼쪽 볼:**\n\n* **나이 대비 적절한 케어**: 이마와 유사하게 수분 보충과 노화 방지가 중요합니다.\n* **상황에 맞는 제품 사용**:  이마와 동일하게 시리움, 비타민C 에센스 등을 활용하여 피부 윤기를 되찾으세요.\n\n**3. 오른쪽 볼:**\n\n* **나이 대비 적절한 케어**: 30대~40대인 만큼 수분 공급과 각질 제거에 집중하는 것이 좋습니다.\n* **상황에 맞는 제품 사용**: 지성 피부를 위한 미스트 또는 로션을 사용하여 수분을 공급하고, 정기적인 각질 제거 (스크럽이나 화학적 각질 제거)로 유해한 노폐물 및 각질을 제거하세요. \n\n**4.  전반적인 관리:**\n\n* **자외선 차단**: 모든 부위에 자외선차단제를 매일 사용하여 피부 손상을 방지하세요.\n* **충분한 수면**: 피부 재생과 회복을 위해 충분한 수면을 취하세요.\n* **균형 잡힌 식사**: 건강한 식습관은 피부 건강에도 중요합니다. 비타민, 미네랄, 항산화 성분이 풍부한 음식을 섭취하세요.\n* **스트레스 관리**: 스트레스는 피부 노화를 가속화할 수 있습니다. 요가, 명상 등 스트레스 해소 활동을 실천하세요.\n\n**추가적으로**:\n\n\n* 전문가에게 상담하여 개인에게 맞는 피부관리 계획을 세우세요.\n* 피부 상태 변화에 따라 관리 방법을 조정하세요.\n\n\n\n"
}
```
</br></br>
#### 5. ** 포맷팅 결과 (GET /gemma/)**

- **Request**:
```json
{
Authorization: Bearer <your_access_token>  # 헤더는 Authorization
}
```
- **Response**:
```json
{
   "forehead_age_prediction": "50대~60대",
   "left_cheek_age_prediction": "50대~60대",
   "right_cheek_age_prediction": "30대~40대",
   "forehead_pigmentation_prediction": "색소침착이 없음",
   "forehead_moisture_prediction": "수분이 없음",
   "left_cheek_moisture_prediction": "수분이 없음",
   "right_cheek_moisture_prediction": "수분이 있음",
   "forehead_skin_prediction": "중성",
   "left_cheek_skin_prediction": "중성",
   "right_cheek_skin_prediction": "지성"
}
```

## 테스트

테스트를 실행하려면 다음 명령어를 사용하세요:

```bash
npm test
```

---

## 라이선스

이 프로젝트는 MIT 라이선스 하에 제공됩니다.

---

## 기여 방법

이 프로젝트에 기여하려면, 아래의 표준 pull request 절차를 따르세요:

1. **저장소를 Fork** 합니다.
2. **기능 브랜치를 생성** 합니다:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **변경 사항을 커밋** 합니다:
   ```bash
   git commit -m 'Add some feature'
   ```
4. **브랜치를 원격 저장소에 푸시** 합니다:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **기능 브랜치에 대해 pull request를 생성** 합니다.


