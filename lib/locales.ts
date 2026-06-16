export type LanguageOption = {
  code: "en" | "ar" | "ku";
  label: string;
  flag: string;
};

export const languages: LanguageOption[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "ku", label: "کوردی", flag: "🏳️" },
];
