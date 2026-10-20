import { useState, type FormEvent } from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

export const meta = () => [
  { title: "Resumind | Upload" },
  {
    name: "description",
    content: "Smart feedback for your dream job",
  },
];

const Upload = () => {
  const { fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    try {
      setIsProcessing(true);

      setStatusText("Uploading the file...");
      const uploadedFile = await fs.upload([file]);
      if (!uploadedFile) {
        setStatusText("Error: Failed to upload file");
        setIsProcessing(false);
        return;
      }

      setStatusText("Converting to image...");
      const imageResult = await convertPdfToImage(file);
      const imageBlob = (imageResult as any)?.file || (imageResult as any)?.blob;
      if (!imageBlob) {
        setStatusText("Error: Failed to convert PDF to image");
        setIsProcessing(false);
        return;
      }

      setStatusText("Uploading the image...");
      const imgFile =
        imageBlob instanceof File
          ? imageBlob
          : new File([imageBlob], `${file.name}.png`, { type: "image/png" });
      const uploadedImage = await fs.upload([imgFile]);
      if (!uploadedImage) {
        setStatusText("Error: Failed to upload image");
        setIsProcessing(false);
        return;
      }

      setStatusText("Preparing data...");
      const uuid = generateUUID();
      const data: any = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: "",
      };
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      setStatusText("Analyzing...");
      const instructions = prepareInstructions({ jobTitle, jobDescription });
      const feedback = await ai.feedback(uploadedFile.path, instructions);

      if (!feedback) {
        setStatusText("Error: Failed to analyze resume");
        setIsProcessing(false);
        return;
      }

      const feedbackRaw =
        typeof feedback.message?.content === "string"
          ? feedback.message.content
          : feedback.message?.content?.[0]?.text ||
            (typeof feedback === "string" ? feedback : JSON.stringify(feedback));

      const cleanJson = feedbackRaw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      try {
        data.feedback = JSON.parse(cleanJson);
      } catch {
        data.feedback = feedbackRaw;
      }

      await kv.set(`resume:${uuid}`, JSON.stringify(data));
      setStatusText("Analysis complete, redirecting...");
      // navigate(`/resume/${uuid}`);
      console.log(data);
    } catch (error) {
      console.error("Analysis failed:", error);
      setStatusText("Error during analysis. Please check console.");
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const companyName = formData.get("company-name")?.toString().trim();
    const jobTitle = formData.get("job-title")?.toString().trim();
    const jobDescription = formData.get("job-description")?.toString().trim();

    if (!file) {
      alert("Please upload your resume before continuing.");
      return;
    }

    if (!companyName || !jobTitle || !jobDescription) {
      return;
    }

    await handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />

      <section className="main-section flex flex-col items-center">
        <div className="page-heading pt-12 pb-8 text-center flex flex-col items-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight">
            Smart feedback <br /> for your dream job
          </h1>

          <h2 className="text-lg text-gray-500 font-normal max-w-md">
            Drop your resume for an ATS score and improvement tips
          </h2>
        </div>

        {isProcessing ? (
          <div
            className="flex flex-col items-center justify-center gap-4"
            role="status"
            aria-live="polite"
          >
            <h2 className="text-lg font-semibold">{statusText}</h2>

            <img
              src="/images/resume-scan.gif"
              alt="Scanning your resume"
              className="w-48"
            />
          </div>
        ) : (
          <form
            id="upload-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 w-full max-w-xl mx-auto px-4 pb-20"
          >
            {/* Company Name */}
            <div className="form-div">
              <label
                htmlFor="company-name"
                className="text-sm font-semibold text-gray-600"
              >
                Company Name
              </label>

              <input
                type="text"
                id="company-name"
                name="company-name"
                placeholder="Company Name"
                autoComplete="organization"
                required
              />
            </div>

            {/* Job Title */}
            <div className="form-div">
              <label
                htmlFor="job-title"
                className="text-sm font-semibold text-gray-600"
              >
                Job Title
              </label>

              <input
                type="text"
                id="job-title"
                name="job-title"
                placeholder="Job Title"
                autoComplete="organization-title"
                required
              />
            </div>

            {/* Job Description */}
            <div className="form-div">
              <label
                htmlFor="job-description"
                className="text-sm font-semibold text-gray-600"
              >
                Job Description
              </label>

              <textarea
                rows={5}
                id="job-description"
                name="job-description"
                placeholder="Job Description"
                required
              />
            </div>

            {/* Upload Resume */}
            <div className="form-div">
              <label
                htmlFor="uploader"
                className="text-sm font-semibold text-gray-600"
              >
                Upload Resume
              </label>

              <FileUploader onFileSelect={handleFileSelect} />

              {file && (
                <p className="mt-2 text-sm text-gray-500" aria-live="polite">
                  Selected file: {file.name}
                </p>
              )}
            </div>

            {/* Analyze Button */}
            <button
              className="primary-button mt-4 !w-full !py-3.5 text-base disabled:opacity-50 cursor-pointer"
              type="submit"
              disabled={isProcessing}
            >
              Analyze Resume
            </button>
          </form>
        )}
      </section>
    </main>
  );
};

export default Upload;