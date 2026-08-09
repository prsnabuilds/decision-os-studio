import { createFileRoute, redirect } from "@tanstack/react-router";

/* Capture now happens on Home; captured financial documents live in Finance. */
export const Route = createFileRoute("/_shell/ingest")({
  beforeLoad: () => {
    throw redirect({ to: "/ledger" });
  },
});
