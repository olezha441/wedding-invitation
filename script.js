const weddingDate = new Date("2026-08-26T14:00:00+03:00");

function downloadCalendarEvent() {
  const event = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//RU",
    "BEGIN:VEVENT",
    "UID:wedding-20260826@example.local",
    "DTSTAMP:20260713T000000Z",
    "DTSTART:20260826T110000Z",
    "DTEND:20260826T130000Z",
    "SUMMARY:Свадьба Дмитрия и Яны",
    "LOCATION:ЗАГС Рамонского района, улица Советская",
    "DESCRIPTION:Приглашение на свадьбу Дмитрия и Яны. Диагноз: любовь.",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([event], { type: "text/calendar;charset=utf-8" }));
  link.download = "wedding-dmitry-yana.ics";
  link.click();
  URL.revokeObjectURL(link.href);
}

function encodeFormData(formData) {
  return new URLSearchParams(formData).toString();
}

document.querySelector("#calendarButton").addEventListener("click", downloadCalendarEvent);

document.querySelector("#rsvpForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const message = document.querySelector("#formMessage");
  const submitButton = form.querySelector("button[type='submit']");
  const formData = new FormData(form);
  const name = formData.get("name").trim();

  submitButton.disabled = true;
  submitButton.textContent = "Отправляем...";
  message.hidden = true;

  try {
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encodeFormData(formData)
    });

    if (!response.ok) {
      throw new Error("Netlify Forms response was not ok");
    }

    localStorage.setItem("wedding-rsvp", JSON.stringify({
      name,
      attendance: formData.get("attendance") === "yes" ? "С радостью буду" : "К сожалению, не смогу",
      drink: formData.get("drink") || "не указано",
      comment: formData.get("comment").trim() || "нет",
      savedAt: new Date().toISOString()
    }));

    form.reset();
    message.textContent = `${name}, спасибо! Ваш ответ отправлен.`;
    message.hidden = false;
    submitButton.textContent = "Ответ отправлен";
  } catch {
    message.textContent = "Ответ не отправился. Если сайт открыт локально, это нормально: Netlify Forms начнёт работать после публикации на Netlify.";
    message.hidden = false;
    submitButton.disabled = false;
    submitButton.textContent = "Отправить ещё раз";
  }
});
