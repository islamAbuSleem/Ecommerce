import { Suspense } from "react";
import { SearchPage } from "./components/SearchPage";
import { SearchSkeleton } from "./components/SearchSkeleton";

export default function SearchRoute() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchPage />
    </Suspense>
  );
}
