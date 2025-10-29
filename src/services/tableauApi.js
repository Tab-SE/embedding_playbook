/**
 * Tableau REST API Service
 * Handles authentication and data fetching from Tableau Server/Online
 */

const TABLEAU_BASE_URL = process.env.NEXT_PUBLIC_TABLEAU_BASE_URL || 'https://prod-useast-b.online.tableau.com';

class TableauApiService {
  constructor() {
    this.baseUrl = TABLEAU_BASE_URL;
    this.siteId = process.env.NEXT_PUBLIC_TABLEAU_SITE_ID || 'embeddingplaybook';
  }

  /**
   * Authenticate with Tableau Server using JWT token
   * This method is used when you already have a JWT token from your existing auth system
   */
  async authenticateWithJWT(jwtToken) {
    try {
      const response = await fetch(`${this.baseUrl}/api/3.19/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentials: {
            jwt: jwtToken,
            site: {
              contentUrl: this.siteId
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`JWT authentication failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        token: data.credentials.token,
        siteId: data.credentials.site.id,
        userId: data.credentials.user.id
      };
    } catch (error) {
      console.error('Tableau JWT authentication error:', error);
      throw error;
    }
  }

  /**
   * Get user's accessible workbooks and dashboards
   */
  async getUserDashboards(token, siteId) {
    try {
      console.log('🔍 Fetching workbooks from Tableau API:', {
        url: `${this.baseUrl}/api/3.19/sites/${siteId}/workbooks`,
        siteId,
        hasToken: !!token
      });

      const response = await fetch(`${this.baseUrl}/api/3.19/sites/${siteId}/workbooks`, {
        headers: {
          'X-Tableau-Auth': token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('❌ Tableau API Error:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        });
        throw new Error(`Failed to fetch workbooks: ${response.statusText}`);
      }

      const data = await response.json();
      const parsedWorkbooks = this.parseWorkbooks(data.workbooks);

      console.log('✅ Workbooks fetched successfully:', {
        rawCount: data.workbooks?.length || 0,
        parsedCount: parsedWorkbooks.length,
        workbooks: parsedWorkbooks.map(wb => ({
          name: wb.name,
          project: wb.projectName,
          id: wb.id
        }))
      });

      return parsedWorkbooks;
    } catch (error) {
      console.error('❌ Error fetching user dashboards:', error);
      throw error;
    }
  }

  /**
   * Get folders for organizing dashboards
   */
  async getFolders(token, siteId) {
    try {
      console.log('📁 Fetching folders from Tableau API:', {
        url: `${this.baseUrl}/api/3.19/sites/${siteId}/projects`,
        siteId,
        hasToken: !!token
      });

      const response = await fetch(`${this.baseUrl}/api/3.19/sites/${siteId}/projects`, {
        headers: {
          'X-Tableau-Auth': token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('❌ Tableau Folders API Error:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        });
        throw new Error(`Failed to fetch folders: ${response.statusText}`);
      }

      const data = await response.json();
      const parsedProjects = this.parseProjects(data.projects);

      console.log('✅ Folders fetched successfully:', {
        rawCount: data.projects?.length || 0,
        parsedCount: parsedProjects.length,
        folders: parsedProjects.map(project => ({
          name: project.name,
          id: project.id,
          description: project.description
        }))
      });

      return parsedProjects;
    } catch (error) {
      console.error('❌ Error fetching folders:', error);
      throw error;
    }
  }

  /**
   * Get specific workbook details including views
   */
  async getWorkbookViews(token, siteId, workbookId) {
    try {
      console.log('👁️ Fetching views for workbook:', {
        workbookId,
        url: `${this.baseUrl}/api/3.19/sites/${siteId}/workbooks/${workbookId}`,
        hasToken: !!token
      });

      const response = await fetch(`${this.baseUrl}/api/3.19/sites/${siteId}/workbooks/${workbookId}`, {
        headers: {
          'X-Tableau-Auth': token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('❌ Tableau Views API Error:', {
          status: response.status,
          statusText: response.statusText,
          workbookId,
          url: response.url
        });
        throw new Error(`Failed to fetch workbook views: ${response.statusText}`);
      }

      const data = await response.json();
      const parsedViews = this.parseViews(data.workbook.views);

      console.log('✅ Views fetched successfully for workbook:', {
        workbookId,
        rawCount: data.workbook.views?.length || 0,
        parsedCount: parsedViews.length,
        views: parsedViews.map(view => ({
          name: view.name,
          id: view.id,
          viewUrlName: view.viewUrlName
        }))
      });

      return parsedViews;
    } catch (error) {
      console.error('❌ Error fetching workbook views:', error);
      throw error;
    }
  }

  /**
   * Parse workbooks data into a more usable format
   */
  parseWorkbooks(workbooks) {
    return workbooks.map(workbook => ({
      id: workbook.id,
      name: workbook.name,
      description: workbook.description || '',
      projectId: workbook.project.id,
      projectName: workbook.project.name,
      owner: workbook.owner?.name || 'Unknown',
      createdAt: workbook.createdAt,
      updatedAt: workbook.updatedAt,
      webPageUrl: workbook.webPageUrl,
      size: workbook.size
    }));
  }

  /**
   * Parse projects (folders) data
   */
  parseProjects(projects) {
    return projects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description || '',
      parentProjectId: project.parentProjectId,
      contentPermissions: project.contentPermissions
    }));
  }

  /**
   * Parse views (dashboards) data
   */
  parseViews(views) {
    return views.map(view => ({
      id: view.id,
      name: view.name,
      contentUrl: view.contentUrl,
      workbookId: view.workbook?.id,
      workbookName: view.workbook?.name,
      projectId: view.project?.id,
      projectName: view.project?.name,
      createdAt: view.createdAt,
      updatedAt: view.updatedAt,
      webPageUrl: view.webPageUrl,
      viewUrlName: view.viewUrlName
    }));
  }

  /**
   * Get embed URL for a specific view
   */
  getEmbedUrl(siteId, workbookId, viewId) {
    return `${this.baseUrl}/t/${this.siteId}/views/${workbookId}/${viewId}`;
  }

  /**
   * Sign out from Tableau
   */
  async signOut(token) {
    try {
      await fetch(`${this.baseUrl}/api/3.19/auth/signout`, {
        method: 'POST',
        headers: {
          'X-Tableau-Auth': token,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
}

const tableauApiService = new TableauApiService();
export default tableauApiService;
