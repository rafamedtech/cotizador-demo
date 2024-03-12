import logo from '@/assets/img/logo-new.svg';

type AppSettings = {
  logo: string;
  name: string;
  description: string;
};

export const appInfo: AppSettings = {
  logo,
  name: 'Cotizador',
  description: 'Cotizador descripcion',
};
