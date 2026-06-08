"use client";
import { useSite } from "@/lib/site-context";

/* Forwards a search to the booking site (tour.journeylife.co.th/search.php).
   Field names + value formats mirror that site's real GET form exactly:
   keyword, keywords, priceRange, cstartdate, cenddate, day, tourid, sort=new.
   Dates submit as DD-MM-BBBB (Buddhist year = Gregorian + 543). */

const SEARCH_ENDPOINT = "https://tour.journeylife.co.th/search.php";

// priceRange option values, copied verbatim from the booking site.
const PRICE_RANGES = [
  "0-5000", "5000-10000", "10000-15000", "15000-20000", "20000-25000",
  "25000-30000", "30000-35000", "35000-40000", "45000-50000", "50000-60000",
  "60000-70000", "70000-80000", "80000-90000", "90000-100000", "100000-150000",
  "150000-200000", "200000-300000", "300000-400000", "400000",
];

const DAYS = Array.from({ length: 30 }, (_, i) => i + 1);

const baht = (n: string) => Number(n).toLocaleString("en-US");

/** yyyy-mm-dd (native date input) → DD-MM-BBBB (Buddhist year), as search.php expects. */
function toBuddhist(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "";
  return `${d}-${m}-${Number(y) + 543}`;
}

export function TourSearch() {
  const { t } = useSite();
  const s = t.overseasPackages.search;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const params = new URLSearchParams({ sort: "new" });

    for (const key of ["keyword", "keywords", "priceRange", "day", "tourid"] as const) {
      const v = (fd.get(key) ?? "").toString().trim();
      if (v) params.set(key, v);
    }
    for (const key of ["cstartdate", "cenddate"] as const) {
      const v = toBuddhist((fd.get(key) ?? "").toString());
      if (v) params.set(key, v);
    }

    window.open(`${SEARCH_ENDPOINT}?${params.toString()}`, "_blank", "noopener,noreferrer");
  }

  const label = "block text-[12px] font-semibold text-brand-ink mb-1.5";
  const field =
    "w-full rounded-lg border border-brand-line bg-white px-3.5 py-2.5 text-[14px] text-brand-ink placeholder:text-brand-mute/60 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15";

  return (
    <form
      onSubmit={handleSubmit}
      // No-JS fallback: still submits (dates degrade to yyyy-mm-dd, which JS fixes when enabled).
      action={SEARCH_ENDPOINT}
      method="get"
      target="_blank"
      className="rounded-2xl bg-white p-5 md:p-6 shadow-[0_24px_60px_-24px_rgba(10,16,36,.55)] ring-1 ring-black/5 text-left"
    >
      <input type="hidden" name="sort" value="new" />

      {/* Title */}
      <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-brand-line">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-brand-red shrink-0">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <h3 className="text-[16px] md:text-[17px] font-semibold text-brand-ink">{s.title}</h3>
      </div>

      {/* Fields */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="ts-country" className={label}>{s.country}</label>
          <input id="ts-country" name="keyword" type="text" placeholder={s.countryPh} className={field} />
        </div>

        <div>
          <label htmlFor="ts-keyword" className={label}>{s.keyword}</label>
          <input id="ts-keyword" name="keywords" type="text" placeholder={s.keywordPh} className={field} />
        </div>

        <div>
          <label htmlFor="ts-price" className={label}>{s.price}</label>
          <select id="ts-price" name="priceRange" defaultValue="" className={field}>
            <option value="">{s.pricePh}</option>
            {PRICE_RANGES.map((r) => {
              const [min, max] = r.split("-");
              return (
                <option key={r} value={r}>
                  {max ? `${baht(min)}-${baht(max)}` : `${baht(min)} ${s.priceUp}`}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label htmlFor="ts-day" className={label}>{s.days}</label>
          <select id="ts-day" name="day" defaultValue="" className={field}>
            <option value="">{s.daysPh}</option>
            {DAYS.map((d) => (
              <option key={d} value={d}>{d} {s.daysUnit}</option>
            ))}
          </select>
        </div>

        {/* Travel date range */}
        <div className="sm:col-span-2">
          <span className={label}>{s.range}</span>
          <div className="grid grid-cols-2 gap-3">
            <input name="cstartdate" type="date" aria-label={s.from} className={field} />
            <input name="cenddate" type="date" aria-label={s.to} className={field} />
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <label htmlFor="ts-code" className={label}>{s.code}</label>
          <input id="ts-code" name="tourid" type="text" placeholder={s.codePh} className={field} />
        </div>

        {/* Submit */}
        <div className="sm:col-span-2 lg:col-span-1 flex flex-col justify-end">
          <button type="submit" className="btn btn-red w-full">
            {s.submit}
            <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </form>
  );
}
