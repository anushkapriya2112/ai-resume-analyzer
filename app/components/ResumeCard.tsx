import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: any;
}) => {
  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-5 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="resume-card-header flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <h2 className="!text-black text-xl font-bold break-words">{companyName}</h2>
          <h3 className="text-sm break-words text-gray-400 font-medium">{jobTitle}</h3>
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback?.overallScore ?? 0} />
        </div>
      </div>

      <div className="gradient-border">
        <div className="w-full h-full rounded-xl overflow-hidden">
          <img
            src={imagePath}
            alt="resume"
            className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
          />
        </div>
      </div>
    </Link>
  );
};

export default ResumeCard;