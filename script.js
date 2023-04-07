const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//ste strength circle color to grey
setIndicator("#ccc");



//set passwordLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    // kitne part ko violet show karna hai in slider
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0 0 15px 1px ${color}`;
}
// this function gives a random no. between min and max range
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
// this function gives a random integer between 0 and 9
function generateRandomNumber() {
    return getRndInteger(0,9);
}
// this function gives a character(lower case) between ASCII value 97 and 123
function generateLowerCase() {  
       return String.fromCharCode(getRndInteger(97,123))
}
// this function gives a character(upper case) between ASCII value 65 and 91
function generateUpperCase() {  
    return String.fromCharCode(getRndInteger(65,91))
}
// this function gives a random symbol/character by traversing symbol string stored in line 13 
function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt( randNum);
}
// this function sees which checkbox are checked , which are unchecked and set color based on specific conditions
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}
// this function copies content on clipboard (using clipboard's right-text wala method) that is available on Password-generator box 
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}
// function to shuffle array of password using Fisher Yates algo
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        // finding random j , using random function
        const j = Math.floor(Math.random() * (i + 1));
        // swap nunmber at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}
// fucntion to check if checkbox is checked or not
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition (desirable as per developer need you can add the condition or not)
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}
// eventListener on all checkboxes
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

// eventListener to change value of slider 
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

// eventListener for if passwordDisplay has non-empty value only then you can copy content.  
copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

// eventListener on generate password button
generateBtn.addEventListener('click', () => {
    //if none of the checkbox are selected then no password can be generated i.e return
    if(checkCount == 0) 
        return;
    
    // special case
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the jouney to find new password
    console.log("Starting the Journey");
    //remove old password
    password = "";

    //let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("Compulsory adddition done");

    //remaining adddition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");

    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");

    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");

    //calculate strength
    calcStrength();
});

              //NOTE: handleslider() ka kam hai ki vho password ko UI pe reflect karata hai 
            //   setIndicator ka kam hai vho strenght wale indicator mei input color and shadow set kar deta hai