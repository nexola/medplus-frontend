const url = "https://ubs-zxgf.onrender.com";
const meuStorage = localStorage;
const token = meuStorage.getItem("token");

// States
const authentication = {
  expires_in: meuStorage.getItem("expires_in") ?? "",
  created_at: meuStorage.getItem("created_at") ?? "",
};

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

const fichaStatus = {
  patient: "",
  date: "",
  time: "",
  status: "",
};

const novaFichaInput = {
  patient: "",
  date: "",
  time: "",
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
const formFichasDoctor = document.querySelectorAll(".input-nova-ficha input");
const containerFormDoctor = document.querySelector(".container--form-doctor");
const containerFormPatient = document.querySelector(".container--form-patient");
const containerFormLogin = document.querySelector(".container--form-login");
const tabelaFichasDoctor = document.querySelector(".tbody-fichas");
const btnLogin = document.getElementById("btn--login");
const btnSignupDoctor = document.getElementById("btn--doctor");
const btnSignupPatient = document.getElementById("btn--patient");
const btnLogout = document.querySelector(".btn-logout");
const btnNovaFicha = document.querySelector(".btn-agendar-consulta");

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

  // window.location.href = "https://medplus-fatec.netlify.app/";
  console.log("Usuário criado com sucesso!");

  console.log(json);
  return json;
}

async function login() {
  optionsLogin.body = `grant_type=password&username=${loginInput.email}&password=${loginInput.password}`;
  const response = await fetch(`${url}/oauth2/token`, optionsLogin);
  if (!response.ok) {
    displayErrLogin("Usuário ou senha inválidos");
    console.log(error);
    return error;
  }

  const json = await response.json();
  console.log(response);
  console.log(json);
  if (response.status >= 200 && response.status < 300) {
    localStorage.setItem("token", json.access_token);
    localStorage.setItem("expires_in", json.expires_in);
    localStorage.setItem("created_at", Date.now());
    authentication.expires_in = json.expires_in;
    authentication.created_at = Date.now();
    // window.location.href = "https://medplus-fatec.netlify.app/main-collab";
    if (isValidToken()) {
      window.location.href = "https://medplus-fatec.netlify.app/main-collab";
    }
    console.log("Usuário logado com sucesso!");
    console.log(authentication);
    token = json.access_token;
    return token;
  }
}

function getInputsLogin(e) {
  e.preventDefault();
  formLogin.forEach((input) => {
    if (!input.value) {
      input.classList.add("inputErr");
      input.placeholder = "Campo obrigatório";
      return;
    }
    loginInput[input.name] = input.value;
  });
  console.log(loginInput);
  login();
}

function isValidToken() {
  if (token) {
    const now = Date.now();
    const expires = parseInt(authentication.expires_in) * 1000;
    const created = parseInt(authentication.created_at);
    const diff = now - created;
    console.log(diff);
    console.log(expires);
    if (diff < expires) {
      return true;
    }
  }
  return false;
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

function logout() {
  localStorage.clear();
  token = "";
  authentication.expires_in = "";
  authentication.created_at = "";
  window.location.href = "https://medplus-fatec.netlify.app/";
}

function redirectToLogin() {
  if (!isValidToken()) {
    window.location.href = "https://medplus-fatec.netlify.app/";
  }
}

// redirectToLogin();

// Event Listeners
btnLogin?.addEventListener("click", getInputsLogin.bind(null));
btnSignupDoctor?.addEventListener(
  "click",
  getInputs.bind(null, formDoctor, signupDoctorInput, "doctors", optionsPost)
);
btnSignupPatient?.addEventListener(
  "click",
  getInputs.bind(null, formPatient, signupPatientInput, "patients", optionsPost)
);
btnLogout?.addEventListener("click", logout);

function getInputsNovaFicha(e) {
  e.preventDefault();
  formFichasDoctor.forEach((input) => {
    if (!input.value) {
      input.classList.add("inputErr");
      input.placeholder = "Campo obrigatório";
      return;
    }
    novaFichaInput[input.name] = input.value;
  });
  console.log(novaFichaInput);
  const instant = novaFichaInput.date + "T" + novaFichaInput.time + ":00Z";
  console.log(instant);
}

function postJsonNovaFicha() {
  console.log(novaFichaInput);
}

async function getFichas() {
  const response = await fetch(`${url}/appointments`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await response.json();
  console.log(json);
  json.forEach((ficha) => {
    const time = ficha.date.split("T")[1].split(":");
    const date = ficha.date.split("T")[0];
    const novaFicha = `<tr>
    <td>${ficha.patient}</td>
    <td>${date}</td>
    <td>${time}</td>
    <td>${ficha.status}</td>
    <td><a href="#">Editar</a></td>
    </tr>`;
    console.log(novaFicha);
    tabelaFichasDoctor.insertAdjacentHTML("beforeend", novaFicha);
  });
}

getFichas();

btnNovaFicha?.addEventListener("click", getInputsNovaFicha.bind(null));
