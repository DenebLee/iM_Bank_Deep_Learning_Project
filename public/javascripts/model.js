document.addEventListener("DOMContentLoaded", function () {    
    const fileInput = document.getElementById('file-input');    
    const fileUploadBtn = document.getElementById('file-upload-btn');    
    const previewImage = document.getElementById('uploaded-image');    
    const resultSection = document.getElementById('upload-result');

    fileUploadBtn.addEventListener('click', () => {   
        console.log('파일 업로드 버튼 클릭 ')     
        fileInput.click();    
    });

    fileInput.addEventListener('change', (e) => {        
        const files = e.target.files;        
        handleFiles(files);    
    });

    function handleFiles(files) {        
        const file = files[0];        
        if (file && file.type.startsWith('image/')) {            
            displayImage(file);        
        } else {            
            alert('유효한 이미지 파일을 업로드해주세요.');        
        }    
    }

    function displayImage(file) {        
        const reader = new FileReader();        
        reader.readAsDataURL(file);        
        reader.onloadend = () => {            
            previewImage.src = reader.result;            
            previewImage.style.display = 'block';        
        };    
    }

    document.getElementById('upload-image-btn').addEventListener('click', function () {        
        const file = fileInput.files[0];                
        if (file) {            
            const formData = new FormData();            
            formData.append('image', file);                
            fetch('/api/predict/', {                
                method: 'POST',                
                body: formData,                
                mode: 'cors',                
                headers: {                    
                    'Accept': 'application/json',                
                }            
            })            
            .then(response => {                
                if (!response.ok) {                    
                    throw new Error(`API 요청 실패. 상태 코드: ${response.status}`);                
                }                
                return response.json();            
            })            
            .then(data => {                
                console.log('API 응답 데이터 수신:', data);                    
                // 각 얼굴 부위의 결과를 동적으로 업데이트하는 부분                
                updateFaceAnalysis(data);                
                createProbabilityBarChart(data); // 차트 생성 함수 호출                
                // 결과 섹션을 표시                
                if (resultSection) {                    
                    resultSection.style.display = 'block';                
                }                
                processFaceDataAndFetchFromDB(data);                
                // 로그인 상태 확인 후 '전문가 상담 섹션' 표시                
                if (isUserLoggedIn()) {                    
                    document.getElementById('expert-consult-section').style.display = 'block';                
                }                
                alert('이미지가 성공적으로 업로드되었습니다!');            
            })            
            .catch(error => {                
                console.error('업로드 중 오류 발생:', error);                
                alert('이미지 업로드 중 오류가 발생했습니다.');            
            });        
        } else {            
            alert('업로드할 이미지 파일을 선택하세요.');        
        }    
    });

    function createProbabilityBarChart(data) {        
        const ctx = document.getElementById('probabilityChart').getContext('2d');        
            const foreheadProbabilities = {                  
            pore: parseFloat(data['이마 모공 개수 확률']),            
            moisture: parseFloat(data['이마 수분 확률']),            
            skinType: parseFloat(data['이마 스킨 타입 확률'])        
        };            
        const leftCheekProbabilities = {                     
            pore: parseFloat(data['왼쪽 볼 모공 개수 확률']),            
            moisture: parseFloat(data['왼쪽 볼 수분 확률']),            
            skinType: parseFloat(data['왼쪽 볼 스킨 타입 확률'])        
        };            
        const rightCheekProbabilities = {                       
            pore: parseFloat(data['오른쪽 볼 모공 개수 확률']),            
            moisture: parseFloat(data['오른쪽 볼 수분 확률']),            
            skinType: parseFloat(data['오른쪽 볼 스킨 타입 확률'])        
        };

        const probabilityData = {            
            labels: ['모공 확률', '수분 확률', '피부 타입 확률'],            
            datasets: [                
                {                    
                    label: '이마',                    
                    data: [foreheadProbabilities.pore, foreheadProbabilities.moisture, foreheadProbabilities.skinType],                    
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',                    
                    borderColor: 'rgba(75, 192, 192, 1)',                    
                    borderWidth: 1                
                },                
                {                    
                    label: '왼쪽 볼',                    
                    data: [ leftCheekProbabilities.pore, leftCheekProbabilities.moisture, leftCheekProbabilities.skinType],                    
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',                    
                    borderColor: 'rgba(255, 99, 132, 1)',                    
                    borderWidth: 1                
                },                
                {                    
                    label: '오른쪽 볼',                    
                    data: [ rightCheekProbabilities.pore, rightCheekProbabilities.moisture, rightCheekProbabilities.skinType],                    
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',                    
                    borderColor: 'rgba(54, 162, 235, 1)',                    
                    borderWidth: 1                
                }            
            ]        
        };

        const chartOptions = {            
            responsive: true,            
            scales: {                
                y: {                    
                    beginAtZero: true,                    
                    max: 100,                    
                    title: {                        
                        display: true,                        
                        text: '확률 (%)',                        
                        color: '#333',                        
                        font: {                            
                            size: 16                        
                        }                    
                    }                
                },                
                x: {                    
                    title: {                        
                        display: true,                        
                        text: '예측 항목',                        
                        color: '#333',                        
                        font: {                            
                            size: 16                        
                        }                    
                    }                
                }            
            },            
            plugins: {                
                legend: {                    
                    position: 'top',                    
                    labels: {                        
                        font: {                            
                            size: 14                        
                        },                        
                        color: '#333'                    
                    }                
                }            
            },            
            layout: {                
                padding: {                    
                    left: 20,                    
                    right: 20,                    
                    top: 20,                    
                    bottom: 20                
                }            
            },            
            maintainAspectRatio: true        
        };

        new Chart(ctx, {            
            type: 'bar',            
            data: probabilityData,            
            options: chartOptions        
        });    
    }

    function updateFaceAnalysis(data) {        
        const faceAreas = {            
            '오른쪽 볼': 'right-cheek',            
            '왼쪽 볼': 'left-cheek',            
            '이마': 'forehead'        
        };        
        Object.keys(faceAreas).forEach(area => {            
            const resultElement = document.getElementById(`${faceAreas[area]}-result`);            
            if (resultElement) {                             
                const porePrediction = data[`${area} 모공 개수 예측`];                
                const moisturePrediction = data[`${area} 수분 예측`];                
                const skinTypePrediction = data[`${area} 스킨 타입 예측`];                
                          
                const poreText = porePrediction === 0 ? '육안으로 보이지 않음' : '육안으로 보임';                
                const moistureText = moisturePrediction === 0 ? '수분감 없음' : '수분감 있음';                
                const skinTypeText = skinTypePrediction === 0     ? '건성'     : skinTypePrediction === 1     ? '중성'     : skinTypePrediction === 2     ? '지성'     : '모름';

                resultElement.innerHTML = `                                     
                    <p><strong>모공 상태:</strong> ${poreText}</p>                    
                    <p><strong>수분 상태:</strong> ${moistureText}</p>                    
                    <p><strong>피부 타입:</strong> ${skinTypeText}</p>                
                `;            
            } else {                
                console.error(`ID가 '${faceAreas[area]}-result'인 요소를 찾을 수 없습니다.`);            
            }        
        });    
    }

    function isUserLoggedIn() {        
        const authToken = localStorage.getItem('authToken');        
        return authToken !== null;    
    }

 // 데이터를 테이블에 표시하고, DB와 비교하여 중복 값을 SELECT하는 로직
function processFaceDataAndFetchFromDB(data) {
    console.log('process DB');

    // 각 얼굴 부위별 예측값 저장 배열
    const ageResults = [];
    const poreResults = [];
    const moistureResults = [];
    const skinTypeResults = [];
    const faceAreas = ['오른쪽 볼', '왼쪽 볼', '이마'];

    faceAreas.forEach(area => {
        // 데이터에서 예측값 가져오기
        const agePrediction = data[`${area} 나이 예측`];
        const porePrediction = data[`${area} 모공 개수 예측`];
        const moisturePrediction = data[`${area} 수분 예측`];
        const skinTypePrediction = data[`${area} 스킨 타입 예측`];

        console.log(area, agePrediction, porePrediction, moisturePrediction, skinTypePrediction);

        // 예측 값들을 배열에 저장
        poreResults.push(porePrediction);
        moistureResults.push(moisturePrediction);
        skinTypeResults.push(skinTypePrediction);
    });

    // 각 예측값에서 2개 이상 중복된 값이 있는지 확인
    const moistureMode = getMode(moistureResults);
    const skinTypeMode = getMode(skinTypeResults);


   // DB에서 해당 값을 기반으로 SELECT 쿼리 실행
if (skinTypeMode !== null) {
    console.log('쿼리 실행 준비 완료');
    
    fetchFromDB({
        skin_type: skinTypeMode,
        moisture_type : moistureMode
    });

    console.log('DB 호출 완료');
} else {
    console.log('필수 예측 값 중 일부가 null입니다. 쿼리를 실행할 수 없습니다.');
}

async function fetchFromDB(params) {
    console.log('fetchFromDB');
    try {
        console.log('FETCHFROMDB TRY');
        
        // 비동기 호출을 위해 fetch 앞에 await 추가
        const response = await fetch('/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params) // params 값을 JSON으로 전송
        });
        
        // 응답을 JSON으로 변환 (비동기이므로 await 사용)
        const data = await response.json();
        
        console.log('DB에서 가져온 데이터:', data);
        
        // 데이터를 테이블에 출력
        displayCosmeticsInTable(data);
        
        return data; // 데이터 반환
    } catch (error) {
        console.error('DB 조회 중 오류 발생:', error);
        throw error; // 오류 발생 시 예외 처리
    }
}



// 최빈값을 찾는 함수 (getMode)
function getMode(arr) {
    const frequency = {};
    let maxFreq = 0;
    let mode = null;

    arr.forEach(value => {
        if (value !== null) {
            frequency[value] = (frequency[value] || 0) + 1;

            if (frequency[value] > maxFreq) {
                maxFreq = frequency[value];
                mode = value;
            }
        }
    });

    return mode;
}

function displayCosmeticsInTable(data) {
    const tableBody = document.querySelector('#cosmetics-table tbody');
    const cosmeticsSection = document.getElementById('cosmetics-section');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const rowsToShow = 5;  // 처음에 보여줄 행 수
    let currentVisibleRows = 0;  // 현재 보이는 행 수

    tableBody.innerHTML = ''; // 테이블 초기화

    // 전체 데이터에 대해 테이블 행을 생성
    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.product_name}</td>
            <td>${item.brand_name}</td>
            <td>${item.price}원</td>
            <td>${item.cosmetics_type}</td>
            <td>${item.skin_type === 0 ? '건성' : item.skin_type === 1 ? '중성' : item.skin_type === 2 ? '지성' : '알 수 없음'}</td>
            <td>${item.moisture_type === 0 ? '수분 없음' : item.moisture_type === 1 ? '수분 있음' : '알 수 없음'}</td>
            <td>${item.pigmentation_type === 0 ? '없음' : '있음'}</td>
            <td>${item.pores_type === 0 ? '보이지 않음' : '보임'}</td>
            <td>${item.description}</td>
            <td><img src="${item.image_path}" alt="${item.product_name}" width="100"></td>
        `;
        if (index >= rowsToShow) {
            row.style.display = 'none'; // 처음에는 5개만 보이고 나머지는 숨김
        }
        tableBody.appendChild(row);
    });

    cosmeticsSection.style.display = 'block';  // 섹션 보이기

    if (data.length > rowsToShow) {
        loadMoreBtn.style.display = 'inline-block'; // 더보기 버튼 보이기
    }

    currentVisibleRows = rowsToShow;

    // 더보기 버튼 클릭 시 처리
    loadMoreBtn.addEventListener('click', () => {
        const rows = tableBody.querySelectorAll('tr');
        const newVisibleRows = currentVisibleRows + rowsToShow;  // 5개 더 표시

        rows.forEach((row, index) => {
            if (index < newVisibleRows) {
                row.style.display = '';  // 숨겨진 행 보이기
            }
        });

        currentVisibleRows = newVisibleRows;

        // 모든 행이 보이면 더보기 버튼 숨기기
        if (currentVisibleRows >= data.length) {
            loadMoreBtn.style.display = 'none';
        }
    });
}



// 페이지 로드 시 로그인 상태를 확인하여 버튼을 표시 또는 숨김
window.onload = function () {
    const authToken = localStorage.getItem('authToken'); // 로그인 토큰 가져오기
    const consultButton = document.getElementById('consult-btn');

    if (authToken) {
        // 로그인 상태: 버튼을 표시
        consultButton.style.display = 'block';
        console.log('로그인 상태 확인됨, 버튼 표시');  // 로그: 로그인 상태 확인
    } else {
        // 비로그인 상태: 버튼을 숨김
        consultButton.style.display = 'none';
        console.log('로그인 상태 확인되지 않음, 버튼 숨김');  // 로그: 비로그인 상태 확인
    }
};

document.getElementById('consult-btn').addEventListener('click', function () {
    console.log('Gemma 상담 버튼 클릭 상태 확인');  // 로그 1: 클릭 상태 확인

    const authToken = localStorage.getItem('authToken');  // 로그인 토큰 가져오기
    console.log('로그인 토큰 확인:', authToken);  // 로그 2: 토큰 값 확인

    // 로그인 토큰이 없을 경우 경고창을 띄우고 요청 중지
    if (!authToken) {
        alert('로그인이 필요합니다. 로그인 후 다시 시도해주세요.');
        console.log('로그인 토큰이 없습니다. 요청 중지');  // 로그 3: 로그인 실패 메시지
        return;
    }

    // API에 보낼 요청 데이터
    const requestData = {
        "formatted_data": "내 피부는 어떻게 관리해야 하나요?"
    };

    // 기존 결과를 숨기기
    document.getElementById('expert-response-section').style.display = 'none';
    console.log('API 호출 준비 완료');  // 로그 4: API 호출 준비

    // API 호출
    fetch('api/gemma/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`  // Bearer 토큰으로 인증
        },
        body: JSON.stringify(requestData)  // 요청 데이터를 JSON으로 변환하여 전송
    })        
    .then(response => {
        console.log('API 응답 수신 중');  // 로그 5: API 응답 수신 중

        // 응답이 정상적이지 않을 경우 에러 처리
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('인증 실패: 로그인 후 다시 시도해주세요.');
            } else {
                throw new Error(`API 요청 실패. 상태 코드: ${response.status}`);
            }
        }

        return response.json();  // 성공 시 응답 JSON 처리
    })
    .then(data => {
        console.log('API 응답 처리 완료, 결과 표시');  // 로그 6: API 응답 처리 완료

        // 마크다운 텍스트를 HTML로 변환하는 함수
        function convertMarkdownToHTML(markdown) {
            // 제목 변환
            let html = markdown
                .replace(/## (.*?)\n/g, '<h3>$1</h3>')  // ## 제목 처리
                .replace(/# (.*?)\n/g, '<h2>$1</h2>')   // # 제목 처리
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // 굵은 글씨 변환
                .replace(/\*(.*?)\*/g, '<em>$1</em>')  // 기울임 글씨 변환
                .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')  // 링크 변환
                .replace(/\n/g, '<br>')  // 줄바꿈 처리
                .replace(/(\d+)\. (.*?)(?=\n|$)/g, '<p><strong>$1.</strong> $2</p>');  // 번호 리스트 변환

            return html;
        }

        const markdownText = data.gemma_response;
        const htmlText = convertMarkdownToHTML(markdownText); // 간단한 마크다운 변환
        document.getElementById('gemma-response').innerHTML = htmlText;

        document.getElementById('expert-response-section').style.display = 'block';
        console.log('결과 섹션 표시됨');  // 로그 7: 결과 표시됨
    })
    .catch(error => {
        // API 요청 중 오류 발생 시 처리
        console.error('전문가 상담 요청 중 오류 발생:', error);
        alert(`오류 발생: ${error.message}`);

        // 오류 발생 시 결과 섹션을 숨김
        document.getElementById('expert-response-section').style.display = 'none';
    });

    console.log('API 호출 완료');  // 로그 8: API 호출 완료
});
}})    
