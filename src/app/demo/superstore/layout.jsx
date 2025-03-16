import { AuthGuard } from '@/components';
import { AgentRuntimeProvider } from './AgentRuntimeProvider';
import { settings } from './config';

export default function Layout({ children }) {
  return (
    <AgentRuntimeProvider>
      <AuthGuard demo={settings.app_id} />
      {children}
    </AgentRuntimeProvider>
  );
}
