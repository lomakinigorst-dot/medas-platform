import CabinetLayout from "@/components/layout/CabinetLayout";
import PatientAppointments from "@/components/cabinet/PatientAppointments";

const navItems = [
  { href: "/cabinet/patient", icon: "🏠", label: "Главная" },
  { href: "/cabinet/patient/appointments", icon: "📅", label: "Приёмы" },
  { href: "/cabinet/patient/medcard", icon: "📋", label: "Медкарта" },
  { href: "/cabinet/patient/family", icon: "👨‍👩‍👧", label: "Семейный профиль" },
  { href: "/cabinet/patient/bonuses", icon: "🎁", label: "Бонусы" },
  { href: "/cabinet/patient/favorites", icon: "❤️", label: "Избранные врачи" },
];

export default function PatientAppointmentsPage() {
  return (
    <CabinetLayout
      role="patient"
      userName="Пациент"
      userSubtitle="Мои приёмы"
      navItems={navItems}
      headerTitle="Мои приёмы"
    >
      <PatientAppointments />
    </CabinetLayout>
  );
}
