const headline = document.querySelector("#headline");
const yesButton = document.querySelector("#yesButton");
const noButton = document.querySelector("#noButton");
const bouquetWrap = document.querySelector("#bouquetWrap");

async function recordChoice(choice) {
  try {
    await fetch("/api/log-choice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ choice }),
    });
  } catch (error) {
    console.warn("Seçim kaydedilemedi:", error);
  }
}

noButton.addEventListener("click", () => {
  recordChoice("Hayır");
  document.body.classList.add("is-unsure");
  headline.textContent = "Emin misinnn 😔";
  yesButton.textContent = "Evet ❤️";
});

yesButton.addEventListener("click", () => {
  recordChoice(yesButton.textContent.trim());
  document.body.classList.add("is-final");
  document.body.classList.remove("is-unsure");
  yesButton.remove();
  noButton.remove();
  bouquetWrap.setAttribute("aria-hidden", "false");
});
