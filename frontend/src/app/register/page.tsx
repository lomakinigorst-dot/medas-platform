import type { Metadata } from "next";
import { Suspense } from "react";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Регистрация — MEDAS",
  description: "Создайте аккаунт на MEDAS — записывайтесь к врачам, храните историю визитов и получайте бонусы",
};

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
