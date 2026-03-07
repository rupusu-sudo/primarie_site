import { useEffect, useState } from "react";

import { API_URL } from "@/config/api";

export type ServiceDocument = {
  id: number;
  title: string;
  category: string;
  content?: string | null;
  fileUrl?: string | null;
  year?: number | null;
  createdAt: string;
};

export const useServiceDocuments = (servicePage: string) => {
  const [documents, setDocuments] = useState<ServiceDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadDocuments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = new URL(`${API_URL}/api/documents`);
        url.searchParams.set("servicePage", servicePage);

        const response = await fetch(url.toString(), { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`request_failed_${response.status}`);
        }

        const data = await response.json();
        setDocuments(Array.isArray(data) ? data : []);
      } catch (nextError) {
        if (controller.signal.aborted) return;

        console.error("Nu am putut încărca documentele serviciului.", nextError);
        setError("Documentele nu au putut fi încărcate momentan.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadDocuments();

    return () => controller.abort();
  }, [servicePage]);

  return { documents, isLoading, error };
};
