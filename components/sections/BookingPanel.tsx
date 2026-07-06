import { site } from "@/content/site";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

/** Static calendar visual — swapped for a real Cal.com/Calendly iframe once `site.bookingUrl` is set. */
function CalendarMock() {
  const today = new Date();
  const month = today.toLocaleString("en-US", { month: "long", year: "numeric" });
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstWeekday = (new Date(today.getFullYear(), today.getMonth(), 1).getDay() + 6) % 7;
  const available = new Set([3, 4, 8, 9, 10, 15, 16, 17, 22, 23, 24, 29, 30]);

  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="rounded-2xl bg-white p-6 text-ink-950 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
      <p className="text-center text-sm font-semibold">Pick a day</p>
      <div className="mt-4 flex items-center justify-between text-sm font-medium">
        <span aria-hidden>‹</span>
        <span>{month}</span>
        <span aria-hidden>›</span>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-y-2 text-center text-xs">
        {WEEKDAYS.map((d) => (
          <span key={d} className="text-gray-400">
            {d}
          </span>
        ))}
        {cells.map((day, i) => (
          <span
            key={i}
            className={
              day && available.has(day)
                ? "mx-auto flex size-7 items-center justify-center rounded-full bg-[#eef1ff] font-medium text-[#4d5bf7]"
                : "mx-auto flex size-7 items-center justify-center text-gray-300"
            }
          >
            {day ?? ""}
          </span>
        ))}
      </div>
      <p className="mt-5 border-t border-gray-100 pt-4 text-center text-xs text-gray-400">
        Timezone · {Intl.DateTimeFormat().resolvedOptions().timeZone.replace("_", " ")}
      </p>
    </div>
  );
}

export default function BookingPanel() {
  if (site.bookingUrl) {
    return (
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <iframe src={site.bookingUrl} title="Book a call" className="h-[560px] w-full" />
      </div>
    );
  }
  return <CalendarMock />;
}
