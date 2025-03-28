import { AuthGuard } from '@/components';
import { AgentRuntimeProvider } from './AgentRuntimeProvider';
import { settings } from './config';

export default function Layout({ children }) {
  return (
    <AgentRuntimeProvider
      agentId='fe096781-5601-53d2-b2f6-0d3403f7e9ca'
    >
      <AuthGuard demo={settings.app_id} />
      {children}
    </AgentRuntimeProvider>
  );
}
