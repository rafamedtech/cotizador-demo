import logo from "@/assets/img/logo-new.svg";

interface AppSettings {
  logo: string;
  name: string;
  description: string;
}

export const appInfo: AppSettings = {
  logo,
  name: "Cotizador",
  description: "Cotizador descripción",
};
