import { Suspense } from "react";
import MusicPage from "./musicPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MusicPage />
    </Suspense>
  );
}