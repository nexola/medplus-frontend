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
  password: "",
  specialization: "",
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

const optionsLogin = {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "Basic bXljbGllbnRpZDpteWNsaWVudHNlY3JldA==",
  },
};

// DOM Selectors
const formLogin = document.querySelectorAll(".container--form-login .input");
const formDoctor = document.querySelectorAll(".container--form-doctor .input");
const formPatient = document.querySelectorAll(
  ".container--form-patient .input"
);
const containerFormDoctor = document.querySelector(".container--form-doctor");
const containerFormPatient = document.querySelector(".container--form-patient");
const containerFormLogin = document.querySelector(".container--form-login");
const btnLogin = document.getElementById("btn--login");
const btnSignupDoctor = document.getElementById("btn--doctor");
const btnSignupPatient = document.getElementById("btn--patient");

// Functions
async function postJson(endpoint, options = {}, objInput = {}) {
  objInput.name
    ? (options.body = JSON.stringify(objInput))
    : (options.body = `grant_type=password&username=${objInput.email}&password=${objInput.password}`);
  const response = await fetch(`${url}/${endpoint}`, options);
  if (!response.ok) {
    const error = await response.json();

    switch (endpoint) {
      case "oauth2/token":
        displayErrLogin("Usuário ou senha inválidos");
        break;
      case "doctors":
        displayErrForm("Campos inválidos!", containerFormDoctor, error);
        break;
      case "patients":
        displayErrForm("Campos inválidos!", containerFormPatient, error);
      default:
        break;
    }

    console.log(error);
    return error;
  }
  const json = await response.json();
  if (
    (endpoint = "oauth2/token" && response.code >= 200 && response.code < 300)
  ) {
    token = json.access_token;
    return token;
  }
  window.location.href = "https://medplus-fatec.netlify.app/";

  console.log(json);
  return json;
}

function getInputs(form, objInput, endpoint, options, e) {
  e.preventDefault();
  form.forEach((input) => {
    if (!input.value) {
      input.classList.add("inputErr");
      input.placeholder = "Campo obrigatório";
      return;
    }
    objInput[input.name] = input.value;
    if (input.name === "birth_date") {
      objInput["birth_date"] = instantFormat(input.value);
    }
  });
  console.log(objInput);
  postJson(endpoint, options, objInput);
}

function clearInputs(form) {
  form.forEach((input) => (input.value = ""));
}

function instantFormat(string) {
  return string + "T00:00:00Z";
}

function displayErrLogin(message) {
  const err = document.createElement("p");
  err.classList.add("err");
  err.textContent = message;
  containerFormLogin.appendChild(err);
}

function displayErrForm(message, container, error) {
  document.querySelectorAll(".err").forEach((err) => err.remove());
  const err = document.createElement("p");
  err.classList.add("err");
  err.textContent = message;
  container.appendChild(err);
  console.log(error);
  error?.errors?.forEach((err) => {
    const field = document.querySelector(`input[name=${err.field}]`);
    field.value = "";
    field.classList.add("inputErr");
    field.placeholder = err.message;
  });
}

// Event Listeners
btnLogin?.addEventListener(
  "click",
  getInputs.bind(null, formLogin, loginInput, "oauth2/token", optionsLogin)
);
btnSignupDoctor?.addEventListener(
  "click",
  getInputs.bind(null, formDoctor, signupDoctorInput, "doctors", optionsPost)
);
btnSignupPatient?.addEventListener(
  "click",
  getInputs.bind(null, formPatient, signupPatientInput, "patients", optionsPost)
);
