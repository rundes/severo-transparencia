import "server-only";
import { BigQuery } from "@google-cloud/bigquery";

// Credenciales por env (Vercel no tiene archivo de key):
//   GCP_PROJECT_ID           → cp-electoral
//   GCP_SERVICE_ACCOUNT_KEY  → JSON del service account (string), o base64 del JSON
//
// El service account necesita roles: BigQuery Data Viewer + BigQuery Job User
// sobre el proyecto cp-electoral.

const PROJECT = process.env.GCP_PROJECT_ID ?? "cp-electoral";

function credentials(): Record<string, unknown> | undefined {
  const raw = process.env.GCP_SERVICE_ACCOUNT_KEY;
  if (!raw) return undefined;
  const json = raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
  return JSON.parse(json);
}

let _bq: BigQuery | null = null;
export function bq(): BigQuery {
  if (!process.env.GCP_SERVICE_ACCOUNT_KEY) throw new Error("Falta GCP_SERVICE_ACCOUNT_KEY");
  if (!_bq) _bq = new BigQuery({ projectId: PROJECT, credentials: credentials() });
  return _bq;
}

export function bqEnabled(): boolean {
  return Boolean(process.env.GCP_SERVICE_ACCOUNT_KEY);
}

export function bqProject(): string {
  return PROJECT;
}
