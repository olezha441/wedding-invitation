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

document.querySelector("#calendarButton").addEventListener("click", downloadCalendarEvent);
