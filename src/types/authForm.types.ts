//src/types/authForm.types.ts
export interface AuthFormProps {
    title: string;
    onSubmit: (e: React.FormEvent) => void;
    children: React.ReactNode;
  }