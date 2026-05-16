const nameGate = document.querySelector("#nameGate");
const nameForm = document.querySelector("#nameForm");
const nameInput = document.querySelector("#nameInput");
const questionStage = document.querySelector("#questionStage");
const headline = document.querySelector("#headline");
const yesButton = document.querySelector("#yesButton");
const noButton = document.querySelector("#noButton");
const bouquetWrap = document.querySelector("#bouquetWrap");
const sadWrap = document.querySelector("#sadWrap");
const dramaticAudio = document.querySelector("#dramaticAudio");

const sessionId = crypto.randomUUID();
let visitorName = "";
let currentStep = 0;
let stage = "initial";

async function recordChoice(choice) {
  currentStep += 1;

  try {
    await fetch("/api/log-choice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId,
        visitorName,
        step: currentStep,
        stage,
        choice,
      }),
    });
  } catch (error) {
    console.warn("Seçim kaydedilemedi:", error);
  }
}

nameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  visitorName = nameInput.value.trim();

  if (!visitorName) {
    return;
  }

  nameGate.hidden = true;
  questionStage.hidden = false;
});

noButton.addEventListener("click", () => {
  if (document.body.classList.contains("is-unsure")) {
    stage = "confirmation";
    recordChoice("Hayır");
    document.body.classList.add("is-final");
    document.body.classList.remove("is-unsure");
    yesButton.remove();
    noButton.remove();
    bouquetWrap.setAttribute("aria-hidden", "false");
    return;
  }

  stage = "initial";
  recordChoice("Hayır");
  document.body.classList.add("is-unsure");
  headline.textContent = "Emin misinnn 😔";
  yesButton.textContent = "Evet";
  noButton.textContent = "Hayır";
});

yesButton.addEventListener("click", () => {
  const choice = yesButton.textContent.trim();

  if (document.body.classList.contains("is-unsure")) {
    stage = "confirmation";
    recordChoice(choice);
    document.body.classList.add("is-sad");
    document.body.classList.remove("is-unsure");
    yesButton.remove();
    noButton.remove();
    sadWrap.setAttribute("aria-hidden", "false");
    dramaticAudio.play().catch(() => {});
    return;
  }

  stage = "initial";
  recordChoice(choice);
  document.body.classList.add("is-final");
  yesButton.remove();
  noButton.remove();
  bouquetWrap.setAttribute("aria-hidden", "false");
});
