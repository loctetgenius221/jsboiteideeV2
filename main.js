// @ts-nocheck
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://lnuhmrfpkfxkdruisdbf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxudWhtcmZwa2Z4a2RydWlzZGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEwMDU2ODEsImV4cCI6MjAzNjU4MTY4MX0.1tZHnLYagUVk6wx1B2225f6ugGrRtm_25aIfDxTtKpg"
);

document.addEventListener("DOMContentLoaded", function () {
  const formSection = document.getElementById("form-section");
  const formulaire = document.getElementById("formulaire");
  const libelleInput = document.getElementById("libelle");
  const categorieSelect = document.getElementById("categorie");
  const messageInput = document.getElementById("message");

  const libelleError = document.getElementById("libelleError");
  const categorieError = document.getElementById("categorieError");
  const messageError = document.getElementById("messageError");
  const listIdee = document.getElementById("listIdee");
  const generalErrorPopup = document.getElementById("generalErrorPopup");

  const tableCategorie = ["politique", "économie", "social", "culture"];

  libelleInput.addEventListener("blur", validerLibelle);
  categorieSelect.addEventListener("blur", validerCategorie);
  messageInput.addEventListener("blur", validerMessage);

  formulaire.addEventListener("submit", async function (event) {
    event.preventDefault();

    const isLibelleValid = validerLibelle();
    const isCategorieValid = validerCategorie();
    const isMessageValid = validerMessage();

    if (!isLibelleValid || !isCategorieValid || !isMessageValid) {
      afficherPopupErreur("Veuillez remplir tous les champs requis");
    } else {
      await ajouterIdeeSupabase();
      formulaire.reset();
    }
  });

  async function ajouterIdeeSupabase() {
    const nouvelleIdee = {
      libelle: libelleInput.value.trim(),
      categorie: categorieSelect.value,
      message: messageInput.value.trim(),
      approuvee: false,
    };

    const { data, error } = await supabase.from("ideas").insert([nouvelleIdee]);

    if (error) {
      afficherPopupErreur("Erreur lors de l'ajout de l'idée");
    } else {
      afficherIdees();
    }
  }

  function afficherIdees() {
    supabase
      .from("ideas")
      .select("*")
      .then(({ data: ideas, error }) => {
        if (error) {
          afficherPopupErreur(
            "Erreur lors de la récupération des idées depuis Supabase"
          );
          console.error(error);
          return;
        }

        listIdee.innerHTML = "";

        ideas.forEach((item) => {
          let card = document.createElement("div");
          card.className = "card";

          if (item.approuvee) {
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
          deleteButton.addEventListener("click", () => supprimerIdee(item.id));

          let approveButton = document.createElement("button");
          approveButton.textContent = "Approuver";
          approveButton.style.display = item.approuvee ? "none" : "block";
          approveButton.addEventListener("click", () => approuverIdee(item.id));

          let disapproveButton = document.createElement("button");
          disapproveButton.textContent = "Désapprouver";
          disapproveButton.style.display = item.approuvee ? "block" : "none";
          disapproveButton.addEventListener("click", () =>
            desapprouverIdee(item.id)
          );

          cardButtons.appendChild(deleteButton);
          cardButtons.appendChild(approveButton);
          cardButtons.appendChild(disapproveButton);

          card.appendChild(libelle);
          card.appendChild(categorie);
          card.appendChild(message);
          card.appendChild(cardButtons);

          listIdee.appendChild(card);
        });
      });
  }

  async function supprimerIdee(id) {
    const { error } = await supabase.from("ideas").delete().eq("id", id);

    if (error) {
      afficherPopupErreur("Erreur lors de la suppression de l'idée");
    } else {
      afficherIdees();
    }
  }

  async function approuverIdee(id) {
    const { error } = await supabase
      .from("ideas")
      .update({ approuvee: true })
      .eq("id", id);

    if (error) {
      afficherPopupErreur("Erreur lors de l'approbation de l'idée");
    } else {
      afficherIdees();
    }
  }

  async function desapprouverIdee(id) {
    const { error } = await supabase
      .from("ideas")
      .update({ approuvee: false })
      .eq("id", id);

    if (error) {
      afficherPopupErreur("Erreur lors de la désapprobation de l'idée");
    } else {
      afficherIdees();
    }
  }

  function afficherPopupErreur(message) {
    generalErrorPopup.textContent = message;
    generalErrorPopup.style.display = "block";
    formSection.style.display = "none";

    setTimeout(() => {
      generalErrorPopup.style.display = "none";
      formSection.style.display = "flex";
    }, 2000);
  }

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

  afficherIdees();
});
