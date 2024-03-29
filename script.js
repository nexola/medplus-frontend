const url = "https://ubs-zxgf.onrender.com";
const token = "";

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
  birth_date: "",
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
async function postJson(endpoint, options = {}, objInput = {}) {
  options.body = JSON.stringify(objInput);
  const response = await fetch(`${url}/${endpoint}`, options);
  if (!response.ok) {
    const message = await response.text();
    console.log(message);
    return message;
  }
  const json = await response.json();
  if (
    (endpoint = "oauth2/token" && response.code >= 200 && response.code < 300)
  ) {
    token = json.access_token;
  }

  console.log(json);
  return json;
}

function getInputs(form, objInput, endpoint, e) {
  e.preventDefault();
  form.forEach((input) => {
    objInput[input.name] = input.value;
    if (input.name === "birth_date") {
      objInput["birth_date"] = instantFormat(input.value);
    }
  });
  clearInputs(form);
  console.log(objInput);
  postJson(endpoint, optionsPost, objInput);
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
  getInputs.bind(null, formLogin, loginInput, "oauth2/token")
);
btnSignupDoctor?.addEventListener(
  "click",
  getInputs.bind(null, formDoctor, signupDoctorInput, "doctors")
);
btnSignupPatient?.addEventListener(
  "click",
  getInputs.bind(null, formPatient, signupPatientInput, "patients")
);
