const addresForm = document.querySelector("#address-form");
const cepInput = document.querySelector("#cep");
const addressInput = document.querySelector("#address");
const cityInput = document.querySelector("#city");
const neighborhoodInput = document.querySelector("#neighborhood");
const regionInput = document.querySelector("#region");
const formInputs = document.querySelectorAll("[data-input]");
const fadeElement = document.querySelector("#fade");

const closeButton = document.querySelector("#close-message");

//validar entra do cep
cepInput.addEventListener("keypress", (e) => {
  const onlyNumbers = /[0-9]/;
  const key = String.fromCharCode(e.keyCode);

  //permitir apenas numeros
  if (!onlyNumbers.test(key)) {
    e.preventDefault();
    return;
  }
});

//get address event
cepInput.addEventListener("keyup", (e) => {
  const inputValue = e.target.value;

  //verifica a qtde de digitos

  if (inputValue.length === 8) {
    getAddress(inputValue);
  }
});

// pegar endereço da API - get customer address
const getAddress = async (cep) => {
  toggleLoader();

  cepInput.blur();

  const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;

  const response = await fetch(apiUrl);

  const data = await response.json();

  //mostrar erro e resetar o form
  if (data.erro === true) {
    if (!cityInput.hasAttribute("disabled")) {
      toggleDisabled();
    }

    console.log(cep);
    addresForm.reset();
    toggleLoader();
    toggleMessage("CEP inválido, tente novamente!");
    return;
  }

  if (cityInput.value === "") {
    toggleDisabled();
  }

  addressInput.value = data.logradouro;
  cityInput.value = data.localidade;
  neighborhoodInput.value = data.bairro;
  regionInput.value = data.cityInput;

  toggleLoader();
};

//Adicionar ou remover atribute disabled
const toggleDisabled = () => {
  if (regionInput.hasAttribute("disabled")) {
    formInputs.forEach((input) => {
      input.removeAttribute("disabled");
    });
  } else {
    formInputs.forEach((input) => {
      input.setAttribute("disabled", "disabled");
    });
  }
};

// mostrar ou ocultar o loader
const toggleLoader = () => {
  const loaderElement = document.querySelector("#loader");

  fadeElement.classList.toggle("hide");
  loaderElement.classList.toggle("hide");
};

//mostrar ou ocultar mensagem
const toggleMessage = (msg) => {
  const messageElement = document.querySelector("#message");
  const messageElementText = document.querySelector("#message p");

  messageElementText.innerText = msg;

  fadeElement.classList.toggle("hide");
  messageElement.classList.toggle("hide");
};

//fechar modal de mensagem

closeButton.addEventListener("click", () => toggleMessage());

// salvar endereço
addresForm.addEventListener("submit", (e) => {
  e.preventDefault();

  toggleLoader();

  setTimeout(() => {
    toggleLoader();
    toggleMessage("Endereço salvo com sucesso!");
    addresForm.reset();
    toggleDisabled();
  }, 1500);
});
