"use client";

import { useState, useEffect } from "react";
import { getToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.med-as.ru/api/v1";

export default function PatientHeroGreeting() {
  const [firstName, setFirstName] = useState("пациент");

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.name) setFirstName(data.name.split(" ")[0]);
      })
      .catch(() => null);
  }, []);

  return (
    <h3 className="text-3xl font-[family-name:var(--font-manrope)] font-extrabold mb-2 tracking-tighter">
      Ваше здоровье под контролем, {firstName}.
    </h3>
  );
}
