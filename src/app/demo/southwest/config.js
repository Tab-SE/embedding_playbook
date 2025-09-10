import {
  Home,
  Plane,
  Users2,
  BarChart3,
  BrainCircuit,
  Settings
} from "lucide-react";

export const settings = {
  app_id: 'southwest',
  app_name: 'Southwest Airlines Analytics',
  app_logo: '/img/demos/Southwest Airlines_Logo_0.svg',
  base_path: '/demo/southwest',
  auth_hero: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ai_chat: true,
  ai_avatar: '/img/themes/southwest/southwest_logo.svg',
  sections: [
    {
      name: 'Home',
      icon: <Home className="h-5 w-5"/>,
      path: '',
      min_role: 0,
      description: 'your southwest airlines dashboard'
    },
    {
      name: 'Agent',
      icon: <BrainCircuit className="h-5 w-5"/>,
      path: '/agent',
      min_role: 0,
      description: 'AI assistant for flight operations and analytics'
    },
    {
      name: 'Flights',
      icon: <Plane className="h-5 w-5"/>,
      path: '/flights',
      min_role: 0,
      description: 'real-time flight tracking and performance analytics'
    },
    {
      name: 'Passengers',
      icon: <Users2 className="h-5 w-5"/>,
      path: '/passengers',
      min_role: 1,
      description: 'passenger analytics and customer satisfaction insights'
    },
    {
      name: 'Operations',
      icon: <BarChart3 className="h-5 w-5"/>,
      path: '/operations',
      min_role: 2,
      description: 'comprehensive operational metrics and strategic insights'
    },
  ],
}
