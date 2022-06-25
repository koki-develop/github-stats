export type Language = {
  name: string;
  type: LanguageType;
  color?: string;
};

export type LanguageType = "programming" | "markup";
