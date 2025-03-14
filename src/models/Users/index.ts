import { Users, UsersType, Role, User, Demo } from './userStore';

export class UserModel {
  public demos: UsersType;

  constructor(data: UsersType = Users) {
    this.demos = data;
  }

  // Find demo object by demo key
  getDemoByName(demoKey: string): Demo | null {
    const demo = this.demos.find(d => d.demo === demoKey);
    if (!demo) {
      console.error(`Demo not found: ${demoKey}`);
      return null;
    }
    return demo;
  }

  // Get all users for a specific demo
  getUsersForDemo(demoKey: string): User[] | null {
    const demo = this.getDemoByName(demoKey);
    if (!demo) return null;
    return demo.users;
  }

  // Get user by ID within a specific demo
  getUserById(demoKey: string, userId: string): User | null {
    const users = this.getUsersForDemo(demoKey);
    if (!users) return null;

    const user = users.find(u => u.id === userId);
    if (!user) {
      console.error(`User ${userId} not found in demo ${demoKey}`);
      return null;
    }
    return user;
  }

  // Get role details for a specific demo
  getRoleDetails(demoKey: string, roleId: number): Role | null {
    const demo = this.getDemoByName(demoKey);
    if (!demo) return null;

    const role = demo.roles?.[roleId];
    if (!role) {
      console.error(`Role ${roleId} not found in demo ${demoKey}`);
      return null;
    }
    return role;
  }

  // Get all roles for a specific demo
  getAllRolesForDemo(demoKey: string): Role[] | null {
    const demo = this.getDemoByName(demoKey);
    if (!demo || !demo.roles) {
      console.error(`Roles not found for demo: ${demoKey}`);
      return null;
    }

    // Extract roles as an array
    return Object.values(demo.roles);
  }
}
