"use client";

import { useState } from "react";

const ruPrice = new Intl.NumberFormat("ru-RU");

type Service = { name: string; description: string; price: number };

export default function ClinicServicesSearch({ services }: { services: Service[] }) {
  const [query, setQuery] = useState("");
  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,45,98,0.06)] border border-outline-variant/10">
      <div className="p-6 border-b border-surface-container flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-xl font-headline font-bold text-primary">Услуги и цены</h2>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск услуги..."
            className="pl-9 pr-4 py-2 bg-surface-container rounded-xl border-none text-sm outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-56"
          />
        </div>
      </div>
      <div>
        {filtered.length === 0 ? (
          <p className="p-6 text-sm text-on-surface-variant text-center">Ничего не найдено</p>
        ) : (
          filtered.map((s, i) => (
            <div
              key={i}
              className="px-6 py-4 flex justify-between items-center hover:bg-surface-container-low transition-colors border-b border-surface-container last:border-0"
            >
              <div>
                <p className="font-bold text-sm text-primary">{s.name}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{s.description}</p>
              </div>
              <span className="font-bold text-primary text-sm ml-4 whitespace-nowrap flex-shrink-0">
                {ruPrice.format(s.price)} ₽
              </span>
            </div>
          ))
        )}
      </div>
      <button className="w-full py-4 text-sm font-bold text-primary hover:bg-surface-container transition-colors bg-surface-container-low">
        Смотреть весь прайс-лист
      </button>
    </div>
  );
}
