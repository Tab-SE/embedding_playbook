import { AuthGuard } from '@/components';
import { settings } from './config';

export default function Layout({ children }) {
  return (
    <>
      <AuthGuard demo={settings.app_id} />
      {children}
    </>
  );
}
