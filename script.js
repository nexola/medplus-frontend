const url = "https://ubs-zxgf.onrender.com/";

// States
const loginInput = {
  email: "",
  password: "",
};

const signupDoctorInput = {
  name: "",
  email: "",
  specialization: "",
  password: "",
};

const signupPatientInput = {
  name: "",
  email: "",
  password: "",
  cpf: "",
  birthDate: "",
};

const optionsPost = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

// DOM Selectors
const formLogin = document.querySelectorAll(".container--form-login .input");
const formDoctor = document.querySelectorAll(".container--form-doctor .input");
const formPatient = document.querySelectorAll(
  ".container--form-patient .input"
);
const btnLogin = document.getElementById("btn--login");
const btnSignupDoctor = document.getElementById("btn--doctor");
const btnSignupPatient = document.getElementById("btn--patient");

// Functions
async function getJson(url, options = {}, objInput = {}) {
  options.body && (options.body = JSON.stringify(objInput));
  const response = await fetch(url, options);
  return await response.json();
}

function getInputs(form, objInput, e) {
  e.preventDefault();
  form.forEach((input) => {
    objInput[input.name] = input.value;
    if (input.name === "birthDate") {
      objInput[input.name] = instantFormat(input.value);
    }
  });
  clearInputs(form);
  console.log(objInput);
}

function clearInputs(form) {
  form.forEach((input) => (input.value = ""));
}

function instantFormat(string) {
  return string + "T00:00:00Z";
}

// Event Listeners
btnLogin?.addEventListener(
  "click",
  getInputs.bind(null, formLogin, loginInput)
);
btnSignupDoctor?.addEventListener(
  "click",
  getInputs.bind(null, formDoctor, signupDoctorInput)
);
btnSignupPatient?.addEventListener(
  "click",
  getInputs.bind(null, formPatient, signupPatientInput)
);
