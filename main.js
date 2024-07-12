// @ts-nocheck
document.addEventListener("DOMContentLoaded", function () {
  // On récupère nos données
  const formSection = document.getElementById("form-section");
  const formulaire = document.getElementById("formulaire");
  const libelleInput = document.getElementById("libelle");
  const categorieSelect = document.getElementById("categorie");
  const messageInput = document.getElementById("message");

  const libelleError = document.getElementById("libelleError");
  const categorieError = document.getElementById("categorieError");
  const messageError = document.getElementById("messageError");
  const listIdee = document.getElementById("listIdee");
  const generalError = document.getElementById("generalError");

  const tableCategorie = ["politique", "économie", "social", "culture"];

  let idee = JSON.parse(localStorage.getItem("idee")) || [];

  afficherIdees();

  libelleInput.addEventListener("blur", validerLibelle);
  categorieSelect.addEventListener("blur", validerCategorie);
  messageInput.addEventListener("blur", validerMessage);

  formulaire.addEventListener("submit", function (event) {
    event.preventDefault();

    const isLibelleValid = validerLibelle();
    const isCategorieValid = validerCategorie();
    const isMessageValid = validerMessage();

    if (!isLibelleValid || !isCategorieValid || !isMessageValid) {
      if (
        !libelleInput.value &&
        !categorieSelect.value &&
        !messageInput.value
      ) {
        afficherPopupErreur("Veuillez remplir tous les champs requis");
      }
    } else {
      ajouterIdee();
      formulaire.reset();
    }
  });

  messageInput.addEventListener("input", function () {
    let message = messageInput.value.trim();
    if (message.length > 255) {
      messageInput.value = message.substring(0, 255);
    }
  });

  libelleInput.addEventListener("input", function () {
    let libelle = libelleInput.value.trim();
    if (libelle.length > 50) {
      libelleInput.value = libelle.substring(0, 50);
    }
  });

  function ajouterIdee() {
    let nouvelleIdee = {
      libelle: libelleInput.value.trim(),
      categorie: categorieSelect.value,
      message: messageInput.value.trim(),
      approuvee: false,
    };

    idee.push(nouvelleIdee);
    localStorage.setItem("idee", JSON.stringify(idee));
    afficherIdees();
  }

  function afficherIdees() {
    listIdee.innerHTML = "";

    idee.forEach((item, index) => {
      let card = document.createElement("div");
      card.className = "card";

      if (item.approuvee === true) {
        card.classList.add("approved");
      } else if (item.approuvee === false) {
        card.classList.add("disapproved");
      }

      let libelle = document.createElement("h3");
      libelle.textContent = item.libelle;

      let categorie = document.createElement("p");
      categorie.className = "card-category";
      categorie.textContent = `Catégorie: ${item.categorie}`;

      let message = document.createElement("p");
      message.textContent = item.message;

      let cardButtons = document.createElement("div");
      cardButtons.className = "card-buttons";

      let deleteButton = document.createElement("button");
      deleteButton.textContent = "Supprimer";
      deleteButton.addEventListener("click", () => supprimerIdee(index));

      let approveButton = document.createElement("button");
      approveButton.textContent = "Approuver";
      approveButton.style.display = item.approuvee ? "none" : "block";
      approveButton.addEventListener("click", () => approuverIdee(index));

      let disapproveButton = document.createElement("button");
      disapproveButton.textContent = "Désapprouver";
      disapproveButton.style.display = item.approuvee ? "block" : "none";
      disapproveButton.addEventListener("click", () => desapprouverIdee(index));

      cardButtons.appendChild(deleteButton);
      cardButtons.appendChild(approveButton);
      cardButtons.appendChild(disapproveButton);

      card.appendChild(libelle);
      card.appendChild(categorie);
      card.appendChild(message);
      card.appendChild(cardButtons);

      listIdee.appendChild(card);
    });
  }

  function supprimerIdee(index) {
    idee.splice(index, 1);
    localStorage.setItem("idee", JSON.stringify(idee));
    afficherIdees();
  }

  function approuverIdee(index) {
    idee[index].approuvee = true;
    localStorage.setItem("idee", JSON.stringify(idee));
    afficherIdees();
  }

  function desapprouverIdee(index) {
    idee[index].approuvee = false;
    localStorage.setItem("idee", JSON.stringify(idee));
    afficherIdees();
  }

  function afficherPopupErreur(message) {
    const generalErrorPopup = document.getElementById("generalErrorPopup");

    generalErrorPopup.textContent = message;
    generalErrorPopup.style.display = "block";
    formSection.style.display = "none";

    setTimeout(() => {
      generalErrorPopup.style.display = "none";
      formSection.style.display = "flex";
    }, 2000);
  }

  // On crée nos fonctions pour valider chaque champ
  function validerLibelle() {
    let libelle = libelleInput.value.trim();
    let monRegex =
      /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s]+$/;
    if (libelle.length < 3 || libelle.length > 50) {
      libelleError.textContent =
        "Le champ doit comporter entre 3 et 50 caractères";
      libelleError.style.display = "block";
      return false;
    } else if (!monRegex.test(libelle)) {
      libelleError.textContent = "Le champ ne doit comporter que des lettres";
      libelleError.style.display = "block";
      return false;
    } else {
      libelleError.textContent = "";
      libelleError.style.display = "none";
      return true;
    }
  }

  function validerCategorie() {
    if (categorieSelect.value === "") {
      categorieError.textContent = "Le champ catégorie est requis";
      categorieError.style.display = "block";
      return false;
    } else if (!tableCategorie.includes(categorieSelect.value)) {
      categorieError.textContent = "La catégorie n'existe pas";
      categorieError.style.display = "block";
      return false;
    } else {
      categorieError.textContent = "";
      categorieError.style.display = "none";
      return true;
    }
  }

  function validerMessage() {
    let message = messageInput.value.trim();
    let monRegex =
      /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s]+$/;

    if (message.length < 15 || message.length > 255) {
      messageError.textContent =
        "Le champ doit comporter entre 15 et 255 caractères";
      messageError.style.display = "block";
      return false;
    } else if (!monRegex.test(message)) {
      messageError.textContent = "Le champ ne doit comporter que des lettres";
      messageError.style.display = "block";
      return false;
    } else {
      messageError.textContent = "";
      messageError.style.display = "none";
      return true;
    }
  }
});
