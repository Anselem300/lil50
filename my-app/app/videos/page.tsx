import { Suspense } from "react";
import VideosPage from "./videosPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <VideosPage />
    </Suspense>
  );
}