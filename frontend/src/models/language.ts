
export type Language = {
  name: string;
  type: LanguageType;
  color?: string;
  count: number;
};

export type LanguageType = "programming" | "markup";

export type LanguageWithoutCount = Omit<Language, "count">;
