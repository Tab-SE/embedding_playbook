import { AuthGuard } from '@/components';
import { AgentRuntimeProvider } from './AgentRuntimeProvider';
import { settings } from './config';

export default function Layout({ children }) {
  return (
    <AgentRuntimeProvider
      agentId='a585b681-26dd-5c0a-b77f-47a0e69b1bbd'
    >
      <AuthGuard demo={settings.app_id} />
      {children}
    </AgentRuntimeProvider>
  );
}
