import { Image, FileIcon, Link2, FileText, Filter } from "lucide-react";
import { User } from "./types";
import Link from "next/link";

interface PostComposerProps {
  user: User;
}

export default function PostComposer({ user }: PostComposerProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 w-full max-w-2xl px-6 py-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Feed</h2>
        <Link href="/posts/filter" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm">
          <Filter className="h-4 w-4" />
          Filter
        </Link>
      </div>

      {/* Compose Section */}
      <div className="flex gap-3 mb-4">
        <img
          src={user?.profilePicture || "/pp.png"}
          alt="Your avatar"
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1">
          <Link
            href="/posts/create"
            className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full px-4 py-3 text-gray-500 text-left block transition-colors"
          >
            What's happening in your practice today?
          </Link>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="flex gap-4">
          <Link
            href="/posts/create?type=image"
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 text-sm transition-colors"
          >
            <Image className="h-4 w-4" />
            Photo
          </Link>
          <Link
            href="/posts/create?type=document"
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 text-sm transition-colors"
          >
            <FileIcon className="h-4 w-4" />
            Document
          </Link>
          <Link
            href="/posts/create?type=link"
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 text-sm transition-colors"
          >
            <Link2 className="h-4 w-4" />
            Link
          </Link>
          <Link
            href="/posts/create?type=research"
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 text-sm transition-colors"
          >
            <FileText className="h-4 w-4" />
            Research
          </Link>
        </div>
        <Link
          href="/posts/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
        >
          Post
        </Link>
      </div>
    </div>
  );
}
