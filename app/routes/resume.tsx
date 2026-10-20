import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import Navbar from "~/components/Navbar";
import { usePuterStore } from "~/lib/puter";

export default function ResumeDetails() {
  const { id } = useParams();
  const { kv } = usePuterStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResume() {
      if (!id) return;
      try {
        const stored = await kv.get(`resume:${id}`);
        if (stored) {
          setData(JSON.parse(stored));
        }
      } catch (err) {
        console.error("Failed to load resume:", err);
      } finally {
        setLoading(false);
      }
    }

    loadResume();
  }, [id, kv]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover">
        <Navbar />
        <div className="flex justify-center items-center h-[60vh]">
          <p className="text-lg font-semibold text-gray-600">Loading analysis...</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <p className="text-xl font-bold text-gray-700">Resume not found.</p>
          <Link to="/upload" className="primary-button">
            Upload Another Resume
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover pb-20">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-10">
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">{data.companyName}</h1>
          <p className="text-lg text-gray-600">{data.jobTitle}</p>
          
          <hr className="my-6 border-gray-200" />
          
          <h2 className="text-xl font-semibold mb-3">AI Feedback & ATS Score</h2>
          <div className="prose max-w-none">
            <pre className="p-4 bg-gray-50 rounded-xl overflow-x-auto text-sm text-gray-800">
              {typeof data.feedback === "object"
                ? JSON.stringify(data.feedback, null, 2)
                : data.feedback}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}