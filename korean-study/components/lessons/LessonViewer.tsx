import type { Lesson } from "@/lib/types";
import { ExplainerLesson } from "./ExplainerLesson";
import { TileGridLesson } from "./TileGridLesson";
import { ComparisonLesson } from "./ComparisonLesson";
import { ExerciseLesson } from "./ExerciseLesson";
import { RuleLesson } from "./RuleLesson";

interface Props {
  lesson: Lesson;
}

export function LessonViewer({ lesson }: Props) {
  switch (lesson.type) {
    case "explainer":
      return <ExplainerLesson lesson={lesson} />;
    case "tile-grid":
      return <TileGridLesson lesson={lesson} />;
    case "comparison":
      return <ComparisonLesson lesson={lesson} />;
    case "exercise":
      return <ExerciseLesson lesson={lesson} />;
    case "rule":
      return <RuleLesson lesson={lesson} />;
    default:
      return <div className="ks-card">Lesson type unknown</div>;
  }
}
