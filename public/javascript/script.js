let selectPrefecture = "";
let selectMountain = "";
let selectCourseInfo = [];
let hikesData = [];
let bpWeight = "";
let csResult = "";

async function fetchPrefecturesData() {
    try {
        const response = await fetch('http://localhost:3000/api/prefectures');
        if (!response.ok) {
            throw new Error('Network response of prefectures was not ok');
        }
        const prefecturesData = await response.json();
        displayPrefecturesData(prefecturesData);
    } catch (error) {
        console.error('There has been a problem with your fetch operation of prefectures', error);
    }
}

async function fetchHikesData() {
    try {
        const response = await fetch('http://localhost:3000/api/hikes');
        if (!response.ok) {
            throw new Error('Network response of hikes was not ok');
        }
        hikesData = await response.json();
    } catch (error) {
        console.error('There has been a problem with your fetch operation of hikes', error);
    }
}

// 県名の選択
function displayPrefecturesData(prefecturesData) {
    console.log(prefecturesData);
    let select = document.createElement('select');
    const option = document.createElement('option');
    option.text = "選択してください";
    select.appendChild(option);
    select.id = 'prefectureSelect';
    for (let i = 0; i < prefecturesData.length; i++) {
        let option = document.createElement('option');
        option.value = prefecturesData[i].name;
        option.text = prefecturesData[i].name;
        select.appendChild(option);
    }
    document.getElementById('dropdown-container').innerHTML = '';
    document.getElementById('dropdown-container').appendChild(select);
    document.getElementById('prefectureSelect').addEventListener('change', function() {
        selectPrefecture = this.value;
        console.log(selectPrefecture);
        displayHikesData(hikesData);
    });
}

// 山岳名の選択
function displayHikesData(hikesData) {
    console.log(hikesData);
    let matchedPrefecture = hikesData.filter(hike => selectPrefecture.includes(hike.prefectures));
    console.log(matchedPrefecture);
    let select = document.createElement('select');
    const option = document.createElement('option');
    option.text = "選択してください";
    select.appendChild(option);
    select.id = 'hikesSelect';
    for (let i = 0; i < matchedPrefecture.length; i++) {
        let option = document.createElement('option');
        option.text = matchedPrefecture[i].mountain;
        option.value = matchedPrefecture[i].mountain;
        select.appendChild(option);
    }
    document.getElementById('dropdown-mountain').innerHTML = '';
    document.getElementById('dropdown-mountain').appendChild(select);
    document.getElementById('hikesSelect').addEventListener('change', function() {
        selectMountain = this.value;
        console.log(selectMountain);
        displayCoursesData(hikesData);
    });
}

// 県名の接尾辞を削除
function formatPrefectureName(prefectureName) {
    if (prefectureName === '北海道') {
        return prefectureName;
    } else {
        return prefectureName.replace(/(都|府|県)$/, '');
    }
}

// コース名の選択
function displayCoursesData(hikesData) {
    let formattedSelectPrefecture = formatPrefectureName(selectPrefecture);
    console.log(formattedSelectPrefecture);
    let matchedMountains = hikesData.filter(hike => hike.mountain === selectMountain && hike.prefectures === formattedSelectPrefecture);
    console.log(matchedMountains);
    let select = document.createElement('select');
    const option = document.createElement('option');
    option.text = "選択してください";
    select.appendChild(option);
    select.id = 'courseSelect';
    for (let i = 0; i < matchedMountains.length; i++) {
        let option = document.createElement('option');
        option.text = matchedMountains[i].course
        option.value = matchedMountains[i].course
        select.appendChild(option);
    }
    document.getElementById('dropdown-course').innerHTML = '';
    document.getElementById('dropdown-course').appendChild(select);
    document.getElementById('courseSelect').addEventListener('change', function () {
        let selectCourse = this.value;
        console.log(selectCourse);
        let selectCourseInfo = hikesData.filter(hike => hike.course === selectCourse)
        calculateCourseScore(selectCourseInfo);
    });
}

// 時間の変換
function convertTimeToHours(time) {
    let hour = parseInt(time.split(':')[0], 10);
    let minutes = parseInt(time.split(':')[1], 10);
    time = hour + (minutes / 60);
    time = Math.round(time * 1000) / 1000;
    return time;
}

// 距離の変換
function convertMeterToKm(m) {
    return m / 1000;
}

// コース定数の計算
function calculateCourseScore(information) {
    for (let i = 0; i < information.length; i++) {
        let info = information[i];
        console.log('山岳情報', info);
        let durationHours = convertTimeToHours(info.duration);
        console.log(durationHours);
        let distanceKm = info.distance;
        console.log(distanceKm);
        let cumulativeUpKm = convertMeterToKm(info.cumulative_up);
        console.log(cumulativeUpKm);
        let cumulativeDownKm = convertMeterToKm(info.cumulative_down);
        console.log(cumulativeDownKm);
        let courseScore = (1.8 * durationHours) + (0.3 * distanceKm) + (10 * cumulativeUpKm) + (0.6 * cumulativeDownKm);
        csResult = Math.round((courseScore) * 1000) / 1000;
        console.log(`${info.course}のコーススコア：`, csResult);
    }
    selectBackpackWeight();
}

document.getElementById('hiking-days').addEventListener('change', function() {
    let selectedValue = document.querySelector('input[name="hiking-days"]:checked').value;

    if (selectedValue === 'option1') {
        document.getElementById('option-info').innerHTML = 'パッキングした状態のザックの重量を選択してください。<br>ザックの重量に関する一般的なガイドラインとして、日帰り登山の場合は体重の10%以下が理想的。';
    } else {
        document.getElementById('option-info').innerHTML = 'パッキングした状態のザックの重量を選択してください。<br>ザックの重量に関する一般的なガイドラインとして、1泊以上の長期登山の場合は体重の20%以下が理想的。';
    }
});

function selectBackpackWeight() {
    let select = document.createElement('select');
    const option = document.createElement('option');
    option.text = '選択してください'
    select.appendChild(option);
    select.id = 'bpWeightSelect';
    for (let i = 0; i < 50; i++) {
        let option = document.createElement('option');
        option.text = (i + 1) + 'kg';
        option.value = i + 1;
        select.appendChild(option);
    }
    document.getElementById('backpack-weight').innerHTML = '';
    document.getElementById('backpack-weight').appendChild(select);
    document.getElementById('bpWeightSelect').addEventListener('change', function() {
    let backPackweight = this.value;
    bpWeight = parseInt(backPackweight, 10);
    console.log(bpWeight);
    fetchUserWeight();
    });
}

async function fetchUserWeight() {
    try {
        const response = await fetch('http://localhost:3000/api/user-weight');
        if (!response.ok) {
            throw new Error('Failed to fetch user weight');
        }
        const data = await response.json();
        const weight = data.weight;
        console.log(weight);
        calculateWaterRequired(csResult, bpWeight, weight);
    } catch (error) {
        console.error('Failed to fetch user weight');
    }
}


function calculateWaterRequired(score, backPackWeight, userWeight) {
    console.log(score, backPackWeight, userWeight);
    let ec = score * (backPackWeight + userWeight);
    console.log(ec);
    let waterRequired = Math.round(((ec / 1000) * 0.8) * 100) / 100;
    console.log(waterRequired);
    document.getElementById('water-required').textContent = waterRequired + 'L';
}

window.addEventListener('DOMContentLoaded', (event) => {
    fetchPrefecturesData();
    fetchHikesData();
});



