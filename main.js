// @ts-nocheck
document.addEventListener("DOMContentLoaded", function () {
  // On récupère nos données
  const formulaire = document.getElementById("formulaire");
  const libelleInput = document.getElementById("libelle");
  const categorieSelect = document.getElementById("categorie");
  const messageInput = document.getElementById("message");

  const libelleError = document.getElementById("libelleError");
  const categorieError = document.getElementById("categorieError");
  const messageError = document.getElementById("messageError");
  const listIdee = document.getElementById("listIdee");
  const generalError = document.getElementById("generalError"); // Ajout d'un élément pour afficher les erreurs générales

  const tableCategorie = ["politique", "économie", "social", "culture"];

  let idee = JSON.parse(localStorage.getItem("idee")) || []; // Charger les données depuis le local storage

  afficherIdees(); // Afficher les idées au chargement de la page

  // On déclare nos écouteurs d'événements pour pouvoir faire la validation dès que le champ perd le focus
  libelleInput.addEventListener("blur", validerLibelle);
  categorieSelect.addEventListener("blur", validerCategorie);
  messageInput.addEventListener("blur", validerMessage);

  // Ajout de l'écouteur d'événement pour la soumission du formulaire
  formulaire.addEventListener("submit", function (event) {
    event.preventDefault(); // Empêcher l'envoi du formulaire par défaut

    // Validation des champs
    const isLibelleValid = validerLibelle();
    const isCategorieValid = validerCategorie();
    const isMessageValid = validerMessage();

    // Si l'un des champs n'est pas valide, afficher les erreurs
    if (!isLibelleValid || !isCategorieValid || !isMessageValid) {
      // Si aucun champ n'est rempli, afficher un message général
      if (
        !libelleInput.value &&
        !categorieSelect.value &&
        !messageInput.value
      ) {
        generalError.textContent = "Veuillez remplir tous les champs requis";
        generalError.style.display = "block";
        formulaire.style.display = "none";

        setTimeout(() => {
          generalError.style.display = "none";
          formulaire.style.display = "block";
        }, 2000);
      }
    } else {
      // Ajouter les données au tableau
      ajouterIdee();

      // Réinitialiser le formulaire
      formulaire.reset();
    }
  });

  // Fonction pour ajouter les données au tableau et les sauvegarder dans le local storage
  function ajouterIdee() {
    let nouvelleIdee = {
      libelle: libelleInput.value.trim(),
      categorie: categorieSelect.value,
      message: messageInput.value.trim(),
      approuvee: false, // Nouveau champ pour l'approbation
    };

    idee.push(nouvelleIdee);
    localStorage.setItem("idee", JSON.stringify(idee)); // Sauvegarder les données dans le local storage
    afficherIdees();
  }

  // Fonction pour afficher les idées sous forme de cartes
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

  // Fonction pour supprimer une idée
  function supprimerIdee(index) {
    idee.splice(index, 1);
    localStorage.setItem("idee", JSON.stringify(idee));
    afficherIdees();
  }

  // Fonction pour approuver une idée
  function approuverIdee(index) {
    idee[index].approuvee = true;
    localStorage.setItem("idee", JSON.stringify(idee));
    afficherIdees();
  }

  // Fonction pour désapprouver une idée
  function desapprouverIdee(index) {
    idee[index].approuvee = false;
    localStorage.setItem("idee", JSON.stringify(idee));
    afficherIdees();
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
