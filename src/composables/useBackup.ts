import { ref } from "vue";

interface BackupData {
  version: 1;
  exportedAt: string;
  data: {
    words?: string;
    darkMode?: string;
    customDatasets?: string;
    activeDataset?: string;
    streakData?: string;
    datasets: Record<string, string>;
  };
}

const BACKUP_KEYS = ["words", "darkMode", "customDatasets", "activeDataset", "streakData"] as const;

// Derive localStorage keys for all custom datasets from the metadata registry
function getDatasetKeys(): string[] {
  const metas = JSON.parse(localStorage.getItem("customDatasets") || "[]");
  return metas.map((m: { id: string }) => `dataset_${m.id}`);
}

function validateBackup(data: unknown): data is BackupData {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  if (obj.version !== 1) return false;
  if (!obj.data || typeof obj.data !== "object") return false;
  return true;
}

export function useBackup() {
  const isImporting = ref(false);
  const importError = ref("");

  function exportBackup() {
    const backup: BackupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      data: {
        datasets: {},
      },
    };

    // Collect main keys
    for (const key of BACKUP_KEYS) {
      const value = localStorage.getItem(key);
      if (value !== null) {
        backup.data[key] = value;
      }
    }

    // Collect custom dataset data
    for (const key of getDatasetKeys()) {
      const value = localStorage.getItem(key);
      if (value !== null) {
        backup.data.datasets[key] = value;
      }
    }

    // Trigger browser download via a temporary object URL and programmatic link click
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().split("T")[0];
    const a = document.createElement("a");
    a.href = url;
    a.download = `hello-words-backup-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importBackup(file: File): Promise<{ success: boolean; error?: string }> {
    isImporting.value = true;
    importError.value = "";

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!validateBackup(data)) {
        const error = "Invalid backup file format.";
        importError.value = error;
        return { success: false, error };
      }

      // Restore main keys
      for (const key of BACKUP_KEYS) {
        const value = data.data[key];
        if (value !== undefined) {
          localStorage.setItem(key, value);
        }
      }

      // Restore dataset data — only allow keys matching "dataset_<alphanumeric>" pattern
      // to prevent arbitrary localStorage key injection from a tampered backup file.
      if (data.data.datasets) {
        for (const [key, value] of Object.entries(data.data.datasets)) {
          if (/^dataset_[a-z0-9]+$/i.test(key) && typeof value === "string") {
            localStorage.setItem(key, value);
          }
        }
      }

      // Reload to apply changes
      window.location.reload();
      return { success: true };
    } catch {
      const error = "Failed to parse backup file.";
      importError.value = error;
      return { success: false, error };
    } finally {
      isImporting.value = false;
    }
  }

  return {
    exportBackup,
    importBackup,
    isImporting,
    importError,
  };
}
