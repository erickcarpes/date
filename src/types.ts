export interface DateFormData {
  dateType: string;
  dateOption: string;
  preferredDate: string;
  whatsapp: string;
  email: string;
}

export type Step = 1 | 2 | 3 | 4;

export interface DateOption {
  id: string;
  emoji: string;
  label: string;
  description: string;
}
