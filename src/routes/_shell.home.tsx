import { createFileRoute } from "@tanstack/react-router";
import { VoiceCapture } from "@/components/capture/VoiceCapture";

export const Route = createFileRoute("/_shell/home")({
  head: () => ({
    meta: [
      { title: "Home - Capture A Decision | DecisionOS" },
      {
        name: "description",
        content:
          "Speak a decision in Tamil, English or Tanglish. DecisionOS writes it up, assigns the work and tracks it for you.",
      },
      { property: "og:title", content: "Home - Capture A Decision | DecisionOS" },
      {
        property: "og:description",
        content: "The first thing you do each morning: say what needs to happen.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomeCapture,
});

function HomeCapture() {
  return <VoiceCapture />;
}
