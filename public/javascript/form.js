let getRadioButton = function (name) {
    let result = "";
    let elems = document.getElementsByName(name);
    for (let i = 0; i < elems.length; i++) {
        if (elems[i].checked) {
            result = elems[i].value;
            break;
        }
    }
    return result;
}

let calculateBMR = function (sexual, age, height, weight) {
    let numAge = parseInt(age, 10);
    let numHeight = parseFloat(height);
    let numWeight = parseFloat(weight);
    let bmr;

    if (sexual === 'male') {
        bmr = (13.397 * numWeight) + (4.799 * numHeight) - (5.677 * numAge) + 88.362;
        return bmr;
    }else{
        bmr = (9.247 * numWeight) + (3.098 * numHeight) - (4.330 * numAge) + 447.593;
        return bmr;
    }
}

document.getElementById('btn').addEventListener('click', function() {
    let userSexual = getRadioButton("sexual");
    let userAge = document.getElementById("age").value;
    let userHeight = document.getElementById("height").value;
    let userWeight = document.getElementById("weight").value;

    console.log('性別：' + userSexual);
    console.log('年齢：' + userAge);
    console.log('身長：' + userHeight);
    console.log('体重：' + userWeight);

    let resultBMR = calculateBMR(userSexual, userAge, userHeight, userWeight);
    console.log('基礎代謝量：' + resultBMR.toFixed(2) + 'kcal/日');

    let userData = {sexual: userSexual, age: userAge, height: userHeight, weight: userWeight, bmr: resultBMR};

    fetch('/submit-form',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if(response.ok) {
            window.location.href = '/index';
        } else {
            throw new Error('Network response was not successful');
        }
    })
    .catch(err => {
        console.log('Error:', err);
    });
}, false);


