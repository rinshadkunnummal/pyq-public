import { Paper, ApiResponse, PaperListResponse } from "./types";

/**
 * Get the API base URL from environment variables.
 * For GitHub Codespaces use:
 * https://YOUR-BACKEND-PORT.app.github.dev/api
 */
function getApiBaseUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Configure it in .env.local."
    );
  }

  // Remove trailing slash if present
  return apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make a typed API request with proper error handling.
   */
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    if (process.env.NODE_ENV === "development") {
      console.log(`[API] ${options?.method || "GET"} ${url}`);
    }

    try {
      const response = await fetch(url, {
        headers: {
          ...(options?.body instanceof FormData
            ? {}
            : { "Content-Type": "application/json" }),
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        let message = response.statusText;

        try {
          const text = await response.text();
          if (text) {
            const json = JSON.parse(text);
            message = json.message || json.error || message;
          }
        } catch {
          // ignore JSON parse errors
        }

        throw new Error(`API Error ${response.status}: ${message}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        throw new Error(
          `Failed to connect to API at ${url}. Check that the backend is running and NEXT_PUBLIC_API_URL is correct.`
        );
      }

      throw error;
    }
  }

  /**
   * Fetch all approved papers.
   */
  async getPapers(): Promise<Paper[]> {
    const response = await this.request<PaperListResponse | Paper[]>(
      "/papers?status=approved"
    );

    if (Array.isArray(response)) {
      return response;
    }

    if (response && "data" in response && Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  }

  /**
   * Fetch a single paper.
   */
  async getPaper(id: string): Promise<Paper> {
    if (!id) {
      throw new Error("Paper ID is required");
    }

    return this.request<Paper>(`/papers/${id}`);
  }

  /**
   * Fetch papers by stage.
   */
  async getPapersByStage(stage: string): Promise<Paper[]> {
    const response = await this.request<PaperListResponse | Paper[]>(
      `/papers?stage=${encodeURIComponent(stage)}&status=approved`
    );

    if (Array.isArray(response)) {
      return response;
    }

    return response.data || [];
  }

  /**
   * Upload a paper.
   */
  async uploadPaper(formData: FormData): Promise<ApiResponse<Paper>> {
    return this.request<ApiResponse<Paper>>("/papers/submit", {
      method: "POST",
      body: formData,
    });
  }

  /**
   * Filter papers client-side.
   */
  filterPapers(
    papers: Paper[],
    filters: {
      stage?: string;
      level?: string;
      subject?: string;
      examType?: string;
      year?: number;
    }
  ): Paper[] {
    return papers.filter((paper) => {
      if (filters.stage && paper.stage !== filters.stage) return false;
      if (filters.level && paper.level !== filters.level) return false;
      if (filters.subject && paper.subject !== filters.subject) return false;
      if (filters.examType && paper.examType !== filters.examType) return false;
      if (filters.year && paper.paperYear !== filters.year) return false;

      return true;
    });
  }

  /**
   * Search papers by subject, stage, or level.
   */
  searchPapers(papers: Paper[], query: string): Paper[] {
    if (!query.trim()) return papers;

    const q = query.toLowerCase();

    return papers.filter(
      (paper) =>
        paper.subject.toLowerCase().includes(q) ||
        paper.stage.toLowerCase().includes(q) ||
        paper.level.toLowerCase().includes(q)
    );
  }
}

/**
 * Singleton API client
 */
export const api = new ApiClient(getApiBaseUrl());