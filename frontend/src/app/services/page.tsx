import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Услуги и диагностика — MEDAS",
  description:
    "Полный спектр медицинских услуг: кардиология, неврология, ортопедия и ещё 20+ специальностей. Запись онлайн.",
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={
          <div className="pt-32 flex items-center justify-center min-h-[60vh]">
            <div className="text-[#737686] text-sm">Загружаем услуги...</div>
          </div>
        }>
          <ServicesClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
