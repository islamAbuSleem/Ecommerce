export function isVerifiedSeller(status: string | null | undefined): boolean {
  return status === "approved";
}
