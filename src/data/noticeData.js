// Village notices and news. Add an entry only when it is confirmed by the
// panchayat or another named source, and always give the real date it was
// issued as a fixed string (never a computed "today").
//
// Notice shape:
// {
//   id: "2026-11-25-water",
//   priority: "HIGH" | "MEDIUM" | "NORMAL",
//   date: "2026-11-25",              // ISO date the notice was issued
//   categoryTe: "", categoryEn: "",
//   titleTe: "", titleEn: "",
//   detailsTe: "", detailsEn: "",
//   sourceTe: "", sourceEn: "",      // who issued it
// }
export const panchyatNotices = [];

// News shape: { id, date, tagTe, tagEn, titleTe, titleEn, snippetTe, snippetEn, sourceUrl }
export const villageNews = [];
