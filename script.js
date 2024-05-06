const url = "https://ubs-zxgf.onrender.com";
const meuStorage = localStorage;
const token = meuStorage.getItem("token");

// States
const authentication = {
  expires_in: meuStorage.getItem("expires_in"),
  created_at: meuStorage.getItem("created_at"),
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
  date: "",
  state: "AGENDADO",
  patient: {
    cpf: "",
  },
};

const optionsSignup = {
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
const inputSearch = document.querySelector("#search");
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
const btnSearchFichas = document.querySelector(".btn-search-fichas");
const btnVoltarFichas = document.querySelector(".btn-voltar-fichas");

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
    window.location.href = "https://medplus-fatec.netlify.app/main-collab";
    console.log("Usuário logado com sucesso!");
    console.log(authentication);
    token = json.access_token;
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
  document.querySelectorAll(".err").forEach((err) => err.remove());
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

// Event Listeners
btnLogin?.addEventListener("click", getInputsLogin.bind(null));
btnSignupDoctor?.addEventListener(
  "click",
  getInputs.bind(null, formDoctor, signupDoctorInput, "doctors", optionsSignup)
);
btnSignupPatient?.addEventListener(
  "click",
  getInputs.bind(
    null,
    formPatient,
    signupPatientInput,
    "patients",
    optionsSignup
  )
);
btnLogout?.addEventListener("click", logout);

function getInputsNovaFicha(e) {
  const field = document.querySelector(`input[name="cpf"]`);
  field.classList.remove("inputErr");
  field.placeholder = "";
  let time = "";

  e.preventDefault();
  formFichasDoctor.forEach((input) => {
    if (!input.value) {
      return;
    }
    if (input.name === "cpf") {
      novaFichaInput.patient.cpf = input.value;
      return;
    }
    if (input.name === "time") {
      time = input.value;
      return;
    }
    novaFichaInput[input.name] = input.value;
  });
  console.log(novaFichaInput);
  const instant = novaFichaInput.date + "T" + time + ":00.720Z";
  console.log(instant);

  novaFichaInput.date = instant;
  postJsonNovaFicha();
  formFichasDoctor.forEach((input) => (input.value = ""));
}

function postJsonNovaFicha() {
  const field = document.querySelector(`input[name="cpf"]`);
  if (field.value === "") {
    return;
  }
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(novaFichaInput),
  };
  fetch(`${url}/appointments`, options)
    .then((response) => {
      const field = document.querySelector(`input[name="cpf"]`);
      console.log(response);
      if (response.status !== 201) {
        field.value = "";
        field.classList.add("inputErr");
        field.placeholder = "CPF inválido ou não cadastrado!";
      } else {
        getFichas();
        alert("Ficha criada com sucesso!");
      }
      return response.json();
    })
    .then((json) => console.log(json));
}

async function getFichas(e) {
  btnVoltarFichas.style.display = "none";
  e?.preventDefault();
  tabelaFichasDoctor.innerHTML = "";
  const response = await fetch(`${url}/appointments`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await response.json();
  json.forEach((ficha, i) => {
    const time = ficha.date.slice(11, 16);
    const date = ficha.date.split("T")[0].replace(/-/g, "/");
    const novaFicha = `<tr id=${`ficha` + i} class="${ficha.id}">
    <td class="name">${ficha.patient.name}</td>
    <td class="date">${dateFormat(date)}</td>
    <td class="time">${time}</td>
    <td class="state">${ficha.state}</td>
    ${
      ficha.state !== "CANCELADO" && ficha.state !== "CONCLUIDO"
        ? `<td><a href="#" id=${`btn-` + i}>Editar</a></td>`
        : ""
    }
    </tr>`;
    tabelaFichasDoctor.insertAdjacentHTML("beforeend", novaFicha);
  });
}

if (window.location.href.includes("main-collab")) {
  redirectToLogin();
  getFichas();
}

btnNovaFicha?.addEventListener("click", getInputsNovaFicha.bind(null));

function searchFichas(e) {
  e.preventDefault();
  const cpf = inputSearch.value;
  if (cpf === "") return;

  fetch(`${url}/patients/${cpf}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      tabelaFichasDoctor.innerHTML = "";
      json.appointments.forEach((ficha, i) => {
        const time = ficha.date.slice(11, 16);
        const date = ficha.date.split("T")[0].replace(/-/g, "/");
        const novaFicha = `<tr id=${`ficha` + i} class="${ficha.id}">
        <td class="name">${json.name}</td>
        <td class="date">${dateFormat(date)}</td>
        <td class="time">${time}</td>
        <td class="state">${ficha.state}</td>
        <td><a href="#" id=${`btn-` + i}>Editar</a></td>
        </tr>`;
        tabelaFichasDoctor.insertAdjacentHTML("beforeend", novaFicha);
      });
    });

  inputSearch.value = "";

  btnVoltarFichas.style.display = "inline";
}

btnSearchFichas?.addEventListener("click", searchFichas.bind(null));

btnVoltarFichas?.addEventListener("click", getFichas.bind(null));

tabelaFichasDoctor?.addEventListener("click", (e) => {
  e.preventDefault();
  const id = e.target.id;
  if (!id.includes("btn-")) return;
  const btn = e.target;

  if (btn.textContent === "Editar") {
    btn.textContent = "Salvar";

    const index = id.slice(4);
    const ficha = document.querySelector(`#ficha${index}`);
    console.log(ficha);

    ficha.classList.add("ficha-ativa");

    const date = ficha.querySelector(".date");
    const time = ficha.querySelector(".time");
    const state = ficha.querySelector(".state");

    const inputDate = createInput("text", "date", date.textContent);
    const inputTime = createInput("time", "time", time.textContent);
    const inputState = createSelectBox("state", state.textContent);

    ficha.insertBefore(inputDate, date);
    ficha.insertBefore(inputTime, time);
    ficha.insertBefore(inputState, state);
    date.remove();
    time.remove();
    state.remove();
  } else if (btn.textContent === "Salvar") {
    btn.textContent = "Editar";

    const index = id.slice(4);
    const ficha = document.querySelector(`#ficha${index}`);
    const idFicha = ficha.classList[0];
    console.log(idFicha);

    const date = ficha.querySelector(".date");
    const time = ficha.querySelector(".time");
    const state = ficha.querySelector(".state");

    const inputDate = ficha.querySelector(".date");
    const inputTime = ficha.querySelector(".time");
    const inputState = ficha.querySelector(".state");

    const dateValue = inputDate.querySelector("input").value;
    const timeValue = inputTime.querySelector("input").value;
    const stateValue = inputState.querySelector("select").value;

    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        date: inverseDateFormat(dateValue) + "T" + timeValue + ":00.720Z",
        state: stateValue,
      }),
    };

    console.log(options.body);

    fetch(`${url}/appointments/${idFicha}`, options)
      .then((response) => {
        console.log(response);
        if (response.status !== 200) {
          alert("Erro ao editar ficha!");
        } else {
          alert("Ficha alterada com sucesso!");
        }
        return response.json();
      })
      .then((json) => {
        console.log(json);
        getFichas();
      });
  }
});

function dateFormat(date) {
  const [year, month, day] = date.split("/");
  return `${day}/${month}/${year}`;
}

function inverseDateFormat(date) {
  const [day, month, year] = date.split("/");
  return `${year}-${month}-${day}`;
}

function createInput(type, name, value) {
  const input = document.createElement("input");
  const td = document.createElement("td");
  td.classList.add(name);
  input.classList.add("input-edit-ficha");
  input.type = type;
  input.name = name;
  input.value = value;
  td.insertAdjacentElement("beforeend", input);
  return td;
}

function createSelectBox(name, value) {
  const select = document.createElement("select");
  const td = document.createElement("td");
  const selectWrapper = document.createElement("div");

  const options = ["AGENDADO", "CONCLUIDO", "CANCELADO"];
  options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    select.appendChild(optionElement);
  });

  selectWrapper.classList.add("select-wrapper");
  td.classList.add(name);
  select.classList.add("input-edit-ficha");
  select.name = name;
  select.value = value;
  selectWrapper.insertAdjacentElement("beforeend", select);
  td.insertAdjacentElement("beforeend", selectWrapper);
  return td;
}
