const loginForm = document.querySelector("#loginForm");
const passwordInput = document.querySelector("#password");
const dashboard = document.querySelector("#dashboard");
const statusText = document.querySelector("#status");
const totalCount = document.querySelector("#totalCount");
const yesCount = document.querySelector("#yesCount");
const noCount = document.querySelector("#noCount");
const recordsBody = document.querySelector("#recordsBody");

function formatDate(isoString) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoString));
}

function renderRecords(records) {
  totalCount.textContent = records.length;
  yesCount.textContent = records.filter((record) => record.choice === "Evet").length;
  noCount.textContent = records.filter((record) => record.choice === "Hayır").length;

  recordsBody.innerHTML = records
    .map(
      (record) => `
        <tr>
          <td>${record.visitorName}</td>
          <td>${formatDate(record.createdAt)}</td>
          <td>${record.stage === "initial" ? "İlk soru" : "Emin misin?"}</td>
          <td>${record.step}</td>
          <td>${record.choice}</td>
        </tr>
      `,
    )
    .join("");
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusText.textContent = "Kayıtlar yükleniyor...";

  try {
    const response = await fetch("/api/get-logs", {
      headers: {
        Authorization: `Bearer ${passwordInput.value}`,
      },
    });

    if (!response.ok) {
      throw new Error("Şifre yanlış veya kayıtlar alınamadı.");
    }

    const records = await response.json();
    renderRecords(records);
    dashboard.hidden = false;
    loginForm.hidden = true;
    statusText.textContent = "";
  } catch (error) {
    statusText.textContent = error.message;
  }
});
